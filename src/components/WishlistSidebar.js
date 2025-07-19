import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import "./css/WishlistSidebar.css";
import { ApiUrl } from "./ApiUrl";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useCart } from "../components/CartContext";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const WishlistSidebar = ({
  isOpen,
  toggleWishlist,
  wishlistRef,
  // removeFromWishlist,
}) => {
  // const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [, setIsAdding] = useState(false); // Track the adding state to prevent multiple clicks
  const [, setIsOfferActive] = useState(true);
  const [, setWishlistLoaded] = useState(false);
  const navigate = useNavigate();

  const isOfferValid = (item) => {
    if (!item.offer_start_time || !item.offer_end_time) return false;

    const now = new Date();
    const start = new Date(item.offer_start_time);
    const end = new Date(item.offer_end_time);

    return start <= now && now < end;
  };

  useEffect(() => {
    if (wishlistItems.length === 0) {
      console.log("Wishlist is empty, no offer status to check.");
      return;
    }

    let activeOffer = false;

    wishlistItems.forEach((item) => {
      if (item.offer_end_time) {
        const now = new Date();
        const offerEndTime = new Date(item.offer_end_time);

        console.log(
          `Checking offer for ${item.prod_name}:`,
          offerEndTime.toLocaleString()
        );

        if (offerEndTime > now) {
          activeOffer = true; // If at least one product has an active offer, set true
        }
      }
    });

    setIsOfferActive(activeOffer);
    console.log(`Final Offer Status: ${activeOffer ? "Yes" : "No"}`);
  }, [wishlistItems]);

  const fetchWishlist = async () => {
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

    if (!email || !username) {
      console.log("No email/username found, skipping wishlist fetch.");
      return;
    }
    
    try {
      const response = await axios.post(`${ApiUrl}/fetch-wishlist`, {
        email,
        username,
      });

      const fetchedWishlist = response.data.products || [];
      setWishlistItems(fetchedWishlist);
      setWishlistLoaded(true);
      console.log("Fetched wishlist items:", fetchedWishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    // Fetch wishlist once when component mounts
    fetchWishlist();

    //  Listen for wishlist updates
    const handleWishlistUpdate = () => {
      console.log("[Event] Wishlist updated, refetching...");
      fetchWishlist();
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);


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

  const handleRemoveFromWishlist = async (productId) => {
    const email = localStorage.getItem("email");

    try {
      const response = await axios.post(`${ApiUrl}/remove-from-wishlist`, {
        email,
        productId,
      });

      if (response.status === 200) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Item removed from your wishlist!`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
        });

        //  Update local wishlist state
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.id !== productId)
        );

        //  Dispatch event so other components (like Mobile) update
        window.dispatchEvent(new Event("wishlist-updated"));
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const handleProductClick = (product) => {
    const slugify = (name) =>
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    navigate(`/shop/${product.id}-${slugify(product.prod_name)}`);
  };

  return (
    <div
      ref={wishlistRef}
      className={`wishlist-sidebar ${isOpen ? "open" : ""}`}
    >
      <button
        style={{ color: "black" }}
        className="close-btn"
        onClick={toggleWishlist}
      >
        <FaTimes />
      </button>
      <div className="wishlist-sidebar-header">
        <h3>Wishlist</h3>
      </div>
      <div className="wishlist-sidebar-body">
        {wishlistItems.length === 0 ? (
          <p className="empty-wishlist">Your wishlist is empty.</p>
        ) : (
          <ul>
            {[...wishlistItems].reverse().map((product) => {
              // Parse the image JSON array
              const images = Array.isArray(product.prod_img)
                ? product.prod_img
                : JSON.parse(product.prod_img || "[]");
              const firstImage = images.length > 0 ? images[0] : null;

              return (
                <li key={product.id} className="wishlist-item">
                  <div
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                      toggleWishlist(false);
                      handleProductClick(product);
                    }}
                  >
                    {firstImage ? (
                      <img
                        src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                        alt={product.prod_name}
                        className="item-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="placeholder-image">
                        No image available
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <div
                      style={{ textDecoration: "none", cursor: "pointer" }}
                      onClick={() => {
                        toggleWishlist(false);
                        handleProductClick(product);
                      }}
                    >
                      <h3 className="item-name">{product.prod_name}</h3>
                      {/* <p className="item-features">{product.prod_features}</p> */}
                    </div>
                  </div>
                  <div className="item-actions">
                    <p
                      className="item-price"
                      style={{
                        color: "red",
                        textDecoration: "line-through",
                        fontSize: "12px",
                      }}
                    >
                      ₹{product.actual_price}
                    </p>
                    <p className="item-price">
                      ₹
                      {product.offer_price > 0 && isOfferValid(product)
                        ? product.offer_price
                        : product.prod_price}
                    </p>
                    {product.status === "unavailable" ? (
                      <p className="out-of-stock">Out of Stock</p>
                    ) : (
                      <button
                        onClick={(event) => handleAddToCart(product, event)}
                        className="add-to-cart-btn"
                      >
                        Add to cart
                      </button>
                    )}

                    <button
                      // onClick={() => removeFromWishlist(product.id, product.category)}
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WishlistSidebar;
