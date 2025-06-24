// client/src/components/DepartmentStats.jsx
export default function DepartmentStats() {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">Department Statistics</h5>
        <ul className="list-unstyled mb-3">
          <li><span className="badge bg-primary me-2">&nbsp;</span>Marketing <span className="float-end">1</span></li>
          <li><span className="badge bg-success me-2">&nbsp;</span>HR <span className="float-end">1</span></li>
          <li><span className="badge bg-warning text-dark me-2">&nbsp;</span>Finance <span className="float-end">1</span></li>
          <li><span className="badge" style={{backgroundColor:'#a259ff'}}>&nbsp;</span>Engineering <span className="float-end">1</span></li>
        </ul>
        <div className="progress" style={{height: '8px'}}>
          <div className="progress-bar bg-primary" style={{width: '25%'}}></div>
          <div className="progress-bar bg-success" style={{width: '25%'}}></div>
          <div className="progress-bar bg-warning" style={{width: '25%'}}></div>
          <div className="progress-bar" style={{width: '25%', backgroundColor:'#a259ff'}}></div>
        </div>
      </div>
    </div>
  );
}