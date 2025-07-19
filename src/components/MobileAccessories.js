import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import Header1 from "./Header1";
// import Header2 from "./Header2";
// import Header3 from "./Header3";
import Footer from "./footer";
import Sidebar from "./Sidebar";
// import Modal from "./Modal";
import "./css/Computers.css";
// import { useCart } from "../components/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ApiUrl } from "./ApiUrl";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
// Define a fallback image URL
// const fallbackImage = require('./img/laptop.jpg'); // Replace with a valid fallback image

const MobileAccessories = () => {
  const [products, setProducts] = useState([]);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState({});
   const [, setIsAdding] = useState(false); // Track the adding state to prevent multiple clicks
  const [loading, setLoading] = useState(true);

const [hoveredProductId, setHoveredProductId] = useState(null);
const [hoverImageIndexes, setHoverImageIndexes] = useState({});

useEffect(() => {
  let interval;

  if (hoveredProductId !== null) {
    interval = setInterval(() => {
      setHoverImageIndexes((prev) => {
        const currentIndex = prev[hoveredProductId] || 0;
        const product = products.find(p => p.id === hoveredProductId);
        const images = Array.isArray(product?.prod_img)
          ? product.prod_img
          : JSON.parse(product?.prod_img || "[]");

        const nextIndex = (currentIndex + 1) % images.length;
        return {
          ...prev,
          [hoveredProductId]: nextIndex,
        };
      });
    }, 1000); // change image every 1 second
  }

  return () => clearInterval(interval);
}, [hoveredProductId, products]);

  
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
    // console.log("Search Query:", searchQuery);


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

 const cacheRef = useRef({
  mobileaccessories: null,
});

useEffect(() => {
  const fetchProducts = async () => {
    // 1. Show cached data immediately (if available)
    if (cacheRef.current.mobileaccessories) {
      setProducts(cacheRef.current.mobileaccessories);
    } else {
      setLoading(true); // Only show loader if no cached data
    }

    try {
      // 2. Always fetch fresh data in background
      const response = await axios.get(`${ApiUrl}/fetchmobileaccessories`);
      const fetchedProducts = response.data;

      setProducts(fetchedProducts); // Update UI with fresh data
      cacheRef.current.mobileaccessories = fetchedProducts; // Update cache
    } catch (error) {
      console.error("Error fetching mobileaccessories:", error);
      if (!cacheRef.current.mobileaccessories) {
        // Only show error if no cached data
        toast.error("Failed to fetch mobileaccessories.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

    const [isOfferActive, setIsOfferActive] = useState(true);
      const [, setProduct] = useState(null);
  
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

  

  // const handleCloseModal = () => {
  //   setSelectedProduct(null);
  // };

  // const handleNextProduct = () => {
  //   if (selectedProduct) {
  //     const currentIndex = products.findIndex(
  //       (p) => p.id === selectedProduct.id
  //     );
  //     const nextIndex = (currentIndex + 1) % products.length;
  //     setSelectedProduct(products[nextIndex]);
  //   }
  // };

  // const handlePrevProduct = () => {
  //   if (selectedProduct) {
  //     const currentIndex = products.findIndex(
  //       (p) => p.id === selectedProduct.id
  //     );
  //     const prevIndex = (currentIndex - 1 + products.length) % products.length;
  //     setSelectedProduct(products[prevIndex]);
  //   }
  // };

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
       Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Item added to your cart!`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
        });
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        toast.error(response.data.message || "Failed to add item to cart", {
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
        window.dispatchEvent(new Event("wishlist-updated"));
       Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Item removed from your wishlist!`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
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
        window.dispatchEvent(new Event("wishlist-updated"));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Item added to your wishlist!`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
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

  // Fetch once on mount
  fetchWishlist();

  //  Listen for wishlist updates
  const handleWishlistUpdate = () => {
    console.log("Wishlist updated event received.");
    fetchWishlist();
  };

  window.addEventListener("wishlist-updated", handleWishlistUpdate);

  return () => {
    window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  };
}, []);


  

  // Define the category variable
  // const category = "mobileaccessories";

  // offerPercentage = ((actual_price - prod_price) / actual_price) * 100

  return (
    <div className="computers-page">
      {/* <Header1 /> */}
      {/* <Header2 category={category} /> */}
      {/* <Header3 /> */}
      <span style={{ marginLeft: "20px", padding: "10px" }}>
         <Link style={{ textDecoration: "none", color: "black" }} to="/">
          Home{" "}
        </Link>
        &gt; Mobile Accessories
      </span>
      <div className="main-content">
        <Sidebar />
       <div className="product-list">
                 {loading ? (
                   // Show skeletons while loading
                   [...Array(8)].map((_, index) => (
                     <div key={index} className="skeleton-product-card">
                       <div className="skeleton-image"></div>
                       <div className="skeleton-text"></div>
                       <div className="skeleton-text short"></div>
                       <div className="skeleton-price"></div>
                       <div className="skeleton-buttons"></div>
                     </div>
                   ))
                 ) : (
                   <>
                     {(filteredProducts.length > 0 ? filteredProducts : products).length === 0 ? (
                       <div className="no-products-message">
                         <h2>No products here yet...</h2>
                         <p>In the meantime, you can choose a different category to continue shopping.</p>
                       </div>
                     ) : (
                       (filteredProducts.length > 0 ? filteredProducts : products).map((product) => {
                         const images = Array.isArray(product.prod_img)
                           ? product.prod_img
                           : JSON.parse(product.prod_img || "[]");
                         const activeIndex =
                           hoveredProductId === product.id
                             ? hoverImageIndexes[product.id] || 0
                             : 0;
                         const currentImage = images[activeIndex];
       
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
                                 src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${currentImage}`}
                                 alt={product.prod_name}
                                 className="product-image"
                                 onMouseEnter={() => setHoveredProductId(product.id)}
                                 onMouseLeave={() => {
                                   setHoveredProductId(null);
                                   setHoverImageIndexes((prev) => ({
                                     ...prev,
                                     [product.id]: 0,
                                   }));
                                 }}
                               />
                               <span
                                 title={
                                   favorites[`${product.id}`]
                                     ? "Remove from Wishlist"
                                     : "Add to Wishlist"
                                 }
                                 className={`favorite-icon ${favorites[`${product.id}`] ? "filled" : ""
                                   }`}
                                 onClick={(event) => handleToggleFavorite(product, event)}
                               >
                                 {favorites[`${product.id}`] ? (
                                   <FaHeart style={{ color: "red" }} />
                                 ) : (
                                   <FaRegHeart />
                                 )}
                               </span>
                             </div>
       
                             <h3 className="product-name" title={product.prod_name}>
                               {product.prod_name.charAt(0).toUpperCase() +
                                 product.prod_name.slice(1)}
                             </h3>
                             <span
                               className="product-subtitle2"
                               title={product.subtitle}
                             >
                               {product.subtitle}
                             </span>
       
                             <div>
                               <span>
                                 <span className="product-price">
                                   ₹
                                   {product.offer_price > 0 && isOfferActive
                                     ? product.offer_price
                                     : product.prod_price}
                                 </span>
                                 <span style={{ margin: "5px", fontSize: "15px" }}>
                                   M.R.P
                                 </span>
                                 <span
                                   className="product-actual-price"
                                   style={{
                                     textDecoration: "line-through",
                                     color: "red",
                                   }}
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
                                   ((product.actual_price -
                                     (product.offer_price > 0 && isOfferActive
                                       ? product.offer_price
                                       : product.prod_price)) /
                                     product.actual_price) *
                                   100
                                 )}
                                 % OFF)
                               </p>
                             </div>
       
                             {product.status === "unavailable" ? (
                               <p
                                 style={{
                                   color: "red",
                                   fontWeight: "bold",
                                   fontSize: "16px",
                                   textAlign: "center",
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
                           </div>
                         );
                       })
                     )}
                   </>
                 )}
               </div>
      </div>

      <Footer />
      {/* {selectedProduct && (
        <Modal
          isOpen={true}
          onClose={handleCloseModal}
          product={selectedProduct}
          onNext={handleNextProduct}
          onPrev={handlePrevProduct}
          category={category} // Pass the category to the Modal
        />
      )} */}
      <ToastContainer />
    </div>
  );
};

export default MobileAccessories;
