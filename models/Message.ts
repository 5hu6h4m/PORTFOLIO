import mongoose, { Schema, model, models } from 'mongoose';

const messageSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Message = models.Message || model('Message', messageSchema);

export default Message;
