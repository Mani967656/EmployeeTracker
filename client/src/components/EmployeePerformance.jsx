import { useMemo } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
      case "week": {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return loginDate >= weekAgo;
      }
      default:
        return true;
    }
  });
}

export default function EmployeePerformance() {
  const logs = useMemo(() => JSON.parse(localStorage.getItem("employeeLogs") || "{}"), []);
  const employees = Object.keys(logs);

  // Elegant color palettes
  const pieColors = [
    "#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"
  ];
  const barColors = [
    "#6a89cc", "#38ada9", "#b8e994", "#f6b93b", "#e55039", "#4a69bd", "#60a3bc", "#78e08f", "#fa983a", "#eb2f06"
  ];

  // Pie chart: working hours this month
  const pieData = {
    labels: employees,
    datasets: [
      {
        label: "Working Hours (This Month)",
        data: employees.map(e => getHours(filterLogs(logs[e], "month"))),
        backgroundColor: employees.map((_, i) => pieColors[i % pieColors.length]),
        borderWidth: 2,
        borderColor: "#fff"
      },
    ],
  };

  // Bar chart: working hours this week
  const barData = {
    labels: employees,
    datasets: [
      {
        label: "Working Hours (This Week)",
        data: employees.map(e => getHours(filterLogs(logs[e], "week"))),
        backgroundColor: employees.map((_, i) => barColors[i % barColors.length]),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    maintainAspectRatio: false
  };

  return (
    <div className="my-4">
      <h4 className="fw-bold mb-3">Employee Performance (Working Hours)</h4>
      <div className="d-flex flex-wrap gap-4 justify-content-center">
        <div style={{ width: 350, height: 350, background: "#fff", borderRadius: 12, padding: 16 }}>
          <Pie data={pieData} options={chartOptions} />
        </div>
        <div style={{ width: 350, height: 350, background: "#fff", borderRadius: 12, padding: 16 }}>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}