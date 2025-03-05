import React, { memo } from "react";
import "./css/BrandsPage.css";

// Dynamically import all images from 'img/brands' folder
const importAll = (context) =>
  context.keys().map((key) => ({
    logo: context(key),
    name: key.replace("./", "").split(".")[0], // Extract filename as brand name
  }));

const brands = importAll(require.context("./img/brands", false, /\.(png|jpe?g|svg)$/));

const BrandsPage = () => {
  return (
    <div className="brands-page">
      <h1>Brands</h1>
      <div className="brands-container">
        {brands.map((brand) => (
          <div className="brand-item" key={brand.name}>
            <img 
              loading="lazy" 
              src={brand.logo} 
              alt={brand.name} 
              className="brand-logo"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(BrandsPage);
