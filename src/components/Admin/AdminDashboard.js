import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Panel</h1>
      <div className="admin-options">
        <Link to="/admin/users">Manage Users</Link>
        <Link to="/admin/courses">Manage Courses</Link>
        <Link to="/admin/enrollments">View Enrollments</Link>
        <Link to="/admin/materials">Material Uploads</Link>
        <Link to="/admin/progress">Student Progress</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
