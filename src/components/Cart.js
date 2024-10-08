import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Cart.css";
import { ApiUrl } from "./ApiUrl";
// import Header1 from './Header1';
import Header2 from "./Header2";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Footer from "./footer";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // State for selected address
  const [, setWishlistItems] = useState([]);
  const [addresses, setAddresses] = useState([]); // State for storing fetched addresses
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null); // Initially selected address
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  const [addressDetails, setAddressDetails] = useState([]);

  // Memoize fetchAddress function using useCallback to avoid re-creating it on each render
  const fetchAddress = useCallback(async () => {
    try {
      const response = await axios.get(`${ApiUrl}/singleaddress/${userId}`);
      setAddressDetails(response.data || []); // Ensure it's an array even if response is null
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  }, [ApiUrl, userId]); // Include dependencies ApiUrl and userId

  useEffect(() => {
    // Fetch the address every 10 seconds
    const interval = setInterval(fetchAddress, 100);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [fetchAddress]); // Add fetchAddress as a dependency

  useEffect(() => {
    // Fetch the selected address from local storage
    const storedAddressId = localStorage.getItem("selectedAddressId");
    if (storedAddressId) {
      setSelectedAddress(storedAddressId);
    }
  }, []);

  const handleConfirm = async () => {
    fetchAddress(); // Fetch the latest address data when the Confirm button is clicked

    if (selectedAddress) {
      try {
        const response = await axios.post(`${ApiUrl}/update-current-address`, {
          userId: userId, // Ensure userId is set correctly
          addressId: selectedAddress,
        });

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
    setSelectedAddress(addressId);
    console.log("Address ID selected:", addressId);
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
    const intervalId = setInterval(fetchLocalStorageData, 200);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price);
        return total + (isNaN(price) ? 0 : price * item.quantity);
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
    const fullAddress = `${selectedAddressDetails.name}, ${selectedAddressDetails.street}, ${selectedAddressDetails.city}, ${selectedAddressDetails.state}, ${selectedAddressDetails.country}, ${selectedAddressDetails.postal_code}`;

    // Enrich cart items with additional details
    const enrichedCartItems = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      image: item.image,
      description: item.description,
      product_id: item.prod_id,
      category: item.category,
    }));

    const orderData = {
      user_id: userId,
      total_amount: calculateTotalPrice(),
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

  return (
    <>
      {/* <Header1 /> */}
      <Header2 />
      <div className="cart-container">
        <div className="cart-header">
          <center>
            <h1>Your Cart</h1>
          </center>
        </div>
        <div className="cart-content row">
          <div className="cart-products">
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
                        }
                      >
                        {isAddressSelected &&
                        selectedAddress === address.address_id
                          ? "Change"
                          : "Confirm This Address"}
                      </button>
                      <strong>Delivery to :</strong>
                      <label>
                        <span style={{ fontSize: "15px", marginTop: "5px" }}>
                          {" "}
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
                  <p> Please add one address during checkout. </p>
                  <a href="/Useraddress">
                    <button className="change-btn">Add Address</button>
                  </a>
                </div>
              )}
            </div>
            <div className="cart-product-card">
              <ul className="cart-list">
                {cartItems.length === 0 ? (
                  <li className="empty-cart-message">
                    <p>Your cart is empty</p>
                    <a href="/">
                      <button className="change-btn">Browse products</button>
                    </a>
                  </li>
                ) : (
                  cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="cart-product d-flex align-items-center"
                    >
                      <img
                        src={`${ApiUrl}/uploads/${item.category}/${item.image}`}
                        alt={item.name}
                        loading="lazy"
                        className="cart-product-image"
                        name="image"
                      />
                      <div className="cart-product-details">
                        <p className="cart-product-name">{item.name}</p>
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
                        <p>₹{item.price * item.quantity}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-item">
              <span>Price ({getTotalItemsCount()} items)</span>
              <span>₹{calculateTotalPrice()}</span>
            </div>
            <div className="summary-item">
              <span>Discount</span>
              <span>-</span>
            </div>
            <div className="summary-item">
              <span>Platform fee</span>
              <span>-</span>
            </div>
            <div className="summary-item">
              <span>Delivery charge</span>
              <span>
                <span style={{ textDecoration: "line-through" }}>₹40</span> FREE
                Delivery
              </span>
            </div>
            <div className="summary-item">
              <span>You will save on this order</span>
              <span>₹10000</span>
            </div>
            <div className="summary-item">
              <strong>Total Amount</strong>
              <span>₹{calculateTotalPrice()}</span>
            </div>
            <button
              className="summary-place-order-btn"
              onClick={() => navigate("/Checkout")}
              // onClick={handlePlaceOrder}
            >
              Place Order
            </button>

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
                  <div style={{ display: "flex" }}>
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

export default CartPage;
