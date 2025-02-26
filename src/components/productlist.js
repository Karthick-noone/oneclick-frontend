import React, { useEffect, useState } from "react";
import { useCart } from "../components/CartContext";
import "./css/ProductList.css"; // Import the CSS for styling
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify
import axios from "axios"; // Import axios for API requests
import { ApiUrl } from "./ApiUrl"; // Ensure ApiUrl is correct
import { FaChevronRight, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import { FaArrowRight } from "react-icons/fa"; // Import an arrow icon

import right from './img/right-chevron.png'

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
  const [coupons, setCoupons] = useState({}); // State to hold coupon codes for products

  const [visibleProductsCount, setVisibleProductsCount] = useState(5); // Initially display 5 products
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the current index
  const [showSeeMore, setShowSeeMore] = useState(false); // Flag to show See More button

// Assuming these indices are defined as state variables for each category.
const [currentIndexMobiles, setCurrentIndexMobiles] = useState(0);
const [currentIndexComputers, setCurrentIndexComputers] = useState(0);
const [currentIndexCCTV, setCurrentIndexCCTV] = useState(0);
const [currentIndexPrinters, setCurrentIndexPrinters] = useState(0);
const [showSeeMoreMobiles, setShowSeeMoreMobiles] = useState(false);
const [showSeeMoreComputers, setShowSeeMoreComputers] = useState(false);
const [showSeeMoreCCTV, setShowSeeMoreCCTV] = useState(false);
const [showSeeMorePrinters, setShowSeeMorePrinters] = useState(false);
const [visibleItemsCount, setVisibleItemsCount] = useState(5); // Initially show 5 items
const [visibleItemsCount2, setVisibleItemsCount2] = useState(5); // Initially show 5 items
  // Function to handle loading more products
  const loadMoreAccessories = () => {
    setVisibleItemsCount(prevCount => prevCount + 5); // Load 5 more items on each click
  };

  // Filter products by category
  const accessories = [
    ...products.filter(product => product.category === 'ComputerAccessories'),
    ...products.filter(product => product.category === 'MobileAccessories'),
    ...products.filter(product => product.category === 'CCTVAccessories'),
    ...products.filter(product => product.category === 'PrinterAccessories')
  ];

  const loadMoreAudio = () => {
    setVisibleItemsCount2(prevCount => prevCount + 5); // Load 5 more items on each click
  };

  // Filter products by category
  const audio = [
    ...products.filter(product => product.category === 'Headphones'),
    ...products.filter(product => product.category === 'Speakers')
  
  ];

    useEffect(() => {
    console.log("currentIndex updated to:", currentIndex);
  }, [currentIndex]);
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
    console.log("Fetching products from API...");
  
    axios
      .get(`${ApiUrl}/api/products`)
      .then((response) => {
        console.log('API Response:', response.data);
        const flattenedProducts = response.data.flat();
        console.log('Flattened Products:', flattenedProducts);
  
        setProducts(flattenedProducts);
        setLoading(false);
  
        // Fetch coupons for each product
        flattenedProducts.forEach((product) => {
          console.log(`Fetching coupons for product ID: ${product.prod_id}`);
  
          axios
            .get(`${ApiUrl}/coupons/${product.prod_id}`) // Fetch coupon using product ID
            .then((couponResponse) => {
              console.log(`Coupon Response for product ${product.prod_id}:`, couponResponse.data);
  
              if (couponResponse.data.coupons.length > 0) {
                console.log(`Coupons found for product ${product.prod_id}:`, couponResponse.data.coupons);
                
                // Set the first coupon code for the product
                setCoupons((prev) => ({
                  ...prev,
                  [product.prod_id]: couponResponse.data.coupons[0].coupon_code
                }));
                console.log(`Set coupon code for product ${product.prod_id}: ${couponResponse.data.coupons[0].coupon_code}`);
              } else {
                console.log(`No coupons found for product ${product.prod_id}.`);
              }
            })
            .catch((error) => {
              console.error(`Failed to fetch coupon for product ${product.prod_id}:`, error);
            });
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
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
            deliverycharge: product.deliverycharge,
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

  

 

  const productsPerCategory = 5;

  const groupedProducts = {
    Mobiles: products.filter(product => product.category === 'Mobiles'),
    Computers: products.filter(product => product.category === 'Computers'),
    CCTV: products.filter(product => product.category === 'CCTV'),
    Printers: products.filter(product => product.category === 'Printers'),
  };

   // Function to go to the next set of products
const nextSlide = (category) => {
  const categoryProducts = groupedProducts[category];
  const nextIndex = currentIndex + productsPerCategory;

  if (nextIndex >= categoryProducts.length) {
    setShowSeeMore(true); // Show "See More" button when there are no more items to slide
  } else {
    setCurrentIndex(nextIndex); // Update to show the next 5 items
  }
};



const loadMoreProducts = (category) => {
  let nextIndex = 0;
  let setCurrentIndex = () => {};
  let setShowSeeMore = () => {};

  // Update the currentIndex and nextIndex based on the category
  if (category === 'Mobiles') {
    nextIndex = currentIndexMobiles + productsPerCategory;
    setCurrentIndex = setCurrentIndexMobiles;
    setShowSeeMore = setShowSeeMoreMobiles;
  } else if (category === 'Computers') {
    nextIndex = currentIndexComputers + productsPerCategory;
    setCurrentIndex = setCurrentIndexComputers;
    setShowSeeMore = setShowSeeMoreComputers;
  } else if (category === 'CCTV') {
    nextIndex = currentIndexCCTV + productsPerCategory;
    setCurrentIndex = setCurrentIndexCCTV;
    setShowSeeMore = setShowSeeMoreCCTV;
  } else if (category === 'Printers') {
    nextIndex = currentIndexPrinters + productsPerCategory;
    setCurrentIndex = setCurrentIndexPrinters;
    setShowSeeMore = setShowSeeMorePrinters;
  }

  // Check if we have more products to load
  if (nextIndex >= groupedProducts[category].length) {
    console.log(`No more products to load for ${category}.`);
    setShowSeeMore(true);  // Show "See More" button when there are no more items to load
  } else {
    setCurrentIndex(nextIndex);  // Update the current index for the respective category
    console.log(`Updated currentIndex for ${category}:`, nextIndex);
  }
};




const visibleProductsMobiles = groupedProducts.Mobiles.slice(currentIndexMobiles, currentIndexMobiles + productsPerCategory);
const visibleProductsComputers = groupedProducts.Computers.slice(currentIndexComputers, currentIndexComputers + productsPerCategory);
const visibleProductsCCTV = groupedProducts.CCTV.slice(currentIndexCCTV, currentIndexCCTV + productsPerCategory);
const visibleProductsPrinters = groupedProducts.Printers.slice(currentIndexPrinters, currentIndexPrinters + productsPerCategory);



  
  return (
    <section id="products" className="product-list3">
      <h3 className="title">Our Products</h3>
  
      <div className="product-section">
        {/* Display Mobiles */}
        <div className="product-row">
      <div className="product-items">
      {groupedProducts.Mobiles.length === 0 ? null : (

          visibleProductsMobiles.map((product, index) => {
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
                    loading="lazy"

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
                <h3 className="product-name">{product.prod_name}</h3>
                <span className="product-subtitle">{product.subtitle}</span>
                <p className="product-price"></p>
                <p className="product-actual-price">
                  <span className="product-price" style={{ color: "#27ae60", fontWeight: "bold", fontSize: '20px' }}>
                    ₹{product.prod_price}
                  </span>

                  <span>
                    <span style={{ color: 'black', marginLeft: '5px', marginRight: '3px' }}>
                      M.R.P
                    </span>
                    <span style={{ textDecoration: "line-through", color: 'red' }}>₹{product.actual_price}</span>
                  </span>
                  <br />
                  <span className="discount" style={{ color: "green", marginLeft: "5px" }}>
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
                    }}
                    className="out-of-stock"
                  >
                    Out of Stock
                  </p>
                ) : (
                  <button
                    onClick={(event) => handleAddToCart(product, event)}
                    className="add-to-cartt"
                  >
                    Add to cart
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
     {visibleProductsMobiles.length < groupedProducts.Mobiles.length && (
//  <div className="load-more" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
//  {showSeeMoreMobiles ? (
//    <button
//      style={{ display: "flex", alignItems: "center", border: "2px solid #3498db", padding: "10px 20px", backgroundColor: "#3498db", color: "white", fontWeight: "bold", borderRadius: "30px", cursor: "pointer", transition: "all 0.3s ease", textTransform: "uppercase", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
//      onClick={() => navigate(`/Mobiles`)} // Navigate to the Mobiles category page
//    >
//      <span style={{ marginRight: '10px' }}>See More...</span>
//    </button>
//  ) : (
//    <button
//      onClick={() => {
//        loadMoreProducts('Mobiles'); // Pass 'Mobiles' as the category
//        setShowSeeMoreMobiles(true); // Hide arrow and show "See More..." text for Mobiles
//      }}
//      className="button-with-image"
//    >
//      {/* <span>Next</span> */}
//      {groupedProducts.Mobiles.length > 5 && (
//        <img src={right} width="30px" alt="Right arrow" />
//      )}
//    </button>
//  )}
// </div>
<div className="load-more" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
{showSeeMoreMobiles ? (
  <span
    style={{ marginLeft: '10px', color: '#000', fontWeight: 'bold' }}
    onClick={() => navigate(`/Mobiles`)} // Navigate to the Mobiles category page
  >
    See More...
  </span>
) : (
  // Only show the arrow if there are more than 5 products remaining
  groupedProducts.Mobiles.length > 5 && (
    <img src={right} loading="lazy" width={'30px'}  
    onClick={() => {
          loadMoreProducts('Mobiles'); // Pass 'Mobiles' as the category
          setShowSeeMoreMobiles(true); // Hide arrow and show "See More..." text for Mobiles
        }}
     alt="" />
    // <FaChevronRight
    //   size={20}
    //   color="#000"
    //   onClick={() => {
    //     loadMoreProducts('Mobiles'); // Pass 'Mobiles' as the category
    //     setShowSeeMoreMobiles(true); // Hide arrow and show "See More..." text for Mobiles
    //   }}
    // />
  )
)}
</div>

)}






      <ToastContainer />
    </div>
        
  
        {/* Display Computers */}
        <div className="product-section">
        <div className="product-row">
      <div className="product-items">
      {groupedProducts.Computers.length === 0 ? null : (

          visibleProductsComputers.map((product, index) => {
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
                    loading="lazy"

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
                <h3 className="product-name">{product.prod_name}</h3>
                <span className="product-subtitle">{product.subtitle}</span>
                <p className="product-price"></p>
                <p className="product-actual-price">
                  <span className="product-price" style={{ color: "#27ae60", fontWeight: "bold", fontSize: '20px' }}>
                    ₹{product.prod_price}
                  </span>

                  <span>
                    <span style={{ color: 'black', marginLeft: '5px', marginRight: '3px' }}>
                      M.R.P
                    </span>
                    <span style={{ textDecoration: "line-through", color: 'red' }}>₹{product.actual_price}</span>
                  </span>
                  <br />
                  <span className="discount" style={{ color: "green", marginLeft: "5px" }}>
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
                    }}
                    className="out-of-stock"
                  >
                    Out of Stock
                  </p>
                ) : (
                  <button
                    onClick={(event) => handleAddToCart(product, event)}
                    className="add-to-cartt"
                  >
                    Add to cart
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      {visibleProductsComputers.length < groupedProducts.Computers.length && (
  <div className="load-more" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
    {showSeeMoreComputers ? (
      <span
        style={{ marginLeft: '10px', color: '#000', fontWeight: 'bold' }}
        onClick={() => navigate(`/Computers`)} // Navigate to the Computers category page
      >
        See More...
      </span>
    ) : (
      // Only show the arrow if there are more than 5 products remaining
      groupedProducts.Computers.length > 5 && (
        <img src={right} loading="lazy" width={'30px'}  
        onClick={() => {
              loadMoreProducts('Computers'); // Pass 'Computers' as the category
              setShowSeeMoreComputers(true); // Hide arrow and show "See More..." text for Computers
            }}
         alt="" />
        // <FaChevronRight
        //   size={20}
        //   color="#000"
        //   onClick={() => {
        //     loadMoreProducts('Computers'); // Pass 'Computers' as the category
        //     setShowSeeMoreComputers(true); // Hide arrow and show "See More..." text for Computers
        //   }}
        // />
      )
    )}
  </div>
)}


    </div>


      </div>
        <div className="product-section">
        <div className="product-row">
      <div className="product-items">
      {groupedProducts.CCTV.length === 0 ? null : (

          visibleProductsCCTV.map((product, index) => {
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
                    loading="lazy"
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
                <h3 className="product-name">{product.prod_name}</h3>
                <span className="product-subtitle">{product.subtitle}</span>
                <p className="product-price"></p>
                <p className="product-actual-price">
                  <span className="product-price" style={{ color: "#27ae60", fontWeight: "bold", fontSize: '20px' }}>
                    ₹{product.prod_price}
                  </span>

                  <span>
                    <span style={{ color: 'black', marginLeft: '5px', marginRight: '3px' }}>
                      M.R.P
                    </span>
                    <span style={{ textDecoration: "line-through", color: 'red' }}>₹{product.actual_price}</span>
                  </span>
                  <br />
                  <span className="discount" style={{ color: "green", marginLeft: "5px" }}>
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
                    }}
                    className="out-of-stock"
                  >
                    Out of Stock
                  </p>
                ) : (
                  <button
                    onClick={(event) => handleAddToCart(product, event)}
                    className="add-to-cartt"
                  >
                    Add to cart
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      {visibleProductsCCTV.length < groupedProducts.CCTV.length && (
  <div className="load-more" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
    {showSeeMoreCCTV ? (
      <span
        style={{ marginLeft: '10px', color: '#000', fontWeight: 'bold' }}
        onClick={() => navigate(`/CCTV`)} // Navigate to the CCTV category page
      >
        See More...
      </span>
    ) : (
      // Only show the arrow if there are more than 5 products remaining
      groupedProducts.CCTV.length > 5 && (
        <img src={right} loading="lazy" width={'30px'}  
          onClick={() => {
            loadMoreProducts('CCTV'); // Pass 'CCTV' as the category
            setShowSeeMoreCCTV(true); // Hide arrow and show "See More..." text for CCTV
          }}
         alt="" />
        // <FaChevronRight
        //   size={20}
        //   color="#000"
        //   onClick={() => {
        //     loadMoreProducts('CCTV'); // Pass 'CCTV' as the category
        //     setShowSeeMoreCCTV(true); // Hide arrow and show "See More..." text for CCTV
        //   }}
        // />
      )
    )}
  </div>
)}


    </div>


      </div>
        <div className="product-section">
        <div className="product-row">
      <div className="product-items">
      {groupedProducts.Printers.length === 0 ? null : (

          visibleProductsPrinters.map((product, index) => {
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
                    loading="lazy"

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
                <h3 className="product-name">{product.prod_name}</h3>
                <span className="product-subtitle">{product.subtitle}</span>
                <p className="product-price"></p>
                <p className="product-actual-price">
                  <span className="product-price" style={{ color: "#27ae60", fontWeight: "bold", fontSize: '20px' }}>
                    ₹{product.prod_price}
                  </span>

                  <span>
                    <span style={{ color: 'black', marginLeft: '5px', marginRight: '3px' }}>
                      M.R.P
                    </span>
                    <span style={{ textDecoration: "line-through", color: 'red' }}>₹{product.actual_price}</span>
                  </span>
                  <br />
                  <span className="discount" style={{ color: "green", marginLeft: "5px" }}>
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
                    }}
                    className="out-of-stock"
                  >
                    Out of Stock
                  </p>
                ) : (
                  <button
                    onClick={(event) => handleAddToCart(product, event)}
                    className="add-to-cartt"
                  >
                    Add to cart
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      {visibleProductsPrinters.length < groupedProducts.Printers.length && (
  <div className="load-more" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
    {showSeeMorePrinters ? (
      <span
        style={{ marginLeft: '10px', color: '#000', fontWeight: 'bold' }}
        onClick={() => navigate(`/Printers`)} // Navigate to the Printers category page
      >
        See More...
      </span>
    ) : (
      // Only show the arrow if there are more than 5 products remaining
      groupedProducts.Printers.length > 5 && (
        <img src={right} width={'30px'}  
           onClick={() => {
            loadMoreProducts('Printers'); // Pass 'Printers' as the category
            setShowSeeMorePrinters(true); // Hide arrow and show "See More..." text for Printers
          }}
       alt="" />
        // <FaChevronRight
        
        //   size={20}
        //   color="#000"
        //   onClick={() => {
        //     loadMoreProducts('Printers'); // Pass 'Printers' as the category
        //     setShowSeeMorePrinters(true); // Hide arrow and show "See More..." text for Printers
        //   }}
        // />
      )
    )}
  </div>
)}



    </div>

      </div>


      </div>
  


      {/* Display Accessories */}
      <div className="product-section">
      <div className="product-row">
      <div className="product-items">
        {/* Mapping and rendering product categories */}
        {accessories.slice(visibleItemsCount - 5, visibleItemsCount).map((product, index) => {
          const images = Array.isArray(product.prod_img) ? product.prod_img : JSON.parse(product.prod_img || "[]");
          const firstImage = images.length > 0 ? images[0] : null;

          return (
            <div key={index} className="product" onClick={() => handleProductClick(product.id)}>
              {product.offer_label && <div className="product-label">{product.offer_label}</div>}
              {firstImage ? (
                <img loading="lazy" src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`} alt={product.prod_name} className="product-first-image" />
              ) : <div>No image available</div>}
              
              <span title="Add to Wishlist" className={`favorite-icon ${favorites[`${product.prod_name}-${product.id}`] ? "filled" : ""}`} onClick={(event) => handleToggleFavorite(product, event)}>
                {favorites[`${product.prod_name}-${product.id}`] ? <FaHeart /> : <FaRegHeart />}
              </span>
              
              <h3 className="product-name">{product.prod_name}</h3>
              <p className="product-price" style={{ color: "#27ae60", fontWeight: "bold" }}></p>
              <p className="product-actual-price">
                <span className="product-price" style={{ color: "#27ae60", fontWeight: "bold", fontSize: '20px' }}>
                  ₹{product.prod_price}
                </span>
                <span>
                  <span style={{ color: 'black', marginLeft: '5px', marginRight: '3px' }}>M.R.P</span>
                  <span style={{ textDecoration: "line-through", color: 'red' }}>₹{product.actual_price}</span>
                </span>
                <br />
                <span className="discount" style={{ color: "green", marginLeft: "5px" }}>
                  ({Math.round(((product.actual_price - product.prod_price) / product.actual_price) * 100)}% OFF)
                </span>
              </p>

              {product.status === "unavailable" ? (
                <p className="out-of-stock" style={{ color: "red", fontWeight: "bold", fontSize: "16px", textAlign: "center", marginTop: "10px", padding: "10px" }}>
                  Out of Stock
                </p>
              ) : (
                <button onClick={(event) => handleAddToCart(product, event)} className="add-to-cartt">Add to cart</button>
              )}
            </div>
          );
        })}

        {/* Load More button and functionality */}
       
      </div>
      {visibleItemsCount < accessories.length && (
          <div className="load-more" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            {/* <FaChevronRight
              size={20}
              color="#000"
              onClick={loadMoreAccessories} // Load more products when clicked
            /> */}
                <img loading="lazy" src={right} width={'30px'}  
                        onClick={loadMoreAccessories} // Load more products when clicked

         alt="" />
          </div>
        )}
    </div>


</div>

<div className="product-section">
      <div className="product-row">
      <div className="product-items">
        {/* Mapping and rendering product categories */}
        {audio.slice(visibleItemsCount2 - 5, visibleItemsCount2).map((product, index) => {
          const images = Array.isArray(product.prod_img) ? product.prod_img : JSON.parse(product.prod_img || "[]");
          const firstImage = images.length > 0 ? images[0] : null;

          return (
            <div key={index} className="product" onClick={() => handleProductClick(product.id)}>
              {product.offer_label && <div className="product-label">{product.offer_label}</div>}
              {firstImage ? (
                <img loading="lazy" src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`} alt={product.prod_name} className="product-first-image" />
              ) : <div>No image available</div>}
              
              <span title="Add to Wishlist" className={`favorite-icon ${favorites[`${product.prod_name}-${product.id}`] ? "filled" : ""}`} onClick={(event) => handleToggleFavorite(product, event)}>
                {favorites[`${product.prod_name}-${product.id}`] ? <FaHeart /> : <FaRegHeart />}
              </span>
              
              <h3 className="product-name">{product.prod_name}</h3>
              <p className="product-price" style={{ color: "#27ae60", fontWeight: "bold" }}></p>
              <p className="product-actual-price">
                <span className="product-price" style={{ color: "#27ae60", fontWeight: "bold", fontSize: '20px' }}>
                  ₹{product.prod_price}
                </span>
                <span>
                  <span style={{ color: 'black', marginLeft: '5px', marginRight: '3px' }}>M.R.P</span>
                  <span style={{ textDecoration: "line-through", color: 'red' }}>₹{product.actual_price}</span>
                </span>
                <br />
                <span className="discount" style={{ color: "green", marginLeft: "5px" }}>
                  ({Math.round(((product.actual_price - product.prod_price) / product.actual_price) * 100)}% OFF)
                </span>
              </p>

              {product.status === "unavailable" ? (
                <p className="out-of-stock" style={{ color: "red", fontWeight: "bold", fontSize: "16px", textAlign: "center", marginTop: "10px", padding: "10px" }}>
                  Out of Stock
                </p>
              ) : (
                <button onClick={(event) => handleAddToCart(product, event)} className="add-to-cartt">Add to cart</button>
              )}
            </div>
          );
        })}

        {/* Load More button and functionality */}
       
      </div>
      {visibleItemsCount2 < audio.length && (
          <div className="load-more" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                <img src={right} width={'30px'}  
                        onClick={loadMoreAudio} // Load more products when clicked

         alt="" />
            {/* <FaChevronRight
              size={20}
              color="#000"
              onClick={loadMoreAudio} // Load more products when clicked
            /> */}
          </div>
        )}
    </div>


</div>

    </section>
  );
  

};

export default ProductList;