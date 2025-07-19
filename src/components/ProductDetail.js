import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom"; // Import useParams to get the product ID from the URL
import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiUrl } from "./ApiUrl"; // Adjust the import path accordingly
import "./css/ProductDetail.css"; // Ensure you create this CSS file
// import Header2 from "./Header2";
// import Sidebar from "./Sidebar";
import { FaBolt, FaHeart, FaRegHeart, } from "react-icons/fa"; // Import the heart icon from react-icons
import Footer from "./footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate at the top
import Slider from "react-slick"; // Import the slider component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Ensure styles are applied
import RecentlyViewed from "./RecentlyViewed";
// import ZoomInCursor from './img/zoom-in.cur'

// import {} from "react-icons/fa";

import {
  FaMemory,
  FaHdd,
  FaCamera,
  FaMicrochip,
  FaTv,
  FaBatteryFull,
  FaWifi,
  FaApple,
} from "react-icons/fa"; // Import necessary icons

// import { useCart } from "../components/CartContext";
import leftarrow from "./img/left.png";
import rightarrow from "./img/right.png";
import Swal from "sweetalert2";
// import pricetag from "./img/check-mark.png";
// import tag from "./img/percent.png";
// import offertag from "./img/sale.png";
// import couponimg from "./img/couponcode.png";
// import FullAdPage from "./FullAdPage";
// import Header2 from './Header2'
const ProductDetail = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // const { addToWishlist, removeFromWishlist } = useCart();
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State to track the currently selected image
  const [, setIsAdding] = useState(false); // Track the adding state to prevent multiple clicks
  // const [currentStartIndex, setCurrentStartIndex] = useState(0);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [showCarousel, setShowCarousel] = useState(false);
  const [relatedAccessories, setRelatedAccessories] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  // const [addToCartTriggered, setAddToCartTriggered] = useState(false); // Track if add to cart was triggered
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState({}); // State to hold coupon codes for products
  const [favorites, setFavorites] = useState({});
  const [, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (remove this in real API calls)
    setTimeout(() => setLoading(false), 1000);
  }, []);
  // State for storing related items
  const [relatedItems, setRelatedItems] = useState([]);
  // State for tracking the current index for carousel
  // const [currentStartIndex2, setStartIndex] = useState(0);

  const [remainingTime, setRemainingTime] = useState(null);
  const [isOfferActive, setIsOfferActive] = useState(true);

  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);
  const [lensBoxStyle, setLensBoxStyle] = useState({});
  const [showLensBox, setShowLensBox] = useState(false);


  const zoomRef = useRef(null);

  useEffect(() => {
    if (product && product.offer_end_time) {
      const now = new Date();
      const offerEndTime = new Date(product.offer_end_time);

      // Set offer active based on whether the offer end time is in the future
      setIsOfferActive(offerEndTime > now);
    }
  }, [product]);

  useEffect(() => {
    const getSimilarProducts = async () => {
      try {
        const apiResponse = await axios.get(
          `${ApiUrl}/products2/related/${product.category}`
        );
        setRelatedItems(apiResponse.data);
      } catch (err) {
        console.error("Error retrieving related items:", err);
      }
    };

    if (product) {
      getSimilarProducts();
    }
  }, [product]);

  // const maxDisplayItems = 5;

  // Filter products to remove the current product from related items
  const productsExcludingCurrent = relatedItems.filter(
    (item) => item.id !== product.id
  );

  // Handle next slide in carousel
  // const handleNextSlide = () => {
  //   if (
  //     currentStartIndex2 + 1 <
  //     productsExcludingCurrent.length - maxDisplayItems + 1
  //   ) {
  //     setStartIndex((prev) => prev + 1);
  //   }
  // };

  // Handle previous slide in carousel
  // const handlePreviousSlide = () => {
  //   if (currentStartIndex2 > 0) {
  //     setStartIndex((prev) => prev - 1);
  //   }
  // };

  // Sort related products based on keyword matches from the current product name
  const prioritizedRelatedItems = productsExcludingCurrent
    .slice()
    .sort((itemA, itemB) => {
      const productName = product.prod_name.trim().toLowerCase();
      const itemAName = itemA.prod_name.trim().toLowerCase();
      const itemBName = itemB.prod_name.trim().toLowerCase();

      // Get keywords from the product name
      const keywords = productName.split(" ");
      const itemAHasKeyword = keywords.some((keyword) =>
        itemAName.includes(keyword)
      );
      const itemBHasKeyword = keywords.some((keyword) =>
        itemBName.includes(keyword)
      );

      // Prioritize items based on keyword match
      if (itemAHasKeyword && !itemBHasKeyword) return -1;
      if (!itemAHasKeyword && itemBHasKeyword) return 1;
      return 0;
    });

  const handleCheckboxChange = (event, accessoryId) => {
    if (event.target.checked) {
      // Add the accessory ID to the selected accessories array
      setSelectedAccessories((prev) => [...prev, accessoryId]);
    } else {
      // Remove the accessory ID from the selected accessories array
      setSelectedAccessories((prev) => prev.filter((id) => id !== accessoryId));
    }
  };

  // const handleNext2 = () => {
  //   setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  // };

  // const handlePrev2 = () => {
  //   setCurrentIndex(
  //     (prevIndex) => (prevIndex - 1 + images.length) % images.length
  //   );
  // };

  // const itemsToShow = 5;

  const filteredProducts = relatedProducts.filter(
    (relatedProduct) => relatedProduct.id !== product.id
  );

  // const handleNext = () => {
  //   if (currentStartIndex + 1 < filteredProducts.length - itemsToShow + 1) {
  //     setCurrentStartIndex((prevIndex) => prevIndex + 1);
  //   }
  // };

  // const handlePrev = () => {
  //   if (currentStartIndex > 0) {
  //     setCurrentStartIndex((prevIndex) => prevIndex - 1);
  //   }
  // };

  // Sort related products to prioritize matching product name (exact and partial)
  const s = filteredProducts.slice().sort((a, b) => {
    const currentProductName = product.prod_name.trim().toLowerCase(); // Trim and lower case the main product name
    const nameA = a.prod_name.trim().toLowerCase(); // Trim and lower case for comparison
    const nameB = b.prod_name.trim().toLowerCase(); // Trim and lower case for comparison

    // Extract relevant keywords from the current product name
    const keywords = currentProductName.split(" "); // Split into keywords
    const isAKeywordMatch = keywords.some((keyword) => nameA.includes(keyword)); // Check for any keyword match in product A
    const isBKeywordMatch = keywords.some((keyword) => nameB.includes(keyword)); // Check for any keyword match in product B

    // If A matches and B does not, A comes first
    if (isAKeywordMatch && !isBKeywordMatch) return -1;
    // If B matches and A does not, B comes first
    if (!isAKeywordMatch && isBKeywordMatch) return 1;
    // If both match or neither matches, maintain original order
    return 0;
  });

  // Log the sorted related products
  // console.log("Sorted Related Products:", s);

  const handleProductClick = (product) => {
    const slugify = (name) =>
      name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    navigate(`/shop/${product.id}-${slugify(product.prod_name)}`);
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
        const productData = response.data;
        setProduct(productData);

        // Set the initial selected image
        const prodImages = Array.isArray(productData.prod_img)
          ? productData.prod_img
          : JSON.parse(productData.prod_img || "[]");
        setImages(prodImages);
        setSelectedImage(0); // Set the first image as the default selected image

        // Fetch coupon using product ID after the product is set
        const couponResponse = await axios.get(
          `${ApiUrl}/coupons/${productData.prod_id}`
        );
        console.log(
          `Coupon Response for product ${productData.prod_id}:`,
          couponResponse.data
        );

        if (couponResponse.data.coupons.length > 0) {
          console.log(
            `Coupons found for product ${productData.prod_id}:`,
            couponResponse.data.coupons
          );

          // Set the first coupon code for the product
          setCoupons((prev) => ({
            ...prev,
            [productData.prod_id]: couponResponse.data.coupons[0].coupon_code,
          }));
          console.log(
            `Set coupon code for product ${productData.prod_id}: ${couponResponse.data.coupons[0].coupon_code}`
          );
        } else {
          console.log(`No coupons found for product ${productData.prod_id}.`);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        // toast.error("Error fetching product details.");
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

  // const handleAddToCart2 = async (selectedAccessories, event) => {
  //   if (!event) return;
  //   event.stopPropagation(); // Prevent event bubbling

  //   const email = localStorage.getItem("email");

  //   if (!email) {
  //     toast.error("User is not logged in!", {
  //       position: "top-right",
  //       autoClose: 2000,
  //     });
  //     window.location.href = "/login";
  //     return;
  //   }

  //   setIsAdding(true); // Disable button while processing

  //   try {
  //     for (const accessoryId of selectedAccessories) {
  //       const accessory = relatedAccessories.find(
  //         (acc) => acc.id === accessoryId
  //       );
  //       if (accessory) {
  //         await axios.post(`${ApiUrl}/add-to-cart`, {
  //           email,
  //           productId: accessory.id,
  //           quantity: 1,
  //         });
  //         const shortName = accessory.prod_name.length > 30
  //           ? accessory.prod_name.substring(0, 27) + "..."
  //           : accessory.prod_name;

  //         toast.success(`${shortName} added to your cart!`, {
  //           position: "top-right",
  //           autoClose: 2000,
  //         });



  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error adding item to cart:", error);
  //     toast.error("Failed to add item to cart", {
  //       position: "top-right",
  //       autoClose: 2000,
  //     });
  //   } finally {
  //     setIsAdding(false); // Enable button after completion
  //   }
  // };

  const handleBuyNowWithAccessories = (selectedAccessories, event) => {
    event.stopPropagation(); // Prevent the event from bubbling up

    if (selectedAccessories.length === 0) {
      toast.warn("Please select at least one accessory!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Exit the function if no accessory is selected
    }

    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("User is not logged in!", {
        position: "top-right",
        autoClose: 2000,
      });
      window.location.href = "/login";
      return;
    }

    const prod_price =
      product.offer_price > 0 && isOfferActive
        ? product.offer_price
        : product.prod_price;

    // Get accessory details
    const selectedAccessoryDetails = relatedAccessories.filter((acc) =>
      selectedAccessories.includes(acc.id)
    );

    // Navigate to purchase page with both product and accessories
    navigate("/purchase", {
      state: {
        product: {
          ...product,
          prod_price,
          accessories: selectedAccessoryDetails, // Embed accessories inside product
        },
        email,
      },
    });

    console.log("Navigating with product and accessories", product, selectedAccessoryDetails);
  };


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

  const handleBuyNow = (product, event) => {
    event.stopPropagation(); // Prevent the event from bubbling up

    // Check if the user is logged in
    const email = localStorage.getItem("email");
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

    const prod_price =
      product.offer_price > 0 && isOfferActive
        ? product.offer_price
        : product.prod_price;

    // Navigate to the purchase page with product details
    navigate("/purchase", {
      // state: { product, email }, // Pass the product details and email (if needed)
      state: { product: { ...product, prod_price }, email }, // Pass updated product details
    });
    console.log("product", product);
  };
  const handleToggleFavorite = async (product, event) => {
    event.stopPropagation();

    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");

    if (!email || !username) {
      toast.error("User is not logged in!", {
        position: "top-right",
        autoClose: 2000,
      });
      window.location.href = "/login";
      return;
    }

    try {
      const isFavorite = favorites[`${product.id}`];

      if (isFavorite) {
        // Optimistically update UI
        setFavorites((prev) => {
          const updated = { ...prev };
          delete updated[`${product.id}`];
          return updated;
        });

        await axios.post(`${ApiUrl}/remove-from-wishlist`, {
          email,
          productId: product.id,
        });

        window.dispatchEvent(new Event("wishlist-updated"));

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Item removed from your wishlist!`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
        });

      } else {
        // Optimistically update UI
        setFavorites((prev) => ({
          ...prev,
          [`${product.id}`]: true,
        }));

        await axios.post(`${ApiUrl}/update-user-wishlist`, {
          email,
          username,
          action: "add",
          prod_id: product.id,
        });

        window.dispatchEvent(new Event("wishlist-updated"));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Item added to your wishlist!`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("An error occurred while updating wishlist.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  useEffect(() => {
    const fetchWishlist = async () => {
      const email = localStorage.getItem("email");
      const username = localStorage.getItem("username");

      if (!email || !username) {
        console.log("No email/username found, skipping wishlist fetch.");
        return;
      }

      try {
        const response = await axios.post(`${ApiUrl}/fetchwishlist`, {
          email,
          username,
        });

        if (response.data.wishlist) {
          const wishlist = response.data.wishlist;
          const favoritesMap = {};

          wishlist.forEach((item) => {
            favoritesMap[`${item}`] = true;
          });

          setFavorites(favoritesMap);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    // Fetch wishlist immediately on mount
    fetchWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      console.log("[Event] Wishlist updated, fetching...");
      fetchWishlist();
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/productdetailsofferspage`);
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);



  useEffect(() => {
    const fetchRelatedAccessories = async () => {
      if (product && product.id) {
        console.log("Fetching related accessories for product ID:", product.id);

        try {
          const url = `${ApiUrl}/products/accessories/${product.id}`;
          const response = await axios.get(url);
          console.log(
            "Fetched related accessories successfully:",
            response.data
          );

          const accessoryIds = response.data.additional_accessories
            ? response.data.additional_accessories.split(",")
            : [];

          if (accessoryIds.length > 0) {
            // Create an array of promises to fetch the details of each accessory
            const accessoryDetailsPromises = accessoryIds.map((id) =>
              axios
                .get(`${ApiUrl}/products/accessory-details/${id}`)
                .catch((err) => {
                  // Handle individual errors
                  console.error(
                    `Error fetching accessory details for ID: ${id}`,
                    err.response ? err.response.data : err.message
                  );
                  return null; // return null for failed request
                })
            );

            // Wait for all requests to complete
            const accessoryDetailsResponses = await Promise.all(
              accessoryDetailsPromises
            );

            // Filter out null values (failed requests)
            const validAccessories = accessoryDetailsResponses.filter(
              (res) => res !== null
            );

            // Map the valid responses to the required structure
            const accessories = validAccessories.map((res) => {
              const accessory = res.data;

              let productImages = [];
              if (Array.isArray(accessory.prod_img)) {
                productImages = accessory.prod_img; // Handle as an array if it's valid
              } else if (typeof accessory.prod_img === "string") {
                productImages = [accessory.prod_img]; // Treat it as a single image (array format)
              }

              // Ensure that prod_name exists before calling any methods
              const productName = accessory.prod_name
                ? accessory.prod_name.toLowerCase()
                : "No Name";

              return {
                id: accessory.id,
                prod_name: productName,
                prod_price: accessory.prod_price,
                effectiveprice: accessory.effectiveprice,
                category: accessory.category,
                prod_id: accessory.prod_id,
                prod_img: productImages.length > 0 ? productImages[0] : null, // Get the first image
              };
            });

            setRelatedAccessories(accessories);
            console.log("Fetched accessory details:", accessories);
          } else {
            console.warn(
              "No related accessories found for product ID:",
              product.id
            );
            setRelatedAccessories([]);
          }
        } catch (error) {
          console.error(
            "Error fetching related accessories:",
            error.response ? error.response.data : error.message
          );
        }
      } else {
        console.warn("Product or product ID is undefined");
      }
    };

    fetchRelatedAccessories();
  }, [product]);

  useEffect(() => {
    const calculateRemainingTime = () => {
      if (!product || !product.offer_end_time) {
        // If product or offer_end_time is invalid, stop processing
        setIsOfferActive(false);
        setRemainingTime(null);
        return;
      }

      const now = new Date();
      const endTime = new Date(product.offer_end_time);

      if (endTime <= now) {
        // Offer expired
        setIsOfferActive(false);
        setRemainingTime(null);
      } else {
        const diff = endTime - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
          setRemainingTime({ days });
        } else {
          setRemainingTime({ hours, minutes, seconds });
        }
      }
    };

    // Update the timer every second
    const timer = setInterval(calculateRemainingTime, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [product]);

  // if (isLoading) {
  //   return <div>Loadingvbcvbcv...</div>;
  // }

  // useEffect(() => {
  //   const fetchWishlist = async () => {
  //     const email = localStorage.getItem("email");
  //     const username = localStorage.getItem("username");

  //     // if (!email || !username) {
  //     //   console.log("User not logged in");
  //     //   return;
  //     // }


  //     try {
  //       const response = await axios.post(`${ApiUrl}/fetchwishlist`, {
  //         email,
  //         username,
  //       });

  //       if (response.data.wishlist) {
  //         const wishlist = response.data.wishlist;
  //         const favoritesMap = {};

  //         wishlist.forEach((item) => {
  //           favoritesMap[item] = true;
  //         });

  //         setFavorites(favoritesMap);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching wishlist:", error);
  //     }
  //   };

  //   // Fetch wishlist on component mount
  //   fetchWishlist();

  //   // Optionally, use a longer polling interval if you need periodic updates
  //   // const intervalId = setInterval(fetchWishlist, 30000); // every 30 seconds
  //   // return () => clearInterval(intervalId);
  // }, []);



  if (isLoading || !product) {
    return null; // Show nothing when loading or if the product is not found
  }

  // // Ensure product exists before accessing prod_img
  const images = product?.prod_img
    ? Array.isArray(product.prod_img)
      ? product.prod_img
      : JSON.parse(product.prod_img)
    : [];

  const handleMouseMove = (e) => {
    const image = zoomRef.current;
    const container = document.querySelector(".big-image-container");
    const mainRow = document.querySelector(".side-row");
    if (!image || !container || !mainRow) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    // Lens box dimensions
    const lensWidth = 200;
    const lensHeight = 120;

    // Clamp the lens so it stays within the container
    const clampedX = Math.max(0, Math.min(x - lensWidth / 2, width - lensWidth));
    const clampedY = Math.max(0, Math.min(y - lensHeight / 2, height - lensHeight));

    setLensBoxStyle({
      position: "absolute",
      top: `${clampedY}px`,
      left: `${clampedX}px`,
      width: `${lensWidth}px`,
      height: `${lensHeight}px`,
      backgroundImage: "radial-gradient(lightblue .3px, transparent .3px)", // Visible dots
      backgroundSize: "3px 3px", // Tight spacing
      pointerEvents: "none",
      zIndex: 11,
    });


    // Zoomed background preview in .side-row
    const percentX = (x / width) * 100;
    const percentY = (y / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${ApiUrl}/uploads/${product.category.toLowerCase()}/${images[selectedImage]})`,
      backgroundSize: "300%", // Higher zoom ratio for sharpness
      backgroundPosition: `${percentX}% ${percentY}%`,
      position: "absolute",
      top: 0,
      left: 0,
      width: mainRow.offsetWidth + "px",
      height: mainRow.offsetHeight + "px",
      pointerEvents: "none",
      zIndex: 10,
      backgroundRepeat: "no-repeat",
      border: "1px solid rgba(0, 0, 0, 0.1)",
      imageRendering: "auto", /* Or 'crisp-edges' */
      transform: "scale(1)",
      transition: "background-position 0.1s ease",
    });


    setShowLensBox(true);
    setShowZoom(true);
  };


  const handleMouseLeave = () => {
    setShowZoom(false);

    setShowLensBox(false);
    setZoomStyle({});
  };
  // const hasMultipleImages = images.length > 1;

  // useEffect(() => {
  //   if (images && images.length > 0) {
  //     setSelectedImage(images[0]);
  //   }
  // }, [images]);

  // const firstImage = images.length > 0 ? images[0] : null; // Get the first image or null if not available

  const couponCode = coupons[product?.prod_id]; // Use coupons object instead of product

  // console.log("couponCode", couponCode);
  // Ensure couponCode is a valid string and contains digits
  if (typeof couponCode === "string") {
    const match = couponCode.match(/(\d+)/);
    if (match) {
      const couponNumber = match[0]; // Use it here if needed
      console.log("Coupon number:", couponNumber);
    }
  }


  // Now you can safely use couponNumber
  // console.log("couponNumber", couponNumber); // Will log the coupon number or null if not found
  // const gradientBackgrounds = [
  //   "linear-gradient(to bottom, #dcff8a, #f6f7d7)",
  //   "linear-gradient(to bottom, #dcff8a, #f6f7d7)",
  // ]; // Two gradient backgrounds

  const filteredBanners = products.filter(
    (product) =>
      product.title?.toLowerCase().trim() === "product_banner" &&
      product.image && product.image.trim() !== ""
  );


  // Click handler function
  const handleAdClick = (product) => {
    const url = `/${product.category
      }?search=${product.brand_name.toLowerCase()}`;
    navigate(url); // Navigate to the constructed URL
  };


  const NextArrow = (props) => {
    const { className, onClick } = props;
    return (
      <div
        className={className}

        onClick={onClick}
      >
        {/* &#8594; */}
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, onClick } = props;
    return (
      <div
        className={className}

        onClick={onClick}
      >
        {/* &#8592; */}
      </div>
    );
  };
  const CustomArrow = ({ src, onClick, className }) => (
    <img
      src={src}
      alt="Arrow"
      className={`custom-arrow ${className}`}
      onClick={onClick}
    />
  );
  const similarSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: s.length > 5,
    prevArrow: <CustomArrow src={leftarrow} className="prev" />,
    nextArrow: <CustomArrow src={rightarrow} className="next" />,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(s.length, 3),
          arrows: s.length > 3,
          prevArrow: <CustomArrow src={leftarrow} className="prev" />,
          nextArrow: <CustomArrow src={rightarrow} className="next" />,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(s.length, 2),
          arrows: s.length > 2,
          prevArrow: <CustomArrow src={leftarrow} className="prev" />,
          nextArrow: <CustomArrow src={rightarrow} className="next" />,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  const relatedAccessoriesSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow:
      prioritizedRelatedItems.length < 5 ? prioritizedRelatedItems.length : 5,
    // slidesToShow: Math.min(s.length, 5),
    slidesToScroll: 1,
    arrows: prioritizedRelatedItems.length > 5,
    prevArrow: <CustomArrow src={leftarrow} className="prev" />,
    nextArrow: <CustomArrow src={rightarrow} className="next" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };


  const thumbnailSliderSettings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: images.length > 5, // Enable arrows only if more than 5 images
    infinite: false,
    draggable: false,
    swipeToSlide: true,
    touchMove: true,
    nextArrow: images.length > 5 ? <NextArrow /> : null,
    prevArrow: images.length > 5 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 4, arrows: images.length > 4 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 3, arrows: images.length > 3 },
      },
    ],
  };

  // const useSlider = images && images.length > 1;

  return (
    <>
      {/* <Header2 /> */}
      <div className="main-container">
        {/* <Sidebar /> */}

        <div className="product-detail-container">
          <div className="another-container">
            <div className="product-style">
              <div
                className="responsive-navigation"
                style={{ marginTop: "5px", marginLeft: "5px" }}
              >
                <Link style={{ textDecoration: "none", color: "grey" }} to="/">
                  Home{" "}
                </Link>{" "}
                <span style={{ color: "grey" }}>&gt; </span>

                <Link to={`/${product.category === "TV" ? "TV" : product.category
                  }`}
                  style={{ textDecoration: "none", color: "grey" }}
                >
                  {product.category}{" "}

                </Link>
              </div>
              <div className="product-detail-image-container">

                {loading && product.offer_label ? (
                  <div className="skeleton-label-wrapper">

                    <Skeleton
                      width={100}
                      height={30}
                      className="product-label-skeleton"
                    />
                  </div>

                ) : (
                  product.offer_label && (
                    <div className="product-label2">
                      {product.offer_label}
                    </div>
                  )
                )}

                {/* Wishlist Heart Icon */}
                {loading ? (
                  <div className="skeleton-heart-wrapper">
                    <Skeleton
                      circle
                      width={30}
                      height={30}
                      className="skeleton-heart-icon"
                    />
                  </div>
                ) : (
                  <span
                    title={
                      favorites[`${product.id}`]
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"
                    }
                    className={`heart-icon ${favorites[`${product.id}`] ? "filled" : ""
                      }`}
                    onClick={(event) =>
                      handleToggleFavorite(product, event)
                    }
                  >
                    {favorites[`${product.id}`] ? (
                      <FaHeart
                        title="Remove from wishlist"
                        style={{ color: "red" }}
                      />
                    ) : (
                      <FaRegHeart title="Add to wishlist" />
                    )}
                  </span>
                )}
                <div className="carousel-container">


                  <div className="big-image-container"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    {loading || !images || images.length === 0 ? (
                      <Skeleton
                        height={400}
                        width={400}
                        className="product-image-skeleton"
                        style={{ marginTop: "25px" }}
                      />
                    ) : (
                      <div
                        className="zoom-container"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{ position: "relative" }}
                      >
                        <img
                          ref={zoomRef}
                          src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${images[selectedImage]}`}
                          alt={product.prod_name}
                          className="product-detail-image"
                          style={{ cursor: 'crosshair' }}
                        />
                        {showLensBox && <div style={lensBoxStyle}></div>}
                      </div>
                    )}
                  </div>

                </div>

                {/* Display Thumbnails only if more than one image exists */}
                <div className="thumbnails-wrapper">
                  <div className="thumbnails-container">
                    {loading && images && images.length > 1 ? (
                      <div
                        className="thumbnail-skeletons"
                        style={{ display: "flex" }}
                      >
                        {[...Array(images.length)].map((_, index) => (
                          <Skeleton
                            key={index}
                            width={80}
                            height={80}
                            style={{ marginLeft: "10px" }}
                            className="thumbnail-skeleton"
                          />
                        ))}
                      </div>
                    ) : images && images.length > 1 ? (
                      <Slider {...thumbnailSliderSettings}>
                        {images.map((image, index) => (
                          <div className="thumbnail-div" key={index}>
                            <img
                              src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${image}`}
                              // alt="image"
                              className={`thumbnail ${selectedImage === index ? "active" : ""
                                }`}
                              onClick={() => setSelectedImage(index)}
                              onMouseEnter={() => setSelectedImage(index)} // Update on hover
                              alt="Thumbnail"
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="side-row">
                <div className="product-main-row">
                  {/* Zoom Preview Box */}
                  {showZoom && <div className="zoom-box" style={zoomStyle}></div>}
                  {/* Product details */}
                  <div className="product-detail-info">
                    {/* Breadcrumb Navigation */}
                    <div
                      className="non-responsive-navigation"
                      style={{ marginBottom: "10px" }}
                    >
                      {loading ? (
                        <Skeleton width={150} height={20} />
                      ) : (
                        <>
                          <Link style={{ textDecoration: "none", color: "grey" }} to="/">
                            Home{" "}
                          </Link>{" "}
                          <span style={{ color: "grey" }}>&gt; </span>

                          <Link to={`/${product.category === "TV" ? "TV" : product.category
                            }`}
                            style={{ textDecoration: "none", color: "grey" }}
                          >
                            {product.category}{" "}

                          </Link>
                        </>
                      )}
                    </div>

                    {/* Product Title */}
                    <h2 className="product-detail-title">
                      {loading ? (
                        <Skeleton width={380} height={40} />
                      ) : (
                        product.prod_name
                      )}
                    </h2>

                    <span className="product-detail-subtitle">
                      {product.subtitle && loading ? (
                        <Skeleton width={380} height={40} />
                      ) : (
                        product.subtitle
                      )}
                    </span>

                    {/* <span>{product.productType}</span> */}

                    {/* Coupon Section */}
                    {couponCode && couponCode.trim() && (
                      loading ? (
                        <Skeleton
                          width={250}
                          height={15}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        />
                      ) : (
                        <p
                          className="coupon-discount-label"
                          style={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            fontSize: "12px",
                          }}
                        >
                          Apply coupon code and get an amazing discount!
                        </p>
                      )
                    )}

                    {/* <img id="imgpmalogo" src="./themes/pmahomme/img/logo_left.png" alt="phpMyAdmin"> */}

                    {/* Price Section */}
                    <p style={{ marginTop: '5px' }}>
                      <div>
                        {loading ? (
                          <div style={{ display: "flex" }}>
                            <Skeleton width={100} height={30} />
                            <Skeleton
                              width={80}
                              height={30}
                              style={{ marginLeft: "10px" }}
                            />
                            <Skeleton
                              width={60}
                              height={30}
                              style={{ marginLeft: "12px" }}
                            />
                            <Skeleton
                              width={100}
                              height={30}
                              style={{ marginLeft: "10px" }}
                            />
                          </div>
                        ) : (
                          <span>
                            <span className="product-detail-price">
                              ₹
                              {product.offer_price > 0 &&
                                isOfferActive &&
                                product.offer_price
                                ? product.offer_price
                                : product.prod_price}{" "}
                            </span>{" "}
                            M.R.P
                            <span
                              className="product-detail-actual-price"
                              style={{ textDecoration: "line-through" }}
                            >
                              ₹{product.actual_price}{" "}
                            </span>
                            <span className="offerr-tag">
                              Save upto ₹
                              {product.actual_price -
                                (product.offer_price > 0 &&
                                  isOfferActive &&
                                  product.offer_price
                                  ? product.offer_price
                                  : product.prod_price)}
                            </span>

                            {product.offer_price > 0 &&
                              isOfferActive &&
                              product.offer_price &&
                              product.status === "available" &&
                              remainingTime && (
                                <div className="offer-timer">
                                  {remainingTime.days ? (
                                    <p style={{ color: "red" }}>
                                      Offer ends in {remainingTime.days > 1 ? `${remainingTime.days} days` : `${remainingTime.days} day`}, Hurry up!
                                    </p>
                                  ) : (
                                    <p>
                                      Don't miss it! Deals end in{" "}
                                      <span className="timer-tag">
                                        {remainingTime.hours >= 1 &&
                                          `${remainingTime.hours}h : `
                                        }
                                        {remainingTime.minutes >= 1 &&
                                          `${remainingTime.minutes}m : `
                                        }
                                        {/* {remainingTime.minutes}m :{" "} */}
                                        {remainingTime.seconds}s
                                      </span>

                                    </p>
                                  )}
                                </div>
                              )}

                            <div className="secure-delivery" style={{ color: "#28a745", marginTop: "5px" }}>
                              🚚 Secure delivery in 10 days, &nbsp;

                              {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                                weekday: "long",
                              })}

                              {/* (
                              {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              ) */}
                            </div>
                          </span>
                        )}

                        {/* {loading ? (
        <Skeleton width={120} height={20} style={{ marginTop: "10px" }} />
      ) : (
        <p className="offerr-tag">
          Save upto ₹
          {product.actual_price -
            (product.offer_price > 0 && isOfferActive && product.offer_price
              ? product.offer_price
              : product.prod_price)}
        </p>
      )} */}
                      </div>
                    </p>

                    {/* Price Table */}
                    {loading ? (
                      <Skeleton
                        width={380}
                        height={90}
                        style={{ marginTop: "15px" }}
                      />
                    ) : (
                      <div className="coupon-box">
                        <div className="price-table">
                          <div className="price-row">
                            {/* MRP Price */}
                            <div
                              className="price-cell"
                              style={{ backgroundColor: "white" }}
                            >
                              <span className="price-label">M.R.P Rate</span>
                              {loading ? (
                                <Skeleton width={60} height={20} />
                              ) : (
                                <span className="actual-priceee">
                                  ₹{product?.actual_price}
                                </span>
                              )}
                            </div>

                            {/* Discount */}
                            <div
                              className="price-cell"
                              style={{ backgroundColor: "white" }}
                            >
                              <span className="price-label">Discount</span>
                              {loading ? (
                                <Skeleton width={50} height={20} />
                              ) : (
                                <span className="discounted-priceee">{`${Math.round(
                                  ((product.actual_price -
                                    (product.offer_price > 0 && isOfferActive
                                      ? product.offer_price
                                      : product.prod_price)) /
                                    product.actual_price) *
                                  100
                                )}%`}</span>
                              )}
                            </div>

                            {/* Effective Price */}
                            <div className="price-cell">
                              <span className="price-label">
                                Effective Price
                              </span>
                              {loading ? (
                                <Skeleton width={70} height={20} />
                              ) : (
                                <span className="total-priceee">
                                  ₹
                                  {isOfferActive && product?.offer_price > 0
                                    ? product?.offer_price
                                    : product?.prod_price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add to Cart & Buy Now Buttons */}
                    {loading ? (
                      <div className="add-to-cart-container">
                        <Skeleton
                          width={150}
                          height={50}
                          style={{ marginRight: "10px" }}
                        />
                        <Skeleton width={150} height={50} />
                        <Skeleton
                          circle
                          width={25}
                          height={25}
                          style={{ marginTop: "15px" }}
                        />
                      </div>
                    ) : product.status !== "unavailable" ? (
                      <div className="add-to-cart-container">
                        <button
                          title="Add To Cart"
                          onClick={(event) => handleAddToCart(product, event)}
                          className="product-detail-add-to-cart"
                        >
                          ADD TO CART{" "}
                          <span style={{ marginLeft: "10px" }}>
                            <button className="icon-button">
                              <svg
                                className="svg-icon"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                              </svg>
                            </button>
                          </span>
                        </button>

                        <button
                          title="Buy Now"
                          onClick={(event) => handleBuyNow(product, event)}
                          className="product-detail-buy-now"
                        >
                          BUY NOW{" "}

                          <span style={{ marginLeft: "10px" }}><FaBolt /></span>
                        </button>


                      </div>
                    ) : (
                      <p className="product-detail-out-of-stock">
                        Out of Stock
                      </p>
                    )}
                  </div>

                  {loading && relatedAccessories.length > 0 ? (
                    <div className="product-detail-infooo">
                      <div className="product-detail-infoo">
                        <div className="related-accessories">
                          <Skeleton
                            width={200}
                            height={25}
                            style={{ marginBottom: "10px" }}
                          />
                          {[...Array(2)].map((_, index) => (
                            <div
                              key={index}
                              className="accessory-item"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "15px",
                              }}
                            >
                              <Skeleton
                                circle
                                width={20}
                                height={20}
                                style={{ marginRight: "10px" }}
                              />
                              <Skeleton
                                width={45}
                                height={45}
                              // style={{ marginLeft: "10px" }}
                              />
                              <div style={{ flex: 1 }}>
                                <Skeleton
                                  width={120}
                                  height={20}
                                  style={{
                                    marginLeft: "10px",
                                    marginBottom: "5px",
                                  }}
                                />
                                <Skeleton
                                  width={80}
                                  height={15}
                                  style={{ marginLeft: "10px" }}
                                />
                              </div>
                              <div style={{ flex: 1, textAlign: "right" }}>
                                <Skeleton width={60} height={15} />
                                <Skeleton
                                  width={70}
                                  height={20}
                                  style={{ marginTop: "5px" }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <Skeleton
                          width={60}
                          height={30}
                          style={{ marginTop: "15px" }}
                        />
                      </div>
                    </div>
                  ) : (
                    relatedAccessories.length > 0 && (
                      <div className="product-detail-infooo">
                        <div className="product-detail-infoo">
                          <div className="related-accessories">
                            <h4>Buy Accessories Together To Get An Extra Off</h4>
                            {relatedAccessories.map((accessory) => {
                              const images = Array.isArray(accessory.prod_img)
                                ? accessory.prod_img
                                : JSON.parse(accessory.prod_img || "[]");

                              const firstImage =
                                images.length > 0
                                  ? images[0]
                                  : "fallback_image.jpg"; // Fallback image

                              return (
                                <div
                                  key={accessory.id}
                                  className="accessory-item"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "15px",
                                  }}
                                >
                                  <div className="container">
                                    <input
                                      type="checkbox"
                                      id={`accessory-${accessory.id}`}
                                      className="custom-checkbox"
                                      onChange={(event) =>
                                        handleCheckboxChange(
                                          event,
                                          accessory.id
                                        )
                                      }
                                      style={{ display: "none" }}
                                    />
                                    <label
                                      htmlFor={`accessory-${accessory.id}`}
                                      className="check"
                                      style={{ marginRight: "10px" }}
                                    >
                                      <svg
                                        width="18px"
                                        height="18px"
                                        viewBox="0 0 18 18"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
                                        <g className="plus">
                                          <line
                                            x1="9"
                                            y1="4"
                                            x2="9"
                                            y2="14"
                                            stroke="#333"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                          />
                                          <line
                                            x1="4"
                                            y1="9"
                                            x2="14"
                                            y2="9"
                                            stroke="#333"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                          />
                                        </g>
                                        <polyline points="1 9 7 14 15 4"></polyline>
                                      </svg>
                                    </label>
                                  </div>

                                  <img
                                    src={`${ApiUrl}/uploads/${accessory.category.toLowerCase()}/${firstImage}`}
                                    alt={accessory.prod_name}
                                    className="accessory-image"
                                    loading="lazy"
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      marginLeft: "10px",
                                    }}
                                  />
                                  <div style={{ flex: 1 }}>
                                    <h5
                                      style={{
                                        marginLeft: "10px",
                                        marginBottom: "2px",
                                        marginTop: "0",
                                      }}
                                    >
                                      {accessory.prod_name
                                        .charAt(0)
                                        .toUpperCase() +
                                        accessory.prod_name
                                          .slice(1)
                                          .split(" ")
                                          .slice(0, 3)
                                          .join(" ")}
                                    </h5>

                                    {/* <span>{accessory.prod_id}</span> */}
                                    {/* <p
                                      style={{
                                        marginLeft: "10px",
                                        margin: 0,
                                        fontSize: "14px",
                                      }}
                                    >
                                      Buy Together for
                                    </p> */}
                                  </div>
                                  <div style={{ flex: 1, textAlign: "right" }}>
                                    <p
                                      style={{
                                        textDecoration: "line-through",
                                        color: "gray",
                                        margin: 0,
                                      }}
                                    >
                                      ₹{accessory.prod_price}
                                    </p>
                                    <p
                                      style={{
                                        marginLeft: "10px",
                                        margin: 0,
                                        color: "green",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {accessory.effectiveprice > 0
                                        ? `₹${accessory.effectiveprice}`
                                        : "Free"}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <button
                            title="Buy Together"
                            onClick={(event) =>
                              handleBuyNowWithAccessories(
                                selectedAccessories,
                                event
                              )
                            }
                            style={{ alignSelf: "left", width: "20%" }}
                            className="product-detail-add-to-cart2"
                          >
                            ADD
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="product-features-row">
                  {/* Title */}
                  <h3 className="product-features-title">
                    {loading ? (
                      <Skeleton width={200} height={25} />
                    ) : product.category === "Mobiles" ||
                      product.category === "Computers" ||
                      product.productType === "Mobiles" ||
                      product.productType === "Computers" ? (
                      "Key Specifications"
                    ) : ["CCTV", "Watch", "TV", "Headphones", "Speaker"].includes(product.category) ? (
                      "Features"
                    ) : (
                      "Description"
                    )}
                  </h3>

                  {/* Skeletons */}
                  {loading &&
                    (product.category === "Mobiles" ||
                      product.category === "Computers" ||
                      product.productType === "Mobiles" ||
                      product.productType === "Computers") && (
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {[...Array(5)].map((_, index) => (
                          <li key={index} style={listItemStyle}>
                            <Skeleton width={120} height={25} style={{ labelStyle }} />
                            <Skeleton width={80} height={25} style={{ valueStyle }} />
                          </li>
                        ))}
                      </ul>
                    )}

                  {loading &&
                    ["CCTV", "Watch", "TV", "Headphones", "Speaker"].includes(product.category) && (
                      <Skeleton width="100%" height={50} />
                    )}

                  {loading &&
                    ![
                      "Mobiles",
                      "Computers",
                      "CCTV",
                      "Watch",
                      "TV",
                      "Headphones",
                      "Speaker",
                    ].includes(product.category) &&
                    product.productType !== "Mobiles" &&
                    product.productType !== "Computers" && (
                      <Skeleton width="100%" height={80} />
                    )}

                  {/* Key Specifications */}
                  {!loading &&
                    (product.category === "Mobiles" ||
                      product.category === "Computers" ||
                      product.productType === "Mobiles" ||
                      product.productType === "Computers") && (
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        {product.memory && (
                          <li style={listItemStyle}>
                            <span style={labelStyle}>
                              <FaHdd style={iconStyle} /> RAM
                            </span>
                            <span style={valueStyle}>{product.memory}</span>
                          </li>
                        )}
                        {product.storage && (
                          <li style={listItemStyle}>
                            <span style={labelStyle}>
                              <FaMemory style={iconStyle} /> ROM
                            </span>
                            <span style={valueStyle}>{product.storage}</span>
                          </li>
                        )}
                        {product.camera && (
                          <li style={listItemStyle}>
                            <span style={labelStyle}>
                              <FaCamera style={iconStyle} /> Camera
                            </span>
                            <span style={valueStyle}>{product.camera}</span>
                          </li>
                        )}
                        {product.processor && (
                          <li style={listItemStyle}>
                            <span style={labelStyle}>
                              <FaMicrochip style={iconStyle} /> Processor
                            </span>
                            <span style={valueStyle}>{product.processor}</span>
                          </li>
                        )}
                        {product.display && (
                          <li style={listItemStyle}>
                            <span style={labelStyle}>
                              <FaTv style={iconStyle} /> Display
                            </span>
                            <span style={valueStyle}>{product.display}</span>
                          </li>
                        )}
                        {product.os && (
                          <li style={listItemStyle}>
                            <span style={labelStyle}>
                              <FaApple style={iconStyle} /> OS
                            </span>
                            <span style={valueStyle}>{product.os}</span>
                          </li>
                        )}
                        {product.network && (
                          <li style={listItemStyle}>
                            <span style={labelStyle}>
                              <FaWifi style={iconStyle} /> Network
                            </span>
                            <span style={valueStyle}>{product.network}</span>
                          </li>
                        )}
                        {product.battery && (
                          <li style={listItemStyle}>
                            <span style={labelStyle}>
                              <FaBatteryFull style={iconStyle} /> Battery
                            </span>
                            <span style={valueStyle}>{product.battery}</span>
                          </li>
                        )}
                        {product.others && (
                          <>
                            <span style={otherFeatures}>Other Features</span>

                            <li style={listItemStyle}>

                              <pre style={productFeatures} className="product-features">{product.others}</pre>
                            </li></>
                        )}
                      </ul>
                    )}

                  {/* Features */}
                  {!loading &&
                    ["CCTV", "Watch", "TV", "Headphones", "Speaker"].includes(product.category) && (
                      <pre className="product-features">{product.prod_features}</pre>
                    )}

                  {/* Description */}
                  {!loading &&
                    ![
                      "Mobiles",
                      "Computers",
                      "CCTV",
                      "Watch",
                      "TV",
                      "Headphones",
                      "Speaker",
                    ].includes(product.category) &&
                    product.productType !== "Mobiles" &&
                    product.productType !== "Computers" && (
                      <pre className="product-features">{product.prod_features}</pre>
                    )}
                </div>

              </div>
            </div>

            {/* ad  */}

            {/* // Inside the JSX where you display related products */}
            {/* import Slider from "react-slick"; */}

            {product.category !== "MobileAccessories" &&
              product.category !== "CCTVAccessories" &&
              product.category !== "ComputerAccessories" &&
              product.category !== "PrinterAccessories" &&
              product.category !== "Headphones" &&
              product.category !== "Speakers" &&
              product.category !== "Watch" &&
              product.category !== "secondhandproducts" &&
              product.category !== "TV" &&
              prioritizedRelatedItems.length > 0 && (
                <div className="similar-products-wrapper">
                  <div className="similar-products-inner">
                    <h2 className="similar-products-title">
                      {product.category} Accessories
                    </h2>

                    <Slider
                      {...relatedAccessoriesSliderSettings}
                      className="similar-products-slider"
                    >
                      {prioritizedRelatedItems.map((relatedProduct) => {
                        const images = JSON.parse(relatedProduct.prod_img || "[]");
                        const firstImage = images[0];

                        return (
                          <div
                            key={relatedProduct.id}
                            className="similar-product-slide"
                          >
                            <div
                              className="similar-product-card"
                              onClick={() => handleProductClick(relatedProduct)}
                            >
                              {relatedProduct.offer_label && (
                                <div className="product-label">
                                  {relatedProduct.offer_label}
                                </div>
                              )}
                              <img
                                src={`${ApiUrl}/uploads/${relatedProduct.category.toLowerCase()}/${firstImage}`}
                                alt={relatedProduct.prod_name}
                                className="similar-product-image"
                                loading="lazy"
                              />
                              <p className="product-name">
                                {relatedProduct.prod_name.charAt(0).toUpperCase() +
                                  relatedProduct.prod_name.slice(1)}
                              </p>
                              <p className="similar-product-price-actual">
                                M.R.P{" "}
                                <span className="similar-price-strike">
                                  ₹{relatedProduct.actual_price}
                                </span>
                                <span className="similar-price-discount">
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
                              <p className="similar-product-price">
                                ₹{relatedProduct.prod_price}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                </div>
              )}





            <div className="bannerr-container4" style={{ marginTop: "20px" }}>
              {filteredBanners.length > 0 ? (
                <div>
                  <div
                    className="banner-image-display"
                    style={{
                      marginTop: "-30px",
                      position: "relative",
                      marginBottom: "5px",
                    }}
                  >
                    {/* <p className="brand-name" style={{ marginTop: '30px' }}>{filteredBanners[0].brand_name}</p> */}
                    <img
                      onClick={() => handleAdClick(filteredBanners[0])}
                      src={`${ApiUrl}/uploads/offerspage/${filteredBanners[0].image}`}
                      alt={`Banner for ${filteredBanners[0].brand_name}`}
                      className="banner-image"
                      loading="lazy"

                    // style={{ width: '1250px', marginTop: '20px', height: '300px' }} // Styling for the image
                    />
                  </div>
                </div>
              ) : (
                <span className="banner-title"></span>
              )}
            </div>

            {/* // Inside the JSX where you display related products */}
            {Array.isArray(s) && s.length > 0 && (
              <div className="similar-products-wrapper">
                <div className="similar-products-inner">
                  <h2 className="similar-products-title">Similar Products</h2>
                  <Slider {...similarSliderSettings} className="similar-products-slider">
                    {s.map((relatedProduct) => {
                      const images = JSON.parse(relatedProduct.prod_img || "[]");
                      const firstImage = images[0];

                      return (
                        <div key={relatedProduct.id} className="similar-product-slide">
                          <div
                            className="similar-product-card"
                            onClick={() => handleProductClick(relatedProduct)}
                          >
                            {relatedProduct.offer_label && (
                              <div className="product-label">
                                {relatedProduct.offer_label}
                              </div>
                            )}
                            <img
                              src={`${ApiUrl}/uploads/${relatedProduct.category.toLowerCase()}/${firstImage}`}
                              alt={relatedProduct.prod_name}
                              className="similar-product-image"
                            />
                            <p className="product-name">
                              {relatedProduct.prod_name.charAt(0).toUpperCase() +
                                relatedProduct.prod_name.slice(1)}
                            </p>
                            <p className="similar-product-price-actual">
                              M.R.P{" "}
                              <span className="similar-price-strike">
                                ₹{relatedProduct.actual_price}
                              </span>
                              <span className="similar-price-discount">
                                (
                                {Math.round(
                                  ((relatedProduct.actual_price - relatedProduct.prod_price) /
                                    relatedProduct.actual_price) *
                                  100
                                )}
                                % OFF)
                              </span>
                            </p>
                            <p className="similar-product-price">₹{relatedProduct.prod_price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </div>
            )}



            {filteredBanners.length > 1 && filteredBanners[1].image && filteredBanners[1].image.trim() !== "" && (
              <div className="bannerr-container4">
                <div>
                  <div
                    className="banner-image-display"
                    style={{
                      marginTop: "-5px",
                      position: "relative",
                      marginBottom: "5px",
                    }}
                  >
                    <img
                      onClick={() => handleAdClick(filteredBanners[1])}
                      src={`${ApiUrl}/uploads/offerspage/${filteredBanners[1].image}`}
                      alt={`Banner for ${filteredBanners[1].brand_name}`}
                      className="banner-image"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            )}

            <RecentlyViewed />

            <ToastContainer />
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      <Footer />
    </>
  );
};


const listItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
  padding: "8px 12px",
  borderRadius: "8px",
  // backgroundColor: '#f9f9f9',
  // border: '1px solid #ddd',
};

const labelStyle = {
  fontWeight: "bold",
  padding: "12px 15px", // More padding for better spacing
  background: "linear-gradient(135deg, #e9ecef, #ffffff)",
  // background: "linear-gradient(135deg, #007BFF, #00c6ff)",
  color: "#333", // White text for contrast
  borderRadius: "8px 0 0 8px",
  width: "37%", // Increased width for label
  marginRight: "15px", // More space between label and value
  fontSize: "16px", // Slightly larger font for readability
  display: "flex",
  alignItems: "center",
};

const otherFeatures = {
  fontWeight: "bold",
  padding: "12px 15px", // More padding for better spacing
  background: "linear-gradient(135deg, #e9ecef, #ffffff)",
  // background: "linear-gradient(135deg, #007BFF, #00c6ff)",
  color: "#333", // White text for contrast
  borderRadius: "8px 0 0 8px",
  width: "37%", // Increased width for label
  marginLeft: "10px", // More space between label and value
  fontSize: "16px", // Slightly larger font for readability
  display: "flex",
  alignItems: "center",
};

const valueStyle = {
  padding: "12px 15px", // Same padding as label
  background: "linear-gradient(135deg, #e9ecef, #ffffff)", // Light gradient for value background
  color: "#333", // Dark text for better visibility
  borderRadius: "0 8px 8px 0",
  width: "70%", // Adjusted width for value
  fontSize: "16px", // Consistent font size
  fontWeight: "normal", // Regular weight for value
  textAlign: 'justify'
};

const productFeatures = {
  padding: "12px 15px", // Same padding as label
  background: "linear-gradient(135deg, #e9ecef, #ffffff)",
  color: "#333", // Dark text for better visibility
  borderRadius: "0 8px 8px 0",
  width: "100%", // Adjusted width for value
  fontSize: "16px", // Consistent font size
  fontWeight: "normal", // Regular weight for value
  textAlign: 'justify'

};

const iconStyle = {
  marginRight: "8px",
  fontSize: "18px",
  color: "#007bff",
};

// // Additional styles for description and text
// const descriptionStyle = {
//   padding: "15px",
//   // background: "linear-gradient(135deg, #f0f8ff, #e0f7fa)", // original
//   background: "linear-gradient(135deg, #e0f7fa, #f0f8ff)", // Light gradient for descriptions
//   borderRadius: "8px",
//   fontSize: "14px",
//   lineHeight: "1.6",
//   color: "#333", // Dark text for good contrast
//   boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)", // Slight shadow for depth
// };

export default ProductDetail;
