const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Activity = require('../models/Activity');

// Employee applies for leave
router.post('/', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    // Log activity
    await Activity.create({ message: `Leave applied by ${leave.username} (${leave.fromDate} to ${leave.toDate})` });
    res.status(201).json(leave);
  } catch {
    res.status(500).json({ message: 'Error applying for leave' });
  }
});

// Manager approves/denies leave
router.patch('/:id', async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    leave.status = req.body.status || leave.status;
    if (req.body.reason) leave.reason = req.body.reason;
    await leave.save();

    // Log activity
    await Activity.create({ message: `Leave ${leave.status} for ${leave.username} (${leave.fromDate} to ${leave.toDate})` });

    res.json(leave);
  } catch {
    res.status(500).json({ message: 'Error updating leave status' });
  }
});

// Get all leaves
router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch {
    res.status(500).json({ message: 'Error fetching leaves' });
  }
});

module.exports = router;