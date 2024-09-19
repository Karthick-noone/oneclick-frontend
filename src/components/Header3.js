import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaLaptop, FaUsb, FaMobileAlt, FaVideo, FaPrint, FaHeadphones, FaVolumeUp, FaTv, FaAppleAlt, FaCog } from 'react-icons/fa';
import './css/Header3.css'; // Adjust path as needed

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

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Determine if any of the links are active
    const isAudioActive = ['/Headphones', '/Speaker'].some((path) => location.pathname.includes(path));
    const isAccessoriesActive = ['/ComputerAccessories', '/MobileAccessories'].some((path) => location.pathname.includes(path));

    // Determine which specific accessory is active
    const isComputerAccessoriesActive = location.pathname === '/ComputerAccessories';
    const isMobileAccessoriesActive = location.pathname === '/MobileAccessories';

    return (
        <header className="header3" ref={headerRef}>
            <div
                style={{ position: isOpen ? 'fixed' : '', right: isOpen ? '' : '-80px', top: !isOpen ? '-20px' : '10px', zIndex: isOpen ? '9999' : '' }}
                className="hamburger"
                onClick={toggleMenu}
            >
                {isOpen ? '✖' : '☰'}
            </div>
            <nav className={`nav ${isOpen ? 'open' : ''}`}>
                <NavLink to="/" exact className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    <FaHome className={`fa-icons ${location.pathname === '/' ? 'active' : ''}`} /> {isOpen ? 'Home' : ''}
                </NavLink>
                <NavLink to="/Computers" className={`nav-link ${location.pathname === '/Computers' ? 'active' : ''}`}>
                    <FaLaptop className={`fa-icons ${location.pathname === '/Computers' ? 'active' : ''}`} /> Computers
                </NavLink>
                <NavLink to="/Mobiles" className={`nav-link ${location.pathname === '/Mobiles' ? 'active' : ''}`}>
                    <FaMobileAlt className={`fa-icons ${location.pathname === '/Mobiles' ? 'active' : ''}`} /> Mobile
                </NavLink>
                <NavLink to="/CCTV" className={`nav-link ${location.pathname === '/CCTV' ? 'active' : ''}`}>
                    <FaVideo className={`fa-icons ${location.pathname === '/CCTV' ? 'active' : ''}`} /> CCTV
                </NavLink>
                {/* Parent Audio link */}
         <div className={`nav-item ${isAudioActive ? 'active' : ''}`} onClick={toggleHeadphonesDropdown}>
                    <span className='activelink'>
                        <FaHeadphones className={`fa-icons ${isAudioActive ? 'active' : ''}`} /> Audio
                    </span>
                    {showHeadphones && (
                        <div className="dropdown">
                            <NavLink to="/Headphones" className={`nav-link ${location.pathname === '/Headphones' ? 'active' : ''}`}>
                                <FaHeadphones className={`fa-icons ${location.pathname === '/Headphones' ? 'active' : ''}`} /> Headphones
                            </NavLink>
                            <NavLink to="/Speaker" className={`nav-link ${location.pathname === '/Speaker' ? 'active' : ''}`}>
                                <FaVolumeUp className={`fa-icons ${location.pathname === '/Speaker' ? 'active' : ''}`} /> Speakers
                            </NavLink>
                        </div>
                    )}
                </div>   
                <NavLink to="/Television" className={`nav-link ${location.pathname === '/Television' ? 'active' : ''}`}>
                    <FaTv className={`fa-icons ${location.pathname === '/Television' ? 'active' : ''}`} /> T.V & Home Cinema
                </NavLink>
                <NavLink to="/Watch" className={`nav-link ${location.pathname === '/Watch' ? 'active' : ''}`}>
                    <FaAppleAlt className={`fa-icons ${location.pathname === '/Watch' ? 'active' : ''}`} /> Wearable Tech
                </NavLink>
                <NavLink to="/Printers" className={`nav-link ${location.pathname === '/Printers' ? 'active' : ''}`}>
                    <FaPrint className={`fa-icons ${location.pathname === '/Printers' ? 'active' : ''}`} /> Printers
                </NavLink>
                {/* Parent Accessories link */}
                <div className={`nav-item ${isAccessoriesActive ? 'active' : ''}`} onClick={toggleMoreDropdown}>
                    <span className='activelink'>
                        <FaCog className={`fa-icons ${isAccessoriesActive ? 'active' : ''}`} /> Accessories
                    </span>
                    {showMore && (
                        <div className="dropdown">
                            <NavLink to="/ComputerAccessories" className={`nav-link ${isComputerAccessoriesActive ? 'active' : ''}`}>
                                <FaUsb className={`fa-icons ${isComputerAccessoriesActive ? 'active' : ''}`} /> Computer Accessories
                            </NavLink>
                            <NavLink to="/MobileAccessories" className={`nav-link ${isMobileAccessoriesActive ? 'active' : ''}`}>
                                <FaMobileAlt className={`fa-icons ${isMobileAccessoriesActive ? 'active' : ''}`} /> Mobile Accessories
                            </NavLink>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header3;
