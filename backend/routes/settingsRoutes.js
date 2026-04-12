const express = require('express');
const router = express.Router();
const AboutSettings = require('../models/AboutSettings');
const { protect } = require('../middleware/authMiddleware');


// GET /api/settings/about-sections  (public - no auth needed)
router.get('/about-sections', async (req, res) => {
  try {
    let settings = await AboutSettings.findOne();
    if (!settings) {
      // Auto-create defaults on first access
      settings = await AboutSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load settings' });
  }
});

// PUT /api/settings/about-sections  (admin only)
router.put('/about-sections', protect, async (req, res) => {

  try {
    const { showGithub, showLeetcode, showCustom, customTitle, customDesc, resumeUrl } = req.body;

    let settings = await AboutSettings.findOne();
    if (!settings) {
      settings = new AboutSettings();
    }

    // Core logic: LeetCode ON → Custom auto-OFF
    if (showLeetcode === true) {
      settings.showLeetcode = true;
      settings.showCustom = false;
      settings.showGithub = showGithub !== undefined ? showGithub : settings.showGithub;
    } else if (showLeetcode === false) {
      settings.showLeetcode = false;
      settings.showCustom = showCustom !== undefined ? showCustom : true;
      settings.showGithub = showGithub !== undefined ? showGithub : settings.showGithub;
    } else {
      if (showGithub !== undefined) settings.showGithub = showGithub;
      if (showCustom !== undefined) settings.showCustom = showCustom;
    }

    if (customTitle !== undefined) settings.customTitle = customTitle;
    if (customDesc !== undefined) settings.customDesc = customDesc;
    if (resumeUrl !== undefined) settings.resumeUrl = resumeUrl;

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

module.exports = router;
