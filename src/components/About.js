import React from 'react';
// import Header1 from './Header1';
import Header2 from './Header2';
// import Header3 from './Header3';
import Footer from './footer';
import aboutImage from './img/about.jpg'; // Replace with your image path
import './css/About.css'; // Import the CSS file for styling
import CareersForm from './CareersForm'; // Import the new component

const About = () => {
  return (
    <div className="about-page">
      {/* <Header1 /> */}
      <Header2 />
      {/* <Header3 /> */}
      <div className="about-content">
        <div className="image-container">
          <img src={aboutImage} alt="About Us" className="about-image" />
        </div>
        <div className="text-container">
          <h2 className="about-title">About Us</h2>
          <p className="about-paragraph">
          At One Click, we are dedicated to delivering top-tier electronic products and IT infrastructure services that meet the demands of diverse industries and technological landscapes. Our customer-first philosophy drives us to maintain the highest standards of quality and operational excellence. Through years of experience and innovation, we’ve honed our ability to provide tailored solutions that cater to the unique needs of our customers.

Our mission is to empower individuals and businesses by offering cutting-edge electronics and seamless shopping experiences. We understand the importance of technology in everyday life and work, and our goal is to ensure our customers can achieve their objectives efficiently, enhancing their productivity and overall quality of life.
          </p>
        </div>
      </div>
      <CareersForm />
      <Footer />
    </div>
  );
};

export default About;