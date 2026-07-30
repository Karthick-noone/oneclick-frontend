import React, { useState, useEffect, useRef } from "react";
import "./css/Topbar.css";
import { FaUserCircle, FaPowerOff, FaUser, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import user from "./img/user.jpg";
import axios from "axios";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { ApiUrl } from "../../components/ApiUrl";
import moment from "moment";
import { Link } from "react-router-dom";
import { Bell, Check, CheckCheck, Search, Menu } from "lucide-react";

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    const deleteOldNotificationsInterval = setInterval(
      deleteOldNotifications,
      3600000
    );
    return () => clearInterval(deleteOldNotificationsInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isNotificationOpen) setIsNotificationOpen(false);
      if (isMenuOpen) setIsMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isNotificationOpen, isMenuOpen]);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await axios.get(`${ApiUrl}/notifications`);
      const fetchedNotifications = response.data;
      setNotifications(
        fetchedNotifications.map((notification) => ({
          ...notification,
          read: notification.is_read === 1,
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
    setIsMenuOpen((prev) => {
      if (prev) return false;
      setIsNotificationOpen(false);
      return true;
    });
  };

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => {
      if (prev) return false;
      setIsMenuOpen(false);
      return true;
    });
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest(".profile-btn")) {
      setIsMenuOpen(false);
    }
    if (notificationRef.current && !notificationRef.current.contains(event.target) && !event.target.closest(".bell-btn")) {
      setIsNotificationOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("branch");
    localStorage.removeItem("current_branch");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const formatTimeAgo = (date) => {
    const now = moment();
    const diff = now.diff(moment(date), "minutes");

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return moment(date).format("hh:mm A DD MMM YY");
  };

  const username = localStorage.getItem("staffname");
  const role = localStorage.getItem("userRole");

  const getRoleDisplay = () => {
    if (role === "Admin") return "Administrator";
    if (role === "branch_admin") {
      const branch = JSON.parse(localStorage.getItem("branch")) || {};
      return `${branch.branch_name || "Branch"} Admin`;
    }
    return `${role} - ${username}`;
  };

  const getRoleColor = () => {
    switch (role) {
      case "Admin": return "#10b981"; // Emerald
      case "branch_admin": return "#8b5cf6"; // Violet
      case "Staff": return "#3b82f6"; // Blue
      default: return "#6b7280"; // Gray
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {/* <button className="sidebar-toggle">
          <Menu size={20} />
        </button>
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div> */}
      </div>

      <div className="topbar-right">
        {/* Role Badge */}
        <div
          className="user-role-badge"
          style={{ '--role-color': getRoleColor() }}
        >
          <div className="role-dot"></div>
          <span className="role-text">{getRoleDisplay()}</span>
        </div>

        {/* Notification Bell */}
        {role === "Admin" && (
          <div className="notification-wrapper">
            <button className="icon-btn bell-btn" onClick={toggleNotification}>
              <Bell size={20} />
              {notifications.filter((notification) => !notification.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter((notification) => !notification.read).length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Profile Button */}
        <div className="profile-wrapper">
          <button className="profile-btn" onClick={toggleMenu}>
            <div className="profile-avatar">
              <img src={user} alt="Profile" className="avatar-image" />
              <div className="online-indicator"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Notification Dropdown - Light Theme */}
      {isNotificationOpen && (
        <div className="notification-dropdown light-notifications" ref={notificationRef}>
          <div className="dropdown-header">
            <h3>Notifications</h3>
            <div className="header-actions">
              <span className="mark-all-btn" onClick={markAllAsRead}>
                Mark all as read
              </span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-count">
                  <span>
                    {notifications.filter(n => !n.read).length} new
                  </span>

                </span>
              )}
            </div>
          </div>

          <div className="notification-list">
            {loadingNotifications ? (
              <div className="loading-notifications">
                <div className="loading-spinner"></div>
                <span>Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={32} />
                <span>No notifications</span>
                <p>You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? "unread" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTimeAgo(notification.created_at)}
                    </div>
                  </div>
                  <div className="notification-status">
                    {notification.read ? (
                      <CheckCheck size={16} className="read-icon" />
                    ) : (
                      <div className="unread-dot"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* User Menu Dropdown - Light Theme */}
      {isMenuOpen && (
        <div className="user-menu-dropdown light-menu" ref={menuRef}>
          <div className="user-profile-section">
            <div className="profile-avatar-large">
              <img src={user} alt="Profile" className="avatar-image-large" />
              <div className="online-indicator-large"></div>
            </div>
            <div className="profile-info">
              <h3 className="profile-name">
                {role === "Admin" ? "Administrator" :
                  role === "branch_admin" ?
                    (JSON.parse(localStorage.getItem("branch")) || {}).name || "Branch Admin" :
                    username}
              </h3>
              <p className="profile-email">{getRoleDisplay()}</p>
            </div>
          </div>

          <div className="menu-divider"></div>

          <div className="menu-items">
            {role === "Admin" && (
              <Link to="/admin/ChangePassword" className="menu-link"
                onClick={() => setIsMenuOpen(false)}

              >
                <button className="menu-item">
                  <FaCog className="menu-icon" />
                  <span>Change Password</span>
                </button>
              </Link>
            )}
            {role === "branch_admin" && (
              <Link to="/Admin/BranchAdminProfile" className="menu-link"
                onClick={() => setIsMenuOpen(false)}

              >
                <button className="menu-item" >
                  <FaUser className="menu-icon" />
                  <span >View Profile</span>
                </button>
              </Link>
            )}

            <div className="menu-divider"></div>

            <button className="menu-item logout-item" onClick={handleLogout}>
              <FaPowerOff className="menu-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;