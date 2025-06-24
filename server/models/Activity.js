const mongoose = require('mongoose');
const ActivitySchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Activity', ActivitySchema);