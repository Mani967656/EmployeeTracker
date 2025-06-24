import ThemeToggle from './ThemeToggle';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    // Get user role from localStorage (from user object if available)
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setRole(user.role || "");
    } catch {
      setRole("");
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <span className="navbar-brand d-flex align-items-center">
          <img src="/logo.svg" alt="logo" width={32} className="me-2" />
          <span className="fw-bold">teamPulse</span>
        </span>
        <div className="d-flex align-items-center">
          {role === "manager" && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/add-employees")}
            >
              Add Employees
            </button>
          )}
        </div>
        {/* ...user info and logout... */}
      </div>
    </nav>
  );
}