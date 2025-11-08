import React from "react";
import "./css/CollaborationAdPage.css";
import { Link } from "react-router-dom";
function CollaborationAdPage() {
  return (
    <div className="collab-banner">
      <div className="collab-banner-overlay"></div>
      <div className="collab-banner-content">
        <h2 className="collab-banner-title">
          Collaborate with <span>OneClick</span> and Expand Your Reach 🚀
        </h2>
        <p className="collab-banner-subtitle">
          Join our growing network of branches and partners to boost your
          business visibility and success — powered by innovation and trust.
        </p>
        <Link to={"branch-login"}>
        <button
          className="collab-banner-btn"
        //   onClick={() => (window.location.href = "/branch-register")}
        >
          Partner With Us
        </button></Link>
      </div>
    </div>
  );
}

export default CollaborationAdPage;
