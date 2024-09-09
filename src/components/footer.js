import React from 'react';
import './css/Footer.css'; // Adjust path as needed

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-section">
                <h4>Store Location</h4>
                <p>Market Road, Marthandam,</p>
                <p>Kanyakumari, 629165</p>
                <p>enquiryoneclick@gmail.com</p>
                <a href="tel:+9092206677"><p>+91-9092206677</p></a>
            </div>
           
            {/* <div className="footer-section">
                <h4>Shop</h4>
                <a href="/Computers"><p>Computers</p></a>
                <a href="/Mobiles"><p>Mobiles</p></a>
                <a href="/CCTV"><p>CCTV</p></a>
                <a href="/Headphones"><p>Headphones</p></a>
                <a href="/Speaker"><p>Speakers</p></a>
                <a href="/TeleVision"><p>T.V & Home Cinema</p></a>
                <a href="/Watch"><p>Wearable Tech</p></a>
                <a href="/Printers"><p>Printers</p></a>
                <a href="/ComputerAccessories"><p>ComputerAccessories</p></a>
                <a href="/MobileAccessories"><p>MobileAccessories</p></a>
            </div> */}
            <div className="footer-section">
                <h4>Customer Support</h4>
                <a href="/Contact"><p>Contact Us</p></a>
                <a href="/HelpCenter"><p>Help Center</p></a>
                <a href="/About"><p>About Us</p></a>
                <a href="/About"><p>Careers</p></a>
            </div>
            <div className="footer-section">
                <h4>Follow Us</h4>
                <p>Facebook</p>
                <p>Instagram</p>
                <p>Twitter</p>
                <p>YouTube</p>
            </div>
            <div className="footer-section">
                <h4>Policy</h4>
                <a href="/ShippingAndReturns"><p>Shipping & Returns</p></a>
                <a href="/TermsAndConditions"><p>Terms & Conditions</p></a>
                <a href="TermsAndConditions#PaymentMethod"><p>Payment Methods</p></a>
                <a href="/HelpCenter"><p>FAQ</p></a>
                <a href="/Adminlogin"><p style={{color:'white',textDecoration:'none'}}>ADMIN</p></a>
            </div>
        </footer>
    );
};

export default Footer;
