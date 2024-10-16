import React, { useState, useEffect } from 'react';
import './css/Slidebar.css'; // Ensure you create this CSS file
import { 
  FaHome, FaBriefcase, FaBox, FaTags, FaUser, FaBars, 
  FaChartLine, FaCog, FaEnvelope, FaChevronDown, FaChevronRight, FaEdit 
} from 'react-icons/fa';
import logoImage from './img/oneclick.png'; // Replace with the path to your image
import { useNavigate, useLocation } from 'react-router-dom';
import logo2 from './img/logo3.png';

const Slidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isOfferPageOpen, setIsOfferPageOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleProducts = () => {
    setIsProductsOpen((prev) => !prev);
    if (isEditPageOpen) {
      setIsEditPageOpen(false); // Close Edit Pages submenu if Products submenu is opened
    }
  };

  const toggleEditPage = () => {
    setIsEditPageOpen((prev) => !prev);
    if (isProductsOpen) {
      setIsProductsOpen(false); // Close Products submenu if Edit Pages submenu is opened
    }
  };

  const toggleOfferPage = () => {
    setIsOfferPageOpen((prev) => !prev);
    if (isEditPageOpen) {
      setIsEditPageOpen(false); // Close Edit Pages submenu if Offer Pages submenu is opened
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768); // Open or close sidebar based on window width
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <>
      <FaBars style={{ color: '#333' }} className="hamburger-icon" onClick={toggleSidebar} />

      <div className={`slidebar ${isOpen ? 'open' : 'collapsed'}`} onMouseEnter={() => setIsOpen(true)}>
      <div className="slidebar-header">
          <button style={{ marginTop: '10px', color:'#333'}} className="close-btn" onClick={toggleSidebar}>
            {isOpen ? '◁' : ''}
          </button>
          {isOpen ? (
            <img src={logo2} alt="Logo" width={'175px'}/>
          ) : (
            <img src={logoImage} alt="Logo" className="logo-img" />
          )}
        </div>
        <ul className="slidebar-menu">
          <li>
            <a href="/Admin/Dashboard" className={isActive('/Admin/Dashboard')}>
              <FaHome className="menu-icon" /> {isOpen && 'Dashboard'}
            </a>
          </li>
          <li>
            <a href="/Admin/orders" className={isActive('/Admin/orders')}>
              <FaBox className="menu-icon" /> {isOpen && 'Orders'}
            </a>
          </li>
          <li className={`submenu ${isProductsOpen ? 'open' : ''}`}>
            <a href="#" onClick={toggleProducts} className={isActive('/Admin/Computers') || isActive('/Admin/Mobiles') || isActive('/Admin/CCTV') || isActive('/Admin/Headphones') || isActive('/Admin/Speakers') || isActive('/Admin/TVHomeCinema') || isActive('/Admin/WearableTech') || isActive('/Admin/Printers') || isActive('/Admin/ComputerAccessories') || isActive('/Admin/MobileAccessories') || isActive('/Admin/PrinterAccessories') || isActive('/Admin/CCTVAccessories') ? 'active' : ''}>
              <FaTags className="menu-icon" /> {isOpen && 'Products'}
              {isOpen && (isProductsOpen ? <FaChevronDown className="submenu-icon" /> : <FaChevronRight className="submenu-icon" />)}
            </a>
            {isOpen && isProductsOpen && (
              <ul className="submenu-items">
                <li><a href="/Admin/Computers" className={isActive('/Admin/Computers')}>Computers</a></li>
                <li><a href="/Admin/Mobiles" className={isActive('/Admin/Mobiles')}>Mobiles</a></li>
                <li><a href="/Admin/CCTV" className={isActive('/Admin/CCTV')}>CCTV</a></li>
                <li><a href="/Admin/Headphones" className={isActive('/Admin/Headphones')}>Headphones</a></li>
                <li><a href="/Admin/Speakers" className={isActive('/Admin/Speakers')}>Speakers</a></li>
                <li><a href="/Admin/TVHomeCinema" className={isActive('/Admin/TVHomeCinema')}>T.V & Home Cinema</a></li>
                <li><a href="/Admin/WearableTech" className={isActive('/Admin/WearableTech')}>Wearable Tech</a></li>
                <li><a href="/Admin/Printers" className={isActive('/Admin/Printers')}>Printers</a></li>
                <li><a href="/Admin/ComputerAccessories" className={isActive('/Admin/ComputerAccessories')}>Computer Accessories</a></li>
                <li><a href="/Admin/MobileAccessories" className={isActive('/Admin/MobileAccessories')}>Mobile Accessories</a></li>
                <li><a href="/Admin/PrinterAccessories" className={isActive('/Admin/PrinterAccessories')}>Printer Accessories</a></li>
                <li><a href="/Admin/CCTVAccessories" className={isActive('/Admin/CCTVAccessories')}>CCTV Accessories</a></li>
              </ul>
            )}
          </li>
          <li className={`submenu ${isEditPageOpen ? 'open' : ''}`}>
            <a href="#" onClick={toggleEditPage} className={isActive('/Admin/EditHomePage') || isActive('/Admin/EditDoubleImageAd') || isActive('/Admin/EditLoginBackgroundImage') || isActive('/Admin/EditSingleImageAd') ? 'active' : ''}>
              <FaEdit className="menu-icon" /> {isOpen && 'Edit Pages'}
              {isOpen && (isEditPageOpen ? <FaChevronDown className="submenu-icon" /> : <FaChevronRight className="submenu-icon" />)}
            </a>
            {isOpen && isEditPageOpen && (
              <ul className="submenu-items">
                <li><a href="/Admin/EditHomePage" className={isActive('/Admin/EditHomePage')}>Edit Home Page</a></li>
                <li><a href="/Admin/EditDoubleImageAd" className={isActive('/Admin/EditDoubleImageAd')}>Edit Triple Images Ad</a></li>
                <li><a href="/Admin/EditSingleImageAd" className={isActive('/Admin/EditSingleImageAd')}>Edit Single Images Ad</a></li>
                <li><a href="/Admin/EditLoginBackgroundImage" className={isActive('/Admin/EditLoginBackgroundImage')}>Edit Login Background Image</a></li>
              </ul>
            )}
          </li>
          <li className={`submenu ${isOfferPageOpen ? 'open' : ''}`}>
            <a href="#" onClick={toggleOfferPage} className={isActive('/Admin/ComputersAd') || isActive('/Admin/MobileAd') || isActive('/Admin/CCTVAd') ? 'active' : ''}>
              <FaEdit className="menu-icon" /> {isOpen && 'Offer Pages'}
              {isOpen && (isOfferPageOpen ? <FaChevronDown className="submenu-icon" /> : <FaChevronRight className="submenu-icon" />)}
            </a>
            {isOpen && isOfferPageOpen && (
              <ul className="submenu-items">
                <li><a href="/Admin/ComputersAd" className={isActive('/Admin/ComputersAd')}>Computer Offer Page</a></li>
                <li><a href="/Admin/MobileAd" className={isActive('/Admin/MobileAd')}>Mobile Offer Page</a></li>
                <li><a href="/Admin/CCTVAd" className={isActive('/Admin/CCTVAd')}>CCTV Offer Page</a></li>
              </ul>
            )}
          </li>
          <li>
            <a href="/Admin/customers" className={isActive('/Admin/customers')}>
              <FaUser className="menu-icon" /> {isOpen && 'Customers'}
            </a>
          </li>
          <li>
            <a href="/Admin/reports" className={isActive('/Admin/reports')}>
              <FaChartLine className="menu-icon" /> {isOpen && 'Reports'}
            </a>
          </li>
          <li>
            <a href="/Admin/CareersTable" className={isActive('/Admin/CareersTable')}>
              <FaBriefcase className="menu-icon" /> {isOpen && 'Careers'}
            </a>
          </li>
          {/* <li>
            <a href="/Admin/Settings" className={isActive('/Admin/Settings')}>
              <FaCog className="menu-icon" /> {isOpen && 'Settings'}
            </a>
          </li> */}
          <li>
            <a href="/Admin/ContactsTable" className={isActive('/Admin/ContactsTable')}>
              <FaEnvelope className="menu-icon" /> {isOpen && 'Contact'}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Slidebar;
