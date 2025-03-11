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
const CustomArrow = ({ src, onClick, className }) => (
  <img
    src={src}
    alt="Arrow"
    className={`custom-arrow ${className}`}
    onClick={onClick}
  />
);

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProductIds = JSON.parse(localStorage.getItem("Recently-viewed")) || [];
    if (!storedProductIds.length) return;

    const fetchProducts = async () => {
      try {
        const productResponses = await Promise.all(
          storedProductIds.map((id) => axios.get(`${ApiUrl}/recently-viewed-products/${id}`))
        );
        setRecentProducts(productResponses.map((res) => res.data[0]).filter(Boolean));
      } catch (error) {
        console.error("Error fetching recently viewed products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!recentProducts.length) return null;

  // Function to calculate discount percentage
  const getDiscountPercentage = (actualPrice, offerPrice, prodPrice) => {
    const price = offerPrice > 0 ? offerPrice : prodPrice;
    return Math.round(((actualPrice - price) / actualPrice) * 100);
  };

  // Reusable Product Card Component
  const ProductCard = ({ product }) => {
    let productImages;
    try {
      productImages = JSON.parse(product.prod_img);
    } catch {
      productImages = [];
    }
    const firstImage = productImages.length ? productImages[0] : "";

    return (
      <div
        key={product.id}
        className="recently-viewed-card"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
          alt={product.prod_name}
          className="recently-viewed-image"
        />
        <h3 className="recent-product-name">{product.prod_name}</h3>
        <span className="recent-product-subtitle">{product.subtitle}</span>
        <p>
          <span className="product-price">₹{product.offer_price > 0 ? product.offer_price : product.prod_price}</span>
          <span style={{ marginRight: "5px", fontSize: "15px" }}>M.R.P</span>
          <span className="product-actual-price" style={{ textDecoration: "line-through", color: "red" }}>
            ₹{product.actual_price}
          </span>
          <p style={{ color: "green", marginLeft: "10px", marginBottom: "10px" }}>
            ({getDiscountPercentage(product.actual_price, product.offer_price, product.prod_price)}% OFF)
          </p>
        </p>
      </div>
    );
  };

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 1 : 5, // Show 1 on mobile, 5 on desktop
    slidesToScroll: 1,
    prevArrow: <CustomArrow src={leftarrow} className="prev" />,
    nextArrow: <CustomArrow src={rightarrow} className="next" />,
  };

  return (
    <div className="recently-viewed-container">
      <h2 className="recently-viewed-title">Recently Viewed Products</h2>
      

      {/* Normal Grid View if products <= 5 (Desktop), otherwise enable slider */}
      {!isMobile && recentProducts.length <= 5 ? (
        <div className="recently-viewed-grid">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        // Slider View for Mobile or if products > 5
        <Slider {...sliderSettings} className="recently-viewed-slider">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default RecentlyViewed;
