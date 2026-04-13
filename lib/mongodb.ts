import mongoose from 'mongoose';

let MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || '';

// SMART REPAIR: In Next.js/Vercel, passwords with special characters (@, :, #, !) can break URIs.
// This function extracts and encodes credentials to fix common Atlas connection failures.
function repairUri(rawUri: string) {
  if (!rawUri) return '';
  
  // 1. Identify the protocol and the rest of the string
  const protocolMatch = rawUri.match(/^mongodb(?:\+srv)?:\/\//);
  if (!protocolMatch) return rawUri;
  
  const protocol = protocolMatch[0];
  const afterProtocol = rawUri.substring(protocol.length);
  
  // 2. Extract credentials and host
  // Match pattern: [user]:[pass]@[host]
  const credentialMatch = afterProtocol.match(/^([^:]+):([^@]+)@(.*)$/);
  if (!credentialMatch) return rawUri;
  
  const [_, user, pass, rest] = credentialMatch;
  
  // 3. Rebuild with encoded credentials
  let repaired = `${protocol}${encodeURIComponent(decodeURIComponent(user))}:${encodeURIComponent(decodeURIComponent(pass))}@${rest}`;
  
  // 4. Ensure database name exists (default to 'portfolio' if missing)
  const hostPart = rest.split('?')[0];
  if (!hostPart.includes('/')) {
      if (repaired.includes('?')) {
          repaired = repaired.replace('?', '/portfolio?');
      } else {
          repaired = repaired + '/portfolio';
      }
  }
  
  return repaired;
}

const RAW_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || '';
const MONGODB_URI = repairUri(RAW_URI);

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing! Check your environment variables.');
} else if (MONGODB_URI !== RAW_URI) {
  console.log('🔧 Auto-repaired MongoDB connection string for special characters.');
}

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing! Check your environment variables.');
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
