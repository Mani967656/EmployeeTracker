const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import the Employee model (make sure you have created server/models/Employee.js)
const Employee = require('../models/Employee');
// Import the Activity model for logging activities
const Activity = require('../models/Activity');

// Assign Project to Employee (MongoDB)
router.post('/assign-project', async (req, res) => {
  const { username, project, startDate, deadline } = req.body;
  try {
    const emp = await Employee.findOne({ $or: [{ name: username }, { email: username }, { username }] });
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    emp.projects.push({ name: project, startDate, deadline });
    await emp.save();
    // Log activity
    await Activity.create({ message: `Project "${project}" assigned to ${emp.username}` });
    res.json({ message: 'Project assigned successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit Project for Employee (MongoDB)
router.patch('/:username/projects/:index', async (req, res) => {
  const { username, index } = req.params;
  const { name, startDate, deadline } = req.body;
  try {
    const emp = await Employee.findOne({ $or: [{ name: username }, { email: username }, { username }] });
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    if (!emp.projects || !emp.projects[index]) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const oldName = emp.projects[index].name;
    emp.projects[index] = { ...emp.projects[index]._doc, name, startDate, deadline };
    await emp.save();
    // Log activity
    await Activity.create({ message: `Project "${oldName}" updated for ${emp.username}` });
    res.json({ message: 'Project updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Project for Employee (MongoDB)
router.delete('/:username/projects/:index', async (req, res) => {
  const { username, index } = req.params;
  try {
    const emp = await Employee.findOne({ $or: [{ name: username }, { email: username }, { username }] });
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    if (!emp.projects || !emp.projects[index]) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const deletedProject = emp.projects[index].name;
    emp.projects.splice(index, 1);
    await emp.save();
    // Log activity
    await Activity.create({ message: `Project "${deletedProject}" deleted for ${emp.username}` });
    res.json({ message: 'Project deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/employees/:username (update employee details)
router.patch('/:username', async (req, res) => {
  const username = req.params.username;
  const update = req.body;
  try {
    const emp = await Employee.findOneAndUpdate(
      { $or: [{ name: username }, { email: username }, { username }] },
      { $set: update },
      { new: true }
    );
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    // Log activity
    await Activity.create({ message: `Employee "${emp.username}" updated` });
    res.json({ message: 'Employee updated', employee: emp });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all employees (for frontend display)
router.get('/', async (req, res) => {
  try {
    const emps = await Employee.find();
    res.json(emps);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new employee (optional, for testing)
router.post('/', async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();
    // Log activity
    await Activity.create({ message: `Employee "${emp.username}" added` });
    res.json({ message: 'Employee added', employee: emp });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;