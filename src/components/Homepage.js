import React, {  useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import "./css/Homepage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

//  Remove delay for production use
const fetchHomepageData = async () => {
  const response = await axios.get(`${ApiUrl}/fetchedithomepage`);
  return response.data || [];
};

const Homepage = () => {
  const {
    data = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["homepageData"],
    queryFn: fetchHomepageData,
    staleTime: 1000 * 60 * 10,     //  10 minutes: considered fresh
    cacheTime: 1000 * 60 * 15,     //  15 minutes: kept in memory
    refetchOnWindowFocus: false,  //  Prevent refetch on tab focus
    refetchOnMount: false,        //  Don't refetch on remount
    refetchOnReconnect: false     //  Don't refetch on network reconnect
  });

const CustomPrevArrow = ({ onClick }) => (
  <button className="slider-prev-arrow" onClick={onClick}>
    ◄
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button className="slider-next-arrow" onClick={onClick}>
    ►
  </button>
);

  const sliderSettings = useMemo(() => ({
    dots: data.length > 1,
    infinite: data.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: data.length > 1,
    autoplay: data.length > 1,
    draggable: data.length > 1,
    autoplaySpeed: 5000,
    arrows: data.length > 1,
    prevArrow: data.length > 1 ? <CustomPrevArrow /> : null,
    nextArrow: data.length > 1 ? <CustomNextArrow /> : null
  }), [data.length]);


  return (
    <div className="box2" >
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
              <div key={index} className="slider-image-container" tabIndex={-1}>
                <Link to={`/${item.category === "Home" ? "" : item.category}`} className="shop-button-link">
                  <img
                    src={`${ApiUrl}/uploads/edithomepage/${item.image}`}
                    alt={`Ad ${index + 1}`}
                    className="slider-image"
                    style={{outline:'none'}}
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
