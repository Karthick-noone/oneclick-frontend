import { useEffect, useState } from "react";
import axios from "axios"; 
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./css/RecentlyViewed.css"; 
import { ApiUrl } from "./ApiUrl";
import leftarrow from "./img/left.png";
import rightarrow from "./img/right.png";
import { useNavigate } from "react-router-dom";


// Custom Arrow Component
const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return <img src={leftarrow} style={{ width: "35px", height:'35px' }}  alt="Prev" className="custom-arrow prev" onClick={onClick} />;
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return <img src={rightarrow} style={{ width: "35px", height:'35px' }} alt="Next" className="custom-arrow next" onClick={onClick} />;
};

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProductIds = JSON.parse(localStorage.getItem("Recently-viewed")) || [];

    if (storedProductIds.length === 0) return; // Stop execution if no stored product IDs

    const fetchProducts = async () => {
      try {
        const productRequests = storedProductIds.map((id) =>
          axios.get(`${ApiUrl}/recently-viewed-products/${id}`)
        );

        const productResponses = await Promise.all(productRequests);
        const products = productResponses.map((res) => res.data[0]);

        setRecentProducts(products.filter((product) => product)); // Remove null/undefined products
      } catch (error) {
        console.error("Error fetching recently viewed products:", error);
      }
    };

    fetchProducts();
  }, []);

  // If there are no products, do not render anything
  if (recentProducts.length === 0) return null;

  // Slider settings with custom arrows
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const handleCardClick = (product) => {
    // Check if product is defined and has an id
    if (product && product.id) {
      navigate(`/product/${product.id}`); // Navigate to the product details page
    } else {
      console.error("Product is undefined or missing ID:", product);
    }
  };


  return (
    <div className="recently-viewed-container">
      <h2 className="recently-viewed-title">Recently Viewed Products</h2>
      {recentProducts.length > 5 ? (
        <Slider {...sliderSettings} className="recently-viewed-slider">
          {recentProducts.map((product) => {
            const productImages = JSON.parse(product.prod_img);
            const firstImage = productImages[0];

            return (
              <div key={product.prod_id} className="recently-viewed-card"  onClick={() => handleCardClick(product)}>
                <img
                  src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                  alt={product.prod_name}
                  className="recently-viewed-image"
                />
                <h3 className="recent-product-name">{product.prod_name}</h3>
                <span className="recent-product-subtitle">{product.subtitle}</span>

                <p>
                    <span>
                      <span className="product-price">
                        ₹{product.offer_price > 0 ? product.offer_price : product.prod_price}
                      </span>
                      <span style={{ marginRight: "5px", fontSize: "15px" }}>
                        M.R.P
                      </span>
                      <span
                        className="product-actual-price"
                        style={{ textDecoration: "line-through", color:'red' }}
                      >
                        ₹{product.actual_price}
                      </span>
                    </span>
                    <p
                      style={{
                        color: "green",
                        marginLeft: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      (
                      {Math.round(
                        ((product.actual_price - (product.offer_price > 0 ? product.offer_price : product.prod_price)) /
                          product.actual_price) *
                          100
                      )}
                      % OFF)
                    </p>
                  </p>
              </div>
            );
          })}
        </Slider>
      ) : (
        <div className="recently-viewed-grid">
          {recentProducts.map((product) => {
            const productImages = JSON.parse(product.prod_img);
            const firstImage = productImages[0];

            return (
              <div key={product.prod_id} className="recently-viewed-card"  onClick={() => handleCardClick(product)}>
                <img
                  src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                  alt={product.prod_name}
                  className="recently-viewed-image"
                />
                <h3 className="recent-product-name">{product.prod_name}</h3>    
                <span className="recent-product-subtitle">{product.subtitle}</span>
                <p>
                    <span>
                      <span className="product-price">
                        ₹{product.offer_price > 0 ? product.offer_price : product.prod_price}
                      </span>
                      <span style={{ marginRight: "5px", fontSize: "15px" }}>
                        M.R.P
                      </span>
                      <span
                        className="product-actual-price"
                        style={{ textDecoration: "line-through", color:'red' }}
                      >
                        ₹{product.actual_price}
                      </span>
                    </span>
                    <p
                      style={{
                        color: "green",
                        marginLeft: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      (
                      {Math.round(
                        ((product.actual_price - (product.offer_price > 0 ? product.offer_price : product.prod_price)) /
                          product.actual_price) *
                          100
                      )}
                      % OFF)
                    </p>
                  </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
