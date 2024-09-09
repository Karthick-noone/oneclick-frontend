import React from 'react';
import './css/BrandsPage.css'; // Import the CSS file for styles

// Importing images
import brandA from './img/brands/dell.png';
import brandB from './img/brands/lenovo.png';
import brandC from './img/brands/vivo.png';
import brandD from './img/brands/samsung.png';
import brandE from './img/brands/hp.png';
import brandF from './img/brands/epson.png';
import brandG from './img/brands/oppo.png';
import brandH from './img/brands/fireboltt.png';
import brandI from './img/brands/hikvision.png';

const brands = [
  { logo: brandA },
  { logo: brandB },
  { logo: brandC },
  { logo: brandD },
  { logo: brandE },
  { logo: brandF },
  { logo: brandG },
  { logo: brandH },
  { logo: brandI },
];

const BrandsPage = () => {
  return (
    <div className="brands-page">
      <h1>Brands</h1>
      <div className="brands-container">
        {brands.map((brand, index) => (
          <div className="brand-item" key={index}>
            <img loading="lazy" src={brand.logo} alt={`Brand ${index}`} className="brand-logo" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsPage;