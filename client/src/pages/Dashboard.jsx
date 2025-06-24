import { useNavigate } from 'react-router-dom';
import DashboardCards from '../components/DashboardCards';
import LogoutButton from '../components/LogoutButton';
import ThemeToggle from '../components/ThemeToggle';
import EmployeePerformance from '../components/EmployeePerformance';
import PersonalPerformance from '../components/PersonalPerformance';
import EmployeeProjects from '../components/EmployeeProjects';
import EmployeeAttendance from '../components/EmployeeAttendance';
import React from 'react';

// --- Recent Activities Component ---
function RecentActivities() {
  const [activities, setActivities] = React.useState([]);
  React.useEffect(() => {
    fetch('http://localhost:5000/api/activities/recent')
      .then(res => res.json())
      .then(data => setActivities(data || []));
  }, []);
  return (
    <div className="card mt-3">
      <div className="card-header fw-bold">Recent Activities</div>
      <ul className="list-group list-group-flush">
        {activities.length === 0 && (
          <li className="list-group-item text-muted">No recent activities.</li>
        )}
        {activities.map((act, idx) => (
          <li className="list-group-item" key={idx}>
            <span>{act.message}</span>
            <br />
            <small className="text-muted">{new Date(act.timestamp || act.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Inbox Component ---
function Inbox({ username, refreshTrigger }) {
  const [messages, setMessages] = React.useState([]);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (show) {
      fetch(`http://localhost:5000/api/inbox/${username}`)
        .then(res => res.json())
        .then(setMessages);
    }
  }, [show, username, refreshTrigger]);

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div style={{ position: 'relative', marginRight: '10px' }}>
      <button className="btn btn-light" onClick={() => setShow(s => !s)}>
        <i className="bi bi-inbox"></i>
        {unreadCount > 0 && (
          <span className="badge bg-danger" style={{ position: 'absolute', top: 0, right: 0 }}>
            {unreadCount}
          </span>
        )}
      </button>
      {show && (
        <div className="card p-2" style={{ position: 'absolute', right: 0, zIndex: 10, minWidth: 300 }}>
          <h6>Inbox</h6>
          {messages.length === 0 && <div>No messages</div>}
          <ul className="list-group">
            {messages.map(msg => (
              <li key={msg._id} className={`list-group-item ${msg.read ? '' : 'fw-bold'}`}>
                {msg.message}
                <br />
                <small className="text-muted">{new Date(msg.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('user');

  // Section state for manager dashboard
  const [activeSection, setActiveSection] = React.useState('overview');

  // Employees state (for table display)
  const [employees, setEmployees] = React.useState([]);
  // New employee state for backend
  const [newEmployee, setNewEmployee] = React.useState({
    username: '',
    password: '',
    role: 'employee',
    name: '',
    email: '',
    department: ''
  });

  // Edit modal state
  const [editModal, setEditModal] = React.useState({ show: false, employee: null, error: '', success: '' });

  // Assign project state (now with startDate and deadline)
  const [assignProject, setAssignProject] = React.useState({
    username: '',
    project: '',
    startDate: '',
    deadline: ''
  });
  const [assignMsg, setAssignMsg] = React.useState('');

  // Project edit modal state
  const [editProjectModal, setEditProjectModal] = React.useState({
    show: false,
    username: '',
    index: null,
    name: '',
    startDate: '',
    deadline: '',
    error: '',
    success: ''
  });

  // Leave application state
  const [leaveForm, setLeaveForm] = React.useState({
    fromDate: '',
    toDate: '',
    reason: ''
  });
  const [leaveMsg, setLeaveMsg] = React.useState('');

  // Manager: Leave applications state
  const [leaves, setLeaves] = React.useState([]);
  const [leaveActionMsg, setLeaveActionMsg] = React.useState('');

  // Search/filter state
  const [search, setSearch] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // Inbox refresh trigger for employee
  const [inboxRefresh, setInboxRefresh] = React.useState(0);

  // Paid leaves state for employee
  const [paidLeaves, setPaidLeaves] = React.useState(0);

  // Popup for leave status
  const [leaveStatusPopup, setLeaveStatusPopup] = React.useState({ show: false, message: '' });

  // Track last leave status for employee dashboard
  const [lastLeaveStatus, setLastLeaveStatus] = React.useState(null);

  // --- Step 3: Show leave status popup only once after approval/denial ---
  React.useEffect(() => {
    if (role === 'employee') {
      fetch('http://localhost:5000/api/leaves')
        .then(res => res.json())
        .then(data => {
          const myLeaves = data
            .filter(lv => lv.username === username)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          if (myLeaves.length > 0) {
            const last = myLeaves[0];
            const lastShownId = localStorage.getItem('lastShownLeaveStatusId');
            if (
              last.status !== 'pending' &&
              last._id !== lastShownId
            ) {
              let msg = '';
              if (last.status === 'approved') {
                const from = new Date(last.fromDate);
                const to = new Date(last.toDate);
                const leaveDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
                msg = `Your leave from ${last.fromDate} to ${last.toDate} has been approved. Paid leaves left: ${paidLeaves - leaveDays}`;
              } else if (last.status === 'denied') {
                if (
                  last.reason &&
                  last.reason.toLowerCase().includes('not enough paid leaves')
                ) {
                  msg = `Your leave from ${last.fromDate} to ${last.toDate} has been denied. Not enough paid leaves left.`;
                } else {
                  msg = `Your leave from ${last.fromDate} to ${last.toDate} has been denied.`;
                }
              }
              setLeaveStatusPopup({ show: true, message: msg });
              localStorage.setItem('lastShownLeaveStatusId', last._id);
            }
            setLastLeaveStatus(last);
          } else {
            setLastLeaveStatus(null);
          }
        });
    }
  }, [role, leaveActionMsg, leaveMsg, username, paidLeaves]);

  // Fetch employees from backend on mount and after add/delete or leave action
  React.useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(() => setEmployees([]));
  }, [role, success, leaveActionMsg, assignMsg]);

  // Fetch leaves for manager and employee (for manager dashboard)
  React.useEffect(() => {
    if (role === 'manager') {
      fetch('http://localhost:5000/api/leaves')
        .then(res => res.json())
        .then(data => setLeaves(data))
        .catch(() => setLeaves([]));
    }
  }, [role, leaveActionMsg, leaveMsg, username, paidLeaves]);

  // Fetch paid leaves for employee
  React.useEffect(() => {
    if (role === 'employee' && username) {
      fetch(`http://localhost:5000/api/employees/${username}`)
        .then(res => res.json())
        .then(data => setPaidLeaves(data.paidLeaves || 0));
    }
  }, [role, username, leaveMsg, leaveActionMsg]);

  // Add employee using backend
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newEmployee.username || !newEmployee.password || !newEmployee.role) {
      setError('Username, password, and role are required.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newEmployee.username,
          password: newEmployee.password,
          role: newEmployee.role,
          name: newEmployee.name,
          email: newEmployee.email,
          department: newEmployee.department
        }),
      });
      if (res.ok) {
        setSuccess('Employee added successfully!');
        fetch('http://localhost:5000/api/employees')
          .then(res => res.json())
          .then(data => setEmployees(data));
        setNewEmployee({
          username: '',
          password: '',
          role: 'employee',
          name: '',
          email: '',
          department: ''
        });
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to add employee.');
      }
    } catch {
      setError('Server error. Please try again.');
    }
  };

  // Assign project to employee (with startDate and deadline)
  const handleAssignProject = async (e) => {
    e.preventDefault();
    setAssignMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/employees/assign-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignProject),
      });
      const data = await res.json();
      if (res.ok) {
        setAssignMsg('Project assigned successfully!');
        setAssignProject({ username: '', project: '', startDate: '', deadline: '' });
        fetch('http://localhost:5000/api/employees')
          .then(res => res.json())
          .then(data => setEmployees(data));
      } else {
        setAssignMsg(data.message || 'Failed to assign project.');
      }
    } catch {
      setAssignMsg('Server error. Please try again.');
    }
  };

  // Edit project modal handlers
  const openEditProjectModal = (username, index, project) => {
    setEditProjectModal({
      show: true,
      username,
      index,
      name: project.name,
      startDate: project.startDate,
      deadline: project.deadline,
      error: '',
      success: ''
    });
  };

  const handleEditProjectChange = (e) => {
    setEditProjectModal(modal => ({
      ...modal,
      [e.target.name]: e.target.value
    }));
  };

  const handleEditProjectSave = async () => {
    setEditProjectModal(modal => ({ ...modal, error: '', success: '' }));
    try {
      const { username, index, name, startDate, deadline } = editProjectModal;
      const res = await fetch(`http://localhost:5000/api/employees/${username}/projects/${index}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, startDate, deadline })
      });
      const data = await res.json();
      if (res.ok) {
        setEditProjectModal(modal => ({ ...modal, success: 'Project updated successfully!' }));
        fetch('http://localhost:5000/api/employees')
          .then(res => res.json())
          .then(data => setEmployees(data));
        setTimeout(() => setEditProjectModal({
          show: false, username: '', index: null, name: '', startDate: '', deadline: '', error: '', success: ''
        }), 1000);
      } else {
        setEditProjectModal(modal => ({ ...modal, error: data.message || 'Failed to update project.' }));
      }
    } catch {
      setEditProjectModal(modal => ({ ...modal, error: 'Server error. Please try again.' }));
    }
  };

  // Delete project handler
  const handleDeleteProject = async (username, index) => {
    await fetch(`http://localhost:5000/api/employees/${username}/projects/${index}`, { method: 'DELETE' });
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data));
  };

  // --- Step 4: Edit employee modal ---
  const handleEditEmployee = (emp) => {
    setEditModal({ show: true, employee: { ...emp }, error: '', success: '' });
  };

  const handleEditModalChange = (e) => {
    setEditModal(modal => ({
      ...modal,
      employee: { ...modal.employee, [e.target.name]: e.target.value }
    }));
  };

  // Only send allowed fields to backend PATCH
  const handleEditModalSave = async () => {
    setEditModal(modal => ({ ...modal, error: '', success: '' }));
    try {
      // Only send allowed fields
      const allowedFields = [
        'email',
        'contact1',
        'contact2',
        'joiningDate',
        'address',
        'designation',
        'name',
        'department',
        'role'
      ];
      const payload = {};
      allowedFields.forEach(field => {
        if (editModal.employee[field] !== undefined) {
          payload[field] = editModal.employee[field];
        }
      });

      const res = await fetch(`http://localhost:5000/api/employees/${editModal.employee.username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditModal(modal => ({ ...modal, success: 'Employee updated successfully!' }));
        fetch('http://localhost:5000/api/employees')
          .then(res => res.json())
          .then(data => setEmployees(data));
        setTimeout(() => setEditModal({ show: false, employee: null, error: '', success: '' }), 1000);
      } else {
        const data = await res.json();
        setEditModal(modal => ({ ...modal, error: data.message || 'Failed to update employee.' }));
      }
    } catch {
      setEditModal(modal => ({ ...modal, error: 'Server error. Please try again.' }));
    }
  };

  // Delete employee handler (calls backend and refetches)
  const handleDeleteEmployee = async (username) => {
    await fetch(`http://localhost:5000/api/employees/${username}`, { method: 'DELETE' });
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data));
  };

  // Manager: Approve/Deny leave
  const handleLeaveAction = async (leaveId, status) => {
    setLeaveActionMsg('');
    const res = await fetch(`http://localhost:5000/api/leaves/${leaveId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setLeaveActionMsg(`Leave ${status}`);
      fetch('http://localhost:5000/api/leaves')
        .then(res => res.json())
        .then(data => setLeaves(data));
      setInboxRefresh(r => r + 1);
    } else {
      setLeaveActionMsg('Failed to update leave status');
    }
  };

  const departments = Array.from(new Set(employees.map(emp => emp.department))).filter(Boolean);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      (emp.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.department || '').toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = departmentFilter ? emp.department === departmentFilter : true;
    return matchesSearch && matchesDepartment;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status !== 'onleave').length;
  const onLeaveEmployees = employees.filter(emp => emp.status === 'onleave').length;

  // SECTION BUTTONS FOR MANAGER (with colors)
  const managerSectionButtons = (
    <div className="mb-3 d-flex flex-wrap gap-2">
      <button
        className={`btn ${activeSection === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => setActiveSection('overview')}
      >
        Overview
      </button>
      <button
        className={`btn ${activeSection === 'manage' ? 'btn-success' : 'btn-outline-success'}`}
        onClick={() => setActiveSection('manage')}
      >
        Manage Employees
      </button>
      <button
        className={`btn ${activeSection === 'projects' ? 'btn-warning text-white' : 'btn-outline-warning'}`}
        onClick={() => setActiveSection('projects')}
      >
        Assign Projects
      </button>
      <button
        className={`btn ${activeSection === 'leaves' ? 'btn-info text-white' : 'btn-outline-info'}`}
        onClick={() => setActiveSection('leaves')}
      >
        Leave Applications
      </button>
      <button
        className={`btn ${activeSection === 'performance' ? 'btn-dark' : 'btn-outline-dark'}`}
        onClick={() => setActiveSection('performance')}
      >
        Performance
      </button>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/profile')}
          >
            My Profile
          </button>
          <button className="btn btn-primary" disabled>
            Dashboard
          </button>
          <ThemeToggle />
        </div>
        {role === 'employee' && <Inbox username={username} refreshTrigger={inboxRefresh} />}
        <LogoutButton />
      </div>
      <h2 className="fw-bold">Dashboard</h2>
      <div className="text-muted mb-4">Overview of your employee management system</div>

      {role === 'manager' && managerSectionButtons}

      {/* OVERVIEW SECTION */}
      {role === 'manager' && activeSection === 'overview' && (
        <div>
          <div className="d-flex justify-content-center mb-4">
            <DashboardCards
              total={totalEmployees}
              active={activeEmployees}
              onleave={onLeaveEmployees}
            />
          </div>
          <RecentActivities />
        </div>
      )}

      {/* MANAGE EMPLOYEES SECTION */}
      {role === 'manager' && activeSection === 'manage' && (
        <div>
          <h4 className="fw-bold mb-3">Manage Employees</h4>
          {/* Add Employee Form */}
          <form className="row g-2 align-items-end" onSubmit={handleAddEmployee}>
            <div className="col-md-2">
              <input className="form-control" placeholder="Username" value={newEmployee.username}
                onChange={e => setNewEmployee({ ...newEmployee, username: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Password" type="password" value={newEmployee.password}
                onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={newEmployee.role}
                onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })} required>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Name (optional)" value={newEmployee.name}
                onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Email (optional)" type="email" value={newEmployee.email}
                onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} />
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Department (optional)" value={newEmployee.department}
                onChange={e => setNewEmployee({ ...newEmployee, department: e.target.value })} />
            </div>
            <div className="col-md-12 mt-2">
              <button className="btn btn-success" type="submit">Add Employee</button>
            </div>
          </form>
          {error && <div className="alert alert-danger mt-2">{error}</div>}
          {success && <div className="alert alert-success mt-2">{success}</div>}

          {/* Employee Search/Filter */}
          <div className="row mt-3 g-2">
            <div className="col-md-6">
              <input className="form-control" placeholder="Search by name, email, or department"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="col-md-6">
              <select className="form-select" value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}>
                <option value="">All Departments</option>
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Employee Table */}
          <div className="table-responsive mt-3">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center">No employees found.</td>
                  </tr>
                )}
                {filteredEmployees.map((emp, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{emp.username}</td>
                    <td>{emp.role}</td>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-1" onClick={() => handleEditEmployee(emp)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEmployee(emp.username)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Edit Employee Modal */}
          {editModal.show && (
            <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Employee</h5>
                    <button type="button" className="btn-close" onClick={() => setEditModal({ show: false, employee: null, error: '', success: '' })}></button>
                  </div>
                  <div className="modal-body">
                    {editModal.error && <div className="alert alert-danger">{editModal.error}</div>}
                    {editModal.success && <div className="alert alert-success">{editModal.success}</div>}
                    {editModal.employee && (
                      <>
                        <div className="mb-2">
                          <label className="form-label">Username</label>
                          <input className="form-control" value={editModal.employee.username} name="username" disabled />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Name</label>
                          <input className="form-control" value={editModal.employee.name || ''} name="name" onChange={handleEditModalChange} />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Email</label>
                          <input className="form-control" value={editModal.employee.email || ''} name="email" onChange={handleEditModalChange} />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Department</label>
                          <input className="form-control" value={editModal.employee.department || ''} name="department" onChange={handleEditModalChange} />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Role</label>
                          <select className="form-select" name="role" value={editModal.employee.role} onChange={handleEditModalChange}>
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" onClick={handleEditModalSave}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setEditModal({ show: false, employee: null, error: '', success: '' })}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ASSIGN PROJECTS SECTION */}
      {role === 'manager' && activeSection === 'projects' && (
        <div>
          <form className="row g-2 align-items-end mt-3" onSubmit={handleAssignProject}>
            <div className="col-md-2">
              <select className="form-select" value={assignProject.username}
                onChange={e => setAssignProject({ ...assignProject, username: e.target.value })} required>
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.username} value={emp.username}>{emp.username}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <input className="form-control" placeholder="Project Name" value={assignProject.project}
                onChange={e => setAssignProject({ ...assignProject, project: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" type="date" placeholder="Start Date" value={assignProject.startDate}
                onChange={e => setAssignProject({ ...assignProject, startDate: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <input className="form-control" type="date" placeholder="Deadline" value={assignProject.deadline}
                onChange={e => setAssignProject({ ...assignProject, deadline: e.target.value })} required />
            </div>
            <div className="col-md-2">
              <button className="btn btn-info w-100" type="submit">Assign Project</button>
            </div>
            {assignMsg && <div className="col-12 mt-2">{assignMsg}</div>}
          </form>
          <div className="mt-4">
            <h5>Assigned Projects</h5>
            {employees.filter(emp => emp.projects && emp.projects.length > 0).length === 0 ? (
              <div className="text-muted">No projects assigned to any employee.</div>
            ) : (
              employees
                .filter(emp => emp.projects && emp.projects.length > 0)
                .map(emp => (
                  <div key={emp.username} className="mb-3">
                    <div className="fw-bold">{emp.username} ({emp.name || 'No Name'})</div>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered align-middle">
                        <thead>
                          <tr>
                            <th>Project Name</th>
                            <th>Start Date</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {emp.projects.map((proj, idx) => (
                            <tr key={idx}>
                              <td>{proj.name}</td>
                              <td>{proj.startDate}</td>
                              <td>{proj.deadline}</td>
                              <td>
                                <button className="btn btn-sm btn-warning me-1"
                                  onClick={() => openEditProjectModal(emp.username, idx, proj)}>Edit</button>
                                <button className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteProject(emp.username, idx)}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
            )}
          </div>
          {/* Edit Project Modal */}
          {editProjectModal.show && (
            <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Project</h5>
                    <button type="button" className="btn-close" onClick={() => setEditProjectModal({
                      show: false, username: '', index: null, name: '', startDate: '', deadline: '', error: '', success: ''
                    })}></button>
                  </div>
                  <div className="modal-body">
                    {editProjectModal.error && <div className="alert alert-danger">{editProjectModal.error}</div>}
                    {editProjectModal.success && <div className="alert alert-success">{editProjectModal.success}</div>}
                    <div className="mb-2">
                      <label className="form-label">Project Name</label>
                      <input className="form-control" name="name" value={editProjectModal.name} onChange={handleEditProjectChange} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Start Date</label>
                      <input className="form-control" type="date" name="startDate" value={editProjectModal.startDate} onChange={handleEditProjectChange} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Deadline</label>
                      <input className="form-control" type="date" name="deadline" value={editProjectModal.deadline} onChange={handleEditProjectChange} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" onClick={handleEditProjectSave}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setEditProjectModal({
                      show: false, username: '', index: null, name: '', startDate: '', deadline: '', error: '', success: ''
                    })}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LEAVE APPLICATIONS SECTION */}
      {role === 'manager' && activeSection === 'leaves' && (
        <div>
          <h4 className="fw-bold mb-3">Leave Applications</h4>
          {leaveActionMsg && <div className="alert alert-info">{leaveActionMsg}</div>}
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center">No leave applications found.</td>
                  </tr>
                )}
                {leaves.map((leave, idx) => (
                  <tr key={leave._id}>
                    <td>{idx + 1}</td>
                    <td>{leave.username}</td>
                    <td>{leave.fromDate}</td>
                    <td>{leave.toDate}</td>
                    <td>{leave.reason}</td>
                    <td>{leave.status}</td>
                    <td>
                      {leave.status === 'pending' && (
                        <>
                          <button className="btn btn-success btn-sm me-2"
                            onClick={() => handleLeaveAction(leave._id, 'approved')}>Approve</button>
                          <button className="btn btn-danger btn-sm"
                            onClick={() => handleLeaveAction(leave._id, 'denied')}>Deny</button>
                        </>
                      )}
                      {leave.status !== 'pending' && <span>-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PERFORMANCE SECTION */}
      {role === 'manager' && activeSection === 'performance' && (
        <EmployeePerformance />
      )}

      {/* EMPLOYEE DASHBOARD */}
      {role === 'employee' && (
        <>
          {lastLeaveStatus && (
            <div className={`alert mb-2 ${lastLeaveStatus.status === 'approved'
              ? 'alert-success'
              : lastLeaveStatus.status === 'denied'
                ? 'alert-danger'
                : 'alert-warning'
              }`}>
              <b>Last Leave:</b> {lastLeaveStatus.fromDate} to {lastLeaveStatus.toDate} &mdash; <b>Status:</b> {lastLeaveStatus.status.charAt(0).toUpperCase() + lastLeaveStatus.status.slice(1)}
              {lastLeaveStatus.status !== 'pending' && (
                <span>
                  {lastLeaveStatus.status === 'approved'
                    ? ` | Approved by manager`
                    : ` | Denied by manager`}
                </span>
              )}
              {lastLeaveStatus.reason && (
                <span> | Reason: {lastLeaveStatus.reason}</span>
              )}
            </div>
          )}
          <div className="card p-3 mb-4">
            <h5>Apply for Leave</h5>
            <form
              className="row g-2 align-items-end"
              onSubmit={async (e) => {
                e.preventDefault();
                setLeaveMsg('');
                const res = await fetch('http://localhost:5000/api/leaves', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username,
                    fromDate: leaveForm.fromDate,
                    toDate: leaveForm.toDate,
                    reason: leaveForm.reason
                  })
                });
                if (res.ok) {
                  setLeaveMsg('Leave application submitted!');
                  setLeaveForm({ fromDate: '', toDate: '', reason: '' });
                } else {
                  setLeaveMsg('Failed to submit leave application.');
                }
              }}
            >
              <div className="col-md-3">
                <label className="form-label">From</label>
                <input type="date" className="form-control" value={leaveForm.fromDate}
                  onChange={e => setLeaveForm(f => ({ ...f, fromDate: e.target.value }))} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">To</label>
                <input type="date" className="form-control" value={leaveForm.toDate}
                  onChange={e => setLeaveForm(f => ({ ...f, toDate: e.target.value }))} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Reason</label>
                <input type="text" className="form-control" value={leaveForm.reason}
                  onChange={e => setLeaveForm(f => ({ ...f, reason: e.target.value }))} required />
              </div>
              <div className="col-md-2">
                <button className="btn btn-success w-100" type="submit">Apply</button>
              </div>
              {leaveMsg && <div className="col-12 mt-2">{leaveMsg}</div>}
            </form>
          </div>
          {leaveStatusPopup.show && (
            <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Leave Status</h5>
                    <button type="button" className="btn-close" onClick={() => setLeaveStatusPopup({ show: false, message: '' })}></button>
                  </div>
                  <div className="modal-body">
                    <p>{leaveStatusPopup.message}</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" onClick={() => setLeaveStatusPopup({ show: false, message: '' })}>OK</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 p-3">
                <PersonalPerformance username={username} />
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 p-3">
                <EmployeeProjects username={username} />
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 p-3">
                <EmployeeAttendance username={username} paidLeaves={paidLeaves} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}