// client/src/components/DashboardCards.jsx
export default function DashboardCards({ total = 0, active = 0, onleave = 0 }) {
  return (
    <div className="row g-3">
      <div className="col-md-4">
        <div className="card text-white bg-primary h-100">
          <div className="card-body d-flex align-items-center">
            <i className="bi bi-people-fill fs-1 me-3"></i>
            <div>
              <div className="fs-4 fw-bold">{total}</div>
              <div>Total Employees</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-success h-100">
          <div className="card-body d-flex align-items-center">
            <i className="bi bi-briefcase-fill fs-1 me-3"></i>
            <div>
              <div className="fs-4 fw-bold">{active}</div>
              <div>Active Employees</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-warning h-100">
          <div className="card-body d-flex align-items-center">
            <i className="bi bi-clock-fill fs-1 me-3"></i>
            <div>
              <div className="fs-4 fw-bold">{onleave}</div>
              <div>On Leave</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}