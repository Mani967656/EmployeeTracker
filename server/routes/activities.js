const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

router.get('/recent', async (req, res) => {
  const activities = await Activity.find().sort({ timestamp: -1 }).limit(10);
  res.json(activities);
});

module.exports = router;