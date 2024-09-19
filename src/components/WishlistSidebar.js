import React from "react";
import { FaTimes } from "react-icons/fa";
import "./css/WishlistSidebar.css";
import { ApiUrl } from "./ApiUrl";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../components/CartContext";
import { Link } from "react-router-dom";

const WishlistSidebar = ({
  isOpen,
  toggleWishlist,
  wishlistItems = [],
  removeFromWishlist,
}) => {
  const { addToCart, updateCartItemQuantity, cartItems } = useCart();

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

  return (
    <>
      <div className={`wishlist-sidebar ${isOpen ? "open" : ""}`}>
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
              {wishlistItems.map((product) => (
                <li key={product.id} className="wishlist-item">
                                    <Link style={{textDecoration:'none'}} to={`/${product.category}`}>

                  <img
                    src={`${ApiUrl}/uploads/${product.category}/${product.prod_img}`}
                    alt={product.name}
                    className="item-image"
                  />
                                          </Link>

                  <div className="item-details">
                  <Link style={{textDecoration:'none'}} to={`/${product.category}`}>

                    <h3 className="item-name">{product.prod_name}</h3>
                    <p className="item-features">{product.prod_features}</p>
                    </Link>

                  </div>
                  <div className="item-actions">
                    <p className="item-price">₹{product.prod_price}</p>
                    {product.status === "unavailable" ? (
                      <p
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: "12px",
                          textAlign: "center",
                          // marginTop: '10px',
                          // padding: '10px',
                          // border: '2px solid red',
                          borderRadius: "5px",
                          // backgroundColor: '#fdd',
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
                        Add to Cart
                      </button>
                    )}
                    <button
                      onClick={() =>
                        removeFromWishlist(product.id, product.category)
                      }
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistSidebar;
