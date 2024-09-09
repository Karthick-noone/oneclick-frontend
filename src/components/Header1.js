import React from 'react';
import './css/Header1.css'; // Adjust path as needed

const Header1 = () => {
    return (
        <header className="header1">
            <p>Free Shipping for orders over ₹ 500</p>
            <nav>
                <a href="/About">About</a>
                <a href="/Contact">Contact</a>
                <a href="/Helpcenter">Help Center</a>
                <a href="tel:+9092206677"><span>Call Us: 9092206677</span></a>
            </nav>
        </header>
    );  
};

export default Header1;
