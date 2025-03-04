import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import "./css/FullAdPage.css";
import { Link } from "react-router-dom";

const FullAdPage = () => {
  const [adImages, setAdImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdImages = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchsingleadpage`);
        setAdImages(response.data || []);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchAdImages();
  }, []);

  const categoryMap = {
    TV: "Television",
    Speakers: "Speaker",
    // Add other mappings as needed
  };

  // Preprocess ads for efficiency
  const processedAds = useMemo(() => {
    return adImages.map((ad) => ({
      ...ad,
      mappedCategory: categoryMap[ad.category] || ad.category,
    }));
  }, [adImages]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="full-page-container">
      {processedAds.length > 0 ? (
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
      ) : (
        <p>No ads available</p>
      )}
    </div>
  );
};

export default FullAdPage;
