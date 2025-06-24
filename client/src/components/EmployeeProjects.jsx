import React, { useEffect, useState } from "react";

export default function EmployeeProjects({ username }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (username) {
      fetch(`http://localhost:5000/api/employees/${username}`)
        .then(res => res.json())
        .then(data => setProjects(data.projects || []));
    }
  }, [username]);

  return (
    <div className="my-4">
      <h4 className="fw-bold mb-3">Your Projects</h4>
      <ul className="list-group">
        {(!projects || projects.length === 0) && (
          <li className="list-group-item">No projects assigned.</li>
        )}
        {projects && projects.map((project, i) => (
          <li key={project._id || i} className="list-group-item">
            <div>
              <b>Project:</b> {project.name ? project.name : "N/A"}
            </div>
            <div>
              <b>Start Date:</b> {project.startDate ? project.startDate : "N/A"}
            </div>
            <div>
              <b>Deadline:</b> {project.deadline ? project.deadline : "N/A"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}