import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import "./css/FullAdPage.css";
import { Link } from "react-router-dom";

const FullAdPage = () => {
  const [adImages, setAdImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdImages = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchsingleadpage`);
        setAdImages(response.data || []);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdImages();
  }, []);

// Memoize categoryMap so it's stable
const categoryMap = useMemo(
  () => ({
    TV: "TV",
    Speakers: "Speaker",
    // Add other mappings as needed
  }),
  []
);

const processedAds = useMemo(() => {
  return adImages.map((ad) => ({
    ...ad,
    mappedCategory: categoryMap[ad.category] || ad.category,
  }));
}, [adImages, categoryMap]); //  Added categoryMap


  return (
    <div className="full-page-container">
      {loading || processedAds.length === 0 ? (
        // Always display skeleton banner when loading or when there's no data
        <div className="skeleton-border">
        <div className="skeleton-ad-banner"></div></div>
      ) : (
        processedAds.map((ad, index) => (
          <div key={index} className="ad-image-container">
            <Link to={`/${ad.mappedCategory}`} className="ad-link">
              <div className="full-ad-card">
                <img
                  src={`${ApiUrl}/uploads/singleadpage/${ad.image}`}
                  alt={`Ad ${index + 1}`}
                  className="banner-image"
                  loading="lazy"
                />
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default FullAdPage;
