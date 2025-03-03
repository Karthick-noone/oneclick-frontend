import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/Cart.css";
import { ApiUrl } from "./ApiUrl";
// import Header1 from './Header1';
import Header2 from "./Header2";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaTrash, FaCheck } from "react-icons/fa";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaUniversity,
  FaPaypal,
} from "react-icons/fa";
import Swal from "sweetalert2";
import Footer from "./footer";

const BuyNow = () => {
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
  const [coupons, setCoupons] = useState(0);
  const [couponValue, setCouponValue] = useState(0);
  const [minPurchaseLimit, setMinPurchaseLimit] = useState(0);

  const location = useLocation();
  const { product, email } = location.state || {}; // Get product and email
  //
  console.log("products", product);

  const [quantity, setQuantity] = useState(1);

  const updateQuantity = (newQuantity) => {
    if (newQuantity < 1) return;

    console.log("Updating quantity to:", newQuantity);
    setQuantity(newQuantity); // Update quantity state

    // Recalculate total when quantity changes
    const rawTotal = calculateTotalPrice();
    console.log("Raw total after quantity change:", rawTotal);

    if (isCouponApplied) {
      const discount = couponValue ?? discountAmount ?? 0;
      console.log("Applied discount:", discount);
      const newAmount = Math.max(0, rawTotal - discount);
      console.log("New total after discount:", newAmount);
      setTotalAmount(newAmount);
    } else {
      console.log("New total without discount:", rawTotal);
      setTotalAmount(rawTotal);
    }
  };

  const items = product ? [product] : [];

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/fetchcoupons`);
      setCoupons(response.data);
      console.log("Fetched coupons successfully:", response.data);

      // Assuming the API returns an array with one coupon object
      const validCoupon = response.data[0];
      if (validCoupon) {
        const couponValueFetched = validCoupon.value;
        const minPurchaseLimitFetched = validCoupon.min_purchase_limit;

        console.log("Coupon Value:", couponValueFetched);
        console.log("Min Purchase Limit:", minPurchaseLimitFetched);

        // Set the minimum purchase limit (coupon value can be set later upon applying coupon)
        setMinPurchaseLimit(minPurchaseLimitFetched);
      } else {
        console.log("No coupons available.");
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      Swal.fire("Error", "Failed to fetch coupons. Please try again.", "error");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Allow only valid characters in coupon input
  const handleCouponChange = (event) => {
    const inputValue = event.target.value;
    const validCharacters = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (validCharacters.test(inputValue)) {
      setCoupon(inputValue);
    }
  };

  // Calculate the total price using the product details
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    // If there's only one product, use the quantity from state
    if (items.length === 1) {
      const price = parseFloat(items[0].prod_price) || 0;
      const deliveryCharge = parseFloat(items[0].deliverycharge || 0);
      totalPrice = price * quantity + deliveryCharge;
    } else {
      // For multiple products, use each product's quantity
      totalPrice = items.reduce((total, item) => {
        const price = parseFloat(item.prod_price) || 0;
        const itemQuantity = item.quantity || 1;
        const deliveryCharge = parseFloat(item.deliverycharge || 0);
        return total + price * itemQuantity + deliveryCharge;
      }, 0);
    }

    return totalPrice; // Return raw total (without coupon discount)
  };

  // Apply coupon via API call
  // Apply coupon via API call
  const handleApplyCoupon = async (couponCode) => {
    if (!couponCode.trim()) {
      setMessage("Please enter a coupon code.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    if (isCouponApplied) {
      setMessage("Coupon has already been applied!");
      setMessageType("warning");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
  
    try {
      console.log("Applying coupon:", couponCode, "for the selected product");
      // Extract product IDs from items (using prod_id or id)
      const productIds = items.map((item) => item.prod_id || item.id);
      console.log("Product IDs:", productIds);
  
      const { data } = await axios.post(`${ApiUrl}/api/apply-coupon`, {
        couponCode,
        product_ids: productIds,
      });
      console.log("Response from server:", data);
  
      if (data.success) {
        // Choose the discount returned by the API (either discount1 or discount2)
        const discount = data.discount1 ?? data.discount2 ?? 0;
  
        console.log("discount", discount);
  
        // If discount1 is applied, enforce the minimum purchase limit
        if (
          data.discount1 !== undefined &&
          calculateTotalPrice() < data.min_purchase_limit
        ) {
          setMessage(
            `Minimum purchase of ₹${data.min_purchase_limit} required.`
          );
          setMessageType("error");
          setTimeout(() => setMessage(""), 3000);
          return;
        }
  
        // Save coupon details (for potential future use or display)
        setDiscountAmount(data.discount2 ?? 0);
        setCouponValue(data.discount1 ?? 0);
        setMinPurchaseLimit(data.min_purchase_limit ?? 0);
  
        // Subtract the discount from the raw total price
        const rawTotal = calculateTotalPrice();
        const newAmount = Math.max(0, rawTotal - discount);
        setTotalAmount(newAmount);
  
        setIsCouponApplied(true);
        setMessage("Coupon applied successfully!");
        setMessageType("success");
        setCoupon("");
  
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Failed to apply coupon.");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setMessage(
        error.response?.data?.error === "Coupon has expired."
          ? "This coupon has expired."
          : "Invalid or expired coupon."
      );
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  

  useEffect(() => {
    // Fetch the username from local storage when the component mounts
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

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

  const handlePayment = () => {
    console.log("Selected Address:", selectedAddress); // Debugging output

    // If no address is selected, set to defaultAddress if available
    const addressToUse = selectedAddress || defaultAddress;
    if (!addressToUse) {
      navigate("/UserAddress"); // Update the path to your UserAddress page
      return;
    }

    const selectedAddressDetails = addressDetails.find(
      (address) => String(address.address_id) === String(addressToUse)
    );

    // Use calculateTotalPrice directly since newTotalAmount has been removed
    const finalAmountToSend = isCouponApplied
      ? totalAmount
      : calculateTotalPrice();
    console.log("Final Amount to Send:", finalAmountToSend);

    const phonenumber = `${selectedAddressDetails.phone}`;
    const name = `${selectedAddressDetails.name}`;
    const email = localStorage.getItem("email");

    const options = {
      key: "rzp_test_mtjdapiflomQkN", // Sample Razorpay Test Key ID
      key_secret: "g13PipAk6MMAEj2Rr3lajUmJ", // Sample Razorpay Test Key Secret
      amount: finalAmountToSend * 100, // Amount in paise (Razorpay works in paise)
      currency: "INR",
      name: "One CLick",
      description: "Order Payment",
      handler: async function (response) {
        try {
          // Handle the order placement based on the payment method
          await handlePlaceOrder(response);
        } catch (error) {
          console.error("Error while placing order after payment:", error);
          Swal.fire({
            icon: "error",
            title: "Order Error",
            text: `An error occurred while placing the order: ${error.message}`,
            timer: 5000,
            showConfirmButton: false,
          });
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: phonenumber,
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
      console.warn("No address selected, redirecting to address page...");
      navigate("/UserAddress");
      return;
    }

    const selectedAddressDetails = addressDetails.find(
      (address) => String(address.address_id) === String(addressToUse)
    );

    if (!selectedAddressDetails) {
      console.error("Selected address not found.");
      Swal.fire({
        icon: "error",
        title: "Address Not Found",
        text: "Selected address not found.",
        timer: 5000,
        showConfirmButton: false,
      });
      return;
    }

    const fullAddress = `${selectedAddressDetails.name}, ${selectedAddressDetails.street}, ${selectedAddressDetails.city}, ${selectedAddressDetails.state}, ${selectedAddressDetails.country}, ${selectedAddressDetails.postal_code}, ${selectedAddressDetails.phone}`;

    // Ensure product exists
    if (!product?.prod_id) {
      console.error("Product data missing or invalid.");
      Swal.fire({
        icon: "error",
        title: "Product Error",
        text: "Product details are missing. Please try again.",
        timer: 5000,
        showConfirmButton: false,
      });
      return;
    }

    console.log("Product details:", product);

    // Create enrichedCartItems using product details
    const enrichedCartItems = [
      {
        id: product.id,
        quantity: 1, // Defaulting quantity to 1
        prod_price: product.prod_price,
        prod_name: product.prod_name,
        prod_img: product.prod_img,
        prod_description: product.prod_description,
        prod_id: product.prod_id,
        prod_category: product.category,
      },
    ];

    console.log("enrichedCartItems:", enrichedCartItems);

    // const finalPrice =
    //   newTotalAmount > 0 ? newTotalAmount : calculateTotalPrice();
    const finalAmountToSend = isCouponApplied
      ? totalAmount
      : calculateTotalPrice();
    console.log("Final Amount to Send:", finalAmountToSend);

    const orderData = {
      user_id: userId,
      total_amount: finalAmountToSend,
      shipping_address: fullAddress,
      address_id: addressToUse,
      cartItems: enrichedCartItems, // Keeping the same structure
      payment_method:
        selectedPaymentMethod === "cod"
          ? "COD"
          : selectedPaymentMethod === "pickup"
          ? "Pick Up From Store"
          : "Online",
      status:
        selectedPaymentMethod === "cod"
          ? "Pending"
          : selectedPaymentMethod === "pickup"
          ? "Pending"
          : "Paid",
    };

    console.log("Order Data:", orderData);

    try {
      const response = await axios.post(`${ApiUrl}/place-order`, orderData);

      if (response.status === 200) {
        console.log("Order placed successfully", response.data);

        Swal.fire({
          icon: "success",
          title: "Order Placed",
          text: "Your order has been placed successfully!",
          timer: 5000,
          showConfirmButton: false,
        }).then(() => {
          window.history.replaceState(null, "", "/MyOrders");
          navigate("/MyOrders");
        });
      } else {
        console.warn("Unexpected response status:", response.status);
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
        timer: 5000,
        showConfirmButton: false,
      });
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const images = Array.isArray(product.prod_img)
    ? product.prod_img
    : JSON.parse(product.prod_img || "[]");
  const firstImage = images.length > 0 ? images[0] : null;

  const discount2 = (product.actual_price - product.prod_price) * quantity;

  const delivery_charge = parseInt(product.deliverycharge) || 0;

  console.log("deliverycharge...", delivery_charge);

  const totalpurchaseamount =
    product.prod_price * quantity - delivery_charge - discountAmount;

  // Apply coupon if applicable
  let finalPrice = totalpurchaseamount;
  if (finalPrice >= minPurchaseLimit) {
    if (couponValue > 0) {
      finalPrice -= couponValue; // Apply coupon discount
      // console.log("Coupon applied. Discounted price:", finalPrice);
    } else {
      console.log("No coupon applied.");
    }
  } else {
    console.log(
      "Total price is below minimum purchase limit. Coupon not applied."
    );
  }

  const finalAmount =
    newTotalAmount > 0
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
              <strong style={{ fontSize: "1.0rem" }}>
                ORDER SUMMARY <FaCheck style={{ color: "green" }} />
              </strong>
              <br />

              <div className="cart-list-container">
                <ul className="cart-list">
                  <li
                    key={product.id}
                    className="cart-product d-flex align-items-center"
                  >
                    {/* Handle image */}
                    {firstImage ? (
                      <div style={{ cursor: "pointer" }}>
                        <img
                          src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                          alt={product.prod_name}
                          loading="lazy"
                          className="cart-product-image"
                        />
                      </div>
                    ) : (
                      <div className="placeholder-image">
                        No image available
                      </div>
                    )}

                    {/* Product details */}
                    {/* <div style={{ cursor: "pointer" }} className="cart-product-details"> */}
                    <p className="buy-product-name">{product.prod_name}</p>
                    {/* </div> */}

                    {product.prod_features && (
                      <p className="buy-product-description">
                        {product.prod_features}
                      </p>
                    )}

                    {/* Price and quantity */}
                    <div className="cart-product-price">
                      <div className="cart-quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(Math.max(quantity - 1, 1))
                          } // Prevent going below 1
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={() => updateQuantity(quantity + 1)} // Increase quantity
                        >
                          +
                        </button>
                      </div>
                      <p
                        style={{
                          color: "red",
                          textDecoration: "line-through",
                          fontSize: "13px",
                          marginRight: "5px",
                        }}
                      >
                        ₹{product.actual_price * quantity}
                      </p>
                      <p>₹{product.prod_price * quantity}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <h4 style={{ marginTop: "10px", marginBottom: "5px" }}>
              PRICE SUMMARY
            </h4>
            <div className="summary-item">
              <span>
                Price (
                {/* {getTotalItemsCount() === 1
                  ? "1 item"
                  : `${getTotalItemsCount()} items`} */}
                {quantity} Item)
              </span>
              <span>₹{product.prod_price * quantity}</span>
            </div>
            {/* <div className="summary-item">
              <span>Discount</span>
              <span style={{ color: "green" }}>- ₹0</span>
            </div> */}
            {/* <div className="summary-item">
              <span>Platform fee</span>
              <span>-</span>
            </div> */}
            <div className="summary-item">
              <span>Delivery Charge</span>
              <span>
                {/* <span style={{ textDecoration: "line-through" }}>₹50</span>{" "}
                <span style={{ color: "green" }}>FREE Delivery</span> */}
                <span>₹{delivery_charge ? delivery_charge : 0}</span>
              </span>
            </div>
            <div className="summary-item">
              <span>Coupon Discount</span>
              <span style={{ color: "green" }}>
                - ₹{discountAmount}
                {/* <span style={{ color: "green" }}>FREE Delivery</span> */}
              </span>
            </div>
            {parseFloat(calculateTotalPrice()) >= minPurchaseLimit && (
              <div className="summary-item">
                <span>
                  (If you have coupon)
                  <br />
                  Extra Discount on Orders Over ₹{minPurchaseLimit}
                </span>
                <span style={{ color: "green" }}>
                  - ₹{couponValue}
                </span>
              </div>
            )}
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
              <button
                disabled={isCouponApplied}
                onClick={() => handleApplyCoupon(coupon, product)}
              >
                Apply
              </button>
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
                  fontSize: "14px",
                }}
              >
                {message}
              </p>
            )}{" "}
            <hr />
            <div className="summary-item">
              <strong>Total Amount</strong>
              <span style={{ fontWeight: "bold" }}>
                ₹
                {isCouponApplied
                  ? Number(totalAmount).toFixed(2)
                  : calculateTotalPrice()}
              </span>
            </div>
            <hr />
            <div>
              {isCouponApplied && (
                <p className="discount-message">
      You will save up to ₹{couponValue || discountAmount} on this order!
      </p>
              )}
            </div>
            <center>
              <h4 style={{ marginTop: "10px" }}>Select Payment Method</h4>
            </center>
            <div className="payment-methods">
              <div
                className={`summary-item2 ${
                  selectedPaymentMethod === "cod" ? "selected" : ""
                }`}
              >
                <FaMoneyBillWave className="payment-icon" />
                <span className="methods">Cash on Delivery</span>
                <span>
                  <input
                    type="radio"
                    name="payment-method"
                    value="cod"
                    checked={selectedPaymentMethod === "cod"}
                    onChange={handlePaymentMethodChange}
                  />
                </span>
                {selectedPaymentMethod === "cod" && (
                  <div className="continue-wrapper">
                    <button
                      onClick={() => handlePlaceOrder("cod")} // Pass "cod" to handlePayment function
                      className="summary-place-order-btn"
                    >
                      Place Order
                    </button>
                  </div>
                )}
              </div>

              <div
                className={`summary-item2 ${
                  selectedPaymentMethod === "card" ? "selected" : ""
                }`}
              >
                <FaCreditCard className="payment-icon" />
                <span className="methods">Pay Online</span>
                <span>
                  <input
                    type="radio"
                    name="payment-method"
                    value="card"
                    checked={selectedPaymentMethod === "card"}
                    onChange={handlePaymentMethodChange}
                  />
                </span>
                {selectedPaymentMethod === "card" && (
                  <div className="continue-wrapper">
                    <button
                      onClick={() => handlePayment("Online")} // Pass "cod" to handlePayment function
                      className="summary-place-order-btn"
                    >
                      Pay Now
                    </button>
                  </div>
                )}
              </div>

              <div
                className={`summary-item2 ${
                  selectedPaymentMethod === "pickup" ? "selected" : ""
                }`}
              >
                <FaMoneyBillWave className="payment-icon" />
                <span className="methods">Pick Up From Store</span>
                <span>
                  <input
                    type="radio"
                    name="payment-method"
                    value="pickup"
                    checked={selectedPaymentMethod === "pickup"}
                    onChange={handlePaymentMethodChange}
                  />
                </span>
                {selectedPaymentMethod === "pickup" && (
                  <div className="continue-wrapper">
                    <button
                      onClick={() => handlePlaceOrder("pickup")} // Pass "cod" to handlePayment function
                      className="summary-place-order-btn"
                    >
                      Place Order
                    </button>
                  </div>
                )}
              </div>
            </div>
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

export default BuyNow;
