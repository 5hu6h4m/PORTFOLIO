import mongoose from 'mongoose';

let MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || '';

// Normalize URI: Handle missing database name and common formatting issues
if (MONGODB_URI) {
  try {
    const url = new URL(MONGODB_URI);
    // If database name is missing (path is empty or just '/'), append 'portfolio'
    if (url.pathname === '/' || !url.pathname) {
      // For mongodb+srv we just append /portfolio, for legacy we need to be careful with options
      if (MONGODB_URI.includes('?')) {
        const parts = MONGODB_URI.split('?');
        if (!parts[0].endsWith('/')) {
           MONGODB_URI = parts[0] + '/portfolio?' + parts[1];
        } else {
           MONGODB_URI = parts[0] + 'portfolio?' + parts[1];
        }
      } else {
        MONGODB_URI = MONGODB_URI.endsWith('/') ? MONGODB_URI + 'portfolio' : MONGODB_URI + '/portfolio';
      }
      console.log('🔧 Normalized MongoDB URI: Added default database name "portfolio"');
    }
  } catch (e) {
    console.warn('⚠️ Could not parse MONGODB_URI for normalization, using raw string');
  }
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
