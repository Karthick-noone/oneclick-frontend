import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import "./css/Homepage.css"; // Ensure your styles are correctly imported

const Homepage = () => {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${ApiUrl}/fetchedithomepage`)
      .then((response) => {
        console.log('Response from API:', response.data); // Log the response data
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Slider settings for multiple images
  const sliderSettings = {
    dots: false, // Disable dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    beforeChange: (current, next) => setActiveIndex(next), // Update active index before changing slide
  };

  return (
    <div className="homepage-container">
      {data.length > 0 ? (
        <>
          {/* Slider for images */}
          <Slider {...sliderSettings}>
            {data.map((item, index) => (
              <div key={index} className="slider-image-container">
                <img
                  src={`${ApiUrl}/uploads/edithomepage/${item.image}`}
                  alt={`Ad ${index + 1}`}
                  className="slider-image"
                  loading="lazy"
                />
              </div>
            ))}
          </Slider>

          {/* Display details for the active index */}
          <div className="text-overlay">
            <h1 className="overlay-title">{data[activeIndex]?.title}</h1>
            <p className="overlay-description">{data[activeIndex]?.description}</p>
            {/* <p className="overlay-category">Category: {data[activeIndex]?.category}</p> */}
            <a href={`/${data[activeIndex]?.category}`} className="shop-button-link">
              <button className="shop-button">Shop Now</button>
            </a>
          </div>
        </>
      ) : (
        <div className="spinner-container">
          <div className="spinner">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="spinner-blade"></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
