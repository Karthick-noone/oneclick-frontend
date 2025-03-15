import React, { useState, useEffect, useCallback, useMemo } from "react";
import Slider from "react-slick";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import "./css/Homepage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Homepage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchedithomepage`);
        // Simulate network delay for testing skeleton
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Response from API:", response.data);
        setData(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        {loading ? (
          <div className="skeleton-container">
            {[...Array(1)].map((_, index) => (
              <div key={index} className="skeleton-slide"></div>
            ))}
          </div>
        ) : data.length > 0 ? (
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
          <div className="no-data-message">No data available</div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
