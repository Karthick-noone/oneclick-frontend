import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the product ID from the URL
import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiUrl } from "./ApiUrl"; // Adjust the import path accordingly
import "./css/ProductDetail.css"; // Ensure you create this CSS file
import Header2 from "./Header2";
// import Sidebar from "./Sidebar";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa"; // Import the heart icon from react-icons
import Footer from "./footer";
import { useNavigate } from "react-router-dom"; // Import useNavigate at the top
import Slider from "react-slick"; // Import the slider component
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

import { useCart } from "../components/CartContext";
import leftarrow from "./img/left.png";
import rightarrow from "./img/right.png";
import pricetag from "./img/check-mark.png";
import tag from "./img/percent.png";
import offertag from "./img/sale.png";
import couponimg from "./img/couponcode.png";
import FullAdPage from "./FullAdPage";
// import Header2 from './Header2'
const ProductDetail = ({ accessoryCategory }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const { addToWishlist, removeFromWishlist } = useCart();
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State to track the currently selected image
  const [, setIsAdding] = useState(false); // Track the adding state to prevent multiple clicks
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);
  const [relatedAccessories, setRelatedAccessories] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [addToCartTriggered, setAddToCartTriggered] = useState(false); // Track if add to cart was triggered
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState({}); // State to hold coupon codes for products
  const [favorites, setFavorites] = useState({});
  const [, setImages] = useState([]);

  // State for storing related items
  const [relatedItems, setRelatedItems] = useState([]);
  // State for tracking the current index for carousel
  const [currentStartIndex2, setStartIndex] = useState(0);

  const [remainingTime, setRemainingTime] = useState(null);
  const [isOfferActive, setIsOfferActive] = useState(true);

  const [zoomStyle, setZoomStyle] = useState({});
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

  const maxDisplayItems = 5;

  // Filter products to remove the current product from related items
  const productsExcludingCurrent = relatedItems.filter(
    (item) => item.id !== product.id
  );

  // Handle next slide in carousel
  const handleNextSlide = () => {
    if (
      currentStartIndex2 + 1 <
      productsExcludingCurrent.length - maxDisplayItems + 1
    ) {
      setStartIndex((prev) => prev + 1);
    }
  };

  // Handle previous slide in carousel
  const handlePreviousSlide = () => {
    if (currentStartIndex2 > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

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

  const handleNext2 = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev2 = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const itemsToShow = 5;

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
  // console.log("Sorted Related Products:", sortedFilteredProducts);

  const handleProductClick = (productId) => {
    // Navigate to the product detail page
    navigate(`/product/${productId}`);
    // window.location.reload();
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

  const handleAddToCart2 = async (selectedAccessories, event) => {
    if (!event) return;
    event.stopPropagation(); // Prevent event bubbling

    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("User is not logged in!", {
        position: "top-right",
        autoClose: 2000,
      });
      window.location.href = "/login";
      return;
    }

    setIsAdding(true); // Disable button while processing

    try {
      for (const accessoryId of selectedAccessories) {
        const accessory = relatedAccessories.find(
          (acc) => acc.id === accessoryId
        );
        if (accessory) {
          await axios.post(`${ApiUrl}/add-to-cart`, {
            email,
            productId: accessory.id,
            quantity: 1,
          });

          toast.success(`${accessory.prod_name} added to your cart!`, {
            position: "top-right",
            autoClose: 2000,
          });
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsAdding(false); // Enable button after completion
    }
  };

  const handleAddToCartWithAccessories = async (selectedAccessories, event) => {
    // Check if at least one accessory is selected
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
    // Call the main product add to cart function
    await handleAddToCart(product, event); // Make sure this function is asynchronous

    // Call the function to add selected accessories to the cart
    await handleAddToCart2(selectedAccessories, event);
  };

  // const handleAddToCart = async (product, event) => {
  //   if (!event) return; // Prevent further execution if event is undefined
  //   event.stopPropagation();

  //   const email = localStorage.getItem("email");
  //   const username = localStorage.getItem("username");

  //   if (!email || !username) {
  //     toast.error("User is not logged in!", {
  //       position: "top-right",
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //     window.location.href = "/login";
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${ApiUrl}/verify-user`, {
  //       email,
  //       username,
  //     });

  //     if (response.data.exists) {
  //       const cartKey = `${email}-cart`;
  //       const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
  //       const currentPrice =
  //         isOfferActive && product.offer_price > 0 && isOfferActive
  //           ? product.offer_price // Use offer_price if offer is active
  //           : product.prod_price;
  //       // Find existing item by id and category
  //       const existingItem = cartItems.find(
  //         (item) => item.id === product.id && item.category === product.category
  //       );

  //       if (existingItem) {
  //         // Increase the quantity if the product already exists in the cart
  //         existingItem.quantity += 1;
  //         toast.info(
  //           `Increased quantity of ${product.prod_name} in your cart!`,
  //           {
  //             position: "top-right",
  //             autoClose: 2000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //           }
  //         );
  //       } else {
  //         // Add new product to the cart
  //         cartItems.push({
  //           id: product.id,
  //           name: product.prod_name,
  //           price: currentPrice, // Use offer_price if it's valid, otherwise prod_price
  //           actual_price: product.actual_price,
  //           image: product.prod_img,
  //           description: product.prod_features,
  //           category: product.category,
  //           deliverycharge: product.deliverycharge,
  //           product_id: product.prod_id,
  //           quantity: 1,
  //         });

  //         toast.success(`${product.prod_name} has been added to your cart!`, {
  //           position: "top-right",
  //           autoClose: 2000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //         });
  //       }

  //       // Save the updated cart in localStorage
  //       localStorage.setItem(cartKey, JSON.stringify(cartItems));
  //     } else {
  //       toast.error("User not found!", {
  //         position: "top-right",
  //         autoClose: 2000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error verifying user or updating cart:", error);
  //     toast.error("An error occurred while adding to cart.", {
  //       position: "top-right",
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   }
  // };

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

    // const prod_price = isOfferActive ? product.offer_price : product.prod_price;

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
        toast.success(`${product.prod_name} added to your cart!`, {
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

    // Check if the user is logged in
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

    // Optimistically update the UI
    setFavorites((prev) => ({
      ...prev,
      [product.id]: !prev[product.id],
    }));

    try {
      const isFavorite = favorites[product.id];

      if (isFavorite) {
        // Call remove API
        await axios.post(`${ApiUrl}/remove-from-wishlist`, {
          email,
          productId: product.id,
        });
        toast.info(`${product.prod_name} removed from your wishlist!`, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        // Call add API
        await axios.post(`${ApiUrl}/update-user-wishlist`, {
          email,
          username,
          action: "add",
          prod_id: product.id,
        });
        toast.success(`${product.prod_name} added to your wishlist!`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      // Revert the UI change if the API call fails
      setFavorites((prev) => ({
        ...prev,
        [product.id]: favorites[product.id],
      }));
      toast.error("An error occurred while updating wishlist.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

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

  // useEffect(() => {
  //   const fetchRelatedAccessories = async () => {
  //     if (product && product.category) {
  //       console.log(
  //         "Fetching related accessories for category:",
  //         product.category
  //       );
  //       const categoryMap = {
  //         Mobiles: "mobileaccessories",
  //         Computers: "computeraccessories",
  //         CCTV: "cctvaccessories",
  //         Printers: "printeraccessories",
  //       };
  //       const accessoryCategory = categoryMap[product.category];

  //       if (accessoryCategory) {
  //         try {
  //           const url = `${ApiUrl}/products/accessories/${accessoryCategory}`;
  //           const response = await axios.get(url);
  //           console.log(
  //             "Fetched related accessories successfully:",
  //             response.data
  //           );

  //           // Filter accessories based on product name
  //           const filteredAccessories = response.data.filter(
  //             (accessory) =>
  //               accessory.prod_name
  //                 .toLowerCase()
  //                 .includes(product.prod_name.toLowerCase()) ||
  //               product.prod_name
  //                 .toLowerCase()
  //                 .includes(accessory.prod_name.toLowerCase())
  //           );

  //           setRelatedAccessories(filteredAccessories);
  //           console.log("Filtered related accessories:", filteredAccessories);
  //         } catch (error) {
  //           console.error(
  //             "Error fetching related accessories:",
  //             error.response ? error.response.data : error.message
  //           );
  //         }
  //       } else {
  //         console.warn(
  //           "No matching accessory category found for:",
  //           product.category
  //         );
  //       }
  //     } else {
  //       console.warn("Product or product category is undefined");
  //     }
  //   };

  //   fetchRelatedAccessories();
  // }, [product]);

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

  useEffect(() => {
    const fetchWishlist = async () => {
      const email = localStorage.getItem("email");
      const username = localStorage.getItem("username");

      if (!email || !username) {
        console.log("User not logged in");
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
            favoritesMap[item] = true;
          });

          setFavorites(favoritesMap);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    // Fetch wishlist on component mount
    fetchWishlist();

    // Optionally, use a longer polling interval if you need periodic updates
    // const intervalId = setInterval(fetchWishlist, 30000); // every 30 seconds
    // return () => clearInterval(intervalId);
  }, []);

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

  if (!product) {
    return <div>Product not found.</div>;
  }
  // Check if prod_img is in a valid format
  const images = Array.isArray(product.prod_img)
    ? product.prod_img
    : JSON.parse(product.prod_img || "[]");

  const handleMouseMove = (e) => {
    const image = zoomRef.current;
    if (!image) return;

    const { left, top, width, height } = image.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)", // Adjust scale for zoom level
      cursor: "zoom-in",
    });
  };

  const hasMultipleImages = images.length > 1;

  // useEffect(() => {
  //   if (images && images.length > 0) {
  //     setSelectedImage(images[0]);
  //   }
  // }, [images]);

  // const firstImage = images.length > 0 ? images[0] : null; // Get the first image or null if not available

  const couponCode = coupons[product?.prod_id]; // Use coupons object instead of product

  // console.log("couponCode", couponCode);
  // Ensure couponCode is a valid string and contains digits
  let couponNumber = null; // Default to null in case there's no number

  if (typeof couponCode === "string") {
    const match = couponCode.match(/(\d+)/);
    if (match) {
      couponNumber = match[0]; // Extract the number if a match is found
    }
  }

  // Now you can safely use couponNumber
  // console.log("couponNumber", couponNumber); // Will log the coupon number or null if not found
  const gradientBackgrounds = [
    "linear-gradient(to bottom, #dcff8a, #f6f7d7)",
    "linear-gradient(to bottom, #dcff8a, #f6f7d7)",
  ]; // Two gradient backgrounds

  const filteredBanners = products.filter(
    (product) => product.image && product.image.startsWith("product_banner")
  );

  // Click handler function
  const handleAdClick = (product) => {
    const url = `/${
      product.category
    }?search=${product.brand_name.toLowerCase()}`;
    navigate(url); // Navigate to the constructed URL
  };

  const settings = {
    dots: false,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: images.length > 1 ? 1 : 0,
    arrows: images.length > 1,
    autoplay: false,
    draggable: images.length > 1,
    swipe: images.length > 1,
    prevArrow: (
      <div className="arrow-container left-arrow">
        <img
          src={leftarrow}
          style={{
            width: "30px",
            borderRadius: "50%",
            backgroundColor: "white",
            padding: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow applied here
          }}
          alt="Previous"
        />
      </div>
    ),
    nextArrow: (
      <div className="arrow-container right-arrow">
        <img
          src={rightarrow}
          style={{
            width: "30px",
            borderRadius: "50%",
            backgroundColor: "white",
            padding: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow applied here
          }}
          alt="Next"
        />
      </div>
    ),
  };

  const settings2 = {
    dots: false,
    infinite: sortedFilteredProducts.length > 5, // Enable infinite loop only if more than 5 products
    speed: 500,
    slidesToShow: 5, // Number of items to show at once
    slidesToScroll: 1,
    arrows: true, // Enable arrows
    prevArrow: (
      <button className="custom-arrow left-arrow">
        <img src={leftarrow} alt="Previous" style={{ width: "30px" }} />
      </button>
    ),
    nextArrow: (
      <button className="custom-arrow right-arrow">
        <img src={rightarrow} alt="Next" style={{ width: "30px" }} />
      </button>
    ),
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings2: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Mobile
        settings2: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Smaller devices
        settings2: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          right: 0,
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          lineHeight: "30px",
          textAlign: "center",
          color: "#fff",
          zIndex: 2,
        }}
        onClick={onClick}
      >
        &#8594;
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          left: 0,
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          lineHeight: "30px",
          textAlign: "center",
          color: "#fff",
          zIndex: 2,
        }}
        onClick={onClick}
      >
        &#8592;
      </div>
    );
  };

  const thumbnailSliderSettings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: images.length > 5, // Enable arrows only if more than 5 images
    infinite: false,
    draggable: true,
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
      <Header2 />
      <div className="main-container">
        {/* <Sidebar /> */}

        <div className="product-detail-container">
          <div className="another-container">
            <div className="product-style">
              <div
                className="responsive-navigation"
                style={{ marginTop: "5px", marginLeft: "5px" }}
              >
                <a style={{ textDecoration: "none", color: "grey" }} href="/">
                  Home{" "}
                </a>{" "}
                <span style={{ color: "grey" }}>&gt;</span>
                <a
                  style={{ textDecoration: "none", color: "grey" }}
                  href={`/${
                    product.category === "TV" ? "TeleVision" : product.category
                  }`} // Conditional URL
                  // Dynamically set the category in the URL
                >
                  {" "}
                  {product.category}{" "}
                </a>
              </div>
              <div className="product-detail-image-container">
                <div className="carousel-container">
                  {product.offer_label && (
                    <div className="product-label2">{product.offer_label}</div>
                  )}

                  <div className="big-image-container">
                    {images && images.length > 0 ? (
                      <div
                        className="zoom-container"
                        onMouseMove={handleMouseMove} // Apply zoom for all images
                        onMouseLeave={() => setZoomStyle({})}
                      >
                        <img
                          ref={zoomRef}
                          src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${
                            images[selectedImage]
                          }`}
                          alt={product.prod_name}
                          className="product-detail-image"
                          style={zoomStyle}
                        />
                      </div>
                    ) : (
                      <div>No image available</div>
                    )}
                  </div>
                </div>

                {/* Display Thumbnails only if more than one image exists */}
                {images && images.length > 1 && (
                  <div className="thumbnails-wrapper">
                    <div className="thumbnails-container">
                      <Slider {...thumbnailSliderSettings}>
                        {images.map((image, index) => (
                          <div key={index}>
                            <img
                              src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${image}`}
                              alt={product.prod_name}
                              className={`thumbnail ${
                                selectedImage === index ? "active" : ""
                              }`}
                              onClick={() => setSelectedImage(index)}
                              onMouseEnter={() => setSelectedImage(index)} // Update on hover
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                )}
              </div>

              <div className="side-row">
                <div className="product-main-row">
                  {/* Product details */}
                  <div className="product-detail-info">
                    <div
                      className="non-responsive-navigation"
                      style={{ marginBottom: "15px" }}
                    >
                      <a
                        style={{ textDecoration: "none", color: "grey" }}
                        href="/"
                      >
                        {" "}
                        Home{" "}
                      </a>{" "}
                      <span style={{ color: "grey" }}>&gt;</span>
                      <a
                        style={{ textDecoration: "none", color: "grey" }}
                        href={`/${
                          product.category === "TV" ? "TV" : product.category
                        }`} // Conditional URL
                      >
                        {" "}
                        {product.category}{" "}
                      </a>
                    </div>

                    <h2 className="product-detail-title">
                      {product.prod_name.charAt(0).toUpperCase() +
                        product.prod_name.slice(1)}
                    </h2>
                    {/* {product.offer_price} */}

                    {couponCode && couponCode.trim() ? (
                      // {couponNumber > 0 ? (
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
                    ) : (
                      <p></p>
                    )}
                    {/* <span style={{color:'grey'}}>({product.subtitle})</span> */}
                    <p>
                      <div>
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
                        </span>
                        <span
                          className="offer-text"
                          style={{ marginLeft: "12px" }}
                        >
                          <span
                            className="save-tag"
                            style={{ marginLeft: "5px" }}
                          >
                            <span>
                              {Math.round(
                                ((product?.actual_price -
                                  (product?.offer_price > 0 && isOfferActive
                                    ? product?.offer_price
                                    : product?.prod_price)) /
                                  product?.actual_price) *
                                  100
                              )}
                              % OFF
                            </span>
                          </span>
                        </span>

                        <p className="offerr-tag">
                          Save upto ₹
                          {product.actual_price -
                            (product.offer_price > 0 &&
                            isOfferActive &&
                            product.offer_price
                              ? product.offer_price
                              : product.prod_price)}
                        </p>

                        {/* Timer display */}
                        {product.offer_price > 0 &&
                          isOfferActive &&
                          product.offer_price &&
                          remainingTime && (
                            <div className="offer-timer">
                              {remainingTime.days ? (
                                <p style={{ color: "red" }}>
                                  {remainingTime.days} day(s) left for this
                                  offer
                                </p>
                              ) : (
                                <p>
                                  Deals end in{" "}
                                  <span className="timer-tag">
                                    {remainingTime.hours}h :{" "}
                                    {remainingTime.minutes}m :{" "}
                                    {remainingTime.seconds}s
                                  </span>
                                </p>
                              )}
                            </div>
                          )}
                      </div>
                    </p>

                    {/* </p> */}
                    <div className="coupon-box">
                      <div className="price-table">
                        <div className="price-row">
                          {/* Actual Price */}
                          <div
                            className="price-cell"
                            style={{ backgroundColor: "white" }}
                          >
                            <span className="price-label">M.R.P Rate</span>
                            <span className="actual-priceee">
                              ₹
                              {/* {coupons[product?.prod_id]
                                ? product?.offer_price || product?.prod_price
                                : product?.actual_price} */}
                              {product?.actual_price}
                            </span>
                          </div>

                          {/* Discount */}
                          <div
                            className="price-cell"
                            style={{ backgroundColor: "white" }}
                          >
                            <span className="price-label">Discount</span>
                            {/* <span className="discounted-priceee">
                              {coupons[product?.prod_id]
                                ? // If a coupon exists, calculate and round discount percentage
                                  `${Math.round(
                                    ((product?.actual_price - couponNumber) /
                                      product?.actual_price) *
                                      100
                                  )}%`
                                : // If no coupon, calculate and round discount percentage
                                  `${Math.round(
                                    ((product?.actual_price -
                                      (product?.offer_price ||
                                        product?.prod_price)) /
                                      product?.actual_price) *
                                      100
                                  )}%`}
                            </span> */}
                            <span className="discounted-priceee">
                              {`${Math.round(
                                ((product.actual_price -
                                  (product.offer_price > 0 && isOfferActive
                                    ? product.offer_price
                                    : product.prod_price)) /
                                  product.actual_price) *
                                  100
                              )}%`}
                            </span>
                          </div>

                          {/* Effective Price */}
                          <div className="price-cell">
                            <span className="price-label">Effective Price</span>
                            <span className="total-priceee">
                              ₹
                              {isOfferActive && product?.offer_price > 0
                                ? product?.offer_price
                                : product?.prod_price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {product.status === "unavailable" ? (
                      <p className="product-detail-out-of-stock">
                        Out of Stock
                      </p>
                    ) : (
                      <div className="add-to-cart-container">
                        <button
                          title="Add To Cart"
                          onClick={(event) => handleAddToCart(product, event)}
                          className="product-detail-add-to-cart"
                        >
                          ADD TO CART{" "}
                          <span style={{ marginLeft: "10px" }}>
                            {/* <FaShoppingBag /> */}
                            <button class="icon-button">
                              <svg
                                class="svg-icon"
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
                          <span style={{ marginLeft: "10px" }}>&gt;</span>
                        </button>
                        {/* <FaHeart
                          title="Add to wishlist"
                          className={`heart-icon ${isFavorite ? "filled" : ""}`}
                          onClick={(event) => toggleFavorite(product, event)}
                        /> */}

                        <span
                          title={
                            favorites[`${product.id}`]
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"
                          }
                          className={`heart-icon ${
                            favorites[`${product.id}`] ? "filled" : ""
                          }`}
                          onClick={(event) =>
                            handleToggleFavorite(product, event)
                          } // Unified handler
                        >
                          {favorites[`${product.id}`] ? (
                            <FaHeart
                              title="Remove from wishlist"
                              style={{ color: "red" }}
                            /> // Filled heart
                          ) : (
                            <FaRegHeart title="Add to wishlist" /> // Empty heart
                          )}
                        </span>
                        <span
                          style={{
                            color: "green",
                            marginTop: "5px",
                            fontWeight: "bold",
                            fontSize: "18px",
                          }}
                        >
                          {/* In Stock */}
                        </span>
                      </div>
                    )}
                  </div>

                  {relatedAccessories.length > 0 && (
                    <div className="product-detail-infooo">
                      <div className="product-detail-infoo">
                        <div className="related-accessories">
                          <h4>Get An Extra Discount</h4>
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
                                {/* <input
                                  type="checkbox"
                                  id={`accessory-${accessory.id}`}
                                  onChange={(event) =>
                                    handleCheckboxChange(event, accessory.id)
                                  }
                                  style={{ marginRight: "10px" }}
                                /> */}

                                <div className="container">
                                  <input
                                    type="checkbox"
                                    id={`accessory-${accessory.id}`}
                                    className="custom-checkbox" // Use the custom class for our CSS
                                    onChange={(event) =>
                                      handleCheckboxChange(event, accessory.id)
                                    }
                                    style={{ display: "none" }} // Hide the native checkbox
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
                                    >
                                      {/* The circle outline remains the same */}
                                      <path d="M 1 9 L 1 9 c 0 -5 3 -8 8 -8 L 9 1 C 14 1 17 5 17 9 L 17 9 c 0 4 -4 8 -8 8 L 9 17 C 5 17 1 14 1 9 L 1 9 Z"></path>
                                      {/* Plus icon group (visible when unchecked) */}
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
                                      {/* Check mark for the animated state */}
                                      <polyline points="1 9 7 14 15 4"></polyline>
                                    </svg>
                                  </label>
                                </div>

                                {/* <span>{accessory.prod_name}</span> */}
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
                                  <p
                                    style={{
                                      marginLeft: "10px",
                                      margin: 0,
                                      fontSize: "14px",
                                    }}
                                  >
                                    Buy Together for
                                  </p>
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
                          title="Add To Cart"
                          onClick={(event) =>
                            handleAddToCartWithAccessories(
                              selectedAccessories,
                              event
                            )
                          } // Pass selected accessories
                          style={{ alignSelf: "left", width: "20%" }}
                          className="product-detail-add-to-cart2"
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="product-features-row">
                  {/* <span>{product.category}</span> */}
                  <h3 className="product-features-title">
                    {product.category === "Mobiles" ||
                    product.category === "Computers"
                      ? "Key Specifications"
                      : product.category === "CCTV" ||
                        product.category === "Watch" ||
                        product.category === "TV" ||
                        product.category === "Headphones" ||
                        product.category === "Speaker"
                      ? "Features"
                      : "Description"}
                  </h3>

                  {product.category === "Mobiles" ||
                  product.category === "Computers" ? (
                    // Mobiles and Computers Specifications
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
                        <li style={listItemStyle}>
                          <span style={labelStyle}>Others</span>
                          <span style={valueStyle}>{product.others}</span>
                        </li>
                      )}
                    </ul>
                  ) : product.category === "CCTV" ||
                    product.category === "Watch" ||
                    product.category === "TV" ||
                    product.category === "Headphones" ||
                    product.category === "Speaker" ? (
                    // Product Features for CCTV, Watch, TV, Headphones, and Speaker
                    <p className="product-features">{product.prod_features}</p>
                  ) : (
                    // For other categories
                    <p className="product-features">{product.prod_features}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ad  */}

            {/* // Inside the JSX where you display related products */}
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
                <div className="related-products-section">
                  <h3 style={{ marginBottom: "10px" }}>
                    {product.category} Accessories
                  </h3>
                  <div className="related-products-carousel">
                    {prioritizedRelatedItems.length > 5 && (
                      <button
                        onClick={handlePreviousSlide}
                        className="carousel-arrow left-arrow"
                      >
                        <img
                          style={{
                            width: "30px",
                            borderRadius: "50%",
                            backgroundColor: "white",
                            padding: "5px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow applied here
                          }}
                          src={leftarrow}
                          alt=""
                          loading="lazy"
                        />
                      </button>
                    )}

                    <div className="related-products-grid">
                      {prioritizedRelatedItems
                        .slice(
                          currentStartIndex2,
                          currentStartIndex2 + maxDisplayItems
                        )
                        .map((relatedProduct) => {
                          // Parse the prod_img string into an array
                          const images = JSON.parse(relatedProduct.prod_img);
                          // Get the first image from the array
                          const firstImage = images[0];

                          return (
                            <div
                              key={relatedProduct.id}
                              onClick={() =>
                                handleProductClick(relatedProduct.id)
                              }
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
                                loading="lazy"
                              />
                              <p className="related-product-name">
                                {relatedProduct.prod_name
                                  .charAt(0)
                                  .toUpperCase() +
                                  relatedProduct.prod_name.slice(1)}
                              </p>
                              {/* <p className="related-product-features">
                  {relatedProduct.prod_features}
                </p> */}
                              <p className="product-actual-price">
                                M.R.P{" "}
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    color: "red",
                                  }}
                                >
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
                    {prioritizedRelatedItems.length > 5 && (
                      <button
                        onClick={handleNextSlide}
                        className="carousel-arrow right-arrow"
                      >
                        <img
                          style={{
                            width: "30px",
                            borderRadius: "50%",
                            backgroundColor: "white",
                            padding: "5px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow applied here
                          }}
                          src={rightarrow}
                          alt=""
                          loading="lazy"
                        />
                      </button>
                    )}
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
                <h4 className="banner-title"></h4>
              )}
            </div>

            {/* // Inside the JSX where you display related products */}
            {sortedFilteredProducts.length > 0 && (
              <div className="related-products-section">
                <h3 style={{ marginBottom: "10px" }}>You might also like</h3>
                <div className="related-products-carousel">
                  {sortedFilteredProducts.length > 5 && (
                    <button
                      onClick={handlePrev}
                      className="carousel-arrow left-arrow"
                    >
                      <img
                        style={{
                          width: "30px",
                          borderRadius: "50%",
                          backgroundColor: "white",
                          padding: "5px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow applied here
                        }}
                        src={leftarrow}
                        alt=""
                        loading="lazy"
                      />
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
                            onClick={() =>
                              handleProductClick(relatedProduct.id)
                            }
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
                              loading="lazy"
                            />
                            <p className="related-product-name">
                              {relatedProduct.prod_name
                                .charAt(0)
                                .toUpperCase() +
                                relatedProduct.prod_name.slice(1)}
                            </p>
                            {/* <p className="related-product-features">
                  {relatedProduct.prod_features}
                </p> */}
                            <p className="product-actual-price">
                              M.R.P{" "}
                              <span
                                style={{
                                  textDecoration: "line-through",
                                  color: "red",
                                }}
                              >
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
                  {sortedFilteredProducts.length > 5 && (
                    <button
                      onClick={handleNext}
                      className="carousel-arrow right-arrow"
                    >
                      <img
                        style={{
                          width: "30px",
                          borderRadius: "50%",
                          backgroundColor: "white",
                          padding: "5px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Box shadow applied here
                        }}
                        src={rightarrow}
                        alt=""
                        loading="lazy"
                      />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="bannerr-container4">
              {filteredBanners.length > 1 ? (
                <div>
                  <div
                    className="banner-image-display"
                    style={{
                      marginTop: "-5px",
                      position: "relative",
                      marginBottom: "5px",
                    }}
                  >
                    {/* <p className="brand-name" style={{ marginTop: '30px' }}>{filteredBanners[0].brand_name}</p> */}
                    <img
                      onClick={() => handleAdClick(filteredBanners[1])}
                      src={`${ApiUrl}/uploads/offerspage/${filteredBanners[1].image}`}
                      alt={`Banner for ${filteredBanners[1].brand_name}`}
                      className="banner-image"
                      loading="lazy"

                      // style={{ width: '1250px', marginTop: '20px', height: '300px' }} // Styling for the image
                    />
                  </div>
                </div>
              ) : (
                <h4 className="banner-title"></h4>
              )}
            </div>

            <ToastContainer />
          </div>
        </div>
      </div>

      {/* Related Products Section */}

      <Footer />
    </>
  );
};

{
  /* Styling for the list items */
}
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
  width: "30%", // Increased width for label
  marginRight: "15px", // More space between label and value
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
};

const iconStyle = {
  marginRight: "8px",
  fontSize: "18px",
  color: "#007bff",
};

// Additional styles for description and text
const descriptionStyle = {
  padding: "15px",
  // background: "linear-gradient(135deg, #f0f8ff, #e0f7fa)", // original
  background: "linear-gradient(135deg, #e0f7fa, #f0f8ff)", // Light gradient for descriptions
  borderRadius: "8px",
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#333", // Dark text for good contrast
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)", // Slight shadow for depth
};

export default ProductDetail;
