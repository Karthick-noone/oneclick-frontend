import React, { useState, useRef, useEffect } from "react";
import "./css/Topbar.css";
import { FaBell, FaUserCircle, FaPowerOff,  FaUser } from "react-icons/fa"; // Updated FaHamburger to FaHamburger
import { useNavigate } from "react-router-dom";
import user from "./img/user.jpg";
// import Slidebar from "./Slidebar";

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !event.target.closest(".action-btn") &&
      !event.target.closest(".hamburger")
    ) {
      setIsMenuOpen(false);
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

  return (
    <div className={`topbar ${isMenuOpen ? "menu-open" : ""}`}>
      {/* <button className="action-btn" onClick={toggleSidebar}>
        <FaHamburger style={{ fontSize: '24px' }} />
      </button> */}
      <div className="topbar-content">
        <button className="action-btn">
          <FaBell style={{ fontSize: '24px' }} />
        </button>
        <button className="action-btn">
          <FaUserCircle onClick={toggleMenu} style={{ fontSize: '24px' }} />
        </button>
        {/* <img
          onClick={toggleMenu}
          src={user}
          alt="Profile"
          className="userpic"
        /> */}
      </div>
      {isMenuOpen && (
        <div className="topbar-menu" ref={menuRef}>
          <div className="profile-section">
            <img src={user} alt="Profile" className="profile-image" />
            <h3 className="profile-username">Admin</h3>
          </div>
          <hr />
          <button className="menu-item" onClick={toggleMenu}>
            <FaBell /> Notifications
          </button>
          <button className="menu-item" onClick={toggleMenu}>
            <FaUserCircle /> Profile
          </button>
          <a style={{ textDecoration: "none" }} href="/admin/ChangePassword">
            <button className="menu-item" onClick={toggleMenu}>
              <FaUserCircle /> Change Password
            </button>
          </a>
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
      {/* Render the Slidebar component here */}
      {/* <Slidebar isOpen={isSidebarOpen} onClose={toggleSidebar} /> */}
    </div>
  );
};

export default Topbar;
