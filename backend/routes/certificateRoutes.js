const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { protect } = require('../middleware/authMiddleware');

// Get all certificates
router.get('/', async (req, res) => {
    try {
        const certificates = await Certificate.find();
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create certificate
router.post('/', protect, async (req, res) => {
    try {
        const newCertificate = new Certificate(req.body);
        const savedCertificate = await newCertificate.save();
        res.status(201).json(savedCertificate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update certificate
router.put('/:id', protect, async (req, res) => {
    try {
        const updatedCertificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCertificate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete certificate
router.delete('/:id', protect, async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Certificate deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
