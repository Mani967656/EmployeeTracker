import React, { useEffect, useState } from "react";

export default function EmployeeProfile({ username, onProfileUpdate }) {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    // Fetch employee profile from backend
    if (username) {
      fetch(`http://localhost:5000/api/employees/${username}`)
        .then((res) => res.json())
        .then((profile) => {
          setData(profile);
          setEditForm({
            email: profile.email || "",
            contact1: profile.contact1 || "",
            contact2: profile.contact2 || "",
            joiningDate: profile.joiningDate ? profile.joiningDate.substring(0, 10) : "",
            address: profile.address || "",
            designation: profile.designation || ""
          });
        })
        .catch(() => setData(null));
    }
  }, [username]);

  const handleEditChange = (e) => {
    setEditForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setMsg('');
    // Only send allowed fields to backend
    const {
      email,
      contact1,
      contact2,
      joiningDate,
      address,
      designation
    } = editForm;
    const payload = { email, contact1, contact2, joiningDate, address, designation };
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMsg('Profile updated successfully!');
        setEditMode(false);
        // Refresh profile data and editForm with updated values
        fetch(`http://localhost:5000/api/employees/${username}`)
          .then((res) => res.json())
          .then((profile) => {
            setData(profile);
            setEditForm({
              email: profile.email || "",
              contact1: profile.contact1 || "",
              contact2: profile.contact2 || "",
              joiningDate: profile.joiningDate ? profile.joiningDate.substring(0, 10) : "",
              address: profile.address || "",
              designation: profile.designation || ""
            });
            // Notify parent (dashboard) to refresh employee list if needed
            if (typeof onProfileUpdate === "function") {
              onProfileUpdate();
            }
          });
      } else {
        const err = await res.json();
        setMsg(err.message || 'Failed to update profile.');
      }
    } catch {
      setMsg('Server error. Please try again.');
    }
  };

  if (!data) return <div className="text-center py-4">Profile not found.</div>;

  return (
    <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: 600, borderRadius: 16 }}>
      <div className="d-flex align-items-center">
        <img
          src={data.photo || "/default-profile.png"}
          alt={data.name || data.username}
          style={{
            width: 120,
            height: 120,
            borderRadius: "12px",
            objectFit: "cover",
            border: "2px solid #eee",
            background: "#f8f9fa",
            marginRight: 32,
          }}
        />
        <div style={{ flex: 1 }}>
          <h4 className="fw-bold mb-2">{data.name || data.username}</h4>
          {editMode ? (
            <>
              <div className="mb-1">
                <b>Email:</b>{" "}
                <input
                  className="form-control"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  style={{ maxWidth: 250, display: "inline-block" }}
                />
              </div>
              <div className="mb-1">
                <b>Contact 1:</b>{" "}
                <input
                  className="form-control"
                  name="contact1"
                  value={editForm.contact1}
                  onChange={handleEditChange}
                  style={{ maxWidth: 250, display: "inline-block" }}
                />
              </div>
              <div className="mb-1">
                <b>Contact 2:</b>{" "}
                <input
                  className="form-control"
                  name="contact2"
                  value={editForm.contact2}
                  onChange={handleEditChange}
                  style={{ maxWidth: 250, display: "inline-block" }}
                />
              </div>
              <div className="mb-1">
                <b>Joining Date:</b>{" "}
                <input
                  className="form-control"
                  name="joiningDate"
                  type="date"
                  value={editForm.joiningDate}
                  onChange={handleEditChange}
                  style={{ maxWidth: 180, display: "inline-block" }}
                />
              </div>
              <div className="mb-1">
                <b>Address:</b>{" "}
                <input
                  className="form-control"
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  style={{ maxWidth: 250, display: "inline-block" }}
                />
              </div>
              <div className="mb-1">
                <b>Designation:</b>{" "}
                <input
                  className="form-control"
                  name="designation"
                  value={editForm.designation}
                  onChange={handleEditChange}
                  style={{ maxWidth: 200, display: "inline-block" }}
                />
              </div>
              <div className="mb-2">
                <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setEditMode(false); setEditForm({
                  email: data.email || "",
                  contact1: data.contact1 || "",
                  contact2: data.contact2 || "",
                  joiningDate: data.joiningDate ? data.joiningDate.substring(0, 10) : "",
                  address: data.address || "",
                  designation: data.designation || ""
                }); }}>Cancel</button>
              </div>
              {msg && <div className="alert alert-info py-1">{msg}</div>}
            </>
          ) : (
            <>
              <div className="mb-1">
                <b>Email:</b> <span className="text-secondary">{data.email || "N/A"}</span>
              </div>
              <div className="mb-1">
                <b>Contact 1:</b> <span className="text-secondary">{data.contact1 || "N/A"}</span>
              </div>
              <div className="mb-1">
                <b>Contact 2:</b> <span className="text-secondary">{data.contact2 || "N/A"}</span>
              </div>
              <div className="mb-1">
                <b>Joining Date:</b> <span className="text-secondary">{data.joiningDate || "N/A"}</span>
              </div>
              <div className="mb-1">
                <b>Address:</b> <span className="text-secondary">{data.address || "N/A"}</span>
              </div>
              <div className="mb-1">
                <b>Designation:</b> <span className="text-secondary">{data.designation || data.role || "N/A"}</span>
              </div>
              {/* Only show team for managers */}
              {data.team && (
                <div>
                  <b>Team Members:</b>{" "}
                  <span className="text-secondary">{Array.isArray(data.team) ? data.team.join(", ") : data.team}</span>
                </div>
              )}
              <div className="mt-2">
                <button className="btn btn-primary btn-sm" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
              </div>
              {msg && <div className="alert alert-info py-1 mt-2">{msg}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}