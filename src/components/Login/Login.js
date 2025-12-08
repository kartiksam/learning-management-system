// import axios from "axios";
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Login.css";

// const Login = () => {
//   const [data, setData] = useState({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(data);
//     axios
//       .post("http://localhost:8080/api/auth/login", data)
//       .then((response) => {
//         console.log(response);
//         localStorage.setItem("token", response.data.accessToken);
//         navigate("/layout");
//         // navigate("/create");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   return (
//     <div className="login-container">
//       <div className="login-background">
//         <div className="floating-shapes">
//           <div className="shape shape-1"></div>
//           <div className="shape shape-2"></div>
//           <div className="shape shape-3"></div>
//         </div>
//       </div>

//       <div className="login-card">
//         <div className="login-header">
//           <div className="logo-icon">🚀</div>
//           <h2>Welcome Back</h2>
//           <p>Sign in to continue your learning journey</p>
//         </div>

//         <form onSubmit={handleSubmit} className="login-form">
//           <div className="form-group">
//             <label htmlFor="username">Username</label>
//             <div className="input-wrapper">
//               <span className="input-icon">👤</span>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 placeholder="Enter your username"
//                 value={data.username}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <div className="input-wrapper">
//               <span className="input-icon">🔒</span>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={data.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <button type="submit" className="login-button">
//             <span>Sign In</span>
//             <span className="button-icon">→</span>
//           </button>
//         </form>

//         <div className="login-footer">
//           <p>
//             Don't have an account?
//             <Link to="/register" className="register-link">
//               Create Account
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/auth/login", data)
      .then((response) => {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/layout");
      })
      .catch(() => alert("Invalid username or password"));
  };

  const sendOtp = () => {
    axios
      .post("http://localhost:8080/api/auth/forgot-password", { email })
      .then((res) => {
        alert(res.data); // shows "OTP sent to email"
        setShowForgotModal(false);
        setShowResetModal(true);
      })
      .catch((err) => {
        alert(err.response?.data || "Error sending OTP");
      });
  };

  const resetPassword = () => {
    axios
      .post("http://localhost:8080/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      })
      .then((res) => {
        alert(res.data); // "Password updated successfully"
        setShowResetModal(false);
      })
      .catch((err) => {
        alert(err.response?.data || "Invalid OTP");
      });
  };

  return (
    <>
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
            <button
              className="forgot-password-link"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot Password?
            </button>
            <p>
              Don't have an account?
              <Link to="/register" className="register-link">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ----------------------------------------
          FORGOT PASSWORD MODAL
      ----------------------------------------- */}
      {showForgotModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Forgot Password</h3>
            <p>Enter your registered email</p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={sendOtp} className="modal-btn">
              Send OTP
            </button>
            <button
              className="modal-close"
              onClick={() => setShowForgotModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------
          RESET PASSWORD MODAL (OTP + New Password)
      ----------------------------------------- */}
      {showResetModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reset Password</h3>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={resetPassword} className="modal-btn">
              Reset Password
            </button>
            <button
              className="modal-close"
              onClick={() => setShowResetModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
