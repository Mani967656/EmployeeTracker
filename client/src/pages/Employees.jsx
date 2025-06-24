import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeForm from '../components/EmployeeForm';
import LogoutButton from '../components/LogoutButton';
import ThemeToggle from '../components/ThemeToggle';
import EmployeePerformance from '../components/EmployeePerformance';

export default function Employees() {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Get the role from localStorage

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Left: Navigation, Add Employee (if manager), Theme Toggle */}
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button
            className="btn btn-primary"
            disabled
          >
            Employees
          </button>
          {/* Only show Add Employee if manager */}
          {role === 'manager' && (
            <button className="btn btn-success" onClick={() => setShowForm(true)}>
              + Add Employee
            </button>
          )}
          <ThemeToggle />
        </div>
        {/* Right: Logout */}
        <LogoutButton />
      </div>
      <EmployeeTable />
      <EmployeeForm show={showForm} onHide={() => setShowForm(false)} />
      {/* Show performance visualization only for manager */}
      {role === 'manager' && (
        <div className="mt-4">
          <EmployeePerformance />
        </div>
      )}
    </div>
  );
}