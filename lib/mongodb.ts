import mongoose from 'mongoose';

function repairUri(rawUri: string) {
  if (!rawUri || typeof rawUri !== 'string') return '';
  
  const trimmed = rawUri.trim();
  const protocolMatch = trimmed.match(/^mongodb(?:\+srv)?:\/\//);
  if (!protocolMatch) return trimmed;
  
  const protocol = protocolMatch[0];
  const body = trimmed.substring(protocol.length);
  
  // Robust parsing: Credentials are everything before the LAST '@'
  const lastAtIndex = body.lastIndexOf('@');
  if (lastAtIndex === -1) return trimmed; // No credentials found
  
  const credentials = body.substring(0, lastAtIndex);
  const hostAndRest = body.substring(lastAtIndex + 1);
  
  // Split credentials by the FIRST ':'
  const colonIndex = credentials.indexOf(':');
  if (colonIndex === -1) return trimmed; // malformed credentials
  
  const username = credentials.substring(0, colonIndex);
  const password = credentials.substring(colonIndex + 1);
  
  // Rebuild with safe encoding
  let repaired = `${protocol}${encodeURIComponent(decodeURIComponent(username))}:${encodeURIComponent(decodeURIComponent(password))}@${hostAndRest}`;
  
  // Ensure database target is 'portfolio' if none specified
  const hostPart = hostAndRest.split('?')[0];
  if (!hostPart.includes('/')) {
    repaired = repaired.includes('?') 
      ? repaired.replace('?', '/portfolio?') 
      : repaired + '/portfolio';
  }
  
  return repaired;
}

const RAW_URI = (process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || '').trim();
const MONGODB_URI = repairUri(RAW_URI);

// Only log missing URI if we are not in the build phase (to avoid build log clutter)
if (!MONGODB_URI && process.env.NEXT_PHASE !== 'phase-production-build') {
  console.warn('⚠️ MONGODB_URI missing in local environment. This is normal during local build if not defined.');
} else if (MONGODB_URI && MONGODB_URI !== RAW_URI) {
  console.log('🔧 Auto-repaired MongoDB connection string for special characters.');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing from your environment variables. Connection aborted.');
    return null;
  }
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 15000, // Be more patient in production
      maxPoolSize: 1, // Crucial for serverless (Vercel) to avoid connection spikes
      minPoolSize: 0,
    };

    console.log('🔄 Initializing new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB Connected successfully to:', MONGODB_URI.split('@')[1] || 'database');
      return mongoose;
    }).catch(err => {
      console.error('❌ MongoDB Connection failed:', err.message);
      if (err.message.includes('ECONNREFUSED')) {
        console.error('💡 HINT: Check if your IP is whitelisted in MongoDB Atlas.');
      }
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
