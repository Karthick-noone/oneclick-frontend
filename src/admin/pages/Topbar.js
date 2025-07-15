import React, { useState, useEffect, useRef } from "react";
import "./css/Topbar.css";
import { FaBell, FaUserCircle, FaPowerOff, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import user from "./img/user.jpg";
import axios from "axios";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { ApiUrl } from "../../components/ApiUrl";
import moment from "moment"; // Moment.js to handle time formatting
import { Link } from "react-router-dom";

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    NProgress.start();

    const timeout = setTimeout(() => {
      NProgress.done();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Set an interval to delete notifications older than 15 days every hour
    const deleteOldNotificationsInterval = setInterval(
      deleteOldNotifications,
      3600000
    ); // 1 hour
    return () => clearInterval(deleteOldNotificationsInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isNotificationOpen) {
        setIsNotificationOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await axios.get(`${ApiUrl}/notifications`);
      const fetchedNotifications = response.data;

      console.log("fetchedNotifications", fetchedNotifications);

      // Mark any notification as 'read' if it has been marked as read in the backend
      setNotifications(
        fetchedNotifications.map((notification) => ({
          ...notification,
          read: notification.is_read === 1, // Ensure the read status is correctly reflected
        }))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${ApiUrl}/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${ApiUrl}/notifications/mark-all-read`);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteOldNotifications = async () => {
    try {
      await axios.delete(`${ApiUrl}/backend/notifications/delete-old`);
    } catch (error) {
      console.error("Error deleting old notifications:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => {
      if (prevState) {
        return false; // If menu is open, close it
      } else {
        setIsNotificationOpen(false); // Close notifications if menu is opened
        return true;
      }
    });
  };

  const toggleNotification = () => {
    setIsNotificationOpen((prevState) => {
      if (prevState) {
        return false; // If notification is open, close it
      } else {
        setIsMenuOpen(false); // Close menu if notification is opened
        return true;
      }
    });
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !event.target.closest(".action-btn")
    ) {
      setIsMenuOpen(false);
    }
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target) &&
      !event.target.closest(".bell-btn")
    ) {
      setIsNotificationOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/AdminLogin");
  };

  // Function to format time for notifications
  const formatTimeAgo = (date) => {
    const now = moment();
    const diff = now.diff(moment(date), "minutes");

    if (diff < 60) {
      return `${diff} minutes ago`;
    } else if (diff < 1440) {
      // 24 hours * 60 minutes
      return `${Math.floor(diff / 60)} hours ago`;
    } else {
      return moment(date).format("hh:mm A DD MMM YY");
    }
  };

  const username = localStorage.getItem("staffname");
  const role = localStorage.getItem("userRole");
  // const UserName = username+username.slice(1)

  return (
    <div className="topbar">

      <div className="topbar-content">
  {/* Role/Username badge */}
  <div
    className="user-info-badge"
    style={{
      backgroundColor: role === "Admin" ? "#4CAF50" : "#2196F3", // Green for Admin, Blue for User
      color: "white",
      padding: "6px 12px",
      borderRadius: "20px",
      fontWeight: "500",
      fontSize: "14px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginTop:'6px',
      marginRight:'10px'
    }}
  >
    {/* <FaUserCircle style={{ fontSize: "16px" }} /> */}
    <span className="user-role">{role === "Admin" ? role : `${role} - ${username}`}</span>
  </div>

  {/* Notification Bell */}
  {/* <button className="action-btn bell-btn" onClick={toggleNotification}>
    {notifications.filter((notification) => !notification.read).length > 0 && (
      <span className="notification-count">
        {notifications.filter((notification) => !notification.read).length}
      </span>
    )}
    <FaBell style={{ fontSize: "24px", color: "white" }} />
  </button> */}

  {/* Profile Icon */}
  <button className="action-btn">
    <FaUserCircle
      onClick={toggleMenu}
      style={{ fontSize: "24px", color: "white" }}
    />
  </button>
</div>


      {/* Notification Dropdown */}
      {isNotificationOpen && (
        <div className="notification-box" ref={notificationRef}>
          <div className="notification-header">
            <h4>Notifications</h4>
            <span className="mark-all-btn" onClick={markAllAsRead}>
              Mark All as Read
            </span>
          </div>

          {loadingNotifications ? (
            <p>Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="no-notify">No new notifications</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className={`notification-item ${
                      !notification.read ? "new" : ""
                    }`}
                  >
                    <div className="notification-row">
                      <span>{notification.message}</span>
                      <div className="circle-btn-wrapper">
                        <button
                          className={`circle-btn ${
                            notification.read ? "read" : "unread"
                          }`}
                          disabled // Disable the button to prevent clicking it
                        ></button>
                      </div>
                    </div>
                    <span className="notification-time">
                      {formatTimeAgo(notification.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* User Menu */}
      {isMenuOpen && (
        <div className="topbar-menu" ref={menuRef}>
          <div className="profile-section">
            <img src={user} alt="Profile" className="profile-imagee" />
            <h3 style={{ color: "black" }} className="profile-username">
              {role === "Staff" ? username : role}
            </h3>
          </div>
          <hr />
          {role !== "Staff" && (
            <>
              <Link
                style={{ textDecoration: "none" }}
                to="/admin/ChangePassword"
              >
                <button className="menu-item" onClick={toggleMenu}>
                  <FaUser /> Change Password
                </button>
              </Link>
            </>
          )}
          <button
            onClick={() => {
              handleLogout();
              toggleMenu();
            }}
            className="menu-item"
          >
            <FaPowerOff /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Topbar;
