## 🧑‍💼 Employee Tracker  Web Application

A web-based application to manage and monitor employee attendance, tasks, leaves, and performance in real time. Built using the MERN stack (MongoDB, Express.js, React, Node.js).

---

## 📌 Features

- ✅ Employee login and dashboard
- 🕒 Real-time attendance tracking (Check-in / Check-out)
- 📋 Task assignment and progress monitoring
- 📝 Leave request and approval system
- 📈 Performance analytics for HR and managers
- 🔐 Role-based access (Admin, Manager, Employee)

---

## 🚀 Technologies Used

- **Frontend:** React.js, Bootstrap, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **File Uploads:** Multer
- **Authentication:** JWT & bcrypt

---

## 📂 Folder Structure
`
├── EmpTracker/
│   ├── client/
│   │   ├── .gitignore
│   │   ├── eslint.config.js
│   │   ├── index.html
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── vite.config.js
│   │   ├── public/
│   │   │   ├── logo.svg
│   │   │   ├── vite.svg
│   │   ├── src/
│   │   │   ├── App.css
│   │   │   ├── App.jsx
│   │   │   ├── index.css
│   │   │   ├── main.jsx
│   │   │   ├── assets/
│   │   │   │   ├── react.svg
│   │   │   ├── components/
│   │   │   │   ├── DashboardCards.jsx
│   │   │   │   ├── DepartmentStats.jsx
│   │   │   │   ├── EmployeeAttendance.jsx
│   │   │   │   ├── EmployeeForm.jsx
│   │   │   │   ├── EmployeePerformance.jsx
│   │   │   │   ├── EmployeeProfile.jsx
│   │   │   │   ├── EmployeeProjects.jsx
│   │   │   │   ├── EmployeeTable.jsx
│   │   │   │   ├── Inbox.jsx
│   │   │   │   ├── LogoutButton.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── PersonalPerformance.jsx
│   │   │   │   ├── RecentActivities.jsx
│   │   │   │   ├── ThemeToggle.jsx
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── EmployeeProfilePage.jsx
│   │   │   │   ├── Employees.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   ├── styles/
│   │   │   │   ├── custom.css
│
│   ├── server/
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── server.js
│   │   ├── models/
│   │   │   ├── Activity.js
│   │   │   ├── Employee.js
│   │   │   ├── InboxMessage.js
│   │   │   ├── Leave.js
│   │   ├── routes/
│   │   │   ├── activities.js
│   │   │   ├── employees.js
│   │   │   ├── inboxRoutes.js
│   │   │   ├── leaves.js
`
