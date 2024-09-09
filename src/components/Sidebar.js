import React, { useState } from 'react';
import { FaSearch, FaTimes, FaHome, FaLaptop, FaHeadphones, FaMobileAlt, FaPrint,  FaTv,FaSpeakerDeck, FaClock, FaCamera } from 'react-icons/fa'; // Removed FaBars and FaCctv
import './css/Sidebar.css'; // Ensure you create this CSS file

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                    <div style={{ display: isOpen ? 'block' : 'none' }} className="close-button" onClick={toggleSidebar}>
                        <FaTimes />
                    </div>
                    <h3>Browse by</h3>
                    <ul>
                        <li><a href="/"><FaHome /> Home</a></li>
                        <li><a href="/Computers"><FaLaptop /> Computers</a></li>
                        <li><a href="/CCTV"><FaCamera /> CCTV</a></li> {/* Use FaTags or another relevant icon */}
                        <li><a href="/ComputerAccessories"><FaLaptop /> Computer Accessories</a></li>
                        <li><a href="/Headphones"><FaHeadphones /> Headphones</a></li>
                        {/* <li><a href="/Headphones"><FaHeadphones /> Home Page Best Sellers</a></li> */}
                        {/* <li><a href="/"><FaSearch /> Home Page Sale</a></li> */}
                        <li><a href="/Mobiles"><FaMobileAlt /> Mobiles</a></li>
                        <li><a href="/MobileAccessories"><FaMobileAlt /> Mobile Accessories</a></li>
                        <li><a href="/Speaker"><FaSpeakerDeck/> Speakers</a></li>
                        <li><a href="/TeleVision"><FaTv /> TV & Home Cinema</a></li>
                        <li><a href="/Watch"><FaClock /> Wearable Tech</a></li>
                        <li><a href="/Printers"><FaPrint /> Printers</a></li>
                    </ul>
                    <h3>Filter by</h3>
                    <div className="price-filter">
                        <label>
                            Price
                            <input type="range" min="0" max="100000" /><br />
                            <span>₹39,499.00 - ₹72,999.00</span>
                        </label>
                    </div>
                </div>
            </aside>

            {/* Fixed toggle button */}
            <div className={`toggle-button ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
                {isOpen ? '' : <FaSearch />} {/* <span>{isOpen ? '' : 'Browse By'}</span> */}
            </div>
        </div>
    );
};

export default Sidebar;