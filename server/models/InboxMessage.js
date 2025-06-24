// server/models/InboxMessage.js
const mongoose = require('mongoose');
const InboxMessageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('InboxMessage', InboxMessageSchema);