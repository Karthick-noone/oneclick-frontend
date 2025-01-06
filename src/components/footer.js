import React from "react";
import "./css/Footer.css"; // Adjust path as needed
import PaymentMethods from "./PaymentMethods"; // Import the PaymentMethods page

// Import icons from react-icons
import { FaMapMarkerAlt, FaHeadset, FaShareAlt, FaGavel } from "react-icons/fa";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-section">
          <h4>
            <FaMapMarkerAlt /> Store Location
          </h4>
          <p>Market Road, Marthandam,</p>
          <p>Kanyakumari, 629165</p>
          <p>enquiryoneclick@gmail.com</p>
          <a href="tel:+9092206677">
            <p>+91-9092206677</p>
          </a>
        </div>

        <div className="footer-section">
          <h4>
            <FaHeadset /> Customer Support
          </h4>
          <a href="/Contact">
            <p>Contact Us</p>
          </a>
          <a href="/HelpCenter">
            <p>Help Center</p>
          </a>
          <a href="/About">
            <p>About Us</p>
          </a>
          <a href="/About">
            <p>Careers</p>
          </a>
        </div>
        <div className="footer-section">
          <h4>
            <FaShareAlt /> Follow Us
          </h4>
          <p>
            <FaFacebookF style={{ color: "#3b5998", marginRight: "8px" }} />{" "}
            Facebook
          </p>
          <p>
            <FaInstagram style={{ color: "#E1306C", marginRight: "8px" }} />{" "}
            Instagram
          </p>
          <p>
            <FaTwitter style={{ color: "#1DA1F2", marginRight: "8px" }} />{" "}
            Twitter
          </p>
          <p>
            <FaYoutube style={{ color: "#FF0000", marginRight: "8px" }} />{" "}
            YouTube
          </p>
          <p>
            <FaWhatsapp style={{ color: "#25D366", marginRight: "8px" }} />{" "}
            WhatsApp
          </p>
        </div>

        <div className="footer-section">
          <h4>
            <FaGavel /> Policy
          </h4>
          <a href="/ShippingAndReturns">
            <p>Shipping & Returns</p>
          </a>
          <a href="/Privacypolicy">
            <p>Privacy Policy</p>
          </a>
          <a href="/Terms">
            <p>Terms Of Use</p>
          </a>
          <a href="/PaymentSecurity">
            <p>Payment Security</p>
          </a>
          <a href="/HelpCenter">
            <p>FAQ</p>
          </a>
          <a href="/Adminlogin">
            <p style={{ color: "black", textDecoration: "none" }}>ADMIN</p>
          </a>
        </div>
      </footer>

      <PaymentMethods />
    </>
  );
};

export default Footer;
