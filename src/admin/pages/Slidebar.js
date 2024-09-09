import React, { useState, useEffect } from 'react';
import './css/Slidebar.css'; // Ensure you create this CSS file
import { FaHome, FaBox, FaTags, FaUser,FaBars, FaChartLine, FaCog, FaSignOutAlt, FaChevronDown, FaChevronRight, FaEdit } from 'react-icons/fa';
import logoImage from './img/oneclick.png'; // Replace with the path to your image
import { useNavigate } from 'react-router-dom';
import logo2 from './img/logo3.png';

const Slidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(false); // State to handle Products submenu
  const [isEditPageOpen, setIsEditPageOpen] = useState(false); // State to handle Edit Pages submenu

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/AdminLogin");
  };

  const navigate = useNavigate();
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);
    if (isEditPageOpen) {
      setIsEditPageOpen(false); // Close Edit Pages submenu if Products submenu is opened
    }
  };

  const toggleEditPage = () => {
    setIsEditPageOpen(!isEditPageOpen);
    if (isProductsOpen) {
      setIsProductsOpen(false); // Close Products submenu if Edit Pages submenu is opened
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
          <FaBars className="hamburger-icon" onClick={toggleSidebar} />

      <div 
        className={`slidebar ${isOpen ? 'open' : 'collapsed'}`}
        onMouseEnter={() => setIsOpen(true)}  // Open sidebar on hover
      >
        <div className="slidebar-header">
          <button style={{ marginTop: '10px'}} className="close-btn" onClick={toggleSidebar}>
            {isOpen ? '◁' : ''}
          </button>
          {isOpen ? (
            <img src={logo2} alt="Logo" width={'175px'}/>
          ) : (
            <img src={logoImage} alt="Logo" className="logo-img" />
          )}
        </div>
        <ul className="slidebar-menu">
          <li><a href="/Admin/Dashboard"><FaHome className="menu-icon" /> {isOpen && 'Dashboard'}</a></li>
          <li><a href="/Admin/orders"><FaBox className="menu-icon" /> {isOpen && 'Orders'}</a></li>
          <li className={`submenu ${isProductsOpen ? 'open' : ''}`}>
            <a href="#" onClick={toggleProducts}>
              <FaTags className="menu-icon" /> {isOpen && 'Products'}
              {isOpen && (isProductsOpen ? <FaChevronDown className="submenu-icon" /> : <FaChevronRight className="submenu-icon" />)}
            </a>
            {isOpen && isProductsOpen && (
              <ul className="submenu-items">
                <li><a href="/Admin/Computers">Computers</a></li>
                <li><a href="/Admin/Mobiles">Mobiles</a></li>
                <li><a href="/Admin/CCTV">CCTV</a></li>
                <li><a href="/Admin/Headphones">Headphones</a></li>
                <li><a href="/Admin/Speakers">Speakers</a></li>
                <li><a href="/Admin/TVHomeCinema">T.V & Home Cinema</a></li>
                <li><a href="/Admin/WearableTech">Wearable Tech</a></li>
                <li><a href="/Admin/Printers">Printers</a></li>
                <li><a href="/Admin/ComputerAccessories">Computer Accessories</a></li>
                <li><a href="/Admin/MobileAccessories">Mobile Accessories</a></li>
              </ul>
            )}
          </li>
          <li className={`submenu ${isEditPageOpen ? 'open' : ''}`}>
            <a href="#" onClick={toggleEditPage}>
              <FaEdit className="menu-icon" /> {isOpen && 'Edit Pages'}
              {isOpen && (isEditPageOpen ? <FaChevronDown className="submenu-icon" /> : <FaChevronRight className="submenu-icon" />)}
            </a>
            {isOpen && isEditPageOpen && (
              <ul className="submenu-items">
                <li><a href="/Admin/EditHomePage">Edit Home Page</a></li>
                <li><a href="/Admin/EditDoubleImageAd">Edit Double Images Ad</a></li>
                <li><a href="/Admin/EditSingleImageAd">Edit Single Images Ad</a></li>
              </ul>
            )}
          </li>
          <li><a href="/Admin/customers"><FaUser className="menu-icon" /> {isOpen && 'Customers'}</a></li>
          <li><a href="/Admin/reports"><FaChartLine className="menu-icon" /> {isOpen && 'Reports'}</a></li>
          <li><a href="#"><FaCog className="menu-icon" /> {isOpen && 'Settings'}</a></li>
          <li onClick={handleLogout}><a href="#"><FaSignOutAlt  className="menu-icon" /> {isOpen && 'Logout'}</a></li>
        </ul>
      </div>
    </>
  );
};

export default Slidebar;