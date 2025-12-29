import React, { useState, useEffect } from 'react';
import {  FaTimes, FaHome, FaLaptop, FaHeadphones, FaMobileAlt, FaPrint, FaTv, FaVolumeUp,  FaVideo, FaRecycle } from 'react-icons/fa';
import { useLocation, Link } from 'react-router-dom';  // Import useLocation hook
import './css/Sidebar.css';
import { Watch } from 'lucide-react';

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
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <aside >
                <div className="sidebar-content">
                    <div style={{ display: isOpen ? 'block' : 'none' }} className="close-button" onClick={toggleSidebar}>
                        <FaTimes />
                    </div>

                    <h3>Browse by products</h3>
                    <ul>
                        <li>
                            <Link
                                to="/"
                                onClick={() => handleLinkClick('home')}
                                className={activeLink === 'home' ? 'active' : ''}
                            >
                                <FaHome /> Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/Computers"
                                onClick={() => handleLinkClick('computers')}
                                className={activeLink === 'computers' ? 'active' : ''}
                            >
                                <FaLaptop /> Computers
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/Mobiles"
                                onClick={() => handleLinkClick('mobiles')}
                                className={activeLink === 'mobiles' ? 'active' : ''}
                            >
                                <FaMobileAlt /> Mobiles
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/CCTV"
                                onClick={() => handleLinkClick('cctv')}
                                className={activeLink === 'cctv' ? 'active' : ''}
                            >
                                <FaVideo /> CCTV
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/Headphones"
                                onClick={() => handleLinkClick('headphones')}
                                className={activeLink === 'headphones' ? 'active' : ''}
                            >
                                <FaHeadphones /> Headphones
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/Speakers"
                                onClick={() => handleLinkClick('speakers')}
                                className={activeLink === 'speakers' ? 'active' : ''}
                            >
                                <FaVolumeUp /> Speakers
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/TV"
                                onClick={() => handleLinkClick('tv')}
                                className={activeLink === 'tv' ? 'active' : ''}
                            >
                                <FaTv /> TV & Home Cinema
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/Watch"
                                onClick={() => handleLinkClick('watch')}
                                className={activeLink === 'watch' ? 'active' : ''}
                            >
                                <Watch
                                />{" "} Wearable Tech
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/Printers"
                                onClick={() => handleLinkClick('printers')}
                                className={activeLink === 'printers' ? 'active' : ''}
                            >
                                <FaPrint /> Printers
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/ComputerAccessories"
                                onClick={() => handleLinkClick('computeraccessories')}
                                className={activeLink === 'computeraccessories' ? 'active' : ''}
                            >
                                <FaLaptop /> Computer Accessories
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/MobileAccessories"
                                onClick={() => handleLinkClick('mobileaccessories')}
                                className={activeLink === 'mobileaccessories' ? 'active' : ''}
                            >
                                <FaMobileAlt /> Mobile Accessories
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/CCTVAccessories"
                                onClick={() => handleLinkClick('cctvaccessories')}
                                className={activeLink === 'cctvaccessories' ? 'active' : ''}
                            >
                                <FaVideo /> CCTV Accessories
                            </Link>
                        </li>




    
                        <li>
                            <Link
                                to="/PrinterAccessories"
                                onClick={() => handleLinkClick('printeraccessories')}
                                className={activeLink === 'printeraccessories' ? 'active' : ''}
                            >
                                <FaPrint /> Printer Accessories
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/Secondhandproducts"
                                onClick={() => handleLinkClick('secondhandproducts')}
                                className={activeLink === 'secondhandproducts' ? 'active' : ''}
                            >
                                <FaRecycle /> Refurbish
                            </Link>
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
