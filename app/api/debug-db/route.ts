import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  const envVars = {
    hasMongoUri: !!process.env.MONGO_URI,
    hasMongoUrl: !!process.env.MONGO_URL,
    nodeEnv: process.env.NODE_ENV,
  };

  const uri = process.env.MONGO_URI || process.env.MONGO_URL || '';

  if (!uri) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'No connection string found in environment variables',
      debug: envVars 
    }, { status: 500 });
  }

  try {
    // Try a direct connection test
    console.log('Testing connection to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'MongoDB connected successfully!',
      debug: envVars
    });
  } catch (err: any) {
    console.error('Debug DB Connection Error:', err.message);
    return NextResponse.json({ 
      status: 'error', 
      message: err.message,
      debug: envVars,
      hint: 'Check your MongoDB Atlas IP Whitelist (Allow 0.0.0.0/0)'
    }, { status: 500 });
  }
}
