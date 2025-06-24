const mongoose = require('mongoose');
const LeaveSchema = new mongoose.Schema({
  username: String,
  fromDate: String,
  toDate: String,
  reason: String,
  status: { type: String, default: 'pending' }
});
module.exports = mongoose.model('Leave', LeaveSchema);