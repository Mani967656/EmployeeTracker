import React, { useEffect, useState } from 'react';

export default function EmployeeAttendance({ username, paidLeaves }) {
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    if (!username) return;
    // Fetch attendance records for the user for the current month
    fetch(`http://localhost:5000/api/attendance/${username}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        // Count unique days attended in the current month based on login date
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        // Assuming each record has a 'date' field for login
        const uniqueDays = new Set(
          data
            .filter(a => {
              const d = new Date(a.date);
              return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
            })
            .map(a => new Date(a.date).toDateString())
        );
        setAttendanceCount(uniqueDays.size);
      })
      .catch(() => setAttendanceCount(0));
  }, [username]);

  return (
    <div className="my-4">
      <h4 className="fw-bold mb-3">Attendance & Paid Leaves</h4>
      <ul className="list-group">
        <li className="list-group-item">
          Days Attended This Month (by login): <b>{attendanceCount}</b>
        </li>
        <li className="list-group-item">
          Paid Leaves Left: <b>{paidLeaves}</b>
        </li>
      </ul>
    </div>
  );
}