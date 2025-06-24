import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialEmployees = [
  { name: "Jane Smith", email: "jane.smith@teampulse.com", department: "Marketing", position: "Marketing Manager", status: "Active", username: "janesmith" },
  { name: "Michael Johnson", email: "michael.johnson@teampulse.com", department: "HR", position: "HR Specialist", status: "On Leave", username: "michaeljohnson" },
  { name: "Emily Williams", email: "emily.williams@teampulse.com", department: "Finance", position: "Financial Analyst", status: "Active", username: "emilywilliams" },
  { name: "David Brown", email: "david.brown@teampulse.com", department: "Engineering", position: "Frontend Developer", status: "Inactive", username: "davidbrown" },
];

export default function EmployeeTable() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [editEmployee, setEditEmployee] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      department === 'All Departments' || emp.department === department;
    return matchesSearch && matchesDept;
  });

  const departments = [
    'All Departments',
    ...Array.from(new Set(initialEmployees.map(emp => emp.department)))
  ];

  const handleEditClick = (emp) => {
    setEditEmployee(emp.email);
    setEditForm({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      status: emp.status
    });
    setMsg('');
  };

  const handleEditFormChange = (e) => {
    setEditForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };

  // PATCH request to backend for updating employee
  const handleEditSave = async () => {
    setMsg('');
    try {
      // Use name as username if you have username, otherwise use email as identifier
      const identifier = editForm.name || editForm.email;
      const res = await fetch(`http://localhost:5000/api/employees/${encodeURIComponent(identifier)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setEmployees(emps =>
          emps.map(emp =>
            emp.email === editEmployee ? { ...emp, ...editForm } : emp
          )
        );
        setMsg('Employee updated successfully!');
        setTimeout(() => {
          setEditEmployee(null);
          setMsg('');
        }, 1000);
      } else {
        const err = await res.json();
        setMsg(err.message || 'Failed to update employee.');
      }
    } catch {
      setMsg('Server error. Please try again.');
    }
  };

  const handleEditCancel = () => {
    setEditEmployee(null);
    setMsg('');
  };

  const handleDelete = (email) => {
    setEmployees(emps => emps.filter(emp => emp.email !== email));
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-3 d-flex">
          <input
            className="form-control me-2"
            placeholder="Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ maxWidth: 200 }}
            value={department}
            onChange={e => setDepartment(e.target.value)}
          >
            {departments.map(dep => (
              <option key={dep}>{dep}</option>
            ))}
          </select>
        </div>
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">No employees found.</td>
              </tr>
            )}
            {filteredEmployees.map(emp => (
              <tr key={emp.email}>
                <td>
                  <div className="d-flex align-items-center">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}`} alt={emp.name} className="rounded-circle me-2" width={36} />
                    <div>
                      <div>{emp.name}</div>
                      <div className="text-muted small">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {editEmployee === emp.email ? (
                    <input
                      className="form-control form-control-sm"
                      name="department"
                      value={editForm.department}
                      onChange={handleEditFormChange}
                    />
                  ) : (
                    emp.department
                  )}
                </td>
                <td>
                  {editEmployee === emp.email ? (
                    <input
                      className="form-control form-control-sm"
                      name="position"
                      value={editForm.position}
                      onChange={handleEditFormChange}
                    />
                  ) : (
                    emp.position
                  )}
                </td>
                <td>
                  {editEmployee === emp.email ? (
                    <select
                      className="form-select form-select-sm"
                      name="status"
                      value={editForm.status}
                      onChange={handleEditFormChange}
                    >
                      <option>Active</option>
                      <option>On Leave</option>
                      <option>Inactive</option>
                    </select>
                  ) : (
                    <span className={`badge ${emp.status === "Active" ? "bg-success" : emp.status === "On Leave" ? "bg-warning text-dark" : "bg-danger"}`}>
                      {emp.status}
                    </span>
                  )}
                </td>
                <td>
                  {editEmployee === emp.email ? (
                    <>
                      <button className="btn btn-success btn-sm me-1" onClick={handleEditSave}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={handleEditCancel}>Cancel</button>
                      {msg && <div className="text-success small mt-1">{msg}</div>}
                    </>
                  ) : (
                    <>
                      {/* View button removed */}
                      <button className="btn btn-link text-warning" title="Edit" onClick={() => handleEditClick(emp)}><i className="bi bi-pencil"></i></button>
                      <button className="btn btn-link text-danger" title="Delete" onClick={() => handleDelete(emp.email)}><i className="bi bi-trash"></i></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}