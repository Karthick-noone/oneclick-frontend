import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import "./css/Homepage.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Homepage = () => {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${ApiUrl}/fetchedithomepage`)
      .then((response) => {
        console.log('Response from API:', response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    afterChange: (current) => setActiveIndex(current),
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className="box2">
    <div className="homepage-container">
      {data.length > 0 ? (
        <>
          <Slider {...sliderSettings}>
            {data.map((item, index) => (
              <div key={index} className="slider-image-container">
                <a href={`/${data[activeIndex]?.category}`} className="shop-button-link">
                  <img
                    src={`${ApiUrl}/uploads/edithomepage/${item.image}`}
                    alt={`Ad ${index + 1}`}
                    className="slider-image"
                  />
                </a>
              </div>
            ))}
          </Slider>
          {/* Custom Dots */}
          {/* <div className="custom-dotss">
            {data.map((_, index) => (
              <button
                key={index}
                className={`dott ${activeIndex === index ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div> */}
        </>
      ) : (
        <div className="spinner-container">
          <div className="spinner">
            {/* Spinner content here */}
          </div>
        </div>
      )}
    </div></div>
  );
};

export default Homepage;
