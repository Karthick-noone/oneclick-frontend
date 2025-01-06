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
  const {
    cartItems,
    addToCart,
    updateCartItemQuantity,
    addToWishlist,
    removeFromWishlist,
  } = useCart();

  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search");

  // Use searchQuery in your component
  console.log("Search Query:", searchQuery);

  // Filter products based on the search query
  const filteredProducts = searchQuery
    ? products.filter((product) => {
        const nameMatches = product.prod_name
          .toLowerCase()
          .includes(searchQuery);
        const featuresMatch = product.prod_features
          .toLowerCase()
          .includes(searchQuery);
        return nameMatches || featuresMatch; // Return products that match either the name or features
      })
    : products; // If no search query, return all products

    const [coupons, setCoupons] = useState({}); // State to store coupons

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${ApiUrl}/fetchcctvaccessories`);
          const fetchedProducts = response.data;
  
          // Set products to state
          setProducts(fetchedProducts);
  
          // Fetch coupons for each product
          for (const product of fetchedProducts) {
            try {
              const couponResponse = await axios.get(`${ApiUrl}/coupons/${product.prod_id}`);
              // Assuming couponResponse.data.coupons returns an array of coupons
              if (couponResponse.data.coupons.length > 0) {
                // Set the first coupon code for the product
                setCoupons((prev) => ({
                  ...prev,
                  [product.prod_id]: couponResponse.data.coupons[0].coupon_code // Use coupon_code from the first coupon
                }));
                console.log(`Set coupon code for product ${product.prod_id}: ${couponResponse.data.coupons[0].coupon_code}`);
              } else {
                console.log(`No coupons found for product ${product.prod_id}`);
              }
            } catch (couponError) {
              console.error(`Failed to fetch coupon for product ${product.prod_id}:`, couponError);
            
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
        }
      };
  
      fetchProducts();
    }, []);
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
    const intervalId = setInterval(updateFavorites, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // const handleCardClick = (product) => {
  //   setSelectedProduct(product);
  // };
  const handleCardClick = (product) => {
    // Check if product is defined and has an id
    if (product && product.id) {
      navigate(`/product/${product.id}`); // Navigate to the product details page
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
            coupon: product.coupon,
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
        &gt; CCTV Accessories
      </span>
      <div className="main-content">
        <Sidebar />
        <div className="product-list">

        {products.length === 0 ? (
    <div className="no-products-message">
      <h2>No products here yet...</h2>
      <p>
        In the meantime, you can choose a different category to continue
        shopping.
      </p>
    </div>
  ) : (
          filteredProducts.length === 0
            ? // If filteredProducts is empty, fallback to using all products
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
                        src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                        alt={product.prod_name}
                        className="product-image"
                      />
                      <span
                        title="Add to Wishlist"
                        className={`favorite-icon ${
                          favorites[product.prod_name] ? "filled" : ""
                        }`}
                        onClick={(event) =>
                          handleToggleFavorite(product, event)
                        }
                      >
                        {favorites[`${product.prod_name}-${product.id}`] ? (
                          <FaHeart style={{ color: "red" }} />
                        ) : (
                          <FaRegHeart />
                        )}
                      </span>
                    </div>
                     
                    <h3 className="product-name">{product.prod_name}</h3>
                    <span className="product-subtitle2">{product.subtitle}</span>
                    {/* <p className="product-description">
                      {product.prod_features}
                    </p> */}
                 <p >
                      <span >
                    <span className="product-price">₹{product.prod_price}</span>
                    <span style={{marginRight:'5px',fontSize:'15px'}}>M.R.P</span><span className="product-actual-price" style={{ textDecoration: "line-through" }}>₹{product.actual_price}</span>
                      </span>
                      <p style={{ color: "green", marginLeft: "10px",marginBottom: "10px" }}>
                        (
                        {Math.round(
                          ((product.actual_price - product.prod_price) /
                            product.actual_price) *
                            100
                        )}
                        % OFF)
                      </p>
                    </p>{" "}
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
                      <button
                        onClick={(event) => handleAddToCart(product, event)}
                        className="add-to-cart"
                      >
                        Add to cart
                      </button>
                    )}
<><br />
{/* {coupons[product.prod_id] && ( // Access using prod_id
          <div className="laptops-product-coupon" style={{ marginBottom:'5px', textAlign: "center" }}>
            <span>
              Coupon Available
            </span>
          </div>
        )} */}</>
                    
                  </div>
                );
              })
            : // If filteredProducts has results, display them
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
                        src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                        alt={product.prod_name}
                        className="product-image"
                      />
                      <span
                        title="Add to Wishlist"
                        className={`favorite-icon ${
                          favorites[product.prod_name] ? "filled" : ""
                        }`}
                        onClick={(event) =>
                          handleToggleFavorite(product, event)
                        }
                      >
                        {favorites[`${product.prod_name}-${product.id}`] ? (
                          <FaHeart style={{ color: "red" }} />
                        ) : (
                          <FaRegHeart />
                        )}
                      </span>
                    </div>
                     
                    <h3 className="product-name">{product.prod_name}</h3>
                    <span className="product-subtitle2">{product.subtitle}</span>
                    {/* <p className="product-description">
                      {product.prod_features}
                    </p> */}

                  <p >
                      <span >
                    <span className="product-price">₹{product.prod_price}</span>
                    <span style={{marginRight:'5px',fontSize:'15px'}}>M.R.P</span><span className="product-actual-price" style={{ textDecoration: "line-through" }}>₹{product.actual_price}</span>
                      </span>
                      <p style={{ color: "green", marginLeft: "10px",marginBottom: "10px" }}>
                        (
                        {Math.round(
                          ((product.actual_price - product.prod_price) /
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
                      <button
                        onClick={(event) => handleAddToCart(product, event)}
                        className="add-to-cart"
                      >
                        Add to cart
                      </button>
                    )}

<><br />
{/* {coupons[product.prod_id] && ( // Access using prod_id
          <div className="laptops-product-coupon" style={{ marginBottom:'5px', textAlign: "center" }}>
            <span>
              Coupon Available
            </span>
          </div>
        )} */}</>
                  </div>
                );
              }) )}
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
