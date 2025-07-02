import React from "react";
import "./css/ShopByCategory.css"; // Adjust path as needed
import { Link } from "react-router-dom";

const categories = [
  { name: "Computers", img: "computer.jpg", link: "/ComputerAd" },
  { name: "Mobiles", img: "mbl.jpg", link: "/MobileAd" },
  { name: "CCTV", img: "cctv.jpg", link: "/CCTVAd" },
  { name: "Headphones", img: "headphones.jpg", link: "/Headphones" },
  { name: "Speakers", img: "speaker.jpg", link: "/Speakers" },
  { name: "T.V & Home Cinema", img: "LED-Tv.jpg", link: "/TV" },
  { name: "Wearable Tech", img: "watch.jpg", link: "/Watch" },
  { name: "Printers", img: "printers.jpg", link: "/Printers" },
  { name: "Computer Accessories", img: "cmp.jpg", link: "/ComputerAccessories" },
  { name: "Mobile Accessories", img: "mobile-accessories.jpg", link: "/MobileAccessories" },
];

// Dynamic import of images
const images = require.context("./img", false, /\.(jpg|jpeg|png|webp)$/);

const ShopByCategory = () => {
  return (
    <section className="shop-by-category">
      <h2>Shop by Category</h2>
      <div className="categories">
        {categories.map((category, index) => (
          <div className="category" key={index}>
            <Link to={category.link}>
              <img
                loading="lazy"
                src={images(`./${category.img}`)}
                alt={category.name}
                className="category-image"
              />
              <span className="category-text">{category.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;
