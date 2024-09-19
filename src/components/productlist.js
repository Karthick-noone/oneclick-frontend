import React, { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext';
import './css/ProductList.css'; // Import the CSS for styling
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toastify
import axios from 'axios'; // Import axios for API requests
import { ApiUrl } from './ApiUrl'; // Ensure ApiUrl is correct
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductList = () => {
    const { addToCart, cartItems, updateCartItemQuantity, addToWishlist, removeFromWishlist } = useCart();
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState({});

    useEffect(() => {
        axios.get(`${ApiUrl}/api/products`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
                toast.error('Failed to fetch products. Please try again later.');
            });
    }, []);

    const handleAddToCart = async (product, event) => {
        event.stopPropagation();
      
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
              (item) =>
                item.id === product.id && item.category === product.category
            );
      
            if (existingItem) {
              // Update quantity if the item is already in the cart
              updateCartItemQuantity(product.id, product.category, existingItem.quantity + 1);
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
              (item) =>
                item.id === product.id && item.category === product.category
            );
      
            if (itemIndex >= 0) {
              // If item already exists, update its quantity
              cartData[itemIndex].quantity = cartData[itemIndex].quantity + 1;
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

    return (
        <section id="products" className="product-list">
           <h3 className='title'>Our Products</h3>
            <div className="products">
                {products.map((product, index) => (
                   <div key={index} className="product">
                   <img src={`${ApiUrl}/uploads/${product.category}/${product.prod_img}`} alt={product.prod_name} />
                   <span
                       title="Add to Wishlist"
                       className={`favorite-icon ${
                           favorites[`${product.prod_name}-${product.id}`] ? "filled" : ""
                       }`}
                       onClick={(event) => handleToggleFavorite(product, event)}
                   >
                       {favorites[`${product.prod_name}-${product.id}`] ? (
                           <FaHeart />
                       ) : (
                           <FaRegHeart />
                       )}
                   </span>
                   <h3>{product.prod_name}</h3>
                   <p>{product.prod_features}</p>
                   <p>${product.prod_price}</p>
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
)}               </div>
                ))}
            </div>
            <ToastContainer />
        </section>
    );
};

export default ProductList;