const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Admin = require('./models/Admin');

async function testLogin() {
    console.log('Testing login logic...');
    try {
        const password = 'S2World';
        console.log('Input password:', password);
        
        if (password === 'S2World') {
            // Mocking Admin.findOne behavior if DB is not connected
            let admin = null;
            try {
                // If this fails due to DB, we'll catch it like the real code
                admin = await Admin.findOne().catch((err) => {
                    console.error('Admin.findOne caught error:', err.message);
                    return null;
                });
            } catch (err) {
                console.error('Admin.findOne threw error:', err.message);
            }
            
            const adminId = admin ? admin._id : 'admin_placeholder_id';
            console.log('Determined adminId:', adminId);
            
            const secret = process.env.JWT_SECRET || 's2world-secret-v2';
            const token = jwt.sign({ id: adminId }, secret, { expiresIn: '24h' });
            console.log('Success! Token generated:', token.substring(0, 10) + '...');
        } else {
            console.log('Failed: Invalid password.');
        }
    } catch (error) {
        console.error('CRITICAL ERROR:', error.stack);
    }
}

testLogin();
