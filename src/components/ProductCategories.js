import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./css/productcategories.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ApiUrl } from "./ApiUrl";
import left from "./img/left.png";
import right from "./img/right.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify
// import { useCart } from "../components/CartContext";
import Swal from "sweetalert2";

const ProductList = () => {
  // const {
  //   // addToCart,
  //   // cartItems,
  //   // updateCartItemQuantity,
  //   addToWishlist,
  //   removeFromWishlist,
  // } = useCart();
  const [productsByCategory, setProductsByCategory] = useState({});
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const swiperRefs = {
    Mobiles: useRef(null),
    Computers: useRef(null),
    CCTV: useRef(null),
    Printers: useRef(null),
    Accessories: useRef(null), // For combined accessories categories
    HeadphonesAndSpeakers: useRef(null), // For combined category
  };

  useEffect(() => {
    axios
      .get(`${ApiUrl}/api/products`)
      .then((response) => {
        // Group products by category
        const categories = response.data.reduce((acc, product) => {
          const categoryName = product.category;
          if (categoryName) {
            if (!acc[categoryName]) {
              acc[categoryName] = []; // Initialize array for category
            }
            acc[categoryName].push(product); // Add product to the category array
          }
          return acc;
        }, {}); // Initial accumulator is an empty object

        setProductsByCategory(categories);
        // console.log("Grouped Product Categories", categories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleToggleFavorite = async (product, event) => {
    event.stopPropagation();

    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

    if (!email || !username) {
      toast.error("User is not logged in!", {
        position: "top-right",
        autoClose: 2000,
      });
      window.location.href = "/login";
      return;
    }

    try {
      const isFavorite = favorites[`${product.id}`];

      if (isFavorite) {
        // Optimistically update UI
        setFavorites((prev) => {
          const updated = { ...prev };
          delete updated[`${product.id}`];
          return updated;
        });

        await axios.post(`${ApiUrl}/remove-from-wishlist`, {
          email,
          productId: product.id,
        });

        window.dispatchEvent(new Event("wishlist-updated"));
        Swal.fire({
          toast: true,
          position: 'top-end',
          text: "Item removed from your wishlist",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        // Optimistically update UI
        setFavorites((prev) => ({
          ...prev,
          [`${product.id}`]: true,
        }));

        await axios.post(`${ApiUrl}/update-user-wishlist`, {
          email,
          username,
          action: "add",
          prod_id: product.id,
        });

        window.dispatchEvent(new Event("wishlist-updated"));
        Swal.fire({
          toast: true,
          position: 'top-end',
          text: "Item added to your wishlist",
          icon: "success",
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("An error occurred while updating wishlist.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      const email = localStorage.getItem("email");
      const username = localStorage.getItem("username");

      if (!email || !username) {
        console.log("No email/username found, skipping wishlist fetch.");
        return;
      }

      try {
        const response = await axios.post(`${ApiUrl}/fetchwishlist`, {
          email,
          username,
        });

        if (response.data.wishlist) {
          const wishlist = response.data.wishlist;
          const favoritesMap = {};

          wishlist.forEach((item) => {
            favoritesMap[`${item}`] = true;
          });

          setFavorites(favoritesMap);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    // Fetch wishlist immediately on mount
    fetchWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      console.log("[Event] Wishlist updated, fetching...");
      fetchWishlist();
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);

  // useEffect(() => {
  //   const updateFavorites = () => {
  //     const favouritesKey = "favourites";
  //     const currentFavourites = localStorage.getItem(favouritesKey) || "";
  //     const favouriteProducts = currentFavourites
  //       .split(",")
  //       .reduce((acc, item) => {
  //         if (item.startsWith("faredheart-")) {
  //           const [_, productName, productId] = item.split("-");
  //           acc[`${productName}-${productId}`] = true;
  //         }
  //         return acc;
  //       }, {});

  //     setFavorites(favouriteProducts);
  //   };

  //   // Initial fetch
  //   updateFavorites();

  //   // Set interval to fetch favorites every second
  //   const intervalId = setInterval(updateFavorites, 100);

  //   // Clear interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  const handleProductClick = (product) => {

    // const slugify = (name) =>
    //   name
    //     .toLowerCase()
    //     .replace(/\s+/g, "-")
    //     .replace(/[^\w-]+/g, "");

    // navigate(`/shop/${product.id}-${slugify(product.prod_name)}`);

    if (product && product.id) {
      const now = Date.now();

      let storedData = localStorage.getItem("Recently-viewed");
      let parsedData = [];

      try {
        parsedData = storedData ? JSON.parse(storedData) : [];
      } catch (err) {
        console.error("Failed to parse Recently-viewed:", err);
      }

      // Remove if already exists
      parsedData = parsedData.filter((item) => item.id !== product.id);

      // Add current item with timestamp
      parsedData.unshift({
        id: product.id,
        timestamp: now,
      });

      // Keep only last 10
      parsedData = parsedData.slice(0, 10);

      localStorage.setItem("Recently-viewed", JSON.stringify(parsedData));

      const slugify = (name) =>
        name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

      navigate(`/shop/${product.id}-${slugify(product.prod_name)}`);
    }
  };
  const renderCategoryRow = (categoryName = false) => {
    // Combine products for the accessory row (Headphones + Speakers or all Accessories)
    const combinedProducts =
      categoryName === "HeadphonesAndSpeakers"
        ? [
          ...(productsByCategory["Headphones"] || []),
          ...(productsByCategory["Speakers"] || []),
        ]
        : categoryName === "Accessories"
          ? [
            ...(productsByCategory["ComputerAccessories"] || []),
            ...(productsByCategory["MobileAccessories"] || []),
            ...(productsByCategory["CCTVAccessories"] || []),
            ...(productsByCategory["PrinterAccessories"] || []),
          ]
          : productsByCategory[categoryName] || [];

    if (!loading && combinedProducts.length === 0) return null;


    return (


      <div key={categoryName} className="product-list-container">


        <div
          style={{ padding: "10px", position: "relative", marginTop:'10px' }}
          className="space"
        >
          {/* Custom navigation buttons */}
          {combinedProducts.length > 5 && (
            <>
              <button
                className="prev-btn"
                style={{
                  fontSize: "20px",
                  padding: "10px",
                  border: "none",
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  zIndex: "10",
                  borderRadius: "50%",
                }}
                onClick={() =>
                  swiperRefs[categoryName]?.current?.swiper.slidePrev()
                }
              >
                <img width="20px" loading="lazy" src={left} alt="" />
              </button>
              <button
                className="next-btn"
                style={{
                  fontSize: "20px",
                  padding: "10px",
                  border: "none",
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  zIndex: "10",
                  borderRadius: "50%",
                }}
                onClick={() =>
                  swiperRefs[categoryName]?.current?.swiper.slideNext()
                }
              >
                <img loading="lazy" width="20px" src={right} alt="" />
              </button>
            </>
          )}

          {/* Swiper Component */}
          <Swiper
            ref={swiperRefs[categoryName]}
            spaceBetween={20}
            slidesPerView={5}
            loop={false}
            breakpoints={{
              // For large screens (1024px and up)
              1024: { slidesPerView: 5 },
              // For medium screens (768px and down)
              768: { slidesPerView: 3 },
              // For small screens (480px and down)
              480: { slidesPerView: 2 },
              // For extra small screens (320px and down)
              320: { slidesPerView: 2 },
            }}
          // onInit={(swiper) => console.log("Swiper initialized:", swiper)}
          >
            {loading || combinedProducts.length === 0
              ? [...Array(5)].map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="skeletonproductcard">
                    <div className="skeletonimage"></div>
                    <div className="skeletontext"></div>
                    <div className="skeletontext short"></div>
                    <div className="skeletonprice"></div>
                  </div>
                </SwiperSlide>
              ))
              : combinedProducts.map((product, idx) => {
                const images = Array.isArray(product.prod_img)
                  ? product.prod_img
                  : JSON.parse(product.prod_img || "[]");
                const firstImage = images.length > 0 ? images[0] : null;
                return (
                  <SwiperSlide
                    key={idx}
                    className={`product-slide ${combinedProducts.length > 5 &&
                      idx === combinedProducts.length - 1
                      ? "last-product"
                      : ""
                      }`}
                  >
                    <div
                      onClick={() => handleProductClick(product)}
                      className={`custom-slider-product ${combinedProducts.length > 5 &&
                        idx === combinedProducts.length - 1
                        ? "blurred"
                        : ""
                        }`}
                    >
                      {product.offer_label && (
                        <div className="product-label"
                          style={{ marginTop: '5px' }}

                        >
                          {product.offer_label.charAt(0).toUpperCase() +
                            product.offer_label.slice(1)}
                        </div>
                      )}
                      {firstImage ? (
                        <img
                          src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                          alt={product.prod_name}
                          className="custom-slider-image"
                          loading="lazy"
                        />
                      ) : (
                        <div>No image available</div>
                      )}
                      <span
                        title={
                          favorites[`${product.id}`]
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                        className={`favourite-icon ${favorites[`${product.id}`] ? "filled" : ""
                          }`}
                        onClick={(event) => handleToggleFavorite(product, event)} // Unified handler
                      >
                        {favorites[`${product.id}`] ? (
                          <FaHeart style={{ color: "red" }} /> // Filled heart
                        ) : (
                          <FaRegHeart /> // Empty heart
                        )}
                      </span>


                      <h3 className="custom-slider-name" title={product.prod_name}>
                        {product.prod_name}
                      </h3>
                      {product.subtitle && (
                        <span className="custom-slider-subtitle">
                          {product.subtitle}
                        </span>
                      )}
                      <p className="product-actual-price">
                        <span
                          className="product-price"
                          style={{
                            color: "#27ae60",
                            fontWeight: "bold",
                            // fontSize: "20px",
                          }}
                        >
                          ₹{product.prod_price}
                        </span>
                        <span>
                          <span
                            style={{
                              color: "black",
                              marginLeft: "5px",
                              marginRight: "3px",
                            }}
                          >
                            M.R.P
                          </span>
                          <span
                            className="product-MRP-price"
                            style={{
                              textDecoration: "line-through",
                              color: "red",
                            }}
                          >
                            ₹{product.actual_price}
                          </span>
                        </span>
                        <br />
                        <span
                          className="discount"
                          style={{ color: "green", marginLeft: "5px" }}
                        >
                          (
                          {Math.round(
                            ((product.actual_price - product.prod_price) /
                              product.actual_price) *
                            100
                          )}
                          % OFF)
                        </span>
                      </p>

                    </div>

                    {combinedProducts.length > 5 &&
                      idx === combinedProducts.length - 1 && (
                        <div className="see-more-wrapper">

                          <button
                            className="animated-button"
                            onClick={() => {
                              const lastProductCategory =
                                combinedProducts[combinedProducts.length - 1]
                                  .category;
                              navigate(`/${lastProductCategory}`);
                            }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="arr-2"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                            </svg>
                            <span className="text">View More</span>
                            <span className="circle"></span>
                            <svg
                              viewBox="0 0 24 24"
                              className="arr-1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                            </svg>
                          </button>
                        </div>
                      )}
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>

    );
  };

  // Call renderCategoryRow with appropriate categories
  return (
    <>
      <h2>Featured Products</h2>

      <ToastContainer />

      {["Mobiles", "Computers", "CCTV", "Printers"].map((category) =>
        renderCategoryRow(category)
      )}
      {renderCategoryRow("HeadphonesAndSpeakers")}
      {renderCategoryRow("Accessories")}
    </>
  );
};

export default ProductList;