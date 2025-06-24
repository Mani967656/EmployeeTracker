// client/src/components/RecentActivities.jsx
export default function RecentActivities() {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">Recent Activities</h5>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-person-dash text-danger me-2"></i>
              Removed employee from system: <b>John Doe</b>
              <div className="text-muted small">Jun 5, 2:20 PM</div>
            </span>
            <span className="badge bg-danger">delete</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-person-plus text-success me-2"></i>
              Added new employee: <b>David Brown</b>
              <div className="text-muted small">Sep 15, 4:00 PM</div>
            </span>
            <span className="badge bg-success">add</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-pencil-square text-primary me-2"></i>
              Updated employee information: <b>Jane Smith</b>
              <div className="text-muted small">Sep 14, 8:15 PM</div>
            </span>
            <span className="badge bg-primary">edit</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-person-dash text-danger me-2"></i>
              Removed employee from system: <b>Robert Taylor</b>
              <div className="text-muted small">Sep 12, 2:45 PM</div>
            </span>
            <span className="badge bg-danger">delete</span>
          </li>
        </ul>
      </div>
    </div>
  );
}