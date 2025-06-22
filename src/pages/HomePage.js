import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
const HomePage = () => {
  return (
    <div className="home-container">
      <div>
        <h1>Welcome to the Smart Learn</h1>
        <p>Your Profile details will be displayed here</p>
      </div>

      <div className="home-content">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default HomePage;
