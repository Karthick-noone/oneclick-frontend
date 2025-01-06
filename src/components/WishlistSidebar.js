import React, {useState} from "react";
import { FaTimes } from "react-icons/fa";
import "./css/WishlistSidebar.css";
import { ApiUrl } from "./ApiUrl";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../components/CartContext";
import { Link } from "react-router-dom";
import right from './img/right.png'

const WishlistSidebar = ({
  isOpen,
  toggleWishlist,
  wishlistItems = [],
  removeFromWishlist,
  wishlistRef
}) => {
  const { addToCart, updateCartItemQuantity, cartItems } = useCart();
  const [, setWishlistItems] = useState([]);


  const handleAddToWishlist = (product) => {
    // Check if the product already exists in the wishlist
    const isProductInWishlist = wishlistItems.some((item) => item.id === product.id);
  
    if (isProductInWishlist) {
      // If the product is already in the wishlist, do not add it again
      alert("This product is already in your wishlist.");
      return;
    }
  
    // If the product is not in the wishlist, add it
    setWishlistItems([...wishlistItems, product]);
  };

  const handleAddToCart = async (product, event) => {
    event.stopPropagation(); // Prevent event bubbling

    // Get the user details from localStorage
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
      // Verify the user in the database
      const response = await axios.post(`${ApiUrl}/verify-user`, {
        email,
        username,
      });

      if (response.data.exists) {
        // User exists, proceed to add the product to the cart
        const existingItem = cartItems.find(
          (item) => item.id === product.id && item.category === product.category
        );

        if (existingItem) {
          // Update quantity if the item is already in the cart
          updateCartItemQuantity(product.id, existingItem.quantity + 1);
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
          addToCart(product);

          // Update the cart in the database
          await axios.post(`${ApiUrl}/update-user-cart`, {
            email,
            username,
            product,
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

        // Store product details in localStorage with email and cart
        const cartKey = `${email}-cart`;
        const cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
        const itemIndex = cartData.findIndex(
          (item) => item.id === product.id && item.category === product.category
        );

        if (itemIndex >= 0) {
          // If item already exists, update its quantity
          cartData[itemIndex].quantity += 1;
        } else {
          // Add new product with quantity 1
          cartData.push({
            id: product.id,
            name: product.prod_name,
            price: product.prod_price,
            image: product.prod_img,
            description: product.prod_features,
            category: product.category,
            product_id: product.prod_id,
            actual_price: product.actual_price,
            deliverycharge: product.deliverycharge,
            coupon: product.coupon,
            quantity: 1,
          });
        }

        localStorage.setItem(cartKey, JSON.stringify(cartData));
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
        progress: undefined,
      });
    }
  };

  // const categoryMap = {
  //   TV: "Television",
  //   Speakers: "Speaker",
  //   // Add other mappings as needed
  // };

  return (
  <>
    <div  ref={wishlistRef} className={`wishlist-sidebar ${isOpen ? "open" : ""}`}>
      <button
        style={{ color: "black" }}
        className="close-btn"
        onClick={toggleWishlist}
      >
        <FaTimes />
        {/* <img src={right} width={'20px'} alt="" /> */}
      </button>
      <div className="wishlist-sidebar-header">
        <h3>Wishlist</h3>
      </div>
      <div className="wishlist-sidebar-body">
        {wishlistItems.length === 0 ? (
          <p className="empty-wishlist">Your wishlist is empty.</p>
        ) : (
          <ul>
            {wishlistItems
              .slice()
              .reverse()
              .map((product) => {
                // Check if prod_img is in a valid format
                const images = Array.isArray(product.prod_img) 
                  ? product.prod_img 
                  : JSON.parse(product.prod_img || '[]');
                const firstImage = images.length > 0 ? images[0] : null; // Get the first image or null if not available

                return (
                  <li key={product.id} className="wishlist-item">
                    {/* <Link
                      style={{ textDecoration: "none" }}
                      to={`/${categoryMap[product.category] || product.category}`}
                    > */}
                                          <Link style={{ textDecoration: 'none' }} to={`/product/${product.id}`}>

                      {firstImage ? (
                        <img
                          src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                          alt={product.prod_name}
                          className="item-image"
                        />
                      ) : (
                        <div className="placeholder-image">No image available</div> // Fallback message
                      )}
                    </Link>

                    <div className="item-details">
                      <Link style={{ textDecoration: 'none' }} to={`/product/${product.id}`}>
                        <h3 className="item-name">{product.prod_name}</h3>
                        <p className="item-features">{product.prod_features}</p>
                      </Link>
                    </div>
                    <div className="item-actions">
                      <p className="item-price" style={{ color: 'red',textDecoration:"line-through", fontSize:'12px' }}>₹{product.actual_price}</p>
                      <p className="item-price">₹{product.prod_price}</p>
                      {product.status === "unavailable" ? (
                        <p
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            fontSize: "12px",
                            textAlign: "center",
                            borderRadius: "5px",
                          }}
                          className="out-of-stock"
                        >
                          Out of Stock
                        </p>
                      ) : (
                        <button
                          onClick={(event) => handleAddToCart(product, event)}
                          className="add-to-cart-btn"
                        >
                          Add to cart
                        </button>
                      )}
                      <button
                        onClick={() => removeFromWishlist(product.id, product.category)}
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
  </>
);
};

export default WishlistSidebar;
