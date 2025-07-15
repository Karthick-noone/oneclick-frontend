import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import "./css/AdminNotFound.css"; // import styles

const AdminNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-notfound-container">
      <div className="admin-notfound-card">
        <FaExclamationTriangle className="admin-notfound-icon" />
        <h1 className="admin-notfound-title">404</h1>
        <p className="admin-notfound-message">Oops! Page Not Found</p>
        <button
          className="admin-notfound-btn"
          onClick={() => navigate("/Admin/Dashboard")}
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminNotFound;
