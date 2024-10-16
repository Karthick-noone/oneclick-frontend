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
  const [isDropdownOpen3, setIsDropdownOpen3] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState("");


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

  useEffect(() => {
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
            setSuggestions([]);
            setErrorMessage(data.message);
            setIsDropdownOpen3(true);
          } else {
            setSuggestions([data.category]);
            setErrorMessage("");
            setIsDropdownOpen3(true);
          }
        } else {
          console.error("Failed to fetch suggestions");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    if (searchQuery.trim()) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setIsDropdownOpen3(false);
      setErrorMessage(""); // Clear error message if input is empty
    }
  }, [searchQuery]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const keywordMapping = [
    { term: "Computers", keywords: ["laptop", "laptops", "desktop", "desktops", "computer", "computers", "notebook"] },
    { term: "Mobiles", keywords: ["mobile", "mobiles", "smartphone", "smartphones", "phones", "phone", "android"] },
    { term: "Headphones", keywords: ["headphone", "headphones", "earphone", "earphones", "earbuds", "headset", "wireless headphone", "wired headphone", "wired headphones"] },
    { term: "Printers", keywords: ["printer", "scanner", "fax"] },
    { term: "Speaker", keywords: ["speaker", "speakers", "bluetooth speaker", "audio", "home theatre"] },
    { term: "Television", keywords: ["television", "tv", "tele"] },
    { term: "Watch", keywords: ["watch", "smart watch", "time", "clock", "wall clock"] },
    { term: "CCTV", keywords: ["cctv", "security camera", "surveillance"] },
    { term: "ComputerAccessories", keywords: ["keyboard", "mouse", "monitor", "webcam", "laptop charger", "adapter"] },
    { term: "MobileAccessories", keywords: ["charger", "mobile charger", "back cover", "back case", "flip cover", "case", "screen protector", "power bank", "c type charger"] }
];
// Function to handle search and navigate
// Function to handle search and navigate
// Function to handle search and navigate
const handleSearch = async () => {
  const searchTerm = searchQuery.trim().toLowerCase(); // Convert input to lowercase for comparison

  if (searchTerm) {
    // 1. First, check locally using keyword mapping
    const foundCategory = keywordMapping.find(mapping => 
      mapping.keywords.some(keyword => searchTerm === keyword.toLowerCase()) // Use exact match, not includes
    );

    if (foundCategory) {
      let category = foundCategory.term;

      // Explicitly handle "TV" search
      if (searchTerm === 'tv') {
        category = 'TeleVision';
      }

      // If a local match is found, navigate to the category with search query
      navigate(`/${encodeURIComponent(category)}?search=${encodeURIComponent(searchTerm)}`);
    } else {
      // 2. If no local match, call the backend API for suggestions
      try {
        const response = await fetch(`${ApiUrl}/api/suggestions?query=${encodeURIComponent(searchQuery.trim())}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.category) {
            let category = data.category;

            // Explicitly handle backend response for "tv"
            if (category.toLowerCase() === 'tv') {
              category = 'TeleVision';
            } else if (searchQuery.trim().toLowerCase() === 'cctv') {
              category = 'CCTV';
            }

            // Navigate to the product's category page with search query
            navigate(`/${encodeURIComponent(category)}?search=${encodeURIComponent(searchTerm)}`);
          } else {
            // If the backend doesn't return a category, show "Product not found"
            Swal.fire({
              title: 'Product not found',
              text: 'We could not find any products matching your search.',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          }
        } else {
          Swal.fire({
            title: 'Product not found',
            text: 'We could not find any products matching your search.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error("Error during search:", error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while searching.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
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
    // console.log(cartItems); // Before passing to Cart

    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price);
        return total + (isNaN(price) ? 0 : price * item.quantity);
      }, 0)
      .toFixed(2);
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
        setIsDropdownOpen3(false);
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


  // const categoryMap = {
  //   TV: 'Television',
  //   Speakers: 'Speaker',
  //   // Add other mappings as needed
  // };


  return (
    <>
      <header
        style={{ position: "sticky", top: 0, zIndex: 1001 }}
        className="header2"
      >
        <div className="company-name">
          <a href="/">
            <img src={logo} width={"230px"} alt="Company Logo" />
          </a>
        </div>
        <div className="search-box" ref={dropdownRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Search for products..."
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* {isDropdownOpen3 && (
            <ul className="suggestions-dropdown">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))
              ) : (
                <li className="no-suggestions">Product not found</li>
              )}
            </ul>
          )} */}
        </div>

        <div className="iconss">
          <FaUser  title={username || "Login"} style={{color:'white'}} className="users"  onClick={toggleUserCard} />
          <FaHeart style={{color:'white'}} title="Wish List" onClick={toggleWishlist} />
          <div className="cart-icon-container">
            <FaShoppingCart style={{color:'white',marginTop:'5px'}} title="Cart" onClick={toggleSidebar} />
            <FaEllipsisV style={{color:'white'}} className="dots" onClick={handleToggleDropdown} />

            {getTotalItemsCount() > 0 && (
              <span className="cart-count">{getTotalItemsCount()}</span>
            )}

            {isDropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <a href="/About">
                  <div
                    className="dropdown-item"
                    onClick={() => handleMenuClick("About")}
                  >
                    <FaInfoCircle style={{color:'#333'}} className="dropdown-icon" />
                    <span>About</span>
                  </div>
                </a>
                <a href="/Contact">
                  <div
                    className="dropdown-item"
                    onClick={() => handleMenuClick("Contact")}
                  >
                    <FaEnvelope style={{color:'#333'}}className="dropdown-icon" />
                    <span>Contact</span>
                  </div>
                </a>
                <a href="/HelpCenter">
                  <div
                    className="dropdown-item"
                    onClick={() => handleMenuClick("Help Center")}
                  >
                    <FaQuestionCircle style={{color:'#333'}}className="dropdown-icon" />
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
      {cartItems.slice().reverse().map((item) => {
        // Check if image is an array or a string
        const images = Array.isArray(item.image) 
          ? item.image 
          : JSON.parse(item.image || '[]'); // Handle JSON string
        const firstImage = images.length > 0 ? images[0] : null; // Get the first image or null if not available

        return (
          <li key={item.id} className="cart-item">
            {/* <Link style={{ textDecoration: 'none' }} to={`/${categoryMap[item.category] || item.category}`}> */}

            <Link style={{ textDecoration: 'none' }} to={`/product/${item.id}`}>
            {firstImage ? (
                <img
                  src={`${ApiUrl}/uploads/${item.category.toLowerCase()}/${firstImage}`}
                  alt={item.name}
                  loading="lazy"
                  name="image"
                />
              ) : (
                <div className="placeholder-image">No image available</div> // Fallback message
              )}
            </Link>

            <div className="item-details">
              <Link style={{ textDecoration: 'none' }} to={`/product/${item.id}`}>
                <h3 className="item-name">{item.name}</h3>
                <p className="item-features">{item.description}</p>
              </Link>
            </div>

            <div className="item-price">
            <p style={{ color: 'red',textDecoration:"line-through", fontSize:'12px' }}>₹{item.actual_price}</p>

              <p style={{ color: '#27ae60' }}> ₹{item.price * item.quantity}</p>
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
        );
      })}
    </ul>
  )}
  <div className="cart-total">
    <div className="sidebarcart-footer">
    <span style={{fontSize:'14px', textDecoration:'line-through'}}>{discount()} </span>  
      <p>₹{calculateTotalPrice()}</p>
      <a
        style={{ textDecoration: "none", color: "black" }}
        href="/Cart"
      >
        <button className="change-btn">
          View Cart <FaShoppingCart />{" "}
        </button>
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
