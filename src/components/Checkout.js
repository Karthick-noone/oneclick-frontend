import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Cart.css";
import { ApiUrl } from "./ApiUrl";
// import Header1 from './Header1';
import Header2 from "./Header2";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaTrash, FaCheck } from "react-icons/fa";
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { FaCashRegister, FaCreditCard, FaUniversity, FaPaypal } from 'react-icons/fa';
import Swal from "sweetalert2";
import Footer from "./footer";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // State for selected address
  const [, setWishlistItems] = useState([]);
  const [addresses, setAddresses] = useState([]); // State for storing fetched addresses
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addressDetails, setAddressDetails] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null); // Initially selected address
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [username, setUsername] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(
    cartItems.length > 0 ? cartItems[0].id : null
  ); // Default to first product if available
  const [newTotalAmount, setNewTotalAmount] = useState(0); // New state for total amount after applying coupon
  const [discountAmount, setDiscountAmount] = useState(0); // New state for storing discount
  const [messageType, setMessageType] = useState(""); // New state to track the message type (success/error)
  const [isCouponApplied, setIsCouponApplied] = useState(false); // New state to track if coupon is applied

  const handleCouponChange = (event) => {
    setCoupon(event.target.value);
  };

  const handleApplyCoupon = async (couponCode) => {

    if (!couponCode.trim()) {
      // If the coupon input is empty, show a message and exit the function
      setMessage("Please enter a coupon code.");
      setMessageType("error");
      return;
    }
    if (isCouponApplied) {
      setMessage("Coupon has already been applied!");
      setMessageType("warning");
      return;
    }

    try {
      console.log("Applying coupon:", couponCode, "for all products in cart");

      // Collect all product IDs from cartItems
      const productIds = cartItems.map((item) => item.id);

      // Calculate the total price before applying the coupon
      const calculatedTotalPrice = calculateTotalPrice();
      console.log("Total price before applying coupon:", calculatedTotalPrice);

      // Send request to backend to apply coupon for all products
      const response = await axios.post(`${ApiUrl}/api/apply-coupon`, {
        couponCode,
        product_ids: productIds, // Send all product IDs
      });

      console.log("Response from server:", response.data); // Log the server response

      if (response.data.success) {
        const discount = response.data.discount; // Get discount from the response
        console.log("Discount received:", discount);

        // Store the discount in state
        setDiscountAmount(discount); // Save the discount amount for future use

        // Calculate the new total amount after applying the discount
        const newAmount = calculatedTotalPrice - discount;
        console.log("New total amount after applying discount:", newAmount);

        // Update the total amount state
        setTotalAmount(newAmount);
        setNewTotalAmount(newAmount); // Update the new total amount state

        // Mark the coupon as applied
        setIsCouponApplied(true); // Prevent the coupon from being applied again

        // Display success message in green
        setMessage("Coupon applied successfully!");
        setMessageType("success"); // Set message type to success

        // Clear the coupon input field
        setCoupon("");

        // Set a timeout to clear the message after 3 seconds
        setTimeout(() => {
          setMessage(""); // Clear the message after 3 seconds
          setMessageType(""); // Clear the message type
        }, 3000);
      } else {
        console.log("Coupon application failed:", response.data.message); // Log failure message
        // Display error message in red
        setMessage(response.data.message || "Failed to apply coupon.");
        setMessageType("error"); // Set message type to error
      }
    } catch (error) {
      console.error("Error applying coupon:", error); // Log the error details
      setMessage(
        error.response ? error.response.data.error : "Error applying coupon"
      );
      setMessageType("error"); // Set message type to error
    }
  };
  

  // Assuming this is where you calculate the total amount
  const calculateTotalPrice = () => {
    const totalPrice = cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price);
        return total + (isNaN(price) ? 0 : price * item.quantity);
      }, 0)
      .toFixed(2);

    console.log("Calculated total price:", totalPrice); // Log the calculated total price
    return totalPrice;
  };

  useEffect(() => {
    // Fetch the username from local storage when the component mounts
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Calculate total items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Toggle expansion
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  // // Memoize fetchAddress function using useCallback to avoid re-creating it on each render
  // const fetchAddress = useCallback(async () => {
  //   try {
  //     const response = await axios.get(`${ApiUrl}/singleaddress/${userId}`);
  //     setAddressDetails(response.data || []); // Ensure it's an array even if response is null
  //   } catch (error) {
  //     console.error("Error fetching address:", error);
  //   }
  // }, [ApiUrl, userId]); // Include dependencies ApiUrl and userId

  // useEffect(() => {
  //   // Fetch the address every 10 seconds
  //   const interval = setInterval(fetchAddress, 10);

  //   // Clean up interval on component unmount
  //   return () => clearInterval(interval);
  // }, [fetchAddress]); // Add fetchAddress as a dependency

  // useEffect(() => {
  //   // Fetch the selected address from local storage
  //   const storedAddressId = localStorage.getItem("selectedAddressId");
  //   if (storedAddressId) {
  //     setSelectedAddress(storedAddressId);
  //   }
  // }, []);

  // Memoize fetchAddress function using useCallback to avoid re-creating it on each render
  const fetchAddress = useCallback(
    async (userId) => {
      try {
        const response = await axios.get(`${ApiUrl}/singleaddress/${userId}`);
        setAddressDetails(response.data || []); // Ensure it's an array even if response is null
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    },
    [ApiUrl]
  ); // Include dependencies ApiUrl

  useEffect(() => {
    // Fetch the selected address from local storage
    const storedAddressId = localStorage.getItem("selectedAddressId");
    if (storedAddressId) {
      setSelectedAddress(storedAddressId);
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchAddress(storedUserId); // Call fetchAddress with userId
    }
  }, [fetchAddress]); // Add fetchAddress as a dependency

  const handleConfirm = async () => {
    fetchAddress(); // Fetch the latest address data when the Confirm button is clicked

    if (selectedAddress) {
      try {
        const response = await axios.post(`${ApiUrl}/update-current-address`, {
          userId: userId, // Ensure userId is set correctly
          addressId: selectedAddress,
        });
        window.location.reload();
        if (response.status === 200) {
          // Update the default address to the newly selected address
          setDefaultAddress(selectedAddress);

          toast.success("Address updated successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          handleCloseModal(); // Close the modal after confirming
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        toast.error(`An error occurred: ${error.message}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      alert("Please select an address.");
    }
  };
  // Function to open the modal
  const handleSelectAddressClick = (addressId) => {
    console.log("Address selected:", addressId); // Log the selected address ID

    setSelectedAddress(addressId);
    setIsAddressSelected(true); // Update the state to reflect that an address has been selected

    setIsModalOpen(true);
    fetchAddresses(userId); // Fetch addresses when opening the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchAddresses(storedUserId);
    }
  }, []);

  // Fetch addresses from the API
  const fetchAddresses = async (userId) => {
    try {
      const response = await fetch(`${ApiUrl}/useraddress/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAddresses(data); // Assuming `data` is an array of addresses
      } else {
        console.error("Error fetching addresses:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchLocalStorageData = () => {
      const storedEmail = localStorage.getItem("email");

      if (storedEmail) {
        const cartKey = `${storedEmail}-cart`;
        const wishlistKey = `${storedEmail}-wishlist`;

        const storedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
        const storedWishlistItems =
          JSON.parse(localStorage.getItem(wishlistKey)) || [];

        const updatedCartItems = storedCartItems.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));

        const updatedWishlistItems = storedWishlistItems.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));

        setCartItems(updatedCartItems);
        setWishlistItems(updatedWishlistItems);
      }
    };

    fetchLocalStorageData();
    // Fetch data every second (if needed)
    const intervalId = setInterval(fetchLocalStorageData, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // const calculateTotalPrice = () => {
  //   return cartItems
  //     .reduce((total, item) => {
  //       const price = parseFloat(item.price);
  //       return total + (isNaN(price) ? 0 : price * item.quantity);
  //     }, 0)
  //     .toFixed(2);
  // };

  const calculateActualPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const actual_price = parseFloat(item.actual_price);
        return total + (isNaN(actual_price) ? 0 : actual_price * item.quantity);
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
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const updateCartItemQuantity = (itemId, itemCategory, newQuantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId && item.category === itemCategory
        ? { ...item, quantity: Math.max(newQuantity, 1) }
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
    // Display confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      // Proceed with removing the item from the cart
      const updatedCartItems = cartItems.filter(
        (item) => !(item.id === itemId && item.category === itemCategory)
      );
      setCartItems(updatedCartItems);

      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        const cartKey = `${storedEmail}-cart`;
        localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));

        try {
          const response = await axios.post(`${ApiUrl}/remove-from-cart`, {
            email: storedEmail,
            itemId: itemId,
            itemCategory: itemCategory,
          });

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
    }
  };

  //   const handlePayment = () => {
  //     // Display the message and exit the function
  //     Swal.fire({
  //         icon: "info",
  //         title: "We can't accept online orders right now",
  //         text: "Please contact us to complete your purchase.",
  //         timer: 10000,
  //         showConfirmButton: true,  // Boolean to show the confirm button
  //         confirmButtonText: "Got It",  // Custom text for the button
  //     });

  //     return; // Exit the function after displaying the message
  // };

  const handlePayment = () => {
    console.log("Selected Address:", selectedAddress); // Debugging output

    // If no address is selected, set to defaultAddress if available
    const addressToUse = selectedAddress || defaultAddress;

    if (!addressToUse) {
      // Swal.fire({
      //   icon: "error",
      //   title: "No Address Selected",
      //   text: "Please select a delivery address before proceeding with payment.",
      //   timer: 2000,
      //   showConfirmButton: false,
      // });
      navigate("/UserAddress"); // Update the path to your UserAddress page

      return;
    }
    if (cartItems.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Cart is Empty",
        text: "Please add items to your cart before proceeding with payment.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const finalAmountToSend = newTotalAmount > 0 ? newTotalAmount : calculateTotalPrice();

    const options = {
      key: "rzp_test_mtjdapiflomQkN", // Replace with your Razorpay Test Key ID
      key_secret: "g13PipAk6MMAEj2Rr3lajUmJ", // Replace with your Razorpay Test Key ID
      amount: finalAmountToSend * 100, // Amount in paise (Razorpay works in paise)
      currency: "INR",
      name: "One CLick",
      description: "Order Payment",
      handler: async function (response) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Payment Successful',
        //   text: `Your payment was successful. Payment ID: ${response.razorpay_payment_id}`,
        //   timer: 2000,
        //   showConfirmButton: false
        // });

        try {
          await handlePlaceOrder();

          // Swal.fire({
          //   icon: 'success',
          //   title: 'Order Placed',
          //   text: 'Your order has been placed successfully!',
          //   timer: 2000,
          //   showConfirmButton: false
          // });
        } catch (error) {
          console.error("Error while placing order after payment:", error);
          Swal.fire({
            icon: "error",
            title: "Order Error",
            text: `An error occurred while placing the order: ${error.message}`,
            timer: 2000,
            showConfirmButton: false,
          });
        }
      },
      prefill: {
        name: "Karthick",
        email: "karthicknoone@gmail.com",
        contact: "8778315180",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // Assuming addressDetails is already available, you can set the initial address
  useEffect(() => {
    if (addressDetails.length > 0 && !defaultAddress) {
      setDefaultAddress(addressDetails[0].address_id);
    }
  }, [addressDetails]);

  const handlePlaceOrder = async () => {
    console.log("handlePlaceOrder function called");

    // Use the selected address if available, otherwise fall back to the default address
    const addressToUse = selectedAddress || defaultAddress;

    if (!addressToUse) {
      console.log("No address selected or default address found");
      Swal.fire({
        icon: "error",
        title: "Address Required",
        text: "Please select a shipping address.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    console.log("Selected or Default Address ID:", addressToUse);
    console.log("Address Details:", addressDetails);

    // Log all address IDs to verify the correct comparison
    console.log(
      "All address IDs:",
      addressDetails.map((address) => address.address_id)
    );

    // Find the address details using the address ID (either default or selected)
    const selectedAddressDetails = addressDetails.find(
      (address) => String(address.address_id) === String(addressToUse)
    );

    if (!selectedAddressDetails) {
      console.log("Selected address details not found");
      Swal.fire({
        icon: "error",
        title: "Address Not Found",
        text: "Selected address not found.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    // Construct the full address string
    const fullAddress = `${selectedAddressDetails.name}, ${selectedAddressDetails.street}, ${selectedAddressDetails.city}, ${selectedAddressDetails.state}, ${selectedAddressDetails.country}, ${selectedAddressDetails.postal_code}, ${selectedAddressDetails.phone}`;

    // Log the full address to ensure it's formatted correctly
    console.log("Full Address:", fullAddress);

    // Enrich cart items with additional details
    const enrichedCartItems = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      image: item.image,
      description: item.description,
      product_id: item.product_id,
      category: item.category,
    }));

    // Log the enriched cart items to check their structure and content
    console.log("Enriched Cart Items:", enrichedCartItems);
    const finalAmountToSend = newTotalAmount > 0 ? newTotalAmount : calculateTotalPrice();

    const orderData = {
      user_id: userId,
      total_amount: finalAmountToSend,
      shipping_address: fullAddress,
      address_id: addressToUse,
      cartItems: enrichedCartItems,
    };

    console.log("Order Data:", orderData);

    try {
      const response = await axios.post(`${ApiUrl}/place-order`, orderData);

      if (response.status === 200) {
        console.log("Order placed successfully");
        Swal.fire({
          icon: "success",
          title: "Order Placed",
          text: "Your order has been placed successfully!",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          clearCart(); // Call your function to clear the cart
          const storedEmail = localStorage.getItem("email");
          if (storedEmail) {
            const cartKey = `${storedEmail}-cart`; // Construct the cart key
            localStorage.removeItem(cartKey); // Remove the cart from local storage
          }

          navigate("/MyOrders");
        });
        // Clear cart or navigate to a confirmation page
      } else {
        console.log("Unexpected response status:", response.status);
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Order Error",
        text: `An error occurred: ${
          error.response?.data?.message || error.message
        }`,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  // Function to clear the cart
  const clearCart = () => {
    // Assuming you have a state variable cartItems
    setCartItems([]); // Clear the cart items
    // If you are using a global state or context, you might need to update that instead
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleProductClick = (productId) => {
    // Navigate to the product detail page
    navigate(`/product/${productId}`);
  };


  const finalAmount = newTotalAmount > 0 
  ? Number(newTotalAmount) // Convert to number if it's not
  : Number(calculateTotalPrice()); // Ensure this is a number



  return (
    <>
      {/* <Header1 /> */}
      <Header2 />
      <div className="cart-container">
        <div className="cart-header">
          <center>
            <h1>Checkout</h1>
          </center>
        </div>
        <div className="cart-content row">
          <div className="cart-products">
            <div className="cart-address">
              <strong>LOGIN </strong>

              {username ? (
                <>
                  <FaCheck style={{ color: "green" }} />
                  <br />
                  <span style={{ fontSize: "14px" }}>
                    {capitalizeFirstLetter(username)}
                  </span>
                </>
              ) : (
                <>
                  <FaTimes style={{ color: "red" }} />
                  <br />
                  {/* <span style={{ fontSize: "14px" }}>Guest</span> */}
                  {/* <br /> */}
                  <a href="/Login">
                    <button
                      className="change-btn"
                      style={{ cursor: "pointer" }}
                      // onClick={() => console.log("Redirect to login page")} // Replace with actual login logic
                    >
                      Login
                    </button>
                  </a>
                </>
              )}
            </div>
            <div className="cart-address">
              {/* <h3>Select a Shipping Address</h3> */}
              {addressDetails.length > 0 ? (
                <ul>
                  {addressDetails.map((address) => (
                    <li
                      className={`addr-list ${
                        selectedAddress === address.address_id ? "selected" : ""
                      }`}
                      key={address.address_id}
                    >
                      <button
                        style={{ float: "right" }}
                        className="change-btn"
                        onClick={() =>
                          handleSelectAddressClick(address.address_id)
                        } // Ensure this is calling the correct function
                      >
                        {isAddressSelected &&
                        selectedAddress === address.address_id
                          ? "Change"
                          : "Change"}
                      </button>
                      <strong style={{ fontSize: "1.0rem" }}>
                        DELIVERY ADDRESS <FaCheck style={{ color: "green" }} />
                      </strong>
                      <label>
                        <span style={{ fontSize: "14px", marginTop: "5px" }}>
                          {address.name}, {address.street}, {address.city},{" "}
                          {address.state}, {address.country},{" "}
                          {address.postal_code}, {address.phone}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <strong style={{ fontSize: "1.0rem" }}>
                    DELIVERY ADDRESS <FaTimes style={{ color: "red" }} />
                  </strong>
                  <br />
                  <a href="/Useraddress">
                    <button className="change-btn">Add Address</button>
                  </a>
                </div>
              )}
            </div>{" "}
            <div className="cart-product-card">
              {!isExpanded ? (
                <div>
                  <strong style={{ fontSize: "1.0rem" }}>
                    ORDER SUMMARY{" "}
                    {totalItems === 0 ? (
                      <FaTimes style={{ color: "red" }} />
                    ) : (
                      <FaCheck style={{ color: "green" }} />
                    )}
                  </strong>
                  <br />
                  {totalItems === 0 ? (
                    <div>
                      <p>Your cart is empty.</p>
                      <a href="/">
                        <button className="change-btn">Browse Products</button>
                      </a>
                    </div>
                  ) : (
                    <div>
                      <p>{totalItems === 1 ? `${totalItems} item` : `${totalItems} items`} in cart</p>
                      <button
                        className="change-btn"
                        onClick={handleToggleExpand}
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="cart-list-container">
                  <ul className="cart-list">
                    {cartItems
                      .slice()
                      .reverse()
                      .map((item) => {
                        let firstImage = ""; // Initialize firstImage

                        // Check if item.image is a string or an array
                        try {
                          if (typeof item.image === "string") {
                            // Attempt to parse it as JSON
                            const images = JSON.parse(item.image); // Parse the JSON string

                            // Handle case where images is an array
                            if (Array.isArray(images) && images.length > 0) {
                              firstImage = images[0].replace(/&quot;/g, ""); // Get the first image and remove &quot;
                            } else {
                              firstImage = item.image.replace(/&quot;/g, ""); // Treat it as a plain string if not an array
                            }
                          } else if (Array.isArray(item.image)) {
                            // Handle case where item.image is already an array
                            firstImage = item.image[0]; // Get the first image from the array
                          }
                        } catch (error) {
                          console.error("Error parsing image:", error);
                          firstImage = ""; // Reset firstImage on error
                        }

                        return (
                          <li
                            key={item.id}
                            className="cart-product d-flex align-items-center"
                          >
                            {firstImage ? (
                              <div
                                key={item.id}
                                onClick={() => handleProductClick(item.id)}
                                style={{ cursor: "pointer" }}
                              >
                                <img
                                  src={`${ApiUrl}/uploads/${item.category.toLowerCase()}/${firstImage}`}
                                  alt={item.name}
                                  loading="lazy"
                                  className="cart-product-image"
                                />
                              </div>
                            ) : (
                              <div className="placeholder-image">
                                No image available
                              </div> // Placeholder for missing image
                            )}
                            <div
                              style={{ cursor: "pointer" }}
                              className="cart-product-details"
                              key={item.id}
                              onClick={() => handleProductClick(item.id)}
                            >
                              <p className="cart-product-name">{item.name}</p>
                              {/* <p className="cart-product-name">
                                {item.product_id}
                              </p> */}
                              <p className="cart-product-description">
                                {item.description}
                              </p>
                            </div>
                            <div className="cart-product-price">
                              <div className="cart-quantity-controls">
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
                                <FaTrash
                                  className="cart-remove-btn"
                                  onClick={() =>
                                    removeFromCart(item.id, item.category)
                                  }
                                />
                              </div>
                              <p
                                style={{
                                  color: "red",
                                  textDecoration: "line-through",
                                  fontSize: "13px",
                                  marginRight: "5px",
                                }}
                              >
                                ₹{item.actual_price}{" "}
                              </p>
                              <p>₹{item.price * item.quantity}</p>
                            </div>
                          </li>
                        );
                      })}
                  </ul>

                  <button
                    style={{ float: "right" }}
                    onClick={handleToggleExpand}
                    className="change-btn"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
            {/* <div className="place-order-card">
  <div className="place-order-content">
    <button
      className="summary-place-order-btn2"
    //   onClick={() => navigate("/checkout")}
    >
      Checkout
    </button>
  </div>
</div> */}
          </div>

          <div className="cart-summary">
            <div className="summary-item">
            <span>Price ({getTotalItemsCount() === 1 ? '1 item' : `${getTotalItemsCount()} items`})</span>
            <span>₹{calculateActualPrice()}</span>
            </div>
            <div className="summary-item">
              <span>Discount</span>
              <span style={{ color: "green" }}>- ₹{discount()}</span>
            </div>
            {/* <div className="summary-item">
              <span>Platform fee</span>
              <span>-</span>
            </div> */}
            <div className="summary-item">
              <span>Delivery charge</span>
              <span>
                <span style={{ textDecoration: "line-through" }}>₹50</span>{" "}
                <span style={{ color: "green" }}>FREE Delivery</span>
              </span>
            </div>
            <div className="summary-item">
              <span>Coupon Discount</span>
              <span style={{ color: "green" }}>
              - ₹{discountAmount.toFixed(2)}
              {/* <span style={{ color: "green" }}>FREE Delivery</span> */}
              </span>
            </div>
            <div className="summary-item">
              {/* Input for coupon code */}
              <input
                value={coupon}
                onChange={handleCouponChange}
                type="text"
                placeholder="Enter Coupon code"
                disabled={isCouponApplied} // Disable input if coupon is applied

              />

              {/* Single Apply button for all items */}
              <button disabled={isCouponApplied} onClick={() =>  handleApplyCoupon(coupon)}>Apply</button>
            </div>

            {message && (
        <p
          style={{
            color:
              messageType === "success"
                ? "green"
                : messageType === "error"
                ? "red"
                : "orange", // Orange for warning (if coupon is already applied)
            // fontWeight: "bold",
            marginTop: "5px",
            fontSize:'14px'
          }}
        >
          {message}
        </p>
      )}  <hr />
            <div className="summary-item">
              <strong>Total Amount</strong>
              <span style={{ fontWeight: "bold" }}>
                {/* ₹{calculateTotalPrice()}₹{newTotalAmount.toFixed(2)} */}₹
                {/* {newTotalAmount > 0
                  ? newTotalAmount.toFixed(2)
                  : calculateTotalPrice()} */}
 {finalAmount.toFixed(2)}

              </span>
            </div>
            <hr />
            {/* <div className="summary-item">
              <span style={{ color: "green" }}>
                You will save ₹{discount()} on this order
              </span> 
            </div> */}
            <button
              className="summary-place-order-btn"
              onClick={handlePayment}
              //   onClick={() => navigate("/checkout")}
            >
              Pay Now
            </button>

            {/* <center>
        <h4 style={{ marginTop: '10px' }}>Payment Method</h4>
      </center>
      <div className="payment-methods">
        <div className={`summary-item2 ${selectedPaymentMethod === 'cod' ? 'selected' : ''}`}>
          <FaCashRegister className="payment-icon" />
          <span className="methods">Cash on Delivery</span>
          <span>
            <input
              type="radio"
              name="payment-method"
              value="cod"
              checked={selectedPaymentMethod === 'cod'}
              onChange={handlePaymentMethodChange}
            />
          </span>
          {selectedPaymentMethod === 'cod' && (
            <div className="continue-wrapper">
              <button className="continue-button">Continue</button>
            </div>
          )}
        </div>
        
        <div className={`summary-item2 ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}>
          <FaCreditCard className="payment-icon" />
          <span className="methods">Credit/Debit Card</span>
          <span>
            <input
              type="radio"
              name="payment-method"
              value="card"
              checked={selectedPaymentMethod === 'card'}
              onChange={handlePaymentMethodChange}
            />
          </span>
          {selectedPaymentMethod === 'card' && (
            <div className="continue-wrapper">
              <button className="continue-button">Continue</button>
            </div>
          )}
        </div>
        
        <div className={`summary-item2 ${selectedPaymentMethod === 'net-banking' ? 'selected' : ''}`}>
          <FaUniversity className="payment-icon" />
          <span className="methods">Net Banking</span>
          <span>
            <input
              type="radio"
              name="payment-method"
              value="net-banking"
              checked={selectedPaymentMethod === 'net-banking'}
              onChange={handlePaymentMethodChange}
            />
          </span>
          {selectedPaymentMethod === 'net-banking' && (
            <div className="continue-wrapper">
              <button className="continue-button">Continue</button>
            </div>
          )}
        </div>
        
        <div className={`summary-item2 ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}>
          <FaPaypal className="payment-icon" />
          <span className="methods">PayPal</span>
          <span>
            <input
              type="radio"
              name="payment-method"
              value="paypal"
              checked={selectedPaymentMethod === 'paypal'}
              onChange={handlePaymentMethodChange}
            />
          </span>
          {selectedPaymentMethod === 'paypal' && (
            <div className="continue-wrapper">
              <button className="continue-button">Continue</button>
            </div>
          )}
        </div>
      </div> */}

            {isModalOpen && (
              <div className="modal4-overlay">
                <div className="modal4-content">
                  <h3>Select a Shipping Address</h3>
                  <button
                    onClick={handleCloseModal}
                    className="modal4-close-btn"
                  >
                    &times;
                  </button>
                  {addresses.length > 0 ? (
                    <ul className="address-list">
                      {addresses.map((address) => (
                        <li key={address.address_id} className="address-item">
                          <label>
                            <input
                              type="radio"
                              name="selectedAddress"
                              value={address.address_id}
                              checked={selectedAddress === address.address_id}
                              onChange={() =>
                                setSelectedAddress(address.address_id)
                              }
                            />
                            {address.name}, {address.street}, {address.city},{" "}
                            {address.state}, {address.postal_code},{" "}
                            {address.country}, {address.phone}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No addresses found. Please add one during checkout.</p>
                  )}
                  <center>
                    <div className="modal4c">
                      <button
                        onClick={handleConfirm}
                        className="modal4-confirm-btn"
                      >
                        Confirm Address
                      </button>
                      <a style={{ textDecoration: "none" }} href="/Useraddress">
                        <button className="modal4-confirm-btn">
                          Add new address
                        </button>
                      </a>
                    </div>
                  </center>
                </div>
              </div>
            )}
          </div>

          {/* Address Section */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
