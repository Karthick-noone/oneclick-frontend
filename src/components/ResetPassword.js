import React, { useState } from "react";
import "./css/Auth.css";
import { FaWhatsapp, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [active, setActive] = useState("auth-forgot1");
  const [loading, setLoading] = useState(false);


  return (
    <div id="auth-container" className={`auth-container ${active}`}>
      {/* FORM SECTION */}
      <div className="auth-row">
        {/* STEP 1: Request OTP */}
        <div className="auth-col auth-align-center auth-flex-col auth-forgot1">
          <div className="auth-form-wrapper auth-align-center">
            <form className="auth-form auth-forgot1" onSubmit={(e) => e.preventDefault()}>
              <h2>Forgot Password</h2>
              <div className="auth-input-group">
                <FaWhatsapp className="auth-input-icon" />
                <input type="tel" required pattern="[0-9]{10}" />
                <label>WhatsApp Number</label>
              </div>
              <button type="button" onClick={() => setActive("auth-forgot2")} disabled={loading}>
                {loading ? <span className="auth-loader"></span> : "Request OTP"}
              </button>
            </form>
          </div>
        </div>

        {/* STEP 2: Verify OTP */}
        <div className="auth-col auth-align-center auth-flex-col auth-forgot2">
          <div className="auth-form-wrapper auth-align-center">
            <form className="auth-form auth-forgot2" onSubmit={(e) => e.preventDefault()}>
              <h2>Verify OTP</h2>
              <div className="auth-input-group">
                <FaLock className="auth-input-icon" />
                <input type="text" required maxLength="6" />
                <label>Enter OTP</label>
              </div>
              <button type="button" onClick={() => setActive("auth-forgot3")} disabled={loading}>
                {loading ? <span className="auth-loader"></span> : "Verify OTP"}
              </button>
              <p>
                <b onClick={() => setActive("auth-forgot1")} className="auth-pointer">Back</b>
              </p>
            </form>
          </div>
        </div>

        {/* STEP 3: Reset Password */}
        <div className="auth-col auth-align-center auth-flex-col auth-forgot3">
          <div className="auth-form-wrapper auth-align-center">
            <form className="auth-form auth-forgot3" onSubmit={(e) => e.preventDefault()}>
              <h2>Reset Password</h2>
              <div className="auth-input-group">
                <FaLock className="auth-input-icon" />
                <input type="password" required />
                <label>New Password</label>
              </div>
              <div className="auth-input-group">
                <FaLock className="auth-input-icon" />
                <input type="password" required />
                <label>Confirm Password</label>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? <span className="auth-loader"></span> : "Reset Password"}
              </button>
              <p>
                <b onClick={() => setActive("auth-forgot2")} className="auth-pointer">Back</b>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="auth-row auth-content-row">
        <div className="auth-col auth-align-center auth-flex-col">
          <div className="auth-text auth-forgot1 auth-forgot2 auth-forgot3">
            <Link to="/" className="logo-link">
              <img src="/img/logo3.png" width="230px" alt="Company Logo" />
            </Link>
            <h2>Password Recovery</h2>
            <p>
              Enter your WhatsApp number to receive OTP and reset your password
              securely in just a few steps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
