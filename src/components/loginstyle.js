import React, { useState, useEffect } from "react";
import "./css/Auth.css"; // put your CSS here
import { FaWhatsapp, FaLock, FaUser, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [active, setActive] = useState("auth-sign-in");
  const [loading, setLoading] = useState(false);

  // Auto-activate sign-in after 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSignIn(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const toggle = () => {
    setIsSignIn((prev) => !prev);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Form submitted!");
    }, 2000);
  };

return (
  <div className={`auth-container ${isSignIn ? "auth-sign-in" : "auth-sign-up"}`}>
   <div className="auth-row">
          {/* SIGN UP */}
          <div className="auth-col auth-align-center auth-flex-col auth-sign-up">
            <div className="auth-form-wrapper auth-align-center">
              <form className="auth-form auth-sign-up" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <div className="auth-input-group">
                  <FaUser className="auth-input-icon" />
                  <input type="text" required />
                  <label>Full Name</label>
                </div>
                <div className="auth-input-group">
                  <FaEnvelope className="auth-input-icon" />
                  <input type="email" required />
                  <label>Email</label>
                </div>
                <div className="auth-input-group">
                  <FaLock className="auth-input-icon" />
                  <input type="password" required />
                  <label>Password</label>
                </div>
                <div className="auth-input-group">
                  <FaLock className="auth-input-icon" />
                  <input type="password" required />
                  <label>Confirm Password</label>
                </div>
                <button type="submit" disabled={loading || active !== "auth-sign-up"}>
                  {loading ? <span className="auth-loader"></span> : "Sign up"}
                </button>
                <p>
                  <span>Already have an account?</span>
                  <b onClick={toggle} className="auth-pointer">
                    Sign in here
                  </b>
                </p>
              </form>
            </div>
          </div>
  
          {/* SIGN IN */}
          <div className="auth-col auth-align-center auth-flex-col auth-sign-in">
            <div className="auth-form-wrapper auth-align-center">
              <form className="auth-form auth-sign-in" onSubmit={handleSubmit}>
                <h2>Welcome Back</h2>
                <div className="auth-input-group">
                  <FaWhatsapp className="auth-input-icon" />
                  <input type="tel" required pattern="[0-9]{10}" autoFocus/>
                  <label>WhatsApp Number</label>
                </div>
  
                <div className="auth-input-group">
                  <FaLock className="auth-input-icon" />
                  <input type="password" required />
                  <label>Password</label>
                </div>
  
                <button type="submit" disabled={loading || active !== "auth-sign-in"}>
                  {loading ? <span className="auth-loader"></span> : "Sign in"}
                </button>
                <p>
                  <b>Forgot password?</b>
                </p>
                <p>
                  <span>Don’t have an account?</span>
                  <b onClick={toggle} className="auth-pointer">
                    Sign up here
                  </b>
                </p>
              </form>
            </div>
          </div>
        </div>
  
        {/* CONTENT SECTION */}
        <div className="auth-row auth-content-row">
          {/* SIGN IN CONTENT */}
          <div className="auth-col auth-align-center auth-flex-col">
            <div className="auth-text auth-sign-in">
              <Link to="/" className="logo-link">
                <img
                  src="/img/logo3.png"
                  width="230px"
                  // style={{ marginLeft: "50px" }}
                  alt="Company Logo"
                />
              </Link>
              <h2>Login with WhatsApp</h2>
              <p>
                Securely sign in using your WhatsApp number and access your
                account instantly.
              </p>
            </div>
            <div className="auth-img auth-sign-in"></div>
          </div>
  
          {/* SIGN UP CONTENT */}
          <div className="auth-col auth-align-center auth-flex-col">
            <div className="auth-img auth-sign-up"></div>
            <div className="auth-text auth-sign-up">
              <Link to="/" className="logo-link">
                <img
                  src="/img/logo3.png"
                  width="230px"
                  // style={{ marginLeft: "50px" }}
                  alt="Company Logo"
                />
              </Link>
              <h2>Join Our Family</h2>
              <p>
                Create your account today to unlock personalized recommendations,
                wishlist, and faster checkout.
              </p>
            </div>
          </div>
        </div>
  </div>
);

}
