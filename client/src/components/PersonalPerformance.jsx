import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import React from "react";
Chart.register(ArcElement, Tooltip, Legend);

function getHours(logs) {
  let total = 0;
  logs.forEach(log => {
    if (log.login && log.logout) {
      total += (new Date(log.logout) - new Date(log.login)) / (1000 * 60 * 60);
    }
  });
  return total;
}

function filterLogs(logs, period) {
  const now = new Date();
  return logs.filter(log => {
    if (!log.login || !log.logout) return false;
    const loginDate = new Date(log.login);
    switch (period) {
      case "month":
        return loginDate.getMonth() === now.getMonth() && loginDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });
}

export default function PersonalPerformance({ username }) {
  // Get logs from localStorage or set as empty object
  const logs = JSON.parse(localStorage.getItem("employeeLogs") || "{}");
  const userLogs = logs[username] || [];

  const hoursThisMonth = getHours(filterLogs(userLogs, "month"));

  const pieData = {
    labels: ["This Month"],
    datasets: [
      {
        label: "Working Hours (This Month)",
        data: [hoursThisMonth],
        backgroundColor: ["#4e79a7"],
        borderWidth: 2,
        borderColor: "#fff"
      },
    ],
  };

  return (
    <div className="my-4">
      <h4 className="fw-bold mb-3">Your Performance (Working Hours - This Month)</h4>
      <div style={{ width: 350, height: 350, background: "#fff", borderRadius: 12, padding: 16, margin: "0 auto" }}>
        <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>
      <div className="mt-3 text-center">
        <span className="badge bg-primary fs-6">
          Total Hours This Month: {hoursThisMonth.toFixed(2)}
        </span>
      </div>
    </div>
  );
}