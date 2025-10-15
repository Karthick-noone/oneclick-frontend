import React, { memo } from "react";
import { useNavigate } from "react-router-dom"; // For URL updates
import "./css/BrandsPage.css";

// Import images directly
import CCTVLogo from "./img/brands/Dahua.jpg";
import Oneplus from "./img/brands/OnePlus.png";
import Zebronics from "./img/brands/zeb.png";
import Apple from "./img/brands/apple.png";
import Boat from "./img/brands/boat.svg";
import Dell from "./img/brands/dell.png";
import Epson from "./img/brands/epson.png";
import Fireboltt from "./img/brands/fireboltt.png";
import Hikvision from "./img/brands/hikvision.png";
import HP from "./img/brands/hp.png";
import Lenovo from "./img/brands/lenovo.png";
import Oppo from "./img/brands/oppo.png";
import Vivo from "./img/brands/vivo.png";
import SamsungLogo from "./img/brands/samsung.png";

// Define brands array with names, logos, and categories
const brands = [
  { name: "dahua", logo: CCTVLogo, category: "cctv" },
  { name: "oneplus", logo: Oneplus, category: "mobiles" },
  { name: "zebronics", logo: Zebronics, category: "headphones" },
  { name: "apple", logo: Apple, category: "mobiles" },
  { name: "boat", logo: Boat, category: "headphones" },
  { name: "dell", logo: Dell, category: "computers" },
  { name: "epson", logo: Epson, category: "printers" },
  { name: "fireboltt", logo: Fireboltt, category: "watch" },
  { name: "hikvision", logo: Hikvision, category: "cctv" },
  { name: "hp", logo: HP, category: "Computers" },
  { name: "lenovo", logo: Lenovo, category: "Computers" },
  { name: "oppo", logo: Oppo, category: "mobiles" },
  { name: "samsung", logo: SamsungLogo, category: "mobiles" },
  { name: "vivo", logo: Vivo, category: "mobiles" },
];

const BrandsPage = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brandName, category) => {
    // Navigate to /Category?search=BrandName
    const encodedBrand = encodeURIComponent(brandName);
    const encodedCategory = encodeURIComponent(category);
    navigate(`/${encodedCategory}?search=${encodedBrand}`);
  };

  return (
    <div className="brands-page">
      <h1>Brands</h1>
      <div className="brands-container">
        {brands.map((brand) => (
          <div
            className="brand-item"
            key={brand.name}
            onClick={() => handleBrandClick(brand.name, brand.category)}
            style={{ cursor: "pointer" }}
          >
            <img
              loading="lazy"
              src={brand.logo}
              alt={brand.name}
              className="brand-logo"
              title={brand.name}
            />
            {/* <p className="brand-name">{brand.name}</p>
            <p className="brand-category">{brand.category}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(BrandsPage);
