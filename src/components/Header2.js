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
} from "react-icons/fa";
import "./../styles.css"; // Adjust path as needed
import "./css/Header2.css"; // Adjust path as needed
import { Link, useNavigate } from "react-router-dom";
import UserCard from "./UserCard"; // Import UserCard component
import WishlistSidebar from "./WishlistSidebar"; // Import WishlistSidebar component
import logo from "./img/logo3.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiUrl } from "./ApiUrl";
import axios from "axios";
import Header3 from "./Header3";
import Swal from "sweetalert2";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
// import isOfferActive from './ProductDetail'
import { IoMdClose } from "react-icons/io"; // Importing close icon

import usericon from "./img/user.png";
import wishlisticon from "./img/wish-list.png";
import carticon from "./img/shopping-cart3.png";

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

  useEffect(() => {
    if (cartItems.length === 0) {
      console.log("Cart is empty, no offer status to check.");
      setProduct(null);
      return;
    }

    let activeOffer = false;
    let bestProduct = null;

    cartItems.forEach((item) => {
      if (item.offer_end_time) {
        const now = new Date();
        const offerEndTime = new Date(item.offer_end_time);

        console.log(
          `Checking offer for ${item.prod_name}:`,
          offerEndTime.toLocaleString()
        );

        if (offerEndTime > now) {
          activeOffer = true;
          bestProduct = item; // Assign the first item with an active offer
        }
      }
    });

    setIsOfferActive(activeOffer);
    setProduct(bestProduct); // Assign the product with the active offer (or null if none)

    console.log(`Final Offer Status: ${activeOffer ? "Yes" : "No"}`);
    console.log("Assigned product for offer tracking:", bestProduct);
  }, [cartItems]);

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
    // Hide dropdown when clicking outside
    const handleClickOutside = (event) => {
      // Check if click happened inside the search container
      if (
        !event.target.closest(".search-container") &&
        !event.target.closest(".suggestions-dropdown")
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
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
      setShowSuggestions(false);
      return;
    }

    console.log(`Fetching suggestions for: ${query}`);

    try {
      const response = await fetch(
        `${ApiUrl}/suggestions?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      console.log("Raw API response:", data); // Debugging log

      if (
        response.ok &&
        Array.isArray(data.suggestions) &&
        data.suggestions.length
      ) {
        console.log("Suggestions received:", data.suggestions);
        setSuggestions([...new Set(data.suggestions)]); // Remove duplicates
        setShowSuggestions(true); // ✅ Ensure this is set to true
      } else {
        console.warn("No valid suggestions found.");
        setSuggestions([]);
        setShowSuggestions(false); // ✅ Hide when no suggestions
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
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
    setSearchQuery(value);

    if (value.trim() === "") {
      setShowSuggestions(false); // Hide when input is empty
    } else {
      setShowSuggestions(true); // Ensure it shows when typing
    }
  };

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (!trimmedQuery) {
      console.warn("Search term is empty.");
      return;
    }

    try {
      const response = await fetch(
        `${ApiUrl}/api/suggestions?query=${encodeURIComponent(trimmedQuery)}`
      );
      const data = await response.json();

      if (response.ok && data.category) {
        console.log(`Navigating to category: ${data.category}`);
        navigate(
          `/${encodeURIComponent(data.category)}?search=${encodeURIComponent(
            trimmedQuery
          )}`
        );
      } else {
        console.warn("No category found.");
        Swal.fire({
          title: "Product not found",
          text: "We could not find any products matching your search.",
          icon: "warning",
          confirmButtonText: "OK",
        });
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
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize(); // Initialize
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
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
    if (!email) {
      toast.error("User is not logged in!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

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
        // Toast notification for successful removal
        toast.success(`${itemName} has been removed from your cart!`, {
          position: "top-right",
          autoClose: 2000,
          closeOnClick: true,
        });
      } else {
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
      setIsDropdownOpen4((prevState) => !prevState);
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
    localStorage.removeItem("email-wishlist");
    localStorage.removeItem("email-cart");
    localStorage.removeItem("favourites");
    localStorage.removeItem("user_id");
    setUser(null);
    setIsUserCardOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedUsername && storedEmail) {
      setUser({ username: storedUsername, email: storedEmail });
    }

    const handleClickOutside = (event) => {
      if (
        userCardRef.current &&
        !userCardRef.current.contains(event.target) &&
        !event.target.closest(".users")
      ) {
        setIsUserCardOpen(false);
        setIsDropdownOpen(false);
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".dots")
      ) {
        setIsDropdownOpen(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen4(false); // Close the dropdown if clicked outside
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
          `An error occurred: ${
            error.response?.data?.message || error.message
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

  const handleSelect = async (suggestion) => {
    setQuery(suggestion); // Update input field
    setShowSuggestions(false); // Hide dropdown

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
        Swal.fire({
          title: "Product not found",
          text: "We could not find any products matching your search.",
          icon: "warning",
          confirmButtonText: "OK",
        });
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
          />
        </Link>
        {/* </div> */}
        <div className="search-box">
          <input
            type="text"
            className="searchboxinput"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Search for products..."
            autoComplete="off" 
          />
          {searchQuery && (
            <IoMdClose
              title="Clear"
              className="clear-icon"
              onClick={handleClearInput}
            />
          )}
          <div className="search-icon-container" onClick={handleSearch}>
            <FaSearch className="search-icon" />
          </div>
        </div>

        {/* Dropdown should be OUTSIDE search-box */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSelect(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        <div className="iconss">
          {/* <FaUser
            title={username || "Login"}
            style={{ color: "white" }}
            className="users"
            onClick={toggleUserCard}
          /> */}
          <img
            title={username || "Login"}
            // style={{ color: "white" }}
            className="icons"
            onClick={toggleUserCard}
            src={usericon}
            style={{ width: "25px", cursor: "pointer" }}
            alt=""
          />

          {isDropdownOpen && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <Link to="/About">
              {/* <a href="/About"> */}
                <div
                  className="dropdown-item"
                  onClick={() => handleMenuClick("About")}
                >
                  <FaInfoCircle
                    style={{ color: "#333" }}
                    className="dropdown-icon"
                  />
                  <span>About</span>
                </div>
              </Link>
              <Link to="/Contact">
                <div
                  className="dropdown-item"
                  onClick={() => handleMenuClick("Contact")}
                >
                  <FaEnvelope
                    style={{ color: "#333" }}
                    className="dropdown-icon"
                  />
                  <span>Contact</span>
                </div>
              </Link>
              <Link to="/HelpCenter">
                <div
                  className="dropdown-item"
                  onClick={() => handleMenuClick("Help Center")}
                >
                  <FaQuestionCircle
                    style={{ color: "#333" }}
                    className="dropdown-icon"
                  />
                  <span>Help Center</span>
                </div>
              </Link>
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
              style={{ width: "25px", cursor: "pointer" }}
              alt=""
              className="icons"
            />

            <FaEllipsisV
              style={{ color: "white" }}
              className="dots"
              onClick={handleToggleDropdown}
            />

            {getTotalItemsCount() > 0 && (
              <span className="cart-count">{getTotalItemsCount()}</span>
            )}

            {isDropdownOpen4 && (
              <div ref={dropdownRef} className="dropdownnn-container">
                <div className="dropdownnn-content">
                  <Link to="/UserAddress" onClick={() => setIsDropdownOpen4(false)}>
                    <FaAddressBook
                      style={{ color: "#333" }}
                      className="iicon"
                    />{" "}
                    My Addresses
                  </Link>
                  {/* <a to="/my-subscription"><FaCalendarCheck /> My Subscription</a> */}
                  <Link to="/MyAccount" onClick={() => setIsDropdownOpen4(false)}>
                    <FaUser style={{ color: "#333" }} className="iicon" /> My
                    Account
                  </Link>
                  <Link to="/MyOrders" onClick={() => setIsDropdownOpen4(false)}>
                    <FaBox style={{ color: "#333" }} className="iicon" /> My
                    Orders
                  </Link>
                  <Link to="/Cart" className="cart-link" onClick={() => setIsDropdownOpen4(false)}>
                    <FaShoppingBag
                      style={{ color: "#333" }}
                      className="iicon"
                    />

                    <div className="cart-icon-container">
                      {getTotalItemsCount() > 0 && (
                        <span className="cart-count2">
                          {getTotalItemsCount()}
                        </span>
                      )}
                      Cart
                    </div>
                  </Link>

                  <hr />
                  <Link to="#" onClick={() => { handleLogout(); setIsDropdownOpen4(false); }}>
                    <FaPowerOff style={{ color: "#333" }} /> Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
          {isMobileView && <Header3 />}
        </div>

        <div
          ref={sidebarRef}
          className={`sidebarcart ${isSidebarOpen ? "open" : ""}`}
        >
          <button
            style={{ color: "black" }}
            className="close-btn"
            onClick={toggleSidebar}
          >
            <FaTimes />
          </button>
          <div className="sidebarcart-header">
            <h3>Cart</h3>
          </div>
          <div className="sidebarcart-body">
            {isLoading ? (
              <p>Your cart is empty.</p>
            ) : cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {cartItems.map((item) => {
                  // Check if image is a stringified array and parse it
                  const images = Array.isArray(item.prod_img)
                    ? item.prod_img
                    : JSON.parse(item.prod_img || "[]"); // Handle if it's a stringified array

                  const firstImage = images.length > 0 ? images[0] : null; // Get the first image or fallback to null

                  return (
                    <li key={item.id} className="cart-item">
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/product/${item.id}`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {firstImage ? (
                          <img
                            src={`${ApiUrl}/uploads/${item.category.toLowerCase()}/${firstImage}`}
                            alt={item.prod_name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="placeholder-image">
                            No image available
                          </div> // Fallback if no image is available
                        )}
                      </Link>
                      <div className="item-details">
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/product/${item.id}`}
                        onClick={() => setIsSidebarOpen(false)}

                        >
                          <h3 className="item-name">{item.prod_name}</h3>
                          <p className="item-features">{item.prod_features}</p>
                        </Link>
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
                          {item.offer_price > 0 && isOfferActive
                            ? item.offer_price * item.quantity
                            : item.prod_price * item.quantity}
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

                <p className="total-prices">₹{calculateTotalPrice()}</p>  


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
      {!isMobileView && <Header3 />}
    </>
  );
};

export default Header2;
