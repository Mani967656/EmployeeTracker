// server/routes/inboxRoutes.js
const express = require('express');
const router = express.Router();
const InboxMessage = require('../models/InboxMessage');

// Get all messages for a user
router.get('/:username', async (req, res) => {
  const messages = await InboxMessage.find({ username: req.params.username }).sort({ createdAt: -1 });
  res.json(messages);
});

// Mark a message as read
router.patch('/:id/read', async (req, res) => {
  await InboxMessage.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});

module.exports = router;