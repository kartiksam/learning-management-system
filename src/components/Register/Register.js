import axios from "axios";
import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "STUDENT",
    captchaToken: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCaptchaChange = (token) => {
    setFormData({ ...formData, captchaToken: token });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.captchaToken) {
      alert("Please verify CAPTCHA");
      return;
    }

    axios
      .post("http://localhost:8080/api/auth/register", formData)
      .then((res) => {
        navigate("/verify-email", { state: formData });
      })
      .catch((err) => {
        alert(err.response?.data || "Error");
      });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Your Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="username"
            placeholder="Email"
            required
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="ADMIN">Admin</option>
          </select>

          <ReCAPTCHA
            sitekey="6LccfiIsAAAAADUMPF4s0PytuloIKMVwtyR12F7A"
            onChange={onCaptchaChange}
          />

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
