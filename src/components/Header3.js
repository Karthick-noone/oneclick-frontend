import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaLaptop,FaUsb, FaMobileAlt, FaVideo,FaPrint, FaHeadphones, FaVolumeUp, FaTv, FaAppleAlt,  FaCog } from 'react-icons/fa';
import './css/Header3.css'; // Adjust path as needed

const Header3 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showHeadphones, setShowHeadphones] = useState(false);
    const [showMore, setShowMore] = useState(false);

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
                <a href="/"><FaHome className='fa-icons'/> {isOpen ? 'Home' : ''}</a>
                <a href="/Computers"><FaLaptop className='fa-icons' /> Computers</a>
                <a href="/Mobiles"><FaMobileAlt className='fa-icons' /> Mobile</a>
                <a href="/CCTV"><FaVideo className='fa-icons' /> CCTV</a>
                <div className="nav-item" onClick={toggleHeadphonesDropdown}>
                    <a href="#"><FaHeadphones className='fa-icons' /> Audio</a>
                    {showHeadphones && (
                        <div className="dropdown">
                            <a href="/Headphones"><FaHeadphones className='fa-icons' /> Headphones</a>
                            <a href="/Speaker"><FaVolumeUp className='fa-icons' /> Speakers</a>
                        </div>
                    )}
                </div>
                <a href="/Television"><FaTv className='fa-icons' /> T.V & Home Cinema</a>
                <a href="/Watch"><FaAppleAlt className='fa-icons' /> Wearable Tech</a>
                <a href="/Printers"><FaPrint  className='fa-icons'/> Printers</a>
                <div className="nav-item" onClick={toggleMoreDropdown}>
                    <a href="#"><FaCog className='fa-icons' />Accessories</a>
                    {showMore && (
                        <div className="dropdown">
                            <a href="/ComputerAccessories"><FaUsb className='fa-icons' /> Computer Accessories</a>
                            <a href="/MobileAccessories"><FaMobileAlt className='fa-icons' /> Mobile Accessories</a>
                            {/* <a href="/"> Gadgets</a> */}
                            {/* <a href="/More/Featured">Featured</a> */}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header3;