import React, { useState, useEffect, useCallback, useMemo } from "react";
import Slider from "react-slick";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import "./css/Homepage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Homepage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchedithomepage`);
        console.log("Response from API:", response.data);
        setData(response.data || []); // Ensure data is always an array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Memoized Custom Arrows to prevent unnecessary re-renders
  const CustomPrevArrow = useCallback(({ onClick }) => (
    <button className="slider-prev-arrow" onClick={onClick}>
      ◄
    </button>
  ), []);

  const CustomNextArrow = useCallback(({ onClick }) => (
    <button className="slider-next-arrow" onClick={onClick}>
      ►
    </button>
  ), []);

  // Memoized Slider Settings
  const sliderSettings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  }), [CustomPrevArrow, CustomNextArrow]);

  return (
    <div className="box2">
      <div className="homepage-container">
        {data.length > 0 ? (
          <Slider {...sliderSettings}>
            {data.map((item, index) => (
              <div key={index} className="slider-image-container">
                <a href={`/${item.category}`} className="shop-button-link">
                  <img
                    src={`${ApiUrl}/uploads/edithomepage/${item.image}`}
                    alt={`Ad ${index + 1}`}
                    className="slider-image"
                    loading="lazy"
                  />
                </a>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="spinner-container">
            <div className="spinner">
              {/* Spinner content here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
