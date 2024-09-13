import React from 'react';
import './css/Footer.css'; // Adjust path as needed
import PaymentMethods from './PaymentMethods'; // Import the PaymentMethods page

// Import icons from react-icons
import { FaMapMarkerAlt, FaHeadset, FaShareAlt, FaGavel } from 'react-icons/fa';

const Footer = () => {
    return (
        <>
        <footer className="footer">
            <div className="footer-section">
                <h4><FaMapMarkerAlt /> Store Location</h4>
                <p>Market Road, Marthandam,</p>
                <p>Kanyakumari, 629165</p>
                <p>enquiryoneclick@gmail.com</p>
                <a href="tel:+9092206677"><p>+91-9092206677</p></a>
            </div>
           
            <div className="footer-section">
                <h4><FaHeadset /> Customer Support</h4>
                <a href="/Contact"><p>Contact Us</p></a>
                <a href="/HelpCenter"><p>Help Center</p></a>
                <a href="/About"><p>About Us</p></a>
                <a href="/About"><p>Careers</p></a>
            </div>
            <div className="footer-section">
                <h4><FaShareAlt /> Follow Us</h4>
                <p>Facebook</p>
                <p>Instagram</p>
                <p>Twitter</p>
                <p>YouTube</p>
            </div>
            <div className="footer-section">
                <h4><FaGavel /> Policy</h4>
                <a href="/ShippingAndReturns"><p>Shipping & Returns</p></a>
                <a href="/TermsAndConditions"><p>Terms & Conditions</p></a>
                <a href="TermsAndConditions#PaymentMethod"><p>Payment Methods</p></a>
                <a href="/HelpCenter"><p>FAQ</p></a>
                <a href="/Adminlogin"><p style={{color:'black',textDecoration:'none'}}>ADMIN</p></a>
            </div>
        </footer>
        
        <PaymentMethods /></>
    );
};

export default Footer;