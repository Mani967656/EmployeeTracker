import React from 'react';
import EmployeeProfile from '../components/EmployeeProfile';
import PersonalPerformance from '../components/PersonalPerformance';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Profile() {
  const username = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const [selectedProfile, setSelectedProfile] = React.useState(username);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-4" style={{ gap: "10px" }}>
        <button
          className={`btn ${selectedProfile === username ? 'btn-secondary' : 'btn-outline-secondary'}`}
          onClick={() => setSelectedProfile(username)}
        >
          My Profile
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>
        <ThemeToggle />
      </div>
      <h2 className="fw-bold mb-4 text-center">My Profile</h2>
      <EmployeeProfile username={selectedProfile} />
      {role === 'manager' && selectedProfile !== username && (
        <div className="mt-4">
          <h4 className="fw-bold mb-3 text-center">Performance Measures</h4>
          <PersonalPerformance username={selectedProfile} />
        </div>
      )}
    </div>
  );
}