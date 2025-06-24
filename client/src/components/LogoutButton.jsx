import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // --- Logout time tracking logic START ---
    const username = localStorage.getItem('user');
    let logs = JSON.parse(localStorage.getItem('employeeLogs') || '{}');
    if (logs[username] && logs[username].length > 0) {
      const lastLog = logs[username][logs[username].length - 1];
      if (lastLog && !lastLog.logout) {
        lastLog.logout = new Date();
      }
      localStorage.setItem('employeeLogs', JSON.stringify(logs));
    }
    // --- Logout time tracking logic END ---

    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <button
      className="btn btn-danger"
      onClick={handleLogout}
      style={{ position: "absolute", top: 20, right: 20, zIndex: 999 }}
    >
      Logout
    </button>
  );
}