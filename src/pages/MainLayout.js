// src/layout/MainLayout.jsx
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./MainLayout.css";
import { getDecodedToken, getUserRole } from "../utils/auth";

const MainLayout = () => {
  const navigate = useNavigate();
  const decoded = getDecodedToken();
  const role = getUserRole();
  const [showMenu, setShowMenu] = useState(false);

  const displayName =
    decoded?.username || decoded?.sub || decoded?.email || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          {role !== "ADMIN" && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/list">My Courses</Link>
              {role === "INSTRUCTOR" && <Link to="/create">Create Course</Link>}
            </>
          )}
        </div>

        <div className="navbar-right">
          {role === "ADMIN" ? (
            // Admin: only power/profile icon, click to show email + logout
            <div className="user-profile admin-profile">
              <button
                className="avatar-circle avatar-button"
                onClick={() => setShowMenu((prev) => !prev)}
                title={decoded?.email || displayName}
              >
                ⏻
              </button>
              {showMenu && (
                <div className="admin-menu">
                  <div className="admin-menu-item admin-email">
                    {decoded?.email || decoded?.username || displayName}
                  </div>
                  <button
                    className="admin-menu-item admin-logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Other roles: show name + role + logout button
            <>
              <div className="user-profile">
                <div className="avatar-circle">{displayName.charAt(0)}</div>
                <div className="user-info">
                  <span className="user-name">{displayName}</span>
                  {role && <span className="user-role">{role}</span>}
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
