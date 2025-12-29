import React, { useState, useEffect } from "react";
// import { FaArrowUp } from "react-icons/fa";
import "./css/ScrollToTopButton.css"; // Create this CSS file or put styles in global CSS
// import upArrow from './img/up-arrow.png'
const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button after scrolling down 300px
    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 300);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };


    return isVisible ? (
        <div className="scroll-to-top-button" onClick={scrollToTop} >
            <div className="tooltip-container">

                <span className="tooltip">Back to top</span>

                <img src="/img/up-arrow.png" alt="Scroll to top" className="up-arrow-icon" />
            </div>
        </div>

    ) : null;
};

export default ScrollToTopButton;
