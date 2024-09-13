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
} from "react-icons/fa";
import "./../styles.css"; // Adjust path as needed
import "./css/Header2.css"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard"; // Import UserCard component
import WishlistSidebar from "./WishlistSidebar"; // Import WishlistSidebar component
import logo from "./img/logo3.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiUrl } from "./ApiUrl";
import axios from "axios";
import Header3 from "./Header3";
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
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleMenuClick = (menu) => {
    console.log(`${menu} clicked`);
    // Add your navigation or action logic here based on the clicked menu
    setIsDropdownOpen(false); // Close dropdown after selection
  };
  const navigate = useNavigate();

  // Fetch suggestions from API
  useEffect(() => {
    if (searchQuery.trim()) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `${ApiUrl}/api/suggestions?query=${encodeURIComponent(
              searchQuery.trim()
            )}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.message) {
              // Handle case where no product was found
              setErrorMessage(data.message);
              setSuggestions([]);
              setIsDropdownOpen(false);
            } else {
              setSuggestions([data.category]);
              setErrorMessage("");
              // setIsDropdownOpen(true);
            }
          } else {
            console.error("Failed to fetch suggestions");
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setErrorMessage(""); // Clear error message if input is empty
    }
  }, [searchQuery]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      if (suggestions.length > 0) {
        navigate(`/${encodeURIComponent(suggestions[0])}`);
      } else {
        setErrorMessage("Product not found"); // Set error message if no suggestions are available
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setIsDropdownOpen(false);
    navigate(`/${encodeURIComponent(suggestion)}`);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize(); // Initialize
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchLocalStorageData = () => {
      const storedEmail = localStorage.getItem("email");

      if (storedEmail) {
        const cartKey = `${storedEmail}-cart`;
        const wishlistKey = `${storedEmail}-wishlist`;

        const storedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
        const storedWishlistItems =
          JSON.parse(localStorage.getItem(wishlistKey)) || [];

        // Ensure quantity is set to 1 for items without a defined quantity
        const updatedCartItems = storedCartItems.map((item) => ({
          ...item,
          quantity: item.quantity || 1, // Set default quantity to 1 if not defined
        }));

        const updatedWishlistItems = storedWishlistItems.map((item) => ({
          ...item,
          quantity: item.quantity || 1, // Set default quantity to 1 if not defined
        }));

        setCartItems(updatedCartItems);
        setWishlistItems(updatedWishlistItems);
      }
    };

    // Fetch data every second
    const intervalId = setInterval(fetchLocalStorageData, 100);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const calculateTotalPrice = () => {
    console.log(cartItems); // Before passing to Cart

    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price);
        return total + (isNaN(price) ? 0 : price * item.quantity);
      }, 0)
      .toFixed(2);
  };

  const getTotalItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0); // Ensure quantity is a valid number
  };

  const updateCartItemQuantity = (itemId, itemCategory, newQuantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId && item.category === itemCategory
        ? { ...item, quantity: Math.max(newQuantity, 1) } // Ensure quantity does not go below 1
        : item
    );

    setCartItems(updatedCartItems);

    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      const cartKey = `${storedEmail}-cart`;
      localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
    }
  };

  const removeFromCart = async (itemId, itemCategory) => {
    // Update local state
    const updatedCartItems = cartItems.filter(
      (item) => !(item.id === itemId && item.category === itemCategory)
    );
    setCartItems(updatedCartItems);

    // Update localStorage
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      const cartKey = `${storedEmail}-cart`;
      localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));

      try {
        // Remove item from the database
        const response = await axios.post(`${ApiUrl}/remove-from-cart`, {
          email: storedEmail,
          itemId: itemId,
          itemCategory: itemCategory, // Ensure category is included
        });

        // Check for successful response
        if (response.status === 200) {
          toast.success("Item removed from cart!", {
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
          "Error removing item from cart:",
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  const toggleUserCard = () => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedUsername && storedEmail) {
      setIsUserCardOpen((prevState) => !prevState);
      setUser({ username: storedUsername, email: storedEmail });
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
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
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".dots")
      ) {
        setIsDropdownOpen(false);
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

  return (
    <>
      <header
        style={{ position: "sticky", top: 0, zIndex: 1000 }}
        className="header2"
      >
        <div className="company-name">
          <a href="/">
            <img src={logo} width={"230px"} alt="Company Logo" />
          </a>
        </div>
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Search for products..."
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
          {/* <button  >Search</button> */}
          {isDropdownOpen && suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
        <div className="icons">
          <FaUser className="users" title="Login" onClick={toggleUserCard} />
          <FaHeart title="Wish List" onClick={toggleWishlist} />
          <div className="cart-icon-container">
            <FaShoppingCart title="Cart" onClick={toggleSidebar} />
            <FaEllipsisV className="dots" onClick={handleToggleDropdown} />

            {getTotalItemsCount() > 0 && (
              <span className="cart-count">{getTotalItemsCount()}</span>
            )}

            {isDropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
              <a href="/About">
                <div className="dropdown-item" onClick={() => handleMenuClick("About")}>
                  <FaInfoCircle className="dropdown-icon" />
                  <span>About</span>
                </div>
              </a>
              <a href="/Contact">
                <div className="dropdown-item" onClick={() => handleMenuClick("Contact")}>
                  <FaEnvelope className="dropdown-icon" />
                  <span>Contact</span>
                </div>
              </a>
              <a href="/HelpCenter">
                <div className="dropdown-item" onClick={() => handleMenuClick("Help Center")}>
                  <FaQuestionCircle className="dropdown-icon" />
                  <span>Help Center</span>
                </div>
              </a>
            </div>
            )}
          </div>
          {isMobileView && <Header3 />}
        </div>
        <div className={`sidebarcart ${isSidebarOpen ? "open" : ""}`}>
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
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-item">
                    <img
                      src={`${ApiUrl}/uploads/${item.category}/${item.image}`}
                      alt={item.name}
                      loading="lazy"
                      name="image"
                    />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      {/* <h3>{item.product_id}</h3> */}
                      <p>{item.description}</p>
                    </div>
                    <div className="item-price">
                      <p>₹{item.price * item.quantity}</p>
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateCartItemQuantity(
                              item.id,
                              item.category,
                              Math.max(item.quantity - 1, 1)
                            )
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartItemQuantity(
                              item.id,
                              item.category,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.category)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="cart-total">
              <div className="sidebarcart-footer">
                <p>Total Price: ₹{calculateTotalPrice()}</p>
                <a style={{textDecoration:'none', color:'black'}} href="/Cart">
                  <span>View Cart <FaShoppingCart  /> </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <WishlistSidebar
          isOpen={isWishlistOpen}
          toggleWishlist={toggleWishlist}
          wishlistItems={wishlistItems}
          removeFromWishlist={removeFromWishlist}
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
