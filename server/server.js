const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://mani:Mani96@cluster0.epppp2y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define Activity schema and model
const activitySchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now }
});
const Activity = mongoose.model('Activity', activitySchema);

// Define User schema and model inline
const projectSchema = new mongoose.Schema({
  name: String,
  startDate: String,
  deadline: String
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  projects: [projectSchema],
  name: String,
  email: String,
  department: String,
  status: { type: String, default: 'active' },
  photo: String,
  contact1: String,
  contact2: String,
  joiningDate: String,
  address: String,
  designation: String,
  team: [String],
  paidLeaves: { type: Number, default: 4 }
});
const User = mongoose.model('User', userSchema);

// Define Leave schema and model (with timestamps for sorting)
const leaveSchema = new mongoose.Schema({
  username: String,
  fromDate: String,
  toDate: String,
  reason: String,
  status: { type: String, default: 'pending' }
}, { timestamps: true });
const Leave = mongoose.model('Leave', leaveSchema);

// Define InboxMessage schema and model
const inboxMessageSchema = new mongoose.Schema({
  username: String,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const InboxMessage = mongoose.model('InboxMessage', inboxMessageSchema);

// Define Attendance schema and model
const attendanceSchema = new mongoose.Schema({
  username: String,
  date: String, // ISO date string
  login: String, // ISO datetime string
  logout: String // ISO datetime string
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { username, password, role } = req.body;
  const user = await User.findOne({ username, password, role });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ username: user.username, role: user.role, projects: user.projects });
});

// Add Employee endpoint (Manager only)
app.post('/api/employees', async (req, res) => {
  const { username, password, role, name, email, department } = req.body;
  const existing = await User.findOne({ username });
  if (existing) {
    return res.status(400).json({ message: 'Employee already exists' });
  }
  const user = new User({
    username,
    password,
    role: role || 'employee',
    projects: [],
    name,
    email,
    department,
    paidLeaves: 4
  });
  await user.save();
  // Log activity
  await Activity.create({ message: `Employee "${user.username}" added` });
  res.status(201).json({ username: user.username, role: user.role });
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get single employee profile by username
app.get('/api/employees/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ message: 'Employee not found' });
  res.json(user);
});

// PATCH: Update employee profile by username (for profile editing and table editing)
app.patch('/api/employees/:username', async (req, res) => {
  try {
    const allowedFields = [
      'email',
      'contact1',
      'contact2',
      'joiningDate',
      'address',
      'designation',
      'department',
      'position',
      'status',
      'name',
      'role'
    ];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    let user = await User.findOne({ username: req.params.username });
    if (!user) {
      user = await User.findOne({ email: req.params.username });
    }
    if (!user) return res.status(404).json({ message: 'Employee not found' });

    Object.assign(user, updates);
    await user.save();

    // Log activity
    await Activity.create({ message: `Employee "${user.username}" updated` });

    res.json(user);
  } catch (err) {
    console.error('Error updating employee profile:', err);
    res.status(500).json({ message: 'Error updating employee profile', error: err.message });
  }
});

// Delete employee by username
app.delete('/api/employees/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  await User.deleteOne({ username: req.params.username });
  // Log activity
  await Activity.create({ message: `Employee "${user.username}" deleted` });
  res.json({ message: 'Employee deleted' });
});

// Assign project to employee endpoint (now with startDate and deadline)
app.post('/api/employees/assign-project', async (req, res) => {
  const { username, project, startDate, deadline } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'Employee not found' });
  user.projects = user.projects || [];
  user.projects.push({
    name: project,
    startDate,
    deadline
  });
  await user.save();
  // Log activity
  await Activity.create({ message: `Project "${project}" assigned to ${user.username}` });
  res.json({ message: 'Project assigned', projects: user.projects });
});

// Edit a project for an employee
app.patch('/api/employees/:username/projects/:index', async (req, res) => {
  const { username, index } = req.params;
  const { name, startDate, deadline } = req.body;
  const user = await User.findOne({ username });
  if (!user || !user.projects[index]) return res.status(404).json({ message: 'Project not found' });
  const oldName = user.projects[index].name;
  user.projects[index] = { name, startDate, deadline };
  await user.save();
  // Log activity
  await Activity.create({ message: `Project "${oldName}" updated for ${user.username}` });
  res.json({ message: 'Project updated', projects: user.projects });
});

// Delete a project for an employee
app.delete('/api/employees/:username/projects/:index', async (req, res) => {
  const { username, index } = req.params;
  const user = await User.findOne({ username });
  if (!user || !user.projects[index]) return res.status(404).json({ message: 'Project not found' });
  const deletedProject = user.projects[index].name;
  user.projects.splice(index, 1);
  await user.save();
  // Log activity
  await Activity.create({ message: `Project "${deletedProject}" deleted for ${user.username}` });
  res.json({ message: 'Project deleted', projects: user.projects });
});

// Employee applies for leave
app.post('/api/leaves', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    // Log activity
    await Activity.create({ message: `Leave applied by ${leave.username} (${leave.fromDate} to ${leave.toDate})` });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: 'Error applying for leave' });
  }
});

// Manager: Get all leave applications (sorted by most recent approvals/updates first, limit 7)
app.get('/api/leaves', async (req, res) => {
  try {
    // Sort by updatedAt (most recently updated first), then by createdAt if needed, limit to 7
    const leaves = await Leave.find().sort({ updatedAt: -1, createdAt: -1 }).limit(7);
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaves' });
  }
});

// Step 2: Manager: Approve or Deny leave with paid leave logic
app.patch('/api/leaves/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    const from = new Date(leave.fromDate);
    const to = new Date(leave.toDate);
    const leaveDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    const user = await User.findOne({ username: leave.username });

    if (leave.status !== status) {
      if (status === 'approved') {
        if (user.paidLeaves >= leaveDays) {
          leave.status = 'approved';
          await leave.save();
          user.paidLeaves -= leaveDays;
          user.status = 'onleave';
          await user.save();
          await InboxMessage.create({
            username: leave.username,
            message: `Your leave from ${leave.fromDate} to ${leave.toDate} has been approved. Paid leaves left: ${user.paidLeaves}`
          });
          // Log activity
          await Activity.create({ message: `Leave approved for ${leave.username} (${leave.fromDate} to ${leave.toDate})` });
        } else {
          leave.status = 'denied';
          await leave.save();
          await InboxMessage.create({
            username: leave.username,
            message: `Your leave from ${leave.fromDate} to ${leave.toDate} has been denied. Not enough paid leaves left.`
          });
          // Log activity
          await Activity.create({ message: `Leave denied for ${leave.username} (${leave.fromDate} to ${leave.toDate}) - Not enough paid leaves` });
          return res.json(leave);
        }
      } else if (status === 'denied') {
        leave.status = 'denied';
        await leave.save();
        user.status = 'active';
        await user.save();
        await InboxMessage.create({
          username: leave.username,
          message: `Your leave from ${leave.fromDate} to ${leave.toDate} has been denied.`
        });
        // Log activity
        await Activity.create({ message: `Leave denied for ${leave.username} (${leave.fromDate} to ${leave.toDate})` });
      }
    }

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: 'Error updating leave status' });
  }
});

// Attendance: Get all attendance records for a user
app.get('/api/attendance/:username', async (req, res) => {
  try {
    const records = await Attendance.find({ username: req.params.username });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
});

// Attendance: Add a new attendance record (login)
app.post('/api/attendance', async (req, res) => {
  try {
    const { username, date, login, logout } = req.body;
    const record = new Attendance({ username, date, login, logout });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: 'Error saving attendance record' });
  }
});

// Inbox: Get all messages for a user
app.get('/api/inbox/:username', async (req, res) => {
  try {
    const messages = await InboxMessage.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inbox messages' });
  }
});

// Inbox: Mark a message as read
app.patch('/api/inbox/:id/read', async (req, res) => {
  try {
    await InboxMessage.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error marking message as read' });
  }
});

// Recent Activities endpoint
app.get('/api/activities/recent', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(10);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));