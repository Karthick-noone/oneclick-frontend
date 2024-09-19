import React, { useState, useEffect } from 'react';
import './css/Modal.css'; // Ensure this file has styles for modal and arrows
import { useCart } from '../components/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHeart } from 'react-icons/fa'; // Import the heart icon from react-icons
import { ApiUrl } from "./ApiUrl";
import axios from "axios";

const Modal = ({ isOpen, onClose, /* category ,*/ product, onNext, onPrev }) => {
  const { /* addToCart, updateCartItemQuantity, cartItems, */ addToWishlist, removeFromWishlist } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Initialize isFavorite based on localStorage or any other state management
    const email = localStorage.getItem('email');
    if (email) {
      const wishlistKey = `${email}-wishlist`;
      const wishlistData = JSON.parse(localStorage.getItem(wishlistKey)) || [];
      const productIsFavorite = wishlistData.some(item => item.id === product.id);
      setIsFavorite(productIsFavorite);
    }
  }, [product]);

  if (!isOpen) return null;

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
          toast.info(`Increased quantity of ${product.prod_name} in your cart!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          // Add new product to the cart
          cartItems.push({
            id: product.id,
            name: product.prod_name,
            price: product.prod_price,
            image: product.prod_img,
            description: product.prod_features,
            category: product.category,
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
        progress: undefined,
      });
    }
  };


  const toggleFavorite = async (product, event) => {
    console.log('product',product);

    event.stopPropagation();
  
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');
  
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
        email: email,
        username: username,
      });
  
      if (response.data.exists) {
        if (isFavorite) {
          // Remove from favorites
          setIsFavorite(false);
          removeFromWishlist(product.id);
  
          // Update the wishlist in the database
          await axios.post(`${ApiUrl}/update-user-wishlist`, {
            email: email,
            username: username,
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
  
          // Remove product details from localStorage
          const wishlistKey = `${email}-wishlist`;
          const wishlistData = JSON.parse(localStorage.getItem(wishlistKey)) || [];
          console.log('wishlistData',wishlistData); // Check if all the necessary product details are stored.

          const updatedWishlistData = wishlistData.filter(
            (item) => item.id !== product.id
          );
          localStorage.setItem(
            wishlistKey,
            JSON.stringify(updatedWishlistData)
          );
  
          // Remove product from "favourites"
          const favouritesKey = 'favourites';
          const currentFavourites = localStorage.getItem(favouritesKey) || "";
          const newFavourites = currentFavourites
            .split(',')
            .filter(item => item !== `faredheart-${product.prod_name}-${product.id}`)
            .join(',');
          localStorage.setItem(favouritesKey, newFavourites);
  
        } else {
          // Add to favorites
          setIsFavorite(true);
          addToWishlist(product);
  
          // Update the wishlist in the database
          await axios.post(`${ApiUrl}/update-user-wishlist`, {
            email: email,
            username: username,
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
  
          // Store product details in localStorage with email and wishlist
          const wishlistKey = `${email}-wishlist`;
          const wishlistData = JSON.parse(localStorage.getItem(wishlistKey)) || [];
          const productInWishlist = wishlistData.some(item => item.id === product.id);
  
          if (!productInWishlist) {
            // Store the product details into localStorage
            wishlistData.push(product);
            console.log('Wishlist Data Before Saving:', wishlistData); // Log wishlist before saving
            localStorage.setItem(wishlistKey, JSON.stringify(wishlistData));
        }
  
          // Store the product name with "faredheart" in a comma-separated string
          const favouritesKey = 'favourites';
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
  if (!isOpen) return null;

  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-nav modal-prev" onClick={onPrev}>
          <span className="arrow"></span>
        </button>
        <button className="modal-nav modal-next" onClick={onNext}>
          <span className="arrow"></span>
        </button>
        <button className="modal-close" onClick={onClose}>X</button>
        {/* <img src={require(`./img/${product.prod_img}`)} alt={product.prod_name} className="modal-image" /> */}
        <img
                  src={`${ApiUrl}/uploads/${product.category}/${product.prod_img}`} 
                  alt={product.prod_name}
                  className="modal-image"
                />
        <div className="modal-header">
          <h2 className="modal-title">{product.prod_name}</h2>
           <FaHeart
          className={`favorite-iconn ${isFavorite ? 'filled' : ''}`}
          onClick={(event) => toggleFavorite(product, event)}
        />
        </div>
        <p className="modal-description">{product.prod_features}</p>
        <p className="modal-price">${product.prod_price}</p>
        {product.status === 'unavailable' ? (
  <center><p style={{
    color: 'red',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    marginTop: '10px',
    padding: '10px',
    border: '2px solid red',
    borderRadius: '5px',
    backgroundColor: '#fdd',
    width:'200px'
  }} className="out-of-stock">
    Out of Stock
  </p></center>
) : (
  <button
  
    onClick={(event) => handleAddToCart(product, event)}
    className="add-to-cart"
  >
    Add to Cart
  </button>
)}

      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Modal;
