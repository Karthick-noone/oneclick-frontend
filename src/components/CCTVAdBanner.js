import React from "react";
import { useQuery } from "@tanstack/react-query";
import "./css/ComputerAdBanner.css";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";

//  Fetch function with no delay
const fetchProducts = async () => {
  const response = await axios.get(`${ApiUrl}/fetchcctvofferspage`);
  return response.data || [];
};

const AdBanner = () => {
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cctvOffersPage"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 10,       // 10 minutes: considered fresh
    cacheTime: 1000 * 60 * 15,       // 15 minutes in cache after unused
    refetchOnWindowFocus: false,     // No refetch on tab focus
    refetchOnReconnect: false,       // No refetch on reconnect
    refetchOnMount: false,           // Don't refetch every mount
    keepPreviousData: true,          // Prevent flicker when refetching
  });

  const handleAdClick = (product) => {
    navigate(`/${product.category}?brand=${product.brand_name.toLowerCase()}`);
  };

const bannerProducts = products.filter(
  (p) =>
    p.category?.toLowerCase() === "cctv" &&
    p.title?.toLowerCase().trim() === "banner" &&
    p.image && p.image.trim() !== ""
);

const portraitProducts = products.filter(
  (p) =>
    p.category?.toLowerCase() === "cctv" &&
    p.title?.toLowerCase().trim() === "portrait" &&
    p.image && p.image.trim() !== ""
);

const noTitleProducts = products.filter(
  (p) =>
    p.category?.toLowerCase() === "cctv" &&
    p.title?.toLowerCase().trim() === "medium" &&
    p.image && p.image.trim() !== ""
);


  const SkeletonLoader = () => (
    <div className="box">
      <div className="skeleton-banner-container">
        <div className="skeleton-banner" />
        <div className="skeleton-banner" />
        <div className="skeleton-banner" />
      </div>
      <div className="skeleton-offers-container">
        {[...Array(4)].map((_, i) => (
          <div className="skeleton-offer" key={i} />
        ))}
      </div>
      {/* <div className="skeleton-portrait-container">
      {[...Array(2)].map((_, i) => (
        <div className="skeleton-portrait" key={i} />
      ))}
    </div> */}
    </div>
  );


  return (
    <>
      <div className="ad-section-container4">
        {isLoading && <SkeletonLoader />}
        {!isLoading && !isError && bannerProducts.length > 0 && (
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

        {!isLoading && !isError && noTitleProducts.length > 0 && (
          <div className="box">
            <div className="offer-ad-container4">
              {noTitleProducts.map((product) => (
                <div
                  key={product.id}
                  className="single-ad-container4"
                  onClick={() => handleAdClick(product)}
                >
                  <div className="image-wrapper">
                    {product.image && (
                      <>
                        <p className="brand-namee">{product.brand_name}</p>
                        <img
                          src={`${ApiUrl}/uploads/offerspage/${product.image}`}
                          alt="Product"
                          className="offer-add"
                          loading="lazy"
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && !isError && portraitProducts.length > 0 && (
          <div className="box">
            <div className="portrait-container2">
              {portraitProducts.map((portrait, index) => (
                <div key={index}>
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

        {/*  Show "No Ads" message if all 3 are empty */}
        {!isLoading && !isError &&
          bannerProducts.length === 0 &&
          portraitProducts.length === 0 &&
          noTitleProducts.length === 0 && (
            <div className="no-ads-message">
              <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
                There are no ads available at the moment.
              </p>
            </div>
          )}
      </div>

      <Footer />
    </>
  );
};

export default AdBanner;
