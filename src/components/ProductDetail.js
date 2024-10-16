import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the product ID from the URL
import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiUrl } from "./ApiUrl"; // Adjust the import path accordingly
import "./css/ProductDetail.css"; // Ensure you create this CSS file
import Header2 from "./Header2";
import Sidebar from "./Sidebar";
import { FaHeart } from "react-icons/fa"; // Import the heart icon from react-icons
import Footer from "./footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate at the top
// import Slider from "react-slick"; // Import the slider component

import { useCart } from "../components/CartContext";
import leftarrow from "./img/left.png";
import rightarrow from "./img/right.png";
import pricetag from "./img/check-mark.png";
import tag from "./img/percent.png";
import offertag from "./img/sale.png";

const ProductDetail = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const { addToWishlist, removeFromWishlist } = useCart();
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State to track the currently selected image

  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);

  const handleNext2 = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev2 = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  const itemsToShow = 4;

  const filteredProducts = relatedProducts.filter(
    (relatedProduct) => relatedProduct.id !== product.id
  );

  const handleNext = () => {
    if (currentStartIndex + 1 < filteredProducts.length - itemsToShow + 1) {
      setCurrentStartIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStartIndex > 0) {
      setCurrentStartIndex((prevIndex) => prevIndex - 1);
    }
  };
  // Sort related products to prioritize matching product name (exact and partial)
  const sortedFilteredProducts = filteredProducts.slice().sort((a, b) => {
    const currentProductName = product.prod_name.trim().toLowerCase(); // Trim and lower case the main product name
    const nameA = a.prod_name.trim().toLowerCase(); // Trim and lower case for comparison
    const nameB = b.prod_name.trim().toLowerCase(); // Trim and lower case for comparison

    // Log the current product name and the names of the related products
    // console.log("Current Product Name:", currentProductName);
    // console.log("Comparing with Related Product A:", nameA);
    // console.log("Comparing with Related Product B:", nameB);

    // Extract relevant keywords from the current product name
    const keywords = currentProductName.split(" "); // Split into keywords
    const isAKeywordMatch = keywords.some((keyword) => nameA.includes(keyword)); // Check for any keyword match in product A
    const isBKeywordMatch = keywords.some((keyword) => nameB.includes(keyword)); // Check for any keyword match in product B

    // Log whether each product matches the current product
    // console.log(`Is A a Match? ${isAKeywordMatch} | Is B a Match? ${isBKeywordMatch}`);

    // If A matches and B does not, A comes first
    if (isAKeywordMatch && !isBKeywordMatch) return -1;
    // If B matches and A does not, B comes first
    if (!isAKeywordMatch && isBKeywordMatch) return 1;
    // If both match or neither matches, maintain original order
    return 0;
  });

  // Log the sorted related products
  // console.log("Sorted Related Products:", sortedFilteredProducts);

  const handleProductClick = (productId) => {
    // Navigate to the product detail page
    navigate(`/product/${productId}`);
    window.location.reload();
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get(
          `${ApiUrl}/products/related/${product.category}`
        );
        setRelatedProducts(response.data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/products/${id}`);
        setProduct(response.data);
        // Set the initial selected image
        const images = Array.isArray(response.data.prod_img)
          ? response.data.prod_img
          : JSON.parse(response.data.prod_img || "[]");
        setSelectedImage(images[0]); // Set the first image as the default selected image
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Error fetching product details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    // Initialize isFavorite based on localStorage or any other state management
    const email = localStorage.getItem("email");
    if (email && product) {
      // Check if product is not null
      const wishlistKey = `${email}-wishlist`;
      const wishlistData = JSON.parse(localStorage.getItem(wishlistKey)) || [];
      const productIsFavorite = wishlistData.some(
        (item) => item.id === product.id // Check for product.id only if product is not null
      );
      setIsFavorite(productIsFavorite);
    }
  }, [product]); // Dependency on product

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
            actual_price: product.actual_price,
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

  const toggleFavorite = async (product, event) => {
    console.log("product", product);

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
          const wishlistData =
            JSON.parse(localStorage.getItem(wishlistKey)) || [];
          console.log("wishlistData", wishlistData); // Check if all the necessary product details are stored.

          const updatedWishlistData = wishlistData.filter(
            (item) => item.id !== product.id
          );
          localStorage.setItem(
            wishlistKey,
            JSON.stringify(updatedWishlistData)
          );

          // Remove product from "favourites"
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
          const wishlistData =
            JSON.parse(localStorage.getItem(wishlistKey)) || [];
          const productInWishlist = wishlistData.some(
            (item) => item.id === product.id
          );

          if (!productInWishlist) {
            // Store the product details into localStorage
            wishlistData.push(product);
            console.log("Wishlist Data Before Saving:", wishlistData); // Log wishlist before saving
            localStorage.setItem(wishlistKey, JSON.stringify(wishlistData));
          }

          // Store the product name with "faredheart" in a comma-separated string
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

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner" style={{ marginTop: "200px" }}>
          {[...Array(12)].map((_, index) => (
            <div key={index} className="spinner-blade"></div>
          ))}
        </div>
      </div>
    ); // You can replace this with a loading spinner or skeleton screen
  }

  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 3, // Number of slides to show at once
  //   slidesToScroll: 1,
  //   responsive: [
  //     {
  //       breakpoint: 1024, // For medium screens
  //       settings: {
  //         slidesToShow: 2, // Number of slides to show at once
  //         slidesToScroll: 1,
  //       },
  //     },
  //     {
  //       breakpoint: 600, // For small screens
  //       settings: {
  //         slidesToShow: 1, // Number of slides to show at once
  //         slidesToScroll: 1,
  //       },
  //     },
  //   ],
  // };

  if (!product) {
    return <div>Product not found.</div>;
  }
  // Check if prod_img is in a valid format
  const images = Array.isArray(product.prod_img)
    ? product.prod_img
    : JSON.parse(product.prod_img || "[]");

  // const firstImage = images.length > 0 ? images[0] : null; // Get the first image or null if not available

  const couponCode = product.coupon; // e.g., "OFF2499"

  // Ensure couponCode is a valid string and contains digits
  let couponNumber = null; // Default to null in case there's no number

  if (typeof couponCode === "string") {
    const match = couponCode.match(/(\d+)/);
    if (match) {
      couponNumber = match[0]; // Extract the number if a match is found
    }
  }

  // Now you can safely use couponNumber
  console.log(couponNumber); // Will log the coupon number or null if not found

  return (
    <>
      <Header2 />
      <div className="main-container">
        <Sidebar />
        <div className="product-detail-container">
          {/* Main Image and Product Details in the same row */}
          <div className="product-main-row">
            <div className="product-detail-image-container">
              {product.offer_label && (
                <div className="product-label2">{product.offer_label}</div>
              )}
              <div className="carousel-container">
                {images.length > 1 && (
                  <img
                    src={leftarrow}
                    onClick={handlePrev2}
                    className="carousel-arrow left-arrow"
                    width={"37px"}
                    alt=""
                  />

                  // <button onClick={handlePrev2} className="carousel-arrow left-arrow">
                  //   &lt;
                  // </button>
                )}

                {images.length > 0 && currentIndex < images.length ? (
                  <img
                    src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${
                      images[currentIndex]
                    }`}
                    alt={product.prod_name}
                    className="product-detail-carousel-image"
                  />
                ) : (
                  <div>No image available</div> // Fallback message if no image is available
                )}

                {images.length > 1 && (
                  // <button onClick={handleNext2} className="carousel-arrow right-arrow">
                  //   &gt;
                  // </button>
                  <img
                    src={rightarrow}
                    onClick={handleNext2}
                    style={{ marginTop: "-10px" }}
                    className="carousel-arrow right-arrow"
                    width={"37px"}
                    alt=""
                  />
                )}
              </div>
            </div>

            {/* Product details */}
            <div className="product-detail-info">
              <h2 className="product-detail-title">{product.prod_name}</h2>
              <p>
                <span>
                  <span className="product-detail-price">
                    ₹{product.prod_price}{" "}
                  </span>{" "}
                  <span
                    className="product-detail-actual-price"
                    style={{ textDecoration: "line-through" }}
                  >
                    ₹{product.actual_price}{" "}
                  </span>
                </span>
                <span className="offer-text" style={{ marginLeft: "12px" }}>
                  <span className="save-tag" style={{ marginLeft: "5px" }}>
                    {/*   <img src={offertag} width={'20px'}  alt="" />  */}
                    <span>
                      {Math.round(
                        ((product.actual_price - product.prod_price) /
                          product.actual_price) *
                          100
                      )}
                      % OFF
                    </span>
                  </span>
                </span>
                {/* <span className="offerr-tag">Save upto</span>
  <span className="discount-amount">₹{product.actual_price - product.prod_price}</span> */}
              </p>

              {/* </p> */}
              <p className="product-detail-price"></p>
              {product.status === "unavailable" ? (
                <p className="product-detail-out-of-stock">Out of Stock</p>
              ) : (
                <div className="add-to-cart-container">
                  <button
                    title="Add to cart"
                    onClick={(event) => handleAddToCart(product, event)}
                    className="product-detail-add-to-cart"
                  >
                    Add to cart
                  </button>
                  <FaHeart
                    title="Add to wishlist"
                    className={`heart-icon ${isFavorite ? "filled" : ""}`}
                    onClick={(event) => toggleFavorite(product, event)}
                  />
                </div>
              )}

              <div className="coupon-box">
                {product?.coupon?.length > 0 ? (
                  <>
                    <div className="dashedborder">
                      <center>
                        <div className="coupon3">
                          {/* Coupon Code */}
                          <img src={tag} width={"30px"} alt="Price Tag" />
                          <span style={{ marginLeft: "2px" }}>
                            {product.coupon}
                          </span>
                        </div>
                      </center>
                      <h4 className="coupon-title">
                        Rs.{couponNumber}{" "}
                        <span className="discountlabel">Discount</span>
                      </h4>
                    </div>
                  </>
                ) : (
                  <h4 className="coupon-title">
                    {/* Rs.{product.prod_price} <span className="discountlabel">No Discount</span> */}
                  </h4>
                )}
                <div className="price-table">
                  <div className="price-row">
                    <div className="price-cell">
                      <span className="price-label">Actual Price</span>
                      <span className="actual-priceee">
                        ₹
                        {product?.coupon?.length > 0
                          ? product.prod_price
                          : product?.actual_price}
                      </span>
                    </div>
                    <div className="price-cell">
                      <span className="price-label">Discounted Price</span>
                      <span className="discounted-priceee">
                        ₹
                        {product?.coupon?.length > 0
                          ? couponNumber
                          : product?.actual_price - product?.prod_price}
                      </span>
                    </div>
                    <div className="price-cell">
                      <span className="price-label">Effective Price</span>
                      <span className="total-priceee">
                        ₹
                        {product?.coupon?.length > 0
                          ? product.prod_price - couponNumber
                          : product?.prod_price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="product-features-row">
            <h3 className="product-features-title">Key Specifications</h3>
            <ul className="product-feature-list">
              {product.prod_features.split("|").map((feature, index) => (
                <li
                  key={index}
                  style={{
                    background: "linear-gradient(to right, #ffe5b4, #fff3e0)", // Double colors (light orange shades)
                    padding: "10px", // Padding for better spacing
                    borderRadius: "5px", // Rounded corners
                    margin: "5px 0", // Margin between items
                    display: "flex", // Flexbox for alignment
                    alignItems: "center", // Center align items vertically
                  }}
                >
                  <span>
                    <img src={pricetag} width={"25px"} alt="Price Tag" />
                  </span>
                  <span style={{ marginLeft: "5px", marginTop: "-5px" }}>
                    {" "}
                    {feature.trim()}{" "}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* // Inside the JSX where you display related products */}
          {sortedFilteredProducts.length > 0 && (
            <div className="related-products-section">
              <h3 style={{ marginBottom: "10px" }}>You might also like</h3>
              <div className="related-products-carousel">
                {sortedFilteredProducts.length > 4 && (
                  <button
                    onClick={handlePrev}
                    className="carousel-arrow left-arrow"
                  >
                    &lt;
                  </button>
                )}

                <div className="related-products-grid">
                  {sortedFilteredProducts
                    .slice(currentStartIndex, currentStartIndex + itemsToShow)
                    .map((relatedProduct) => {
                      // Parse the prod_img string into an array
                      const images = JSON.parse(relatedProduct.prod_img);
                      // Get the first image from the array
                      const firstImage = images[0];

                      return (
                        <div
                          key={relatedProduct.id}
                          onClick={() => handleProductClick(relatedProduct.id)}
                          className="related-product-card"
                        >
                          {relatedProduct.offer_label && (
                            <div className="product-label">
                              {relatedProduct.offer_label}
                            </div>
                          )}
                          <img
                            src={`${ApiUrl}/uploads/${relatedProduct.category.toLowerCase()}/${firstImage}`}
                            alt={relatedProduct.prod_name}
                            className="related-product-image"
                          />
                          <p className="related-product-name">
                            {relatedProduct.prod_name}
                          </p>
                          {/* <p className="related-product-features">
                  {relatedProduct.prod_features}
                </p> */}
                          <p className="product-actual-price">
                            <span style={{ textDecoration: "line-through" }}>
                              ₹{relatedProduct.actual_price}{" "}
                            </span>
                            <span
                              style={{ color: "green", marginLeft: "10px" }}
                            >
                              (
                              {Math.round(
                                ((relatedProduct.actual_price -
                                  relatedProduct.prod_price) /
                                  relatedProduct.actual_price) *
                                  100
                              )}
                              % OFF)
                            </span>
                          </p>
                          <p className="related-product-price">
                            ₹{relatedProduct.prod_price}
                          </p>
                        </div>
                      );
                    })}
                </div>
                {sortedFilteredProducts.length > 4 && (
                  <button
                    onClick={handleNext}
                    className="carousel-arrow right-arrow"
                  >
                    &gt;
                  </button>
                )}
              </div>
            </div>
          )}
          <ToastContainer />
        </div>
      </div>

      {/* Related Products Section */}

      <Footer />
    </>
  );
};

export default ProductDetail;
