import mongoose, { Schema, model, models } from 'mongoose';

const adminSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Admin = models.Admin || model('Admin', adminSchema);

export default Admin;
