const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/authMiddleware');

// Admin Login (Password Only)
router.post('/login', async (req, res) => {
    const { password } = req.body;
    console.log(`[AUTH] Attempt with password: ${password}`);
    try {
        if (password === 'S2World') {
            let adminId = 'admin_placeholder_id';
            
            // Attempt to get real admin ID if DB is connected
            try {
                const mongoose = require('mongoose');
                if (mongoose.connection.readyState === 1) {
                    const admin = await Admin.findOne().catch(() => null);
                    if (admin) adminId = admin._id;
                } else {
                    console.warn('[AUTH] Database not connected. Using fallback ID.');
                }
            } catch (dbError) {
                console.error('[AUTH] Database check failed:', dbError.message);
            }

            // Generate token
            const token = jwt.sign(
                { id: adminId }, 
                process.env.JWT_SECRET || 's2world-secret-v2', 
                { expiresIn: '24h' }
            );
            
            // Set HTTP-Only Cookie
            res.cookie("adminToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            
            console.log(`[AUTH] Success! Cookie set for ID: ${adminId}`);
            res.json({ message: "Login successful", token });
        } else {
            console.log(`[AUTH] Failed: Invalid password.`);
            res.status(401).json({ message: 'INVALID_PASSWORD' });
        }
    } catch (error) {
        console.error('[AUTH] Critical Error:', error.message);
        res.status(500).json({ message: 'INTERNAL_SERVER_ERROR', detail: error.message });
    }
});

// Verify Admin Token
router.get('/verify', protect, (req, res) => {
    res.json({ valid: true, adminId: req.adminId });
});

// Admin Logout
router.post('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
