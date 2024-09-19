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

// Define a fallback image URL
// const fallbackImage = require('./img/laptop.jpg'); // Replace with a valid fallback image

const Mobiles = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState({});
  const { cartItems, addToCart, updateCartItemQuantity, addToWishlist, removeFromWishlist } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchmobiles`);

        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error("Failed to fetch products.", {
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

    fetchProducts();
  }, []);

  useEffect(() => {
    const updateFavorites = () => {
      const favouritesKey = 'favourites';
      const currentFavourites = localStorage.getItem(favouritesKey) || "";
      const favouriteProducts = currentFavourites.split(',').reduce((acc, item) => {
        if (item.startsWith('faredheart-')) {
          const [_, productName, productId] = item.split('-');
          acc[`${productName}-${productId}`] = true;
        }
        return acc;
      }, {});
  
      setFavorites(favouriteProducts);
    };
  
    // Initial fetch
    updateFavorites();
  
    // Set interval to fetch favorites every second
    const intervalId = setInterval(updateFavorites, 1000);
  
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
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
            product_id: product.prod_id,

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

  const handleToggleFavorite = async (product, event) => {
    event.stopPropagation();
    const isFavorite = favorites[`${product.prod_name}-${product.id}`];

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
          const wishlistData = JSON.parse(localStorage.getItem(wishlistKey)) || [];
          const updatedWishlistData = wishlistData.filter(
            (item) => item.id !== product.id
          );
          localStorage.setItem(
            wishlistKey,
            JSON.stringify(updatedWishlistData)
          );

          const favouritesKey = 'favourites';
          const currentFavourites = localStorage.getItem(favouritesKey) || "";
          const newFavourites = currentFavourites
            .split(',')
            .filter(item => item !== `faredheart-${product.prod_name}-${product.id}`)
            .join(',');
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
          const wishlistData = JSON.parse(localStorage.getItem(wishlistKey)) || [];
         

 wishlistData.push(product);
          localStorage.setItem(wishlistKey, JSON.stringify(wishlistData));

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

  // Define the category variable
  const category = 'mobiles';

  return (
    <div className="computers-page">
      {/* <Header1 /> */}
      <Header2 category={category} />
      {/* <Header3 /> */}
      <span style={{ marginLeft: "20px",padding:'10px' }}><a style={{textDecoration:'none', color:'black'}} href="/">Home </a> &gt; Mobiles</span>
      <div className="main-content">
        <Sidebar />
        <div className="product-list">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleCardClick(product)}
            >
              <div className="product-actions">
                <img
                  src={`${ApiUrl}/uploads/${product.category}/${product.prod_img}`} 
                  alt={product.prod_name}
                  className="product-image"
                />
                <span
                  title="Add to Wishlist"
                  className={`favorite-icon ${
                    favorites[product.prod_name] ? "filled" : ""
                  }`}
                  onClick={(event) => handleToggleFavorite(product, event)}
                >
                  {favorites[`${product.prod_name}-${product.id}`] ? (
                    <FaHeart style={{color:'red'}}/>
                  ) : (
                    <FaRegHeart  />
                  )}
                </span>
                
              </div>
              <h3 className="product-name">{product.prod_name}</h3>
              <p className="product-description">{product.prod_features}</p>
              <p className="product-price">₹{product.prod_price}</p>
              {product.status === 'unavailable' ? (
  <p style={{
    color: 'red',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    marginTop: '10px',
    padding: '10px',
    border: '2px solid red',
    borderRadius: '5px',
    backgroundColor: '#fdd',
  }} className="out-of-stock">
    Out of Stock
  </p>
) : (
  <button
  
    onClick={(event) => handleAddToCart(product, event)}
    className="add-to-cart"
  >
    Add to Cart
  </button>
)}
            </div>
          ))}
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

export default Mobiles;