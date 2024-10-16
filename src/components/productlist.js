import React, { useEffect, useState } from "react";
import { useCart } from "../components/CartContext";
import "./css/ProductList.css"; // Import the CSS for styling
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify
import axios from "axios"; // Import axios for API requests
import { ApiUrl } from "./ApiUrl"; // Ensure ApiUrl is correct
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

const ProductList = () => {
  const {
    addToCart,
    cartItems,
    updateCartItemQuantity,
    addToWishlist,
    removeFromWishlist,
  } = useCart();
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const navigate = useNavigate(); // Initialize useNavigate

  // useEffect(() => {
  //     axios.get(`${ApiUrl}/api/products`)
  //         .then(response => {
  //             setProducts(response.data);
  //         })
  //         .catch(error => {
  //             console.error('There was an error fetching the products!', error);
  //             toast.error('Failed to fetch products. Please try again later.');
  //         });
  // }, []);

  useEffect(() => {
    axios
      .get(`${ApiUrl}/api/products`)
      .then((response) => {
        console.log('API Response:', response.data); // Log the response data
        const flattenedProducts = response.data.flat(); // Flatten the array of arrays
        setProducts(flattenedProducts);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        setError("Failed to fetch products. Please try again later.");
        setLoading(false); // Set loading to false even on error
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
        progress: undefined,
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

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to the product details page with the product ID
  };

  const groupedProducts = {
    Mobiles: products.filter(product => product.category === 'Mobiles').slice(0, 5),
    Computers: products.filter(product => product.category === 'Computers').slice(0, 5),
  };
  
  return (
    <section id="products" className="product-list3">
      <h3 className="title">Our Products</h3>
  
      <div className="products">
      <h3 className="category-title">Mobiles</h3>

        {/* Display Mobiles */}
        <div className="product-row">
          {groupedProducts.Mobiles.length === 0 ? (
            <p>No products available for Mobiles.</p>
          ) : (
            groupedProducts.Mobiles.map((product, index) => {
              const images = Array.isArray(product.prod_img)
                ? product.prod_img
                : JSON.parse(product.prod_img || "[]");
              const firstImage = images.length > 0 ? images[0] : null;
  
              return (
                <div
                  key={index}
                  className="product"
                  onClick={() => handleProductClick(product.id)}
                >
                  {product.offer_label && (
                    <div className="product-label">{product.offer_label}</div>
                  )}
                  {firstImage ? (
                    <img
                      src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                      alt={product.prod_name}
                      className="product-first-image"
                    />
                  ) : (
                    <div>No image available</div>
                  )}
                  <span
                    title="Add to Wishlist"
                    className={`favorite-icon ${favorites[`${product.prod_name}-${product.id}`] ? "filled" : ""}`}
                    onClick={(event) => handleToggleFavorite(product, event)}
                  >
                    {favorites[`${product.prod_name}-${product.id}`] ? <FaHeart /> : <FaRegHeart />}
                  </span>
                  <h3 className="product-description">{product.prod_name}</h3>
                  <p className="product-price" style={{ color: "#27ae60", fontWeight: "bold" }}>₹{product.prod_price}</p>
                  <p className="product-actual-price">
                    <span style={{ textDecoration: "line-through", color: 'red' }}>
                      ₹{product.actual_price}{" "}
                    </span>
                    <span style={{ color: "green", marginLeft: "10px" }}>
                      (
                      {Math.round(
                        ((product.actual_price - product.prod_price) /
                          product.actual_price) *
                          100
                      )}
                      % OFF)
                    </span>
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
                        border: "2px solid red",
                        borderRadius: "5px",
                        backgroundColor: "#fdd",
                      }}
                      className="out-of-stock"
                    >
                      Out of Stock
                    </p>
                  ) : (
                    <button
                      onClick={(event) => handleAddToCart(product, event)}
                      className="add-to-cart"
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
  
        {/* Display Computers */}
        <h3 className="category-title">Computers</h3>

        <div className="product-row">
          {groupedProducts.Computers.length === 0 ? (
            <p>No products available for Computers.</p>
          ) : (
            groupedProducts.Computers.map((product, index) => {
              const images = Array.isArray(product.prod_img)
                ? product.prod_img
                : JSON.parse(product.prod_img || "[]");
              const firstImage = images.length > 0 ? images[0] : null;
  
              return (
                <div
                  key={index}
                  className="product"
                  onClick={() => handleProductClick(product.id)}
                >
                  {product.offer_label && (
                    <div className="product-label">{product.offer_label}</div>
                  )}
                  {firstImage ? (
                    <img
                      src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                      alt={product.prod_name}
                      className="product-first-image"
                    />
                  ) : (
                    <div>No image available</div>
                  )}
                  <span
                    title="Add to Wishlist"
                    className={`favorite-icon ${favorites[`${product.prod_name}-${product.id}`] ? "filled" : ""}`}
                    onClick={(event) => handleToggleFavorite(product, event)}
                  >
                    {favorites[`${product.prod_name}-${product.id}`] ? <FaHeart /> : <FaRegHeart />}
                  </span>
                  <h3 className="product-description">{product.prod_name}</h3>
                  <p className="product-price" style={{ color: "#27ae60", fontWeight: "bold" }}>₹{product.prod_price}</p>
                  <p className="product-actual-price">
                    <span style={{ textDecoration: "line-through", color: 'red' }}>
                      ₹{product.actual_price}{" "}
                    </span>
                    <span style={{ color: "green", marginLeft: "10px" }}>
                      (
                      {Math.round(
                        ((product.actual_price - product.prod_price) /
                          product.actual_price) *
                          100
                      )}
                      % OFF)
                    </span>
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
                        border: "2px solid red",
                        borderRadius: "5px",
                        backgroundColor: "#fdd",
                      }}
                      className="out-of-stock"
                    >
                      Out of Stock
                    </p>
                  ) : (
                    <button
                      onClick={(event) => handleAddToCart(product, event)}
                      className="add-to-cart"
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
  
      {/* Display CCTV and Printers */}
      <div className="products">
      <h3 className="category-title">CCTV & Printers</h3>

        <div className="product-row">
          {[...products.filter(product => product.category === 'CCTV'), ...products.filter(product => product.category === 'Printers')].map((product, index) => {
            const images = Array.isArray(product.prod_img) ? product.prod_img : JSON.parse(product.prod_img || "[]");
            const firstImage = images.length > 0 ? images[0] : null;
  
            return (
              <div
                key={index}
                className="product"
                onClick={() => handleProductClick(product.id)}
              >
                {product.offer_label && <div className="product-label">{product.offer_label}</div>}
                {firstImage ? (
                  <img
                    src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                    alt={product.prod_name}
                    className="product-first-image"
                  />
                ) : <div>No image available</div>}
                <span
                  title="Add to Wishlist"
                  className={`favorite-icon ${favorites[`${product.prod_name}-${product.id}`] ? "filled" : ""}`}
                  onClick={(event) => handleToggleFavorite(product, event)}
                >
                  {favorites[`${product.prod_name}-${product.id}`] ? <FaHeart /> : <FaRegHeart />}
                </span>
                <h3 className="product-description">{product.prod_name}</h3>
                <p className="product-price" style={{ color: "#27ae60", fontWeight: "bold" }}>₹{product.prod_price}</p>
                <p className="product-actual-price">
                  <span style={{ textDecoration: "line-through", color: 'red' }}>
                    ₹{product.actual_price}{" "}
                  </span>
                  <span style={{ color: "green", marginLeft: "10px" }}>
                    (
                    {Math.round(
                      ((product.actual_price - product.prod_price) /
                        product.actual_price) *
                        100
                    )}
                    % OFF)
                  </span>
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
                      border: "2px solid red",
                      borderRadius: "5px",
                      backgroundColor: "#fdd",
                    }}
                    className="out-of-stock"
                  >
                    Out of Stock
                  </p>
                ) : (
                  <button
                    onClick={(event) => handleAddToCart(product, event)}
                    className="add-to-cart"
                  >
                    Add to cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
  

};

export default ProductList;