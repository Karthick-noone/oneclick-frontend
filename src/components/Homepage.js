import React, { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import "./css/Homepage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
const fetchHomepageData = async () => {
  const response = await axios.get(`${ApiUrl}/fetchedithomepage`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating delay
  return response.data || [];
};

const Homepage = () => {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["homepageData"],
    queryFn: fetchHomepageData,
    staleTime: Infinity, // Keeps data fresh until manual refetch
    cacheTime: 100000, // 5 minutes before unused cache is garbage collected
    refetchOnWindowFocus: false, // Prevents refetch when switching tabs
  });
  

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
        {isLoading ? (
          <div className="skeleton-container">
            <div className="skeleton-slide"></div>
          </div>
        ) : isError ? (
          <div className="error-message">Error fetching data</div>
        ) : data.length > 0 ? (
          <Slider {...sliderSettings}>
            {data.map((item, index) => (
              <div key={index} className="slider-image-container">
                <Link to={`/${item.category}`} className="shop-button-link">
                  <img
                    src={`${ApiUrl}/uploads/edithomepage/${item.image}`}
                    alt={`Ad ${index + 1}`}
                    className="slider-image"
                    // loading="lazy"
                  />
                </Link>
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
