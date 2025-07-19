import React from "react";
import "./css/Footer.css"; // Adjust path as needed
import PaymentMethods from "./PaymentMethods"; // Import the PaymentMethods page
import { Link } from "react-router-dom";
import PlayStore from './img/Play-Store.png';

// Import icons from react-icons
import { FaMapMarkerAlt, FaHeadset, FaShareAlt, FaGavel } from "react-icons/fa";
import {
  FaFacebookF,
  FaInstagram,
  // FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-bg">
      <footer className="footer">
        <div className="footer-section">
          <h4>
            <FaMapMarkerAlt /> Store Location
          </h4>
          <p>Market Road, Marthandam,</p>
          <p>Kanyakumari, 629165</p>
          <a href="mailto:enquiryoneclick@gmail.com"><p>enquiryoneclick@gmail.com</p></a>
          <a href="tel:+9092206677">
            <p>+91-9092206677</p>
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.oneclick.seasense" target="_blank" rel="noopener noreferrer">
            <img loading='lazy' src={PlayStore} alt="Visa" className='play-store-image' />
          </a>
        </div>

        <div className="footer-section">
          <h4>
            <FaHeadset /> Customer Support
          </h4>
          <Link to="/Contact">
            <p>Contact Us</p>
          </Link>
          <Link to="/HelpCenter">
            <p>Help Center</p>
          </Link>
          <Link to="/About">
            <p>About Us</p>
          </Link>
          <Link to="/About">
            <p>Careers</p>
          </Link>
        </div>
        <div className="footer-section">
          <h4>
            <FaShareAlt /> Follow Us
          </h4>
          <a href="https://www.facebook.com/oneclickteck/" target="_blank" rel="noopener noreferrer">
            <p>
              <FaFacebookF style={{ color: "white", marginRight: "8px" }} /> Facebook
            </p>
          </a>
          <a href="https://www.instagram.com/oneclicktechnologies/" target="_blank" rel="noopener noreferrer">
            <p>
              <FaInstagram style={{ color: "white", marginRight: "8px" }} /> Instagram
            </p>
          </a>
          {/* <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <p>
              <FaTwitter style={{ color: "white", marginRight: "8px" }} /> Twitter
            </p>
          </a> */}
          <a href="https://www.youtube.com/@oneclickteck" target="_blank" rel="noopener noreferrer">
            <p>
              <FaYoutube style={{ color: "white", marginRight: "8px" }} /> YouTube
            </p>
          </a>
          <a
            href="https://wa.me/919092206677"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p>
              <FaWhatsapp style={{ color: "white", marginRight: "8px" }} /> WhatsApp
            </p>
          </a>
        </div>


        <div className="footer-section">
          <h4>
            <FaGavel /> Policy
          </h4>
          <Link to="/ShippingAndReturns">
            <p>Shipping & Returns</p>
          </Link>
          <Link to="/Privacypolicy">
            <p>Privacy Policy</p>
          </Link>
          <Link to="/Terms">
            <p>Terms Of Use</p>
          </Link>
          <Link to="/PaymentSecurity">
            <p>Payment Security</p>
          </Link>
          <Link to="/HelpCenter">
            <p>FAQ</p>
          </Link>
          <Link to="/Adminlogin">
            <p style={{ color: "white", textDecoration: "none" }}>ADMIN</p>
          </Link>
        </div>


      </footer>

      <PaymentMethods />

    </div>
  );
};

export default Footer;
