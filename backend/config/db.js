const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`\x1b[32m✅ MongoDB Connected Successfully: ${conn.connection.host}\x1b[0m`);
    } catch (error) {
        console.error(`\x1b[31m❌ MongoDB Connection Failed:\x1b[0m`);
        console.error(`  Error Name: ${error.name}`);
        console.error(`  Error Message: ${error.message}`);
        if (error.reason) console.error(`  Reason: ${error.reason}`);
        console.log('Database features will be unavailable, but the server is running.');
        // process.exit(1); 
    }
};

module.exports = connectDB;
