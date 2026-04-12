const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    const uri = process.env.MONGO_URI;
    console.log(`Attempting to connect to: ${uri}`);
    
    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log('✅ Success! Connected to MongoDB.');
        // console.log('Replica Set Name:', conn.connection.db.databaseName); // This was wrong, it's the DB name
        console.log('Replica Set Name (Topology):', conn.connection.topology?.s?.options?.replicaSet);
        console.log('Host:', conn.connection.host);
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:');
        console.error(err);
        process.exit(1);
    }
}

testConnection();
