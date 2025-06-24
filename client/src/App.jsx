import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import EmployeeProfile from './components/EmployeeProfile';

// Helper component to conditionally render Navbar
function AppLayout({ children }) {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('user');
  // Hide Navbar on login page
  const hideNavbar = location.pathname === "/login";
  return (
    <>
      {isLoggedIn && !hideNavbar && <Navbar />}
      {children}
    </>
  );
}

// Wrapper to extract username param and pass to EmployeeProfile
function EmployeeProfileWrapper() {
  const { username } = useParams();
  return (
    <div className="container py-4">
      <EmployeeProfile username={username} />
    </div>
  );
}

function App() {
  const isLoggedIn = !!localStorage.getItem('user');
  const role = localStorage.getItem('role');
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route
            path="/employees"
            element={
              isLoggedIn
                ? (role === 'manager' ? <Employees /> : <Navigate to="/dashboard" />)
                : <Navigate to="/login" />
            }
          />
          {/* Profile page for logged-in user */}
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
          />
          {/* Step 2: Add the employee profile route for viewing any employee */}
          <Route
            path="/employees/:username"
            element={isLoggedIn && role === 'manager' ? <EmployeeProfileWrapper /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;