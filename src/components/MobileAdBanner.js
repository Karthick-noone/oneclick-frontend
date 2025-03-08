import React, { useEffect, useState } from "react";
import "./css/ComputerAdBanner.css"; // Importing styles
import Header2 from "./Header2";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";

const AdBanner = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchmobileofferspage`);
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAdClick = (product) => {
    navigate(`/${product.category}?search=${product.brand_name.toLowerCase()}`);
  };

  // ✅ Correct filtering
  const bannerProducts = products.filter((product) => product.title === "banner");
  const portraitProducts = products.filter((product) => product.title === "portrait");
  const noTitleProducts = products.filter((product) => !product.title || product.title.trim() === "");

  return (
    <>
      <Header2 />
      <div className="ad-section-container4">
        {/* ✅ Section 1: Banner Images */}
        {bannerProducts.length > 0 && (
          <div className="box">
            <div className="bannerr-container4">
              {bannerProducts.map((banner, index) => (
                <div className="banner-image-display" key={index}>
                  <img
                    onClick={() => handleAdClick(banner)}
                    src={`${ApiUrl}/uploads/offerspage/${banner.image}`}
                    alt={`Banner for ${banner.brand_name}`}
                    className="banner-image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Section 2: Products with Empty Title */}
        {noTitleProducts.length > 0 && (
          <div className="box">
            <div className="offer-ad-container4">
              {noTitleProducts.map((product) => (
                <div key={product.id} className="single-ad-container4" onClick={() => handleAdClick(product)}>
                  <div className="image-wrapper">
                    {product.image ? (
                      <>
                        <p className="brand-namee">{product.brand_name}</p>
                        <img
                          src={`${ApiUrl}/uploads/offerspage/${product.image}`}
                          alt="Product"
                          className="offer-add"
                          loading="lazy"
                        />
                      </>
                    ) : (
                      <p>No images available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Section 3: Portrait Images */}
        {portraitProducts.length > 0 && (
          <div className="box">
            <div className="portrait-container2">
              {portraitProducts.map((portrait, index) => (
                <div key={index}>
                {/* <p className="brand-namee">{portrait.brand_name}</p> */}
                  <img
                    onClick={() => handleAdClick(portrait)}
                    src={`${ApiUrl}/uploads/offerspage/${portrait.image}`}
                    alt={`Portrait for ${portrait.brand_name}`}
                    className="portrait-image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdBanner;
