const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

async function simulateLogin() {
    const password = 'S2World';
    console.log(`[AUTH] Attempt with password: ${password}`);
    try {
        if (password === 'S2World') {
            let adminId = 'admin_placeholder_id';
            
            // Attempt to get real admin ID if DB is connected
            try {
                // In the real code, mongoose is required again inside
                const mongooseInternal = require('mongoose');
                if (mongooseInternal.connection.readyState === 1) {
                    // This part would call Admin.findOne()
                    console.log('DB connected, would query...');
                } else {
                    console.warn('[AUTH] Database not connected. Using fallback ID.');
                }
            } catch (dbError) {
                console.error('[AUTH] Database check failed:', dbError.message);
            }

            // Generate token
            const token = jwt.sign(
                { id: adminId }, 
                'temp-secret', 
                { expiresIn: '24h' }
            );
            
            console.log(`[AUTH] Success! Token issued for ID: ${adminId}`);
            return { token };
        }
    } catch (error) {
        console.error('[AUTH] Critical Error:', error.message);
        throw error;
    }
}

simulateLogin().then(() => console.log('Simulated Success')).catch(err => console.error('Simulated Failure:', err.message));
