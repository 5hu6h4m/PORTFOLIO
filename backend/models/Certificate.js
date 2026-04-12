const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String },
    image: { type: String }
});

module.exports = mongoose.model('Certificate', certificateSchema);
