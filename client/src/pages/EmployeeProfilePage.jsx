import { useParams, Navigate } from 'react-router-dom';
import EmployeeProfile from '../components/EmployeeProfile';

export default function EmployeeProfilePage() {
  const { username } = useParams();
  const isLoggedIn = !!localStorage.getItem('user');
  const role = localStorage.getItem('role');

  // Only allow managers to view this page
  if (!isLoggedIn || role !== 'manager') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container py-4">
      <EmployeeProfile username={username} />
    </div>
  );
}