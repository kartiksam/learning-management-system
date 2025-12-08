// import axios from "axios";
// import React, { useState } from "react";
// import "./Register.css";
// import { Link, useNavigate } from "react-router-dom";
// import ReCAPTCHA from "react-google-recaptcha";
// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     role: "STUDENT",
//     captchaToken: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const navigate = useNavigate();

//   const onCaptchaChange = (token) => {
//     setFormData({ ...formData, captchaToken: token });
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.captchaToken) {
//       alert("Please verify CAPTCHA.");
//       return;
//     }
//     console.log(formData);
//     axios
//       .post("http://localhost:8080/api/auth/register", formData)
//       .then((response) => {
//         console.log(response);
//         navigate("/login");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   return (
//     <div className="register-container">
//       <div className="register-background">
//         <div className="floating-shapes">
//           <div className="shape shape-1"></div>
//           <div className="shape shape-2"></div>
//           <div className="shape shape-3"></div>
//         </div>
//       </div>

//       <div className="register-card">
//         <div className="register-header">
//           <div className="logo-icon">🎓</div>
//           <h2>Create Your Account</h2>
//           <p>Join Smart Learn and start your learning journey today</p>
//         </div>

//         <form onSubmit={handleSubmit} className="register-form">
//           <div className="form-group">
//             <label htmlFor="username">Username</label>
//             <div className="input-wrapper">
//               <span className="input-icon">👤</span>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 placeholder="Enter your username"
//                 value={formData.username}
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
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="role">Role</label>
//             <div className="input-wrapper">
//               <span className="input-icon">🎯</span>
//               <select
//                 id="role"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//               >
//                 <option value="STUDENT">Student</option>
//                 <option value="INSTRUCTOR">Instructor</option>
//                 <option value="ADMIN">Admin</option>
//               </select>
//             </div>
//           </div>
//           {/* CAPTCHA HERE */}
//           <ReCAPTCHA
//             sitekey="6LccfiIsAAAAADUMPF4s0PytuloIKMVwtyR12F7A" // <--- REPLACE THIS
//             onChange={onCaptchaChange}
//           />
//           <button type="submit" className="register-button">
//             <span>Create Account</span>
//             <span className="button-icon">→</span>
//           </button>
//         </form>

//         <div className="register-footer">
//           <p>
//             Already have an account?
//             <Link to="/login" className="login-link">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import axios from "axios";
import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const [step, setStep] = useState(1); // STEP 1 = form, STEP 2 = verify token

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "STUDENT",
    captchaToken: "",
  });

  const [token, setToken] = useState(""); // for verification token

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCaptchaChange = (token) => {
    setFormData({ ...formData, captchaToken: token });
  };

  const navigate = useNavigate();

  // -----------------------------
  // STEP 1 — Send verification email
  // -----------------------------
  const handleSubmitStep1 = (e) => {
    e.preventDefault();

    if (!formData.captchaToken) {
      alert("Please verify CAPTCHA.");
      return;
    }

    axios
      .post("http://localhost:8080/api/auth/register", formData)
      .then((res) => {
        alert("Verification email sent! Check your inbox.");
        setStep(2); // move to next screen
      })
      .catch((err) => {
        alert("Error: " + err.response?.data);
      });
  };

  // -----------------------------
  // STEP 2 — Complete registration
  // -----------------------------
  const handleSubmitStep2 = () => {
    if (!token) {
      alert("Enter verification code");
      return;
    }

    axios
      .post(`http://localhost:8080/api/auth/verify?token=${token}`, formData)
      .then((res) => {
        alert("Account created successfully!");
        navigate("/login");
      })
      .catch((err) => {
        alert("Verification failed: " + err.response?.data);
      });
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="register-card">
        <div className="register-header">
          <div className="logo-icon">🎓</div>
          <h2>Create Your Account</h2>
          <p>Join Smart Learn and start your journey</p>
        </div>

        {/* ----------------------------------------------------
            STEP 1 FORM — SEND VERIFICATION EMAIL
        ----------------------------------------------------- */}
        {step === 1 && (
          <form onSubmit={handleSubmitStep1} className="register-form">
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="username"
                  name="username"
                  placeholder="Enter your email"
                  value={formData.username}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <div className="input-wrapper">
                <span className="input-icon">🎯</span>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="STUDENT">Student</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            {/* CAPTCHA */}
            <ReCAPTCHA
              sitekey="6LccfiIsAAAAADUMPF4s0PytuloIKMVwtyR12F7A"
              onChange={onCaptchaChange}
            />

            <button type="submit" className="register-button">
              <span>Send Verification Email</span>
              <span className="button-icon">→</span>
            </button>
          </form>
        )}

        {/* ----------------------------------------------------
            STEP 2 FORM — ENTER TOKEN
        ----------------------------------------------------- */}
        {step === 2 && (
          <div className="verify-form">
            <h3>Verify Your Email</h3>
            <p>Enter the verification code sent to your email</p>

            <input
              type="text"
              placeholder="Enter verification token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="token-input"
            />

            <button onClick={handleSubmitStep2} className="register-button">
              <span>Verify & Create Account</span>
              <span className="button-icon">✔</span>
            </button>
          </div>
        )}

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
