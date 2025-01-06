import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed and imported
import { ApiUrl } from "./ApiUrl"; // Import your API URL
import "./css/FullAdPage.css"; // Import the CSS file
import { Link } from "react-router-dom";

const FullAdPage = () => {
  const [adImages, setAdImages] = useState([]); // State to hold the array of ad images
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Function to fetch the images
    const fetchAdImages = async () => {
      try {
        // Fetch data from your API
        const response = await axios.get(`${ApiUrl}/fetchsingleadpage`);
        setAdImages(response.data); // Assuming the API returns an array of images
        setLoading(false);
      } catch (err) {
        console.error("Error fetching the images:", err);
        setError("Failed to load images");
        setLoading(false);
      }
    };

    fetchAdImages();
  }, []);

  if (loading) return <div>Loading...</div>; // Display a loading indicator
  if (error) return <div>{error}</div>; // Display error message if fetching fails

  const categoryMap = {
    TV: "Television",
    Speakers: "Speaker",
    // Add other mappings as needed
  };
  return (
    <div className="full-page-container">
    {adImages.length > 0 ? (
      adImages.map((ad, index) => (
        <div key={index} className="ad-image-container">
          <Link
            style={{ textDecoration: "none" }}
            to={`/${categoryMap[ad.category] || ad.category}`}
          >
            <div className="full-ad-card">
              <img
                src={`${ApiUrl}/uploads/singleadpage/${ad.image}`} // Adjust path as needed
                alt={`Ad ${index + 1}`}
                // className="full-page-image"
                className="bannner-image"

                loading="lazy"
                // style={{ width: '1250px', marginTop: '20px', height: 'auto' }} // Styling for the image

              />
            </div>
          </Link>
          {/* Uncomment if you want to display the category or overlay content */}
          {/* <div>{ad.category}</div> */}
          {/* <div className="overlay-content">
                          <button className="shop-now-button">Shop Now</button>
                      </div> */}
        </div>
      ))
    ) : (
      <p>No ads available</p>
    )}
  </div>
  
  );
};

export default FullAdPage;
