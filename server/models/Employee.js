const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: String,
  startDate: String,
  deadline: String
});

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  department: String,
  position: String,
  status: String,
  projects: [ProjectSchema]
});

module.exports = mongoose.model('Employee', EmployeeSchema);