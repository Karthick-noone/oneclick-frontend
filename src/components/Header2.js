import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaTimes,
  FaEllipsisV,
  FaInfoCircle,
  FaEnvelope,
  FaQuestionCircle,
  FaShoppingBag,
  FaAddressBook,
  FaPowerOff,
  FaBox,
  FaChevronDown
} from "react-icons/fa";
import "./../styles.css"; // Adjust path as needed
import "./css/Header2.css"; // Adjust path as needed
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserCard from "./UserCard"; // Import UserCard component
import WishlistSidebar from "./WishlistSidebar"; // Import WishlistSidebar component
import logo from "./img/logo3.png";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { ApiUrl } from "./ApiUrl";
import axios from "axios";
// import Header3 from "./Header3";
import Swal from "sweetalert2";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
// import isOfferActive from './ProductDetail'
import { IoMdClose } from "react-icons/io"; // Importing close icon
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";
// import Lottie from "lottie-react";
// import empty_cart from './css/empty_cart.json'
import Empty_cart from './img/empty-cart.png'
import searchIcon from './img/search.png'
import usericon from "./img/user.png";
import defaultUser from "./img/default-picture.png";
import wishlisticon from "./img/wish-list.png";
import carticon from "./img/shopping-cart3.png";
import { Search, SearchIcon } from "lucide-react";

const Header2 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const userCardRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen4, setIsDropdownOpen4] = useState(false);
  const [isDropdownOpen3, setIsDropdownOpen3] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(true);
  const [product, setProduct] = useState(null);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [query, setQuery] = useState(""); // ✅ Fix: Declare query state
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const openMobileSearch = () => setShowMobileSearch(true);
  const closeMobileSearch = () => setShowMobileSearch(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const location = useLocation();

  // Focus the input when search opens
  useEffect(() => {
    if (showMobileSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showMobileSearch]);

  const suggestionRefs = useRef([]);

  //  useEffect(() => {
  //         const now = new Date();
  //         // console.log("Current Time:", now.toLocaleString());

  //         const activeProduct = cartItems.find((item) => {
  //           if (!item.offer_start_time || !item.offer_end_time) {
  //             // console.log(`Skipping product ${item.prod_name} due to missing offer times.`);
  //             return false;
  //           }

  //           const offerStartTime = new Date(item.offer_start_time);
  //           const offerEndTime = new Date(item.offer_end_time);

  //           // console.log(
  //           //   `Checking product: ${item.prod_name}, Offer Start: ${offerStartTime.toLocaleString()}, Offer End: ${offerEndTime.toLocaleString()}`
  //           // );

  //           return offerStartTime <= now && offerEndTime > now;
  //         });

  //         if (activeProduct) {
  //           // console.log("Active Product Found:", activeProduct);
  //         } else {
  //           // console.log("No active product with a valid offer.");
  //         }

  //         setProduct(activeProduct || null);
  //         setIsOfferActive(!!activeProduct);

  //         // console.log(`Is Offer Active: ${!!activeProduct ? "Yes" : "No"}`);
  //       }, [cartItems]);

  const isOfferValid = (item) => {
    if (!item.offer_start_time || !item.offer_end_time) return false;

    const now = new Date();
    const start = new Date(item.offer_start_time);
    const end = new Date(item.offer_end_time);

    return start <= now && now < end;
  };



  useEffect(() => {
    NProgress.configure({ showSpinner: false }); // Disable spinner

    NProgress.start();

    // Simulate a delay to show the progress bar
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 1000); // Adjust the time as needed

    // Cleanup function to stop NProgress if the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Hide dropdown on scroll
    const handleScroll = () => {
      if (showSuggestions) {
        setShowSuggestions(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideInput = inputRef.current && !inputRef.current.contains(event.target);
      const clickedOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);

      if (clickedOutsideInput && clickedOutsideDropdown) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (isDropdownOpen4) {
        setIsDropdownOpen4(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDropdownOpen4]);

  useEffect(() => {
    const handleScroll = () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    // Fetch the username from local storage
    const storedUsername = localStorage.getItem("username");

    // Update state with the stored username
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleMenuClick = (menu) => {
    console.log(`${menu} clicked`);
    // Add your navigation or action logic here based on the clicked menu
    setIsDropdownOpen(false); // Close dropdown after selection
  };
  const navigate = useNavigate();

  const fetchSuggestions = async (query) => {
    if (!query) {
      console.log("Empty query, skipping API call.");
      setSuggestions([]);
      setShowSuggestions(false);  // hide dropdown when input is cleared
      return;
    }

    console.log(`Fetching suggestions for: ${query}`);

    try {
      const response = await fetch(
        `${ApiUrl}/suggestions?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      console.log("Raw API response:", data); // Debugging

      if (response.ok && Array.isArray(data.suggestions)) {
        const unique = [...new Set(data.suggestions)];
        console.log("Suggestions received:", unique);

        setSuggestions(unique);
        setShowSuggestions(true);    // always keep it open
      } else {
        console.warn("No valid suggestions found.");

        setSuggestions([]);          // empty array → your “no matches” UI
        setShowSuggestions(true);    // keep dropdown open to show “No matches”
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);

      setSuggestions([]);            // hide the list, but show “No matches”
      setShowSuggestions(true);
    }
  };


  const handleClearInput = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Debounce API calls
  useEffect(() => {
    console.log(`Search query changed: ${searchQuery}`);
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSuggestions(searchQuery.trim().toLowerCase());
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    console.log(`Suggestion clicked: ${suggestion}`);
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(); // Perform search
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setHighlightedIndex(-1);

    setSearchQuery(value);

    if (value.trim() === "") {
      setShowSuggestions(false); // Hide when input is empty
    } else {
      setShowSuggestions(true); // Ensure it shows when typing
    }
  };

  const handleSearch = async () => {
    let finalQuery = searchQuery.trim().toLowerCase();

    // If a suggestion is highlighted, prefer that
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      const highlighted = suggestions[highlightedIndex];
      finalQuery = (highlighted?.prod_name || highlighted)?.toLowerCase();
    }

    if (!finalQuery) {
      console.warn("Search term is empty.");
      return;
    }

    try {
      const response = await fetch(
        `${ApiUrl}/api/suggestions?query=${encodeURIComponent(finalQuery)}`
      );
      const data = await response.json();

      if (response.ok && data.category) {
        console.log(`Navigating to category: ${data.category}`);
        navigate(
          `/${encodeURIComponent(data.category)}?search=${encodeURIComponent(
            finalQuery
          )}`
        );
      } else {
        console.warn("No category found.");
        // Swal.fire({
        //   title: "Product not found",
        //   text: "We could not find any products matching your search.",
        //   icon: "warning",
        //   confirmButtonText: "OK",
        // });
      }
    } catch (error) {
      console.error("Error during search:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while searching.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // const handleSuggestionClick = (suggestion) => {
  //   setSearchQuery(suggestion);
  //   setIsDropdownOpen3(false);
  //   navigate(`/${encodeURIComponent(suggestion)}`);
  // };

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 768); // adjust as needed
    };

    checkMobileView(); // check on mount
    window.addEventListener("resize", checkMobileView); // update on resize

    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);
  // useEffect(() => {
  //   const fetchLocalStorageData = () => {
  //     const storedEmail = localStorage.getItem("email");

  //     if (storedEmail) {
  //       const cartKey = `${storedEmail}-cart`;
  //       const wishlistKey = `${storedEmail}-wishlist`;

  //       const storedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
  //       const storedWishlistItems =
  //         JSON.parse(localStorage.getItem(wishlistKey)) || [];

  //       // Ensure quantity is set to 1 for items without a defined quantity
  //       const updatedCartItems = storedCartItems.map((item) => ({
  //         ...item,
  //         quantity: item.quantity || 1, // Set default quantity to 1 if not defined
  //       }));

  //       const updatedWishlistItems = storedWishlistItems.map((item) => ({
  //         ...item,
  //         quantity: item.quantity || 1, // Set default quantity to 1 if not defined
  //       }));

  //       setCartItems(updatedCartItems);
  //       setWishlistItems(updatedWishlistItems);
  //     }
  //   };

  //   // Fetch data every second
  //   const intervalId = setInterval(fetchLocalStorageData, 100);

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  const calculateTotalPrice = () => {
    // console.log(cartItems); // Before passing to Cart

    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(
          item.offer_price > 0 && isOfferActive
            ? item.offer_price
            : item.prod_price
        );
        return total + (isNaN(price) ? 0 : price * item.quantity);
      }, 0)
      .toFixed(0);
  };

  const discount = () => {
    return cartItems
      .reduce((total, item) => {
        const actual_price = parseFloat(item.actual_price);
        const price = parseFloat(item.price);
        const discountPerItem = actual_price - price;
        return (
          total + (isNaN(discountPerItem) ? 0 : discountPerItem * item.quantity)
        );
      }, 0)
      .toFixed(2);
  };

  const getTotalItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0); // Ensure quantity is a valid number
  };

  // const updateCartItemQuantity = (itemId, itemCategory, newQuantity) => {
  //   const updatedCartItems = cartItems.map((item) =>
  //     item.id === itemId && item.category === itemCategory
  //       ? { ...item, quantity: Math.max(newQuantity, 1) } // Ensure quantity does not go below 1
  //       : item
  //   );

  //   setCartItems(updatedCartItems);

  //   const storedEmail = localStorage.getItem("email");
  //   if (storedEmail) {
  //     const cartKey = `${storedEmail}-cart`;
  //     localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
  //   }
  // };

  // const removeFromCart = async (itemId, itemCategory) => {
  //   // Update local state
  //   const updatedCartItems = cartItems.filter(
  //     (item) => !(item.id === itemId && item.category === itemCategory)
  //   );
  //   setCartItems(updatedCartItems);

  //   // Update localStorage
  //   const storedEmail = localStorage.getItem("email");
  //   if (storedEmail) {
  //     const cartKey = `${storedEmail}-cart`;
  //     localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));

  //     try {
  //       // Remove item from the database
  //       const response = await axios.post(`${ApiUrl}/remove-from-cart`, {
  //         email: storedEmail,
  //         itemId: itemId,
  //         itemCategory: itemCategory, // Ensure category is included
  //       });

  //       // Check for successful response
  //       if (response.status === 200) {
  //         toast.success("Item removed from cart!", {
  //           position: "top-right",
  //           autoClose: 2000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //         });
  //       } else {
  //         throw new Error("Unexpected response status");
  //       }
  //     } catch (error) {
  //       console.error(
  //         "Error removing item from cart:",
  //         error.response || error.message || error
  //       );
  //       toast.error(
  //         `An error occurred: ${
  //           error.response?.data?.message || error.message
  //         }`,
  //         {
  //           position: "top-right",
  //           autoClose: 2000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //         }
  //       );
  //     }
  //   }
  // };

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) return; // Prevent reducing quantity below 1

    const email = localStorage.getItem("email"); // Ensure email is fetched properly
    // if (!email) {
    //   toast.error("User is not logged in!", {
    //     position: "top-right",
    //     autoClose: 2000,
    //   });
    //   return;
    // }

    try {
      // Send the updated quantity to the server
      const response = await axios.post(`${ApiUrl}/update-cart-quantity`, {
        email,
        itemId,
        quantity: newQuantity,
      });

      if (response.status === 200) {
        // Update the cart item in the local state only after a successful API call
        setCartItems((prevCartItems) =>
          prevCartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        toast.error("Failed to update item quantity", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast.error("Error updating item quantity", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const removeFromCart = async (itemId, itemName, quantity) => {
    try {
      // Remove the item from the local state first
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);

      // Send the removal request to the server
      const response = await axios.post(`${ApiUrl}/remove-from-cart`, {
        email,
        itemId,
        quantity,
      });

      if (response.data.success) {
        const shortName = itemName.length > 30
          ? itemName.substring(0, 27) + "..."
          : itemName;

        toast.success(`${shortName} has been removed from your cart!`, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
        });
      }
      else {
        console.error("Failed to remove item from cart");
        toast.error("Failed to remove item from cart!", {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Error removing item from cart!", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
      });
    }
  };

  const sidebarRef = useRef(null);
  const wishlistRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the sidebar and wishlist
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }

      if (
        wishlistRef.current &&
        !wishlistRef.current.contains(event.target) &&
        isWishlistOpen
      ) {
        setIsWishlistOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isWishlistOpen]);

  const toggleUserCard = () => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedUsername && storedEmail) {
      setIsDropdownOpen4((prevState) => !prevState); //  Toggles open/close
      setUser({ username: storedUsername, email: storedEmail });
    } else {
      navigate("/login");
    }
  };


  // const handleToggleDropdown = () => {
  //   setIsDropdownOpen((prevState) => !prevState);
  // };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    localStorage.removeItem("contact_number");

    setUser(null);
    setIsUserCardOpen(false);
    setIsDropdownOpen4(false); // Close the dropdown immediately

    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });

    // Delay the navigation until after the toast is shown
    setTimeout(() => {
      navigate("/login");
    }, 2000); // Match the autoClose duration of the toast
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedUsername && storedEmail) {
      setUser({ username: storedUsername, email: storedEmail });
    }

    const handleClickOutside = (event) => {
      const target = event.target;

      // Close user card
      if (
        userCardRef.current &&
        !userCardRef.current.contains(target) &&
        !target.closest(".users")
      ) {
        setIsUserCardOpen(false);
      }

      // Close the "dots" menu dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !target.closest(".dots")
      ) {
        setIsDropdownOpen(false);
      }

      // Close the user icon dropdown (using same ref as dots menu, shared dropdownRef)
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        imgRef.current &&
        !imgRef.current.contains(target) &&
        !target.closest(".icons") // Optional: in case "icons" is your img class
      ) {
        setIsDropdownOpen4(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const removeFromWishlist = async (itemId) => {
    // Remove the item from the wishlistItems state
    const updatedWishlistItems = wishlistItems.filter(
      (item) => item.id !== itemId
    );
    setWishlistItems(updatedWishlistItems);

    // Get the user's email from localStorage
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      const wishlistKey = `${storedEmail}-wishlist`;
      localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlistItems));

      // Remove the item from localStorage favourites
      const favouritesKey = "favourites";
      const currentFavourites = localStorage.getItem(favouritesKey) || "";

      // Remove the product from the favourites list
      const updatedFavourites = currentFavourites
        .split(",")
        .filter((item) => {
          // Check if the item is in the format `faredheart-productname-productid`
          const parts = item.split("-");
          return !(parts[0] === "faredheart" && parts[2] === itemId.toString());
        })
        .join(",");

      localStorage.setItem(favouritesKey, updatedFavourites);

      try {
        // Remove the item from the database
        const response = await axios.post(`${ApiUrl}/remove-from-wishlist`, {
          email: storedEmail,
          itemId: itemId,
        });

        // Check for successful response
        if (response.status === 200) {
          toast.success("Item removed from wishlist!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (error) {
        console.error(
          "Error removing item from wishlist:",
          error.response || error.message || error
        );
        toast.error(
          `An error occurred: ${error.response?.data?.message || error.message
          }`,
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
      }
    }
  };

  // useEffect(() => {
  //   console.log("Cart Items:", cartItems);
  //   console.log("Wishlist Items:", wishlistItems);
  // }, [cartItems, wishlistItems]);

  // const categoryMap = {
  //   TV: 'Television',
  //   Speakers: 'Speaker',
  //   // Add other mappings as needed
  // };
  const [isLoading, setIsLoading] = useState(true);

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (email) {
      const fetchCartItems = async () => {
        try {
          const response = await axios.post(`${ApiUrl}/get-cart-items`, {
            email,
            username: localStorage.getItem("username"),
          });

          const fetchedCart = response.data.products || [];
          setCartItems(fetchedCart);
          setCartLoaded(true);

          console.log("Fetched cart items:", fetchedCart);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCartItems();
      const intervalId = setInterval(fetchCartItems, 5000);

      return () => clearInterval(intervalId);
    }
  }, [email]); // Dependency on `email` so it will trigger fetch when email changes

  const handleViewCart = () => {
    navigate("/Cart", { state: { isOfferActive, product } });
  };

  useEffect(() => {
    if (
      highlightedIndex !== -1 &&
      suggestionRefs.current[highlightedIndex]
    ) {
      suggestionRefs.current[highlightedIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedIndex]);


  const handleSelect = async (suggestion) => {
    setQuery(suggestion); // Update input field
    setShowSuggestions(false); // Hide dropdown
    setShowMobileSearch(false)
    handleSearch();


    try {
      const response = await fetch(
        `${ApiUrl}/api/suggestions?query=${encodeURIComponent(suggestion)}`
      );
      const data = await response.json();

      if (response.ok && data.category) {
        console.log(`Navigating to: /${data.category}?search=${suggestion}`);
        navigate(
          `/${encodeURIComponent(data.category)}?search=${encodeURIComponent(
            suggestion
          )}`
        );
      } else {
        console.warn("No category found.");
        // Swal.fire({
        //   title: "Product not found",
        //   text: "We could not find any products matching your search.",
        //   icon: "warning",
        //   confirmButtonText: "OK",
        // });
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while searching.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handle Keyboard Events
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        const selected = suggestions[highlightedIndex];
        const query = selected?.prod_name || selected;
        handleSelect(query); // Send prod_name like in old dropdown
      }
    }
  };

  useEffect(() => {
    if (
      highlightedIndex !== null &&
      suggestionRefs.current[highlightedIndex]
    ) {
      suggestionRefs.current[highlightedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [suggestions, highlightedIndex, showSuggestions]);

  const handleProductClick = (product) => {
    const slugify = (name) =>
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    navigate(`/shop/${product.id}-${slugify(product.prod_name)}`);
  };
  return (
    <>
      <header
        // style={{ position: "sticky", top: 0, zIndex: 1001 }}
        className="header2"
      >
        {/* <div className="company-name"> */}
        <Link to="/">
          <img
            src={logo}
            width={"230px"}
            style={{ marginLeft: "50px" }}
            alt="Company Logo"
            // loading="lazy"
            loading="eager"
          />
        </Link>

        {/* {showMobileSearch && (
          <IoMdClose
            title="Close"
            className="mobile-close-icon"
            onClick={closeMobileSearch}
          />
        )} */}

        {showMobileSearch && (
          <div className="mobile-backdrop" onClick={closeMobileSearch} />
        )}
        {/* <div > */}
        <div

          className={`search-box ${showMobileSearch ? "mobile-overlay show" : "mobile-overlay"}`}
        >
          <div className="search-icon-container" onClick={handleSearch}>
            <FaSearch className="search-icon" />
          </div>
          <input
            type="text"
            className="searchboxinput"
            ref={inputRef}
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => setShowSuggestions(true)} // 
            placeholder="Search for products, brands and more"
            autoComplete="off"
          />
          {searchQuery && (
            <IoMdClose
              title="Clear"
              className="clear-icon"
              onClick={handleClearInput}
            />
          )}

        </div>

        {showSuggestions && (
          <ul ref={dropdownRef} className="suggestions-dropdown">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => {
                const prodName = suggestion?.prod_name || suggestion;

                return (
                  <li
                    key={index}
                    ref={(el) => (suggestionRefs.current[index] = el)}
                    onClick={() => handleSelect(prodName)}
                    className={index === highlightedIndex ? "highlighted" : ""}
                  >
                    <div className="suggestion-item">
                      <div className="suggestion-content">
                        <SearchIcon className="search-icon" />
                        <div className="suggestion-text">{prodName}</div>
                      </div>

                      {suggestion.prod_img && JSON.parse(suggestion.prod_img)?.[0] && (
                        <img
                          src={`${ApiUrl}/uploads/${suggestion.category.toLowerCase()}/${JSON.parse(suggestion.prod_img)[0]}`}
                          alt={prodName}
                          className="suggestion-image"
                        />
                      )}
                    </div>

                  </li>
                );
              })
            ) : searchQuery.trim() === "" ? (
              <li className="no-suggestionss">Search your products...</li> // 👈 New message for empty input
            ) : (
              <li className="no-suggestionss">
                No matches found for “{searchQuery}”
              </li>
            )}
          </ul>
        )}


        {/* </div> */}



        <div className="iconss">

          <div ref={imgRef} className="userLogo" onClick={toggleUserCard}>
            <img
              title={username ? `Logged in as ${username}` : "Login"}

              className="icons"
              src={username ? usericon : defaultUser}
              style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }}
              alt=""
            />
            <span style={{ fontSize: "14px", color: "#fff", display: "flex", alignItems: "center", gap: "4px" }}>
              {username ? (
                <>
                  <FaChevronDown
                    className={`down-arrow ${isDropdownOpen4 ? "rotate" : ""}`}
                    size={13}
                  />
                </>
              ) : (
                <>Login</>
              )}
            </span>
          </div>


          {/* {username && (
            <FaChevronDown className="dropdown-open-arrow" />
          )} */}

          {isDropdownOpen4 && (
            <div ref={dropdownRef} className="dropdownnn-container">
              <div className="dropdownnn-content">

                <Link
                  to="/MyAccount"
                  className={location.pathname === "/MyAccount" ? "active" : ""}
                  onClick={() => setIsDropdownOpen4(false)}
                >
                  {/* <FaUser style={{ color: "#333" }} className="iicon" /> */}
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 15a5.698 5.698 0 1 0 0-11.396A5.698 5.698 0 0 0 12 15Z" stroke="#2A55E5" stroke-width="1.4" stroke-miterlimit="10"></path><path d="M2.906 20.25a10.5 10.5 0 0 1 18.188 0" stroke="#2A55E5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>

                  <span style={{ fontSize: '16px' }}> My Profile</span>
                </Link>


                <Link
                  to="/UserAddress"
                  className={location.pathname === "/UserAddress" ? "active" : ""}
                  onClick={() => setIsDropdownOpen4(false)}
                >
                  {/* <FaAddressBook style={{ color: "#333" }} className="iicon" /> */}
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M5.683 20.75H17.97M11.827 12.558a2.73 2.73 0 1 0 0-5.462 2.73 2.73 0 0 0 0 5.462Z" stroke="#2A55E5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.654 9.827c0 6.144-6.827 10.923-6.827 10.923S5 15.971 5 9.827a6.827 6.827 0 1 1 13.654 0v0Z" stroke="#2A55E5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  <span style={{ fontSize: '16px' }}> Saved Address </span>
                </Link>



                <Link
                  to="/MyOrders"
                  className={location.pathname === "/MyOrders" ? "active" : ""}
                  onClick={() => setIsDropdownOpen4(false)}
                >
                  {/* <FaBox  className="iicon" />  */}
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" ><path d="M20.087 16.153V7.847a.682.682 0 0 0-.346-.59L12.33 3.089a.657.657 0 0 0-.658 0L4.26 7.258a.682.682 0 0 0-.345.59v8.305a.682.682 0 0 0 .345.59l7.412 4.169a.658.658 0 0 0 .658 0l7.412-4.17a.683.683 0 0 0 .346-.59v0Z" stroke="#2A55E5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.128 14.064v-4.38L7.957 5.177" stroke="#2A55E5" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20.007 7.502 12.082 12 4.008 7.502M12.076 12 12 20.996" stroke="#2A55E5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  <span style={{ fontSize: '16px' }}> Orders </span>
                </Link>

                {/* <Link
                  to="/Cart"
                  className={`cart-link ${location.pathname === "/Cart" ? "active" : ""}`}
                  onClick={() => setIsDropdownOpen4(false)}
                >
                  <FaShoppingCart style={{ color: "#2A55E5" }}  />
                  <div className="cart-icon-container">
                    {getTotalItemsCount() > 0 && (
                      <span className="cart-count2">{getTotalItemsCount()}</span>
                    )}
                    Cart
                  </div>
                </Link> */}

                <hr />
                <Link
                  to="#"
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen4(false);
                  }}
                >
                  {/* <FaPowerOff style={{ color: "#333" }} /> */}
                  <svg width="24" height="24" class="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#2A55E5" stroke-width="0.3" stroke="#2A55E5" d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"></path></svg>
                  <span style={{ fontSize: '16px' }}> Logout </span>
                </Link>
              </div>
            </div>
          )}




          {/* <FaHeart
            style={{ color: "white" }}
            title="Wish List"
            onClick={toggleWishlist}
          /> */}
          <img
            title="Wish List"
            onClick={toggleWishlist}
            src={wishlisticon}
            className="icons2"
            style={{ width: "25px", cursor: "pointer" }}
            alt=""
          />


          <div className="cart-icon-container">
            {/* <FaShoppingCart
              style={{ color: "white", marginTop: "4px" }}
              title="Cart"
              onClick={toggleSidebar}
            /> */}
            <img
              title="Cart"
              onClick={toggleSidebar}
              src={carticon}
              style={{ width: "25px", cursor: "pointer", marginLeft: '5px' }}
              alt=""
              className="icons"
            />


            <FaEllipsisV
              style={{ color: "white" }}
              // className="dots"
              className={`dots ${isDropdownOpen ? "dot-rotate" : ""}`}

              onClick={handleToggleDropdown}
            />

            {isDropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <Link to="/About" onClick={() => handleMenuClick("About")}>
                  <div className={`dropdown-item ${location.pathname === "/About" ? "active" : ""}`}>
                    {/* <FaInfoCircle className="dropdown-icon" /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon">
                      <circle cx="12" cy="12" r="9"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>

                    <span style={{ fontSize: '16px' }}>About</span>
                  </div>
                </Link>
                <Link to="/Contact" onClick={() => handleMenuClick("Contact")}>
                  <div className={`dropdown-item ${location.pathname === "/Contact" ? "active" : ""}`}>
                    {/* <FaEnvelope className="dropdown-icon" /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon">
                      <path d="M4 4h16v16H4z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>


                    <span style={{ fontSize: '16px' }}>Contact</span>
                  </div>
                </Link>
                <Link to="/HelpCenter" onClick={() => handleMenuClick("Help Center")}>
                  <div className={`dropdown-item ${location.pathname === "/HelpCenter" ? "active" : ""}`}>
                    {/* <FaQuestionCircle className="dropdown-icon" /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9 9c0-3.5 5.5-3.5 5.5 0c0 2.5-2.5 3-2.5 5"></path>
                      <circle cx="12" cy="18.01" r="0.01"></circle>
                    </svg>

                    <span style={{ fontSize: '16px' }}>Help Center</span>
                  </div>
                </Link>
              </div>
            )}


            {getTotalItemsCount() > 0 && (
              <span className="cart-count">{getTotalItemsCount()}</span>
            )}


          </div>
          <div className="mobile-search-icon" onClick={openMobileSearch}>
            {/* <FaSearch /> */}
            <img src={searchIcon} className="search-product-icon" width={"28px"} />

          </div>


          {/* {isMobileView && <Header3 />} */}
        </div>

        <div
          ref={sidebarRef}
          className={`sidebarcart ${isSidebarOpen ? "open" : ""}`}
        >

          <div className="sidebarcart-header">
            <button
              // style={{ color: "white" }}
              className="close-btn"
              onClick={toggleSidebar}
            >
              <FaTimes />
            </button>
            <h3>Cart</h3>
          </div>
          {/* </div> */}
          <div className="sidebarcart-body">
            {isLoading ? (

              <>
                <p style={{ textAlign: "center" }}>Your cart is empty.</p>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                  {/* <Lottie animationData={empty_cart} style={{ width: 250, height: 250 }} /> */}
                  <img src={Empty_cart} className="empty-cart-image" alt="Cart is Empty" />
                </div>
              </>) : cartItems.length === 0 ? (

                <>
                  <p style={{ textAlign: "center" }}>Your cart is empty.</p>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                    {/* <Lottie animationData={empty_cart} style={{ width: 250, height: 250 }} /> */}
                    <img src={Empty_cart} className="empty-cart-image" alt="Cart is Empty" />

                  </div>

                </>) : (
              <ul>
                {cartItems.map((item) => {
                  // Check if image is a stringified array and parse it
                  const images = Array.isArray(item.prod_img)
                    ? item.prod_img
                    : JSON.parse(item.prod_img || "[]"); // Handle if it's a stringified array

                  const firstImage = images.length > 0 ? images[0] : null; // Get the first image or fallback to null

                  return (
                    <li key={item.id} className="cart-item">
                      <span
                        style={{ cursor: "pointer" }}
                        // to={`/product/${item.id}`}
                        onClick={() => {
                          setIsSidebarOpen(false);
                          handleProductClick(item);
                        }}
                      >
                        {firstImage ? (
                          <img
                            src={`${ApiUrl}/uploads/${item.category.toLowerCase()}/${firstImage}`}
                            alt={item.prod_name}
                            loading="lazy"
                          />
                        ) : (
                          <span className="placeholder-image">
                            No image available
                          </span> // Fallback if no image is available
                        )}
                      </span>
                      <div className="item-details">
                        <span
                          style={{ cursor: "pointer" }}
                          // to={`/product/${item.id}`}
                          onClick={() => {
                            setIsSidebarOpen(false);
                            handleProductClick(item);
                          }}
                        >
                          <h3 className="item-name">{item.prod_name}</h3>
                          {/* <span className="item-features">{item.prod_features}</span> */}
                        </span>
                      </div>

                      <div className="item-price">
                        <p
                          style={{
                            color: "red",
                            textDecoration: "line-through",
                            fontSize: "12px",
                          }}
                        >
                          ₹{item.actual_price * item.quantity}
                        </p>
                        <p style={{ color: "#27ae60" }}>
                          {" "}
                          {/* ₹{item.prod_price * item.quantity} */}₹
                          {item.offer_price > 0 && isOfferValid(item)
                            ? item.offer_price
                            : item.prod_price}

                        </p>

                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.id,
                              item.prod_name,
                              item.quantity
                            )
                          }
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="cart-total">
              <div className="sidebarcart-footer">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to="/Cart"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {/* <button className="change-btn" onClick={handleViewCart}>
                    View Cart <FaShoppingCart />
                  </button> */}
                  {/* <button class="Btn">
  
  <div class="sign" onClick={handleViewCart}> <svg
                                class="svg-icon"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                              </svg></div>
  
  <div class="text">View Cart</div>
</button> */}

                  <button class="cssbuttons-io-button">
                    View Cart
                    <div class="icon3" onClick={handleViewCart}>
                      <svg
                        class="svg-icon"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </div>
                  </button>
                </Link>

                {calculateTotalPrice() > 0 && (
                  <p className="total-prices">₹{calculateTotalPrice()}</p>
                )}

                {/* <ToastContainer position="top-right" autoClose={3000} /> */}
              </div>
            </div>
          </div>
        </div>

        <WishlistSidebar
          isOpen={isWishlistOpen}
          toggleWishlist={toggleWishlist}
          wishlistItems={wishlistItems}
          removeFromWishlist={removeFromWishlist}
          wishlistRef={wishlistRef} // Pass the ref
        />
        {isUserCardOpen && user && (
          <div className="user-card-container" ref={userCardRef}>
            <UserCard
              user={user}
              onLogout={handleLogout}
              onClose={() => setIsUserCardOpen(false)}
            />
          </div>
        )}
      </header>
      {/* {!isMobileView && <Header3 />} */}

      {/* <ToastContainer /> */}

    </>
  );
};

export default Header2;
