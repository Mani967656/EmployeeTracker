import { useState } from "react";

export default function EmployeeForm({ show, onHide, onSave }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Marketing");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Active");
  const [darkMode, setDarkMode] = useState(false);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !department || !position || !status) return;
    if (onSave) {
      onSave({ name, email, department, position, status });
    }
    // Reset fields
    setName("");
    setEmail("");
    setDepartment("Marketing");
    setPosition("");
    setStatus("Active");
    onHide();
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setDepartment("Marketing");
    setPosition("");
    setStatus("Active");
    onHide();
  };

  const modalBg = darkMode ? "#23272f" : "#fff";
  const textColor = darkMode ? "#f8f9fa" : "#212529";

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
      <div className="modal-dialog">
        <div
          className="modal-content"
          style={{
            background: modalBg,
            color: textColor,
            transition: "background 0.3s, color 0.3s"
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="modal-header" style={{ borderBottom: darkMode ? "1px solid #444" : undefined }}>
              <h5 className="modal-title">Add Employee</h5>
              <button
                type="button"
                className="btn-close"
                style={{ filter: darkMode ? "invert(1)" : "none" }}
                onClick={handleCancel}
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="darkModeSwitch"
                  checked={darkMode}
                  onChange={() => setDarkMode((d) => !d)}
                />
                <label className="form-check-label" htmlFor="darkModeSwitch">
                  {darkMode ? "Dark" : "Light"} Mode
                </label>
              </div>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  style={{ background: darkMode ? "#23272f" : "#fff", color: textColor }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  style={{ background: darkMode ? "#23272f" : "#fff", color: textColor }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  style={{ background: darkMode ? "#23272f" : "#fff", color: textColor }}
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  required
                >
                  <option>Marketing</option>
                  <option>HR</option>
                  <option>Finance</option>
                  <option>Engineering</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Position</label>
                <input
                  className="form-control"
                  style={{ background: darkMode ? "#23272f" : "#fff", color: textColor }}
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  style={{ background: darkMode ? "#23272f" : "#fff", color: textColor }}
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  required
                >
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: darkMode ? "1px solid #444" : undefined }}>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}