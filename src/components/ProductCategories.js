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
import { useCart } from "../components/CartContext";

const ProductList = () => {
  const {
    // addToCart,
    // cartItems,
    // updateCartItemQuantity,
    addToWishlist,
    removeFromWishlist,
  } = useCart();
  const [productsByCategory, setProductsByCategory] = useState({});
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const categories = response.data.reduce((acc, category) => {
          const categoryName = category[0]?.category;
          if (categoryName) {
            acc[categoryName] = category;
          }
          return acc;
        }, {});
        setProductsByCategory(categories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product, event) => {
    event.stopPropagation();

    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

    if (!email || !username) {
      toast.error("User is not logged in!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.post(`${ApiUrl}/verify-user`, {
        email,
        username,
      });

      if (response.data.exists) {
        const cartKey = `${email}-cart`;
        const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];

        // Find existing item by id and category
        const existingItem = cartItems.find(
          (item) => item.id === product.id && item.category === product.category
        );

        if (existingItem) {
          // Increase the quantity if the product already exists in the cart
          existingItem.quantity += 1;
          toast.info(
            `Increased quantity of ${product.prod_name} in your cart!`,
            {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        } else {
          // Add new product to the cart
          cartItems.push({
            id: product.id,
            name: product.prod_name,
            price: product.prod_price,
            image: product.prod_img,
            description: product.prod_features,
            category: product.category,
            deliverycharge: product.deliverycharge,
            product_id: product.prod_id,
            actual_price: product.actual_price,
            quantity: 1,
          });

          toast.success(`${product.prod_name} has been added to your cart!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }

        // Save the updated cart in localStorage
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
      } else {
        toast.error("User not found!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error verifying user or updating cart:", error);
      toast.error("An error occurred while adding to cart.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        // progress: undefined,
      });
    }
  };
  const handleToggleFavorite = async (product, event) => {
    event.stopPropagation();
    const isFavorite = favorites[`${product.prod_name}-${product.id}`];

    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

    if (!email || !username) {
      toast.error("User is not logged in!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.post(`${ApiUrl}/verify-user`, {
        email,
        username,
      });

      if (response.data.exists) {
        if (isFavorite) {
          setFavorites((prevFavorites) => {
            const newFavorites = { ...prevFavorites };
            delete newFavorites[`${product.prod_name}-${product.id}`];
            return newFavorites;
          });
          removeFromWishlist(product.id);

          await axios.post(`${ApiUrl}/update-user-wishlist`, {
            email,
            username,
            action: "remove",
            product,
          });

          toast.info(`${product.prod_name} removed from your wishlist.`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          const wishlistKey = `${email}-wishlist`;
          const wishlistData =
            JSON.parse(localStorage.getItem(wishlistKey)) || [];
          const updatedWishlistData = wishlistData.filter(
            (item) => item.id !== product.id
          );
          localStorage.setItem(
            wishlistKey,
            JSON.stringify(updatedWishlistData)
          );

          const favouritesKey = "favourites";
          const currentFavourites = localStorage.getItem(favouritesKey) || "";
          const newFavourites = currentFavourites
            .split(",")
            .filter(
              (item) => item !== `faredheart-${product.prod_name}-${product.id}`
            )
            .join(",");
          localStorage.setItem(favouritesKey, newFavourites);
        } else {
          setFavorites((prevFavorites) => ({
            ...prevFavorites,
            [`${product.prod_name}-${product.id}`]: true,
          }));
          addToWishlist(product);

          await axios.post(`${ApiUrl}/update-user-wishlist`, {
            email,
            username,
            action: "add",
            product,
          });

          toast.success(`${product.prod_name} added to your wishlist!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          const wishlistKey = `${email}-wishlist`;
          const wishlistData =
            JSON.parse(localStorage.getItem(wishlistKey)) || [];

          wishlistData.push(product);
          localStorage.setItem(wishlistKey, JSON.stringify(wishlistData));

          const favouritesKey = "favourites";
          const currentFavourites = localStorage.getItem(favouritesKey) || "";
          const newFavourites = `${currentFavourites},faredheart-${product.prod_name}-${product.id}`;
          localStorage.setItem(favouritesKey, newFavourites);
        }
      } else {
        toast.error("User not found!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error verifying user or updating wishlist:", error);
      toast.error("An error occurred while updating wishlist.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    const updateFavorites = () => {
      const favouritesKey = "favourites";
      const currentFavourites = localStorage.getItem(favouritesKey) || "";
      const favouriteProducts = currentFavourites
        .split(",")
        .reduce((acc, item) => {
          if (item.startsWith("faredheart-")) {
            const [_, productName, productId] = item.split("-");
            acc[`${productName}-${productId}`] = true;
          }
          return acc;
        }, {});

      setFavorites(favouriteProducts);
    };

    // Initial fetch
    updateFavorites();

    // Set interval to fetch favorites every second
    const intervalId = setInterval(updateFavorites, 100);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to the product details page with the product ID
  };
  const renderCategoryRow = (categoryName, isAccessoryRow = false) => {
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

    return (
      <div key={categoryName} className="product-list-container">
        <div
          style={{ padding: "20px", position: "relative" }}
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
                <img width="20px" src={left} alt="" />
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
                <img width="20px" src={right} alt="" />
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
            onInit={(swiper) => console.log("Swiper initialized:", swiper)}
          >
            {combinedProducts.map((product, idx) => {
              const images = Array.isArray(product.prod_img)
                ? product.prod_img
                : JSON.parse(product.prod_img || "[]");
              const firstImage = images.length > 0 ? images[0] : null;
              return (
                <SwiperSlide
                  key={idx}
                  className={`product-slide ${
                    combinedProducts.length > 5 &&
                    idx === combinedProducts.length - 1
                      ? "last-product"
                      : ""
                  }`}
                >
                  <div
                    onClick={() => handleProductClick(product.id)}
                    className={`custom-slider-product ${
                      combinedProducts.length > 5 &&
                      idx === combinedProducts.length - 1
                        ? "blurred"
                        : ""
                    }`}
                  >
                    {product.offer_label && (
                      <div className="product-label">
                        {product.offer_label.charAt(0).toUpperCase() +
                          product.offer_label.slice(1)}
                      </div>
                    )}
                    {firstImage ? (
                      <img
                        src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                        alt={product.prod_name}
                        className="custom-slider-image"
                      />
                    ) : (
                      <div>No image available</div>
                    )}
                    <span
                      title="Add to Wishlist"
                      className={`favorite-icon ${
                        favorites[`${product.prod_name}-${product.id}`]
                          ? "filled"
                          : ""
                      }`}
                      onClick={(event) => handleToggleFavorite(product, event)}
                    >
                      {favorites[`${product.prod_name}-${product.id}`] ? (
                        <FaHeart />
                      ) : (
                        <FaRegHeart />
                      )}
                    </span>
                    <h3 className="custom-slider-name">{product.prod_name}</h3>
                    <span className="product-subtitle">{product.subtitle}</span>
                    <p className="product-actual-price">
                      <span
                        className="product-price"
                        style={{
                          color: "#27ae60",
                          fontWeight: "bold",
                          fontSize: "20px",
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
                    {/* {product.status === "unavailable" ? (
            <p 
              style={{
                color: "red",
                fontWeight: "bold",
                fontSize: "16px",
                textAlign: "center",
                marginTop: "10px",
                padding: "10px",
              }}
              className="custom-slider-out-of-stock"
            >
              Out of Stock
            </p>
          ) : (
            <button
              onClick={(event) => handleAddToCart(product, event)}
              className="custom-slider-add-to-cart"
            >
              Add to cart
            </button>
          )} */}
                  </div>

                  {combinedProducts.length > 5 &&
                    idx === combinedProducts.length - 1 && (
                      <div className="see-more-wrapper">
                        <button
                          onClick={() => {
                            if (
                              product.category === "Headphones" ||
                              product.category === "Speakers"
                            ) {
                              navigate(`/Headphones`);
                            } else if (
                              product.category === "ComputerAccessories" ||
                              product.category === "MobileAccessories" ||
                              product.category === "CCTVAccessories" ||
                              product.category === "PrinterAccessories"
                            ) {
                              navigate(`/ComputerAccessories`);
                            } else {
                              navigate(`/${product.category}`);
                            }
                          }}
                          className="see-more-btn"
                        >
                          VIEW MORE
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
