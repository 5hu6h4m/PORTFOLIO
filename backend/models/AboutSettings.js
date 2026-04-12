const mongoose = require('mongoose');

const aboutSettingsSchema = new mongoose.Schema({
  showGithub: { type: Boolean, default: true },
  showLeetcode: { type: Boolean, default: false },
  showCustom: { type: Boolean, default: true },
  customTitle: { type: String, default: 'Currently Leveling Up' },
  customDesc: { type: String, default: 'Building real-world projects, sharpening DSA skills, and working toward 200+ LeetCode problems.' },
  resumeUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('AboutSettings', aboutSettingsSchema);
