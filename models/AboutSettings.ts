import mongoose, { Schema, model, models } from 'mongoose';

const aboutSettingsSchema = new Schema({
    showGithub: { type: Boolean, default: true },
    showLeetcode: { type: Boolean, default: false },
    showCustom: { type: Boolean, default: true },
    customTitle: { type: String, default: 'Currently Leveling Up' },
    customDesc: { type: String, default: 'Building real-world projects, sharpening DSA skills.' }
});

const AboutSettings = models.AboutSettings || model('AboutSettings', aboutSettingsSchema);

export default AboutSettings;
