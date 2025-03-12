import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaLaptop,
  FaUsb,
  FaMobileAlt,
  FaVideo,
  FaPrint,
  FaHeadphones,
  FaVolumeUp,
  FaTv,
  FaAppleAlt,
  FaCog,
  FaRecycle,
  FaInfoCircle,
  FaEnvelope,
  FaQuestionCircle,
} from "react-icons/fa";
import "./css/Header3.css"; // Adjust path as needed

const Header3 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeadphones, setShowHeadphones] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation(); // To get the current URL

  const headerRef = useRef(null); // Reference to the header

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleHeadphonesDropdown = () => {
    setShowHeadphones(!showHeadphones);
    setShowMore(false); // Close the "More" dropdown
  };

  useEffect(() => {
    const handleScroll = () => {
      if (showHeadphones) {
        setShowHeadphones(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showHeadphones]);

  useEffect(() => {
    const handleScroll = () => {
      if (showMore) {
        setShowMore(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showMore]);

  const toggleMoreDropdown = () => {
    setShowMore(!showMore);
    setShowHeadphones(false); // Close the "Headphones" dropdown
  };

  // Handle clicks outside of the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowHeadphones(false);
        setShowMore(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine if any of the links are active
  const isAudioActive = ["/Headphones", "/Speaker"].some((path) =>
    location.pathname.includes(path)
  );
  const isAccessoriesActive = [
    "/CCTVAccessories",
    "/PrinterAccessories",
    "/ComputerAccessories",
    "/MobileAccessories",
  ].some((path) => location.pathname.includes(path));

  // Determine which specific accessory is active
  const isComputerAccessoriesActive =
    location.pathname === "/ComputerAccessories";
  const isMobileAccessoriesActive = location.pathname === "/MobileAccessories";
  const isCCTVAccessoriesActive = location.pathname === "/CCTVAccessories";
  const isPrinterAccessoriesActive =
    location.pathname === "/PrinterAccessories";

  const isComputersActive = location.pathname.startsWith("/Computers"); // Match any path starting with "/Computers"

  return (
    <header
      className="header3"
      ref={headerRef}
      style={{ position: "sticky", top: "85px", zIndex: 1001 }}
    >
      <div
        style={{
          position: isOpen ? "fixed" : "",
          right: isOpen ? "" : "-80px",
          top: !isOpen ? "-20px" : "10px",
          zIndex: isOpen ? "9999" : "",
        }}
        className="hamburger"
        onClick={toggleMenu}
      >
        {isOpen ? "✖" : "☰"}
      </div>
      <nav className={`nav ${isOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          exact
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          <FaHome
            className={`fa-icons ${location.pathname === "/" ? "active" : ""}`}
          />{" "}
          {isOpen ? "Home" : ""}
        </NavLink>
        <NavLink
          to="/ComputerAd"
          className={`nav-link ${
            location.pathname.startsWith("/computers") ||
            location.pathname.startsWith("/ComputerAd")
              ? "active"
              : ""
          }`}
        >
          <FaLaptop
            className={`fa-icons ${
              location.pathname.startsWith("/computers") ||
              location.pathname.startsWith("/ComputerAd")
                ? "active"
                : ""
            }`}
          />{" "}
          Computers
        </NavLink>

        <NavLink
          to="/MobileAd"
          className={`nav-link ${
            location.pathname.startsWith("/mobiles") ||
            location.pathname.startsWith("/MobileAd")
              ? "active"
              : ""
          }`}
        >
          <FaMobileAlt
            className={`fa-icons ${
              location.pathname.startsWith("/mobiles") ||
              location.pathname.startsWith("/MobileAd")
                ? "active"
                : ""
            }`}
          />{" "}
          Mobile
        </NavLink>

        <NavLink
          to="/CCTVAd"
          className={`nav-link ${
            location.pathname.startsWith("/cctv") ||
            location.pathname.startsWith("/CCTVAd")
              ? "active"
              : ""
          }`}
        >
          <FaVideo
            className={`fa-icons ${
              location.pathname.startsWith("/cctv") ||
              location.pathname.startsWith("/CCTVAd")
                ? "active"
                : ""
            }`}
          />{" "}
          CCTV
        </NavLink>

        {/* Parent Audio link */}
        <div
          className={`nav-item ${isAudioActive ? "active" : ""}`}
          onClick={toggleHeadphonesDropdown}
        >
          <span className="activelink">
            <FaHeadphones
              className={`fa-icons ${isAudioActive ? "active" : ""}`}
            />{" "}
            Audio
          </span>
          {showHeadphones && (
            <div className="dropdown">
              <NavLink
                to="/Headphones"
                className={`nav-link ${
                  location.pathname === "/Headphones" ? "active" : ""
                }`}
              >
                <FaHeadphones
                  className={`fa-icons ${
                    location.pathname === "/Headphones" ? "active" : ""
                  }`}
                />{" "}
                Headphones
              </NavLink>
              <NavLink
                to="/Speakers"
                className={`nav-link ${
                  location.pathname === "/Speakers" ? "active" : ""
                }`}
              >
                <FaVolumeUp
                  className={`fa-icons ${
                    location.pathname === "/Speakers" ? "active" : ""
                  }`}
                />{" "}
                Speakers
              </NavLink>
            </div>
          )}
        </div>
        <NavLink
          to="/TV"
          className={`nav-link ${
            location.pathname === "/TV" ? "active" : ""
          }`}
        >
          <FaTv
            className={`fa-icons ${
              location.pathname === "/TV" ? "active" : ""
            }`}
          />{" "}
          T.V & Home Cinema
        </NavLink>
        <NavLink
          to="/Watch"
          className={`nav-link ${
            location.pathname === "/Watch" ? "active" : ""
          }`}
        >
          <FaAppleAlt
            className={`fa-icons ${
              location.pathname === "/Watch" ? "active" : ""
            }`}
          />{" "}
          Wearable Tech
        </NavLink>
        <NavLink
          to="/Printers"
          className={`nav-link ${
            location.pathname === "/Printers" ? "active" : ""
          }`}
        >
          <FaPrint
            className={`fa-icons ${
              location.pathname === "/Printers" ? "active" : ""
            }`}
          />{" "}
          Printers
        </NavLink>

        {/* Parent Accessories link */}
        <div
          className={`nav-item ${isAccessoriesActive ? "active" : ""}`}
          onClick={toggleMoreDropdown}
        >
          <span className="activelink">
            <FaCog
              className={`fa-icons ${isAccessoriesActive ? "active" : ""}`}
            />{" "}
            Accessories
          </span>
          {showMore && (
            <div className="dropdown">
              <NavLink
                to="/ComputerAccessories"
                className={`nav-link ${
                  isComputerAccessoriesActive ? "active" : ""
                }`}
              >
                <FaUsb
                  className={`fa-icons ${
                    isComputerAccessoriesActive ? "active" : ""
                  }`}
                />{" "}
                Computer Accessories
              </NavLink>
              <NavLink
                to="/MobileAccessories"
                className={`nav-link ${
                  isMobileAccessoriesActive ? "active" : ""
                }`}
              >
                <FaMobileAlt
                  className={`fa-icons ${
                    isMobileAccessoriesActive ? "active" : ""
                  }`}
                />{" "}
                Mobile Accessories
              </NavLink>
              <NavLink
                to="/CCTVAccessories"
                className={`nav-link ${
                  isCCTVAccessoriesActive ? "active" : ""
                }`}
              >
                <FaVideo
                  className={`fa-icons ${
                    isCCTVAccessoriesActive ? "active" : ""
                  }`}
                />{" "}
                CCTV Accessories
              </NavLink>
              <NavLink
                to="/PrinterAccessories"
                className={`nav-link ${
                  isPrinterAccessoriesActive ? "active" : ""
                }`}
              >
                <FaPrint
                  className={`fa-icons ${
                    isPrinterAccessoriesActive ? "active" : ""
                  }`}
                />{" "}
                Printer Accessories
              </NavLink>
            </div>
          )}
        </div>
        <NavLink
          to="/Secondhandproducts"
          className={`nav-link ${
            location.pathname === "/Secondhandproducts" ? "active" : ""
          }`}
        >
          <FaRecycle
            className={`fa-icons ${
              location.pathname === "/Secondhandproducts" ? "active" : ""
            }`}
          />{" "}
          Refurbish
        </NavLink>
        <NavLink
          to="/About"
          className={`nav-link ${
            location.pathname === "/About" ? "active" : ""
          }`}
          style={{
            display: window.innerWidth <= 768 ? "flex" : "none", // Show only on mobile
          }}
        >
          <FaInfoCircle
            className={`fa-icons ${
              location.pathname === "/About" ? "active" : ""
            }`}
          />{" "}
          About
        </NavLink>

        <NavLink
          to="/Contact"
          className={`nav-link ${
            location.pathname === "/Contact" ? "active" : ""
          }`}
          style={{
            display: window.innerWidth <= 768 ? "flex" : "none", // Show only on mobile
          }}
        >
          <FaEnvelope
            className={`fa-icons ${
              location.pathname === "/Contact" ? "active" : ""
            }`}
          />{" "}
          Contact
        </NavLink>

        <NavLink
          to="/HelpCenter"
          className={`nav-link ${
            location.pathname === "/HelpCenter" ? "active" : ""
          }`}
          style={{
            display: window.innerWidth <= 768 ? "flex" : "none", // Show only on mobile
          }}
        >
          <FaQuestionCircle
            className={`fa-icons ${
              location.pathname === "/HelpCenter" ? "active" : ""
            }`}
          />{" "}
          Help Center
        </NavLink>
      </nav>
    </header>
  );
};

export default Header3;
