import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
  // FaAppleAlt,
  FaCog,
  FaRecycle,
  FaInfoCircle,
  FaEnvelope,
  FaQuestionCircle,
  FaCodeBranch,
  // FaStopwatch,
  // FontAwesomeIcon
} from "react-icons/fa";
import "./css/Header3.css"; // Adjust path as needed
import { FaChevronDown, } from "react-icons/fa";
import listIcon from './img/list.png'

import { Watch } from 'lucide-react';


const Header3 = ({ topOffset, isOpen, setIsOpen }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [showHeadphones, setShowHeadphones] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const headphonesRef = useRef(null);
  const accessoriesRef = useRef(null);
  const location = useLocation(); // To get the current URL
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 768;
    }
    return false;
  });

  const headerRef = useRef(null); // Reference to the header

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target) &&
        window.innerWidth <= 768 // Apply only for mobile/tablet views
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // const toggleMenu = () => {
  //   setIsOpen(prev => !prev);
  // };

  // Open the menu (☰ icon)
  const openMenu = () => {
    console.log("sidebar opened");
    setIsOpen(true);
  };

  // Close the menu (✖ icon or link click)
  const closeMenu = () => {
    console.log("sidebar closed");
    setIsOpen(false);
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

      if (
        headphonesRef.current &&
        !headphonesRef.current.contains(event.target) &&
        !event.target.closest(".nav-item")
      ) {
        setShowHeadphones(false); // close Audio dropdown
      }

      if (
        accessoriesRef.current &&
        !accessoriesRef.current.contains(event.target) &&
        !event.target.closest(".nav-item")
      ) {
        setShowMore(false); // close Accessories dropdown
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

  // const isComputersActive = location.pathname.startsWith("/Computers"); // Match any path starting with "/Computers"

  const handleLinkClick = () => {
    setIsOpen(false);
    setShowHeadphones(false);
    setShowMore(false);
  };


  return (
    <>
      {/* Show hamburger ☰ only when menu is closed */}
      {/* {isMobileView && !isOpen && (
        <div className="hamburger" onClick={openMenu}>
          <img src={listIcon} width="28px" alt="list" />
        </div>

      )} */}

      {/* Show close ✖ only when menu is open */}
      {isMobileView && isOpen && (
        <div
          style={{
            position: "fixed",
            top: "5px",
            left: "70%",
            transform: "translateX(-50%)",
            zIndex: 1003,
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "24px",
            cursor: "pointer",
            backgroundColor: "transparent",
          }}
          className="hamburger"
          onClick={closeMenu}
        >
          ✖
        </div>
      )}



      <div
        className="header3"
        ref={headerRef}
        // style={{ position: "sticky", top: `46px`, zIndex: 999 }}
        style={{ position: "sticky", top: `${topOffset}px`, zIndex: 999 }}
      >

        <nav className={`nav ${isOpen ? "open" : ""}`}>
          <Link
            to="/"
            exact
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >

            <FaHome
              className={`fa-icons ${location.pathname === "/" ? "active" : ""}`}
            />{" "}
            {isOpen ? "Home" : ""}
          </Link>
          <Link
            to="/ComputerAd"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname.startsWith("/computers") || location.pathname.startsWith("/Computers") ||
              location.pathname.startsWith("/ComputerAd")
              ? "active"
              : ""
              }`}
          >
            <FaLaptop
              className={`fa-icons ${location.pathname.startsWith("/computers") || location.pathname.startsWith("/Computers") ||
                location.pathname.startsWith("/ComputerAd")
                ? "active"
                : ""
                }`}
            />{" "}
            Computers
          </Link>

          <Link
            to="/MobileAd"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname.startsWith("/mobiles") || location.pathname.startsWith("/Mobiles") ||
              location.pathname.startsWith("/MobileAd")
              ? "active"
              : ""
              }`}
          >
            <FaMobileAlt
              className={`fa-icons ${location.pathname.startsWith("/mobiles") || location.pathname.startsWith("/Mobiles") ||
                location.pathname.startsWith("/MobileAd")
                ? "active"
                : ""
                }`}
            />{" "}
            Mobile
          </Link>

          <Link
            to="/CCTVAd"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname === "/CCTV" ||
                location.pathname === "/cctv" ||
                location.pathname === "/CCTVAd"
                ? "active"
                : ""
              }`}
          >
            <FaVideo
              className={`fa-icons ${location.pathname === "/CCTV" ||
                  location.pathname === "/cctv" ||
                  location.pathname === "/CCTVAd"
                  ? "active"
                  : ""
                }`}
            />{" "}
            CCTV
          </Link>


          {/* Parent Audio link */}
          <div
            className={`nav-item ${isAudioActive ? "active" : ""} ${showHeadphones ? "show-dropdown" : ""}`}
            onClick={toggleHeadphonesDropdown}
          // onMouseEnter={() => {
          //   if (window.innerWidth > 768) { // Only for desktop
          //     setShowHeadphones(true);
          //   }
          // }}
          // onMouseLeave={() => {
          //   if (window.innerWidth > 768) { // Only for desktop
          //     setShowHeadphones(false);
          //   }
          // }}
          >
            <span className="activelink">
              <FaHeadphones
                className={`fa-icons ${isAudioActive ? "active" : ""}`}
              />{" "}
              Audio
              {/* {showHeadphones ? (
                <FaChevronUp className="dropdown-arrow" />
              ) : (
                <FaChevronDown className="dropdown-arrow" />
              )} */}
              <FaChevronDown
                className={`dropdown-arrow ${showHeadphones ? "rotate" : ""}`}
                size={13}
              />
            </span>
            <div className={`audio-dropdown ${showHeadphones ? "visible" : ""}`} ref={headphonesRef}>
              <Link
                to="/Headphones"
                onClick={handleLinkClick}
                className={`nav-link ${location.pathname === "/Headphones" || location.pathname === "/headphones" ? "active" : ""
                  }`}
              >
                <FaHeadphones
                  style={{ fontSize: '16px' }}

                  className={`fa-icons ${location.pathname === "/Headphones" || location.pathname === "/headphones" ? "active" : ""
                    }`}
                />{" "}
                Headphones
              </Link>
              <Link
                to="/Speakers"
                onClick={handleLinkClick}
                className={`nav-link ${location.pathname === "/Speakers" || location.pathname === "/speakers" ? "active" : ""
                  }`}
              >
                <FaVolumeUp
                  style={{ fontSize: '16px' }}

                  className={`fa-icons ${location.pathname === "/Speakers" || location.pathname === "/speakers" ? "active" : ""
                    }`}
                />{" "}
                Speakers
              </Link>
            </div>
          </div>
          <Link
            to="/TV"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname === "/TV" || location.pathname === "/tv" ? "active" : ""
              }`}
          >
            <FaTv
              className={`fa-icons ${location.pathname === "/TV" || location.pathname === "/tv" ? "active" : ""
                }`}
            />{" "}
            T.V & Home Cinema
          </Link>
          <Link
            to="/Watch"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname === "/Watch" || location.pathname === "/watch" ? "active" : ""
              }`}
          >
            <Watch
              className={`fa-icons ${location.pathname === "/Watch" || location.pathname === "/watch" ? "active" : ""
                }`}
            />{" "}
            Wearable Tech
          </Link>
          <Link
            to="/Printers"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname === "/Printers" || location.pathname === "/printers" ? "active" : ""
              }`}
          >
            <FaPrint
              className={`fa-icons ${location.pathname === "/Printers" || location.pathname === "/printers" ? "active" : ""
                }`}
            />{" "}
            Printers
          </Link>

          <div
            className={`nav-item ${isAccessoriesActive ? "active" : ""} ${showMore ? "show-dropdown" : ""}`}
            ref={accessoriesRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleMoreDropdown();
            }}
          // onMouseEnter={() => {
          //   if (window.innerWidth > 768) { // Only for desktop
          //     setShowMore(true);
          //   }
          // }}
          // onMouseLeave={() => {
          //   if (window.innerWidth > 768) { // Only for desktop
          //     setShowMore(false);
          //   }
          // }}
          >
            <span className="activelink" style={{ cursor: "pointer" }}>
              <FaCog className={`fa-icons ${isAccessoriesActive ? "active" : ""}`} /> Accessories
              {/* {showMore ? (
                <FaChevronUp className="dropdown-arrow" />
              ) : (
                <FaChevronDown className="dropdown-arrow" />
              )} */}
              <FaChevronDown
                className={`dropdown-arrow ${showMore ? "rotate" : ""}`}
                size={13}
              />
            </span>

            <div className={`dropdown ${showMore ? "visible" : ""}`}>
              <Link
                to="/ComputerAccessories"
                onClick={handleLinkClick}
                className={`nav-link ${isComputerAccessoriesActive ? "active" : ""}`}
              >
                <FaUsb
                  style={{ fontSize: '16px' }}
                  className={`fa-icons ${location.pathname === "/ComputerAccessories" ? "active" : ""
                    }`}
                /> Computer Accessories
              </Link>


              <Link
                to="/MobileAccessories"
                onClick={handleLinkClick}
                className={`nav-link ${isMobileAccessoriesActive ? "active" : ""}`}
              >
                <FaMobileAlt
                  style={{ fontSize: '16px' }}

                  className={`fa-icons ${location.pathname === "/MobileAccessories" ? "active" : ""
                    }`} /> Mobile Accessories
              </Link>
              <Link
                to="/CCTVAccessories"
                onClick={handleLinkClick}
                className={`nav-link ${isCCTVAccessoriesActive ? "active" : ""}`}
              >
                <FaVideo
                  style={{ fontSize: '16px' }}

                  className={`fa-icons ${location.pathname === "/CCTVAccessories" ? "active" : ""
                    }`}
                /> CCTV Accessories
              </Link>
              <Link
                to="/PrinterAccessories"
                onClick={handleLinkClick}
                className={`nav-link ${isPrinterAccessoriesActive ? "active" : ""}`}
              >
                <FaPrint
                  style={{ fontSize: '16px' }}

                  className={`fa-icons ${location.pathname === "/PrinterAccessories" ? "active" : ""
                    }`}
                /> Printer Accessories
              </Link>
            </div>
          </div>


          <Link
            to="/Secondhandproducts"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname === "/Secondhandproducts" || location.pathname === "/secondhandproducts" ? "active" : ""
              }`}
          >
            <FaRecycle
              className={`fa-icons ${location.pathname === "/Secondhandproducts" || location.pathname === "/secondhandproducts" ? "active" : ""
                }`}
            />{" "}
            Refurbish
          </Link>
          <Link
            to="/About"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname === "/About" ? "active" : ""
              }`}
            style={{
              display: window.innerWidth <= 768 ? "flex" : "none", // Show only on mobile
            }}
          >
            <FaInfoCircle
              className={`fa-icons ${location.pathname === "/About" ? "active" : ""
                }`}
            />{" "}
            About
          </Link>

          <Link
            to="/Contact"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname === "/Contact" ? "active" : ""
              }`}
            style={{
              display: window.innerWidth <= 768 ? "flex" : "none", // Show only on mobile
            }}
          >
            <FaEnvelope
              className={`fa-icons ${location.pathname === "/Contact" ? "active" : ""
                }`}
            />{" "}
            Contact
          </Link>

          <Link
            to="/HelpCenter"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname === "/HelpCenter" ? "active" : ""
              }`}
            style={{
              display: window.innerWidth <= 768 ? "flex" : "none", // Show only on mobile
            }}
          >
            <FaQuestionCircle
              className={`fa-icons ${location.pathname === "/HelpCenter" ? "active" : ""
                }`}
            />{" "}
            Help Center
          </Link>
          <Link
            to="/branch-login"
            onClick={handleLinkClick}
            className={`nav-link ${location.pathname === "/branch-login" ? "active" : ""
              }`}
            style={{
              display: window.innerWidth <= 768 ? "flex" : "none", // Show only on mobile
            }}
          >
            <FaCodeBranch
              className={`fa-icons ${location.pathname === "/branch-login" ? "active" : ""
                }`}
            />{" "}
            Business Login
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header3;
