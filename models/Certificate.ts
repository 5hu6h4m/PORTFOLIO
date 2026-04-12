import mongoose, { Schema, model, models } from 'mongoose';

const certificateSchema = new Schema({
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String },
    image: { type: String },
    link: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Certificate = models.Certificate || model('Certificate', certificateSchema);

export default Certificate;
