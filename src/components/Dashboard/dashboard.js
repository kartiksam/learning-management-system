import React from "react";

import Reviews from "../Review/ReviewForm";

import "./dashboard.css";
import Notifications from "../Notification/Notification";
import CourseProgress from "../Progress/CourseProgress";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>My Dashboard</h2>
      <div className="dashboard-section">
        <Notifications />
        <CourseProgress />
      </div>
      <div className="dashboard-section">
        <Reviews />
      </div>
    </div>
  );
};

export default Dashboard;
