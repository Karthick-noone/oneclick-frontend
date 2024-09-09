import React from "react";
// import { Link } from 'react-router-dom'; // Import Link if you're using React Router for navigation
import computerImg from "./img/computer.jpg";
import mobileImg from "./img/mbl.jpg";
import mobileAccessoriesImg from "./img/cmp.jpg";
import cctvImg from "./img/cctv.jpg";
import tvImg from "./img/tv.jpg";
import watchImg from "./img/watch.jpg";
import headphonesImg from "./img/headphones.jpg";
import printerImg from "./img/printer.jpg";
import computerAccessoriesImg from "./img/cmp.jpg";
import speakersImg from "./img/speaker.jpg";
import "./css/ShopByCategory.css"; // Adjust path as needed

const ShopByCategory = () => {
  return (
    <section className="shop-by-category">
      <h2>Shop by Category</h2>
      <div className="categories">
        <div className="category">
          <a href="/Computers">
            <img loading="lazy" src={computerImg} alt="Computers" className="category-image" />
            <span>Computers</span>
          </a>
        </div>
        <div className="category">
          <a href="/Mobiles">
            <img loading="lazy" src={mobileImg} alt="Mobile" className="category-image" />
            <span>Mobile</span>
          </a>
        </div>
        <div className="category">
          <a href="/MobileAccessories">
            <img
              src={mobileAccessoriesImg}
              alt="Mobile Accessories"
              className="category-image"
            />
            <span>Mobile Accessories</span>
          </a>
        </div>
        <div className="category">
          <a href="/CCTV">
            <img loading="lazy" src={cctvImg} alt="CCTV" className="category-image" />
            <span>CCTV</span>
          </a>
        </div>
        <div className="category">
          <a href="/TeleVision">
            <img
              src={tvImg}
              alt="T.V & Home Cinema"
              className="category-image"
            />
            <span>T.V & Home Cinema</span>
          </a>
        </div>
        <div className="category">
          <a href="/Watch">
            <img
              src={watchImg}
              alt="Wearable Tech"
              className="category-image"
            />
            <span>Wearable Tech</span>
          </a>
        </div>
        <div className="category">
          <a href="/Headphones">
            <img
              src={headphonesImg}
              alt="Headphones"
              className="category-image"
            />
            <span>Headphones</span>
          </a>
        </div>
        <div className="category">
          <a href="/Printers">
            <img loading="lazy" src={printerImg} alt="Printers" className="category-image" />
            <span>Printers</span>
          </a>
        </div>
        <div className="category">
          <a href="/ComputerAccessories">
            <img
              src={computerAccessoriesImg}
              alt="Computer Accessories"
              className="category-image"
            />
            <span>Computer Accessories</span>
          </a>
        </div>
        <div className="category">
          <a href="/Speaker">
            <img loading="lazy" src={speakersImg} alt="Speakers" className="category-image" />
            <span>Speakers</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
