import React, { useState, useEffect } from "react";
import axios from "axios";
// import Header1 from "./Header1";
import Header2 from "./Header2";
// import Header3 from "./Header3";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import "./css/Computers.css";
import { useCart } from "../components/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ApiUrl } from "./ApiUrl";
import { useNavigate, useLocation } from "react-router-dom";

// Define a fallback image URL
// const fallbackImage = require('./img/laptop.jpg'); // Replace with a valid fallback image

const CCTVAccessories = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState({});
   const [, setIsAdding] = useState(false); // Track the adding state to prevent multiple clicks
  const [loading, setLoading] = useState(true);


  
  // const {
  //   cartItems,
  //   addToCart,
  //   updateCartItemQuantity,
  //   addToWishlist,
  //   removeFromWishlist,
  // } = useCart();

  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search");

  // Log the raw search query
  console.log("Search Query:", searchQuery);

  // Normalize a string by trimming, lowercasing, and removing all spaces
  const normalizeString = (str) =>
    str.trim().toLowerCase().replace(/\s+/g, "");

  // Normalize the search query (if it exists)
  const normalizedSearchQuery = searchQuery 
    ? normalizeString(searchQuery)
    : "";

  // Filter products based on the normalized, concatenated prod_name and prod_features
  const filteredProducts = searchQuery
    ? products.filter((product) => {
        // Concatenate prod_name and prod_features
        const prodName = product.prod_name || "";
        const prodFeatures = product.prod_features || "";
        const combinedString = normalizeString(prodName + " " + prodFeatures);

        // Log the combined string for debugging
        console.log(
          `Combined string for product: ${prodName} => ${combinedString}`
        );

        // Check if the combined string contains the normalized search query
        return combinedString.includes(normalizedSearchQuery);
      })
    : products; // If no search query, return all products // If no search query, return all products

  const [coupons, setCoupons] = useState({}); // State to store coupons

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${ApiUrl}/fetchcctvaccessories`);
        const fetchedProducts = response.data;

        // Set products to state
        setProducts(fetchedProducts);

        // Fetch coupons for each product
        for (const product of fetchedProducts) {
          try {
            const couponResponse = await axios.get(
              `${ApiUrl}/coupons/${product.prod_id}`
            );
            // Assuming couponResponse.data.coupons returns an array of coupons
            if (couponResponse.data.coupons.length > 0) {
              // Set the first coupon code for the product
              setCoupons((prev) => ({
                ...prev,
                [product.prod_id]: couponResponse.data.coupons[0].coupon_code, // Use coupon_code from the first coupon
              }));
              console.log(
                `Set coupon code for product ${product.prod_id}: ${couponResponse.data.coupons[0].coupon_code}`
              );
            } else {
              console.log(`No coupons found for product ${product.prod_id}`);
            }
          } catch (couponError) {
            console.error(
              `Failed to fetch coupon for product ${product.prod_id}:`,
              couponError
            );
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchProducts();
  }, []);

    const [isOfferActive, setIsOfferActive] = useState(true);
      const [product, setProduct] = useState(null);
  
       useEffect(() => {
          const now = new Date();
          // console.log("Current Time:", now.toLocaleString());
        
          const activeProduct = products.find((item) => {
            if (!item.offer_start_time || !item.offer_end_time) {
              // console.log(`Skipping product ${item.prod_name} due to missing offer times.`);
              return false;
            }
        
            const offerStartTime = new Date(item.offer_start_time);
            const offerEndTime = new Date(item.offer_end_time);
        
            // console.log(
            //   `Checking product: ${item.prod_name}, Offer Start: ${offerStartTime.toLocaleString()}, Offer End: ${offerEndTime.toLocaleString()}`
            // );
        
            return offerStartTime <= now && offerEndTime > now;
          });
        
          if (activeProduct) {
            // console.log("Active Product Found:", activeProduct);
          } else {
            // console.log("No active product with a valid offer.");
          }
        
          setProduct(activeProduct || null);
          setIsOfferActive(!!activeProduct);
        
          // console.log(`Is Offer Active: ${!!activeProduct ? "Yes" : "No"}`);
        }, [products]);

  const handleBuyNow = (product, event) => {
    event.stopPropagation(); // Prevent the event from bubbling up

    // Check if the user is logged in
    const email = localStorage.getItem("email");
    if (!email) {
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

    // Navigate to the purchase page with product details
    navigate("/purchase", {
      state: { product, email }, // Pass the product details and email (if needed)
    });
    console.log("product", product);
  };

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
  //   const intervalId = setInterval(updateFavorites, 1000);

  //   // Clear interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  // const handleCardClick = (product) => {
  //   setSelectedProduct(product);
  // };

  const handleCardClick = (product) => {
    if (product && product.id) {
      // Retrieve existing recently viewed products
      let storedProductIds = localStorage.getItem("Recently-viewed");
  
      if (storedProductIds) {
        try {
          storedProductIds = JSON.parse(storedProductIds);
          
          // Ensure it's an array
          if (!Array.isArray(storedProductIds)) {
            storedProductIds = [storedProductIds]; 
          }
        } catch (error) {
          console.error("Error parsing Recently Viewed data:", error);
          storedProductIds = [];
        }
      } else {
        storedProductIds = [];
      }
  
      // Remove the product ID if it already exists (to avoid duplicates)
      storedProductIds = storedProductIds.filter((id) => id !== product.id);
  
      // Add the new product ID to the beginning of the list
      storedProductIds.unshift(product.id);
  
      // Keep only the last 10 recently viewed products
      storedProductIds = storedProductIds.slice(0, 10);
  
      // Save back to localStorage
      localStorage.setItem("Recently-viewed", JSON.stringify(storedProductIds));
  
      // Navigate to product details page
      navigate(`/product/${product.id}`);
    } else {
      console.error("Product is undefined or missing ID:", product);
    }
  };
  

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleNextProduct = () => {
    if (selectedProduct) {
      const currentIndex = products.findIndex(
        (p) => p.id === selectedProduct.id
      );
      const nextIndex = (currentIndex + 1) % products.length;
      setSelectedProduct(products[nextIndex]);
    }
  };

  const handlePrevProduct = () => {
    if (selectedProduct) {
      const currentIndex = products.findIndex(
        (p) => p.id === selectedProduct.id
      );
      const prevIndex = (currentIndex - 1 + products.length) % products.length;
      setSelectedProduct(products[prevIndex]);
    }
  };

  const handleAddToCart = async (product, event) => {
    event.stopPropagation(); // Prevent the event from bubbling up

    const email = localStorage.getItem("email");

    // Check if the user is logged in
    if (!email) {
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

    // Set isAdding to true to disable the button while the request is in progress
    setIsAdding(true);

    try {
      const response = await axios.post(`${ApiUrl}/add-to-cart`, {
        email,
        productId: product.id, // Send the product ID to be added to the cart
        quantity: 1,
      });

      // Handle the response
      if (response.status === 200) {
        toast.success(`${product.prod_name} added to your cart!`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      // Reset isAdding to false when the request is completed
      setIsAdding(false);
    }
  };
  const handleToggleFavorite = async (product, event) => {
    event.stopPropagation();

    // Check if the user is logged in
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
      const isFavorite = favorites[`${product.id}`]; // Check if product is already in the wishlist

      if (isFavorite) {
        // If already in wishlist, call remove API
        console.log(
          `${product.prod_name} (ID: ${product.id}) is in the wishlist. Removing it.`
        );

        await axios.post(`${ApiUrl}/remove-from-wishlist`, {
          email,
          productId: product.id,
        });

        console.log(
          `${product.prod_name} (ID: ${product.id}) has been removed from the wishlist.`
        );
        toast.info(`${product.prod_name} removed from your wishlist!`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        // If not in wishlist, call add API
        console.log(
          `${product.prod_name} (ID: ${product.id}) is not in the wishlist. Adding it.`
        );

        await axios.post(`${ApiUrl}/update-user-wishlist`, {
          email,
          username,
          action: "add",
          prod_id: product.id,
        });

        console.log(
          `${product.prod_name} (ID: ${product.id}) has been added to the wishlist.`
        );
        toast.success(`${product.prod_name} added to your wishlist!`, {
          position: "top-right",
          autoClose: 2000,
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
        console.log("User not logged in");
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

          // Set the favorites map based on product IDs in the wishlist
          wishlist.forEach((item) => {
            favoritesMap[`${item}`] = true; // Mark product ID as in wishlist
          });

          setFavorites(favoritesMap); // Update the favorites state
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    // Fetch wishlist immediately
    fetchWishlist();

    // Set an interval to fetch the wishlist every second
    const intervalId = setInterval(() => {
      fetchWishlist();
    }, 1000); // Update every second (1000ms)

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("User is not logged in!");
      return;
    }

    try {
      const response = await axios.post(`${ApiUrl}/remove-from-wishlist`, {
        email,
        productId,
      });

      if (response.status === 200) {
        toast.success("Item removed from wishlist");
        // Update the wishlist in the state
        // setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  // Define the category variable
  const category = "cctvaccessories";

  // offerPercentage = ((actual_price - prod_price) / actual_price) * 100

  return (
    <div className="computers-page">
      {/* <Header1 /> */}
      <Header2 category={category} />
      {/* <Header3 /> */}
      <span style={{ marginLeft: "20px", padding: "10px" }}>
        <a style={{ textDecoration: "none", color: "black" }} href="/">
          Home{" "}
        </a>
        &gt; CCTVAccessories
      </span>
      <div className="main-content">
        <Sidebar />
        <div className="product-list">
          {loading ? (
        // 1. Loading state
         [...Array(8)].map((_, index) => (
          <div key={index} className="skeleton-product-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
            <div className="skeleton-price"></div>
            <div className="skeleton-buttons"></div>
          </div>
        ))
      ) : products.length === 0 ? (
            <div className="no-products-message">
              <h2>No products here yet...</h2>
              <p>
                In the meantime, you can choose a different category to continue
                shopping.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            // If filteredProducts is empty, fallback to using all products
            products.map((product) => {
              // Parse the prod_img if it's a JSON string; assuming it's an array
              const images = Array.isArray(product.prod_img)
                ? product.prod_img
                : JSON.parse(product.prod_img);
              const firstImage = images[0]; // Get the first image

              return (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleCardClick(product)}
                >
                  <div className="product-actions">
                    <img
                      src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${
                        firstImage
                      }`}
                      alt={product.prod_name}
                      className="product-image"
                    loading="lazy"

                    />
                    <span
                      title={
                        favorites[`${product.id}`]
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                      className={`favorite-icon ${
                        favorites[`${product.id}`] ? "filled" : ""
                      }`}
                      onClick={(event) => handleToggleFavorite(product, event)} // Unified handler
                    >
                      {favorites[`${product.id}`] ? (
                        <FaHeart style={{ color: "red" }} /> // Filled heart
                      ) : (
                        <FaRegHeart /> // Empty heart
                      )}
                    </span>
                  </div>

                  <h3 className="product-name">{product.prod_name.charAt(0).toUpperCase()+product.prod_name.slice(1)}</h3>

                  {/* <h3 className="product-name">{product.offer_price}</h3> */}
                  <span className="product-subtitle2">{product.subtitle}</span>
                  {/* <p className="product-description">
                            {product.prod_features}
                          </p> */}
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
                  {product.status === "unavailable" ? (
                    <p
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                        marginTop: "10px",
                        padding: "10px",
                        // border: "2px solid red",
                        // borderRadius: "5px",
                        // backgroundColor: "#fdd",
                      }}
                      className="out-of-stock"
                    >
                      Out of Stock
                    </p>
                  ) : (
                    <div className="btn-container">
                      <button
                        onClick={(event) => handleAddToCart(product, event)}
                        className="addToCart"
                        title="Add To Cart"
                      >
                        ADD TO CART
                      </button>
                      <button
                        title="Buy Now"
                        onClick={(event) => handleBuyNow(product, event)}
                        className="buy-now"
                      >
                        BUY NOW
                      </button>
                    </div>
                  )}
                  <>
                    <br />
                    {/* {coupons[product.prod_id] && ( // Access using prod_id
                <div className="laptops-product-coupon" style={{ marginBottom:'5px', textAlign: "center" }}>
                  <span>
                    Coupon Available
                  </span>
                </div>
              )} */}
                  </>
                </div>
              );
            })
          ) : (
            // If filteredProducts has results, display them
            filteredProducts.map((product) => {
              const images = Array.isArray(product.prod_img)
                ? product.prod_img
                : JSON.parse(product.prod_img);
              const firstImage = images[0];

              return (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleCardClick(product)}
                >
                  {product.offer_label && (
                    <div className="product-label">{product.offer_label}</div>
                  )}

                  <div className="product-actions">
                    <img
                      src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${
                        firstImage
                      }`}
                      alt={product.prod_name}
                      className="product-image"
                    loading="lazy"

                    />
                    <span
                      title={
                        favorites[`${product.id}`]
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                      className={`favorite-icon ${
                        favorites[`${product.id}`] ? "filled" : ""
                      }`}
                      onClick={(event) => handleToggleFavorite(product, event)} // Unified handler
                    >
                      {favorites[`${product.id}`] ? (
                        <FaHeart style={{ color: "red" }} /> // Filled heart
                      ) : (
                        <FaRegHeart /> // Empty heart
                      )}
                    </span>
                  </div>

                  <h3 className="product-name">{product.prod_name.charAt(0).toUpperCase()+product.prod_name.slice(1)}</h3>
                  <span className="product-subtitle2">{product.subtitle}</span>
                  {/* <p className="product-description">
                            {product.prod_features}
                          </p> */}

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

                  {product.status === "unavailable" ? (
                    <p
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        fontSize: "16px",
                        textAlign: "center",
                        marginTop: "10px",
                        padding: "10px",
                        // border: "2px solid red",
                        // borderRadius: "5px",
                        // backgroundColor: "#fdd",
                      }}
                      className="out-of-stock"
                    >
                      Out of Stock
                    </p>
                  ) : (
                    <div className="btn-container">
                      <button
                        onClick={(event) => handleAddToCart(product, event)}
                        className="addToCart"
                        title="Add To Cart"
                      >
                        ADD TO CART
                      </button>
                      <button
                        title="Buy Now"
                        onClick={(event) => handleBuyNow(product, event)}
                        className="buy-now"
                      >
                        BUY NOW
                      </button>
                    </div>
                  )}

                  <>
                    <br />
                    {/* {coupons[product.prod_id] && ( // Access using prod_id
                <div className="laptops-product-coupon" style={{ marginBottom:'5px', textAlign: "center" }}>
                  <span>
                    Coupon Available
                  </span>
                </div>
              )} */}
                  </>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Footer />
      {selectedProduct && (
        <Modal
          isOpen={true}
          onClose={handleCloseModal}
          product={selectedProduct}
          onNext={handleNextProduct}
          onPrev={handlePrevProduct}
          category={category} // Pass the category to the Modal
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default CCTVAccessories;
