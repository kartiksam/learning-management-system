import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    axios
      .post("http://localhost:8080/api/auth/login", data)
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        navigate("/create");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">🚀</div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={data.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={data.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            <span>Sign In</span>
            <span className="button-icon">→</span>
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?
            <Link to="/register" className="register-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
