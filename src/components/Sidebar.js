import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaHome, FaLaptop, FaHeadphones, FaMobileAlt, FaPrint, FaTv, FaVolumeUp, FaClock, FaVideo, FaRecycle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';  // Import useLocation hook
import './css/Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();  // Get the current URL path
    const [activeLink, setActiveLink] = useState(localStorage.getItem('activeLink') || '');

    // Toggle sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Handle submenu click and set active link
    const handleLinkClick = (link) => {
        setActiveLink(link);
        localStorage.setItem('activeLink', link);  // Save active link to localStorage
    };

    // This useEffect will ensure the active link updates based on the current URL
    useEffect(() => {
        const path = location.pathname.replace('/', '').toLowerCase();  // Remove leading "/" and convert to lowercase
        setActiveLink(path);
        localStorage.setItem('activeLink', path);  // Update localStorage with the current URL path
    }, [location]);  // Re-run when the location changes

    return (
        <div>
            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                    <div style={{ display: isOpen ? 'block' : 'none' }} className="close-button" onClick={toggleSidebar}>
                        <FaTimes />
                    </div>
                    
                    <h3>Browse by products</h3>
                    <ul>
                        <li>
                            <a
                                href="/"
                                onClick={() => handleLinkClick('home')}
                                className={activeLink === 'home' ? 'active' : ''}
                            >
                                <FaHome /> Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="/Computers"
                                onClick={() => handleLinkClick('computers')}
                                className={activeLink === 'computers' ? 'active' : ''}
                            >
                                <FaLaptop /> Computers
                            </a>
                        </li>
                        <li>
                            <a
                                href="/CCTV"
                                onClick={() => handleLinkClick('cctv')}
                                className={activeLink === 'cctv' ? 'active' : ''}
                            >
                                <FaVideo /> CCTV
                            </a>
                        </li>
                        <li>
                            <a
                                href="/Headphones"
                                onClick={() => handleLinkClick('headphones')}
                                className={activeLink === 'headphones' ? 'active' : ''}
                            >
                                <FaHeadphones /> Headphones
                            </a>
                        </li>
                        <li>
                            <a
                                href="/Mobiles"
                                onClick={() => handleLinkClick('mobiles')}
                                className={activeLink === 'mobiles' ? 'active' : ''}
                            >
                                <FaMobileAlt /> Mobiles
                            </a>
                        </li>
                        <li>
                            <a
                                href="/Speaker"
                                onClick={() => handleLinkClick('speaker')}
                                className={activeLink === 'speaker' ? 'active' : ''}
                            >
                                <FaVolumeUp /> Speakers
                            </a>
                        </li>
                        <li>
                            <a
                                href="/TeleVision"
                                onClick={() => handleLinkClick('television')}
                                className={activeLink === 'television' ? 'active' : ''}
                            >
                                <FaTv /> TV & Home Cinema
                            </a>
                        </li>
                        <li>
                            <a
                                href="/Watch"
                                onClick={() => handleLinkClick('watch')}
                                className={activeLink === 'watch' ? 'active' : ''} 
                            >
                                <FaClock /> Wearable Tech
                            </a>
                        </li>
                        <li>
                            <a
                                href="/Printers"
                                onClick={() => handleLinkClick('printers')}
                                className={activeLink === 'printers' ? 'active' : ''}
                            >
                                <FaPrint /> Printers
                            </a>
                        </li>
                        <li>
                            <a
                                href="/MobileAccessories"
                                onClick={() => handleLinkClick('mobileaccessories')}
                                className={activeLink === 'mobileaccessories' ? 'active' : ''}
                            >
                                <FaMobileAlt /> Mobile Accessories
                            </a>
                        </li>
                        <li>
                            <a
                                href="/ComputerAccessories"
                                onClick={() => handleLinkClick('computeraccessories')}
                                className={activeLink === 'computeraccessories' ? 'active' : ''}
                            >
                                <FaLaptop /> Computer Accessories
                            </a>
                        </li>
                        <li>
                            <a
                                href="/CCTVAccessories"
                                onClick={() => handleLinkClick('cctvaccessories')}
                                className={activeLink === 'cctvaccessories' ? 'active' : ''}
                            >
                                <FaVideo /> CCTV Accessories
                            </a>
                        </li>
                        <li>
                            <a
                                href="/PrinterAccessories"
                                onClick={() => handleLinkClick('printeraccessories')}
                                className={activeLink === 'printeraccessories' ? 'active' : ''}
                            >
                                <FaPrint /> Printer Accessories
                            </a>
                        </li>
                        <li>
                            <a
                                href="/Secondhandproducts"
                                onClick={() => handleLinkClick('secondhandproducts')}
                                className={activeLink === 'secondhandproducts' ? 'active' : ''}
                            >
                                <FaRecycle /> Refurbish
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Fixed toggle button */}
            <div className={`toggle-button ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
                {isOpen ? '' : ''} {/* <span>{isOpen ? '' : 'Browse By'}</span> */}
            </div>
        </div>
    );
};

export default Sidebar;
