// VerifyEmail.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userData = location.state; // username, password, role

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // -----------------------------------------
  // VERIFY OTP (Complete Registration)
  // -----------------------------------------
  const handleVerify = () => {
    if (otp.trim() === "") {
      alert("Enter OTP");
      return;
    }

    axios
      .post(`http://localhost:8080/api/auth/verify?token=${otp}`, userData)
      .then(() => {
        alert("Account created successfully!");
        navigate("/login");
      })
      .catch((err) => {
        alert(err.response?.data || "Verification failed");
      });
  };

  // -----------------------------------------
  // RESEND OTP
  // -----------------------------------------
  const resendOtp = () => {
    axios
      .post(
        `http://localhost:8080/api/auth/resend-otp?email=${userData.username}`
      )
      .then(() => {
        alert("OTP resent!");
        setTimer(60);
        setCanResend(false);
      })
      .catch((err) => {
        alert(err.response?.data || "Error sending OTP");
      });
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2>Email Verification</h2>
        <p>A verification code has been sent to:</p>
        <h4>{userData.username}</h4>

        <input
          className="otp-input"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="verify-btn" onClick={handleVerify}>
          Verify & Create Account
        </button>

        <div className="resend-section">
          {canResend ? (
            <button className="resend-btn" onClick={resendOtp}>
              Resend OTP
            </button>
          ) : (
            <p>Resend OTP in {timer} sec</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
