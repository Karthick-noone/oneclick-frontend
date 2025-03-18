import React from "react";
import { useQuery } from "@tanstack/react-query";
import "./css/ComputerAdBanner.css";
import Header2 from "./Header2";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";

// Fetch function for TanStack Query
const fetchProducts = async () => {
  const response = await axios.get(`${ApiUrl}/fetchcctvofferspage`);
  return response.data || [];
};

const AdBanner = () => {
  const navigate = useNavigate();

  // Use TanStack Query for data fetching
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["cctvOffersPage"],
    queryFn: fetchProducts,
    staleTime: Infinity,
    cacheTime: 300000,
    refetchOnWindowFocus: false,
  });

  const handleAdClick = (product) => {
    navigate(`/${product.category}?search=${product.brand_name.toLowerCase()}`);
  };

  const bannerProducts = products.filter((product) => product.title === "banner");
  const portraitProducts = products.filter((product) => product.title === "portrait");
  const noTitleProducts = products.filter((product) => !product.title || product.title.trim() === "");

  return (
    <>
      <Header2 />
      <div className="ad-section-container4">
        {/* Banner Images */}
        <div className="box">
          <div className="bannerr-container4">
            {isLoading
              ? [...Array(2)].map((_, index) => (
                  <div className="skeleton-banner" key={index}></div>
                ))
              : isError ? (
                  <div className="error-message">Failed to load banners</div>
                ) : bannerProducts.length > 0 ? (
                  bannerProducts.map((banner, index) => (
                    <div className="banner-image-display" key={index}>
                      <img
                        onClick={() => handleAdClick(banner)}
                        src={`${ApiUrl}/uploads/offerspage/${banner.image}`}
                        alt={`Banner for ${banner.brand_name}`}
                        className="banner-image"
                        loading="lazy"
                      />
                    </div>
                  ))
                ) : null}
          </div>
        </div>

        {/* Products with Empty Title */}
        <div className="box">
          <div className="offer-ad-container4">
            {isLoading
              ? [...Array(3)].map((_, index) => (
                  <div className="skeleton-product" key={index}></div>
                ))
              : isError ? (
                  <div className="error-message">Failed to load products</div>
                ) : noTitleProducts.length > 0 ? (
                  noTitleProducts.map((product) => (
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
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : null}
          </div>
        </div>

        {/* Portrait Images */}
        <div className="box">
          <div className="portrait-container2">
            {isLoading
              ? [...Array(2)].map((_, index) => (
                  <div className="skeleton-portrait" key={index}></div>
                ))
              : isError ? (
                  <div className="error-message">Failed to load portraits</div>
                ) : portraitProducts.length > 0 ? (
                  portraitProducts.map((portrait, index) => (
                    <div key={index}>
                      <img
                        onClick={() => handleAdClick(portrait)}
                        src={`${ApiUrl}/uploads/offerspage/${portrait.image}`}
                        alt={`Portrait for ${portrait.brand_name}`}
                        className="portrait-image"
                        loading="lazy"
                      />
                    </div>
                  ))
                ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdBanner;
