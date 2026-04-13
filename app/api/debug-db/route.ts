import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

function repairUri(rawUri: string) {
  if (!rawUri) return '';
  const protocolMatch = rawUri.match(/^mongodb(?:\+srv)?:\/\//);
  if (!protocolMatch) return rawUri;
  const protocol = protocolMatch[0];
  const afterProtocol = rawUri.substring(protocol.length);
  const credentialMatch = afterProtocol.match(/^([^:]+):([^@]+)@(.*)$/);
  if (!credentialMatch) return rawUri;
  const [_, user, pass, rest] = credentialMatch;
  let repaired = `${protocol}${encodeURIComponent(decodeURIComponent(user))}:${encodeURIComponent(decodeURIComponent(pass))}@${rest}`;
  const hostPart = rest.split('?')[0];
  if (!hostPart.includes('/')) {
      if (repaired.includes('?')) repaired = repaired.replace('?', '/portfolio?');
      else repaired = repaired + '/portfolio';
  }
  return repaired;
}

export async function GET() {
  const envVars = {
    hasMongodbUri: !!process.env.MONGODB_URI,
    hasMongoUri: !!process.env.MONGO_URI,
    hasMongoUrl: !!process.env.MONGO_URL,
    nodeEnv: process.env.NODE_ENV,
  };

  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || '';
  const uri = repairUri(rawUri);
  const isRepaired = uri !== rawUri;

  // Extract credentials for diagnostics
  const protocolMatch = rawUri.match(/^mongodb(?:\+srv)?:\/\//);
  const afterProtocol = rawUri.substring(protocolMatch ? protocolMatch[0].length : 0);
  const credentialMatch = afterProtocol.match(/^([^:]+):([^@]+)@(.*)$/);

  // Extract password for extreme debugging (masked safely)
  let passLength = 0;
  let passStart = '';
  let passEnd = '';
  
  if (credentialMatch) {
      const pass = credentialMatch[2];
      passLength = pass.length;
      passStart = pass[0];
      passEnd = pass[pass.length - 1];
  }

  // Mask URI for safe debugging
  const maskedUri = uri ? uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'none';
  const hasDbName = uri.includes('/', uri.indexOf('://') + 3) && !uri.endsWith('/');

  if (!uri) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'No connection string found in environment variables',
      debug: envVars 
    }, { status: 500 });
  }

  try {
    console.log('Testing connection to MongoDB...');
    // Use a fresh connection for the test
    const testConn = await mongoose.createConnection(uri, { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000 
    }).asPromise();
    
    await testConn.close();
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'MongoDB connected successfully!',
      uriInfo: {
        masked: maskedUri,
        hasDbName,
        isRepaired,
        protocol: uri.split(':')[0],
        passSummary: `${passStart}...${passEnd} (Length: ${passLength})`
      },
      debug: envVars
    });
  } catch (err: any) {
    console.error('Debug DB Connection Error:', err.message);
    
    let advice = 'Check your MongoDB Atlas IP Whitelist (Allow 0.0.0.0/0)';
    if (err.message.includes('Authentication failed') || err.message.includes('auth failed') || err.message.includes('bad auth')) {
      advice = `PASSWORD ERROR: Your password starts with "${passStart}" and ends with "${passEnd}" (Total ${passLength} chars). PLEASE CHECK IF THIS IS CORRECT in Vercel!`;
    } else if (err.message.includes('ECONNREFUSED')) {
      advice = 'Connection refused. Ensure your Atlas cluster is active and accepting connections.';
    }

    return NextResponse.json({ 
      status: 'error', 
      message: err.message,
      uriInfo: {
        masked: maskedUri,
        hasDbName,
        isRepaired,
        protocol: uri.split(':')[0],
        passSummary: `${passStart}...${passEnd} (Length: ${passLength})`
      },
      debug: envVars,
      hint: advice
    }, { status: 500 });
  }
}
