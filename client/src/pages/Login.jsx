import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Check for existing session and redirect if logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    const userRole = localStorage.getItem('role');
    if (user && userRole) {
      navigate(userRole === 'manager' ? '/manager-dashboard' : '/dashboard');
    }
  }, [navigate]);

  // Login using backend API (MongoDB Atlas)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user', user.username);
        localStorage.setItem('role', user.role);
        setSuccess(true);

        // --- Login time tracking logic START ---
        const now = new Date();
        let logs = JSON.parse(localStorage.getItem('employeeLogs') || '{}');
        if (!logs[username]) logs[username] = [];
        logs[username].push({ login: now, logout: null });
        localStorage.setItem('employeeLogs', JSON.stringify(logs));
        // --- Login time tracking logic END ---

        setTimeout(() => {
          navigate(user.role === 'manager' ? '/manager-dashboard' : '/dashboard');
        }, 1500);
      } else {
        setError('Invalid credentials or role. Please try again.');
      }
    } catch {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="position-absolute top-0 start-50 translate-middle-x" style={{ zIndex: 1050, width: 400 }}>
        {success && (
          <div className="alert alert-success text-center mb-2" role="alert">
            Login successful!
          </div>
        )}
      </div>
      <div className="card p-4 shadow" style={{ minWidth: 400 }}>
        <div className="text-center mb-3">
          <img src="/logo.svg" alt="logo" width={48} />
          <h2 className="fw-bold mt-2">teamPulse</h2>
          <div className="text-muted">Employee Management System</div>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username <span className="text-danger">*</span></label>
            <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password <span className="text-danger">*</span></label>
            <div className="input-group">
              <input
                type={show ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShow(s => !s)}>
                <i className={`bi bi-eye${show ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Role <span className="text-danger">*</span></label>
            <select className="form-select" value={role} onChange={e => setRole(e.target.value)} required>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          {error && <div className="alert alert-danger py-1">{error}</div>}
          <button className="btn btn-primary w-100" type="submit">Sign in</button>
        </form>
        <div className="text-muted small mt-3 text-center">
          Login with your registered credentials.<br />
          Only Manager can perform all employee CRUD operations.<br />
          Employees must sign in with their own credentials.
        </div>
      </div>
    </div>
  );
}