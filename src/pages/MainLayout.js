// src/layout/MainLayout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/courses">My Courses</Link>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
