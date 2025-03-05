import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Cart.css";
import { ApiUrl } from "./ApiUrl";
// import Header1 from './Header1';
import Header2 from "./Header2";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaTrash, FaCheck, FaShoppingBag } from "react-icons/fa";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaUniversity,
  FaPaypal,
} from "react-icons/fa";
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
  const [coupons, setCoupons] = useState(0);
  const [couponValue, setCouponValue] = useState(0);
  const [minPurchaseLimit, setMinPurchaseLimit] = useState(0);
  const [, setIsAdding] = useState(false); // Track the adding state to prevent multiple clicks
  const [isOfferActive, setIsOfferActive] = useState(true);
  const [item, setitem] = useState(null);

  useEffect(() => {
    if (item && item.offer_end_time) {
      const now = new Date();
      const offerEndTime = new Date(item.offer_end_time);

      // Set offer active based on whether the offer end time is in the future
      setIsOfferActive(offerEndTime > now);
    }
  }, [item]);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/fetchcoupons`);
      setCoupons(response.data); // Set the coupons in state

      // Debugging: Check the response structure
      console.log("Fetched coupons successfully:", response.data);

      // Extract the values for couponValue and minPurchaseLimit
      const validCoupon = response.data[0]; // Assuming only one coupon exists in the array
      if (validCoupon) {
        const couponValue = validCoupon.value;
        const minPurchaseLimit = validCoupon.min_purchase_limit;

        // Log the variables
        console.log("Coupon Value:", couponValue);
        console.log("Min Purchase Limit:", minPurchaseLimit);

        // Optionally set the state if needed
        // setCouponValue(couponValue);
        setMinPurchaseLimit(minPurchaseLimit);
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

  const handleCouponChange = (event) => {
    // Get the value from the input
    const inputValue = event.target.value;

    // Use a regular expression to allow only alphanumeric characters (A-Z, a-z, 0-9)
    const validCharacters = /^[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    // Check if the input value matches the regex
    if (validCharacters.test(inputValue)) {
      setCoupon(inputValue); // Only set the value if it's valid
    }
  };

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
      console.log("Applying coupon:", couponCode, "for all products in cart");
      const productIds = cartItems.map((item) => item.prod_id);

      const { data } = await axios.post(`${ApiUrl}/api/apply-coupon`, {
        couponCode,
        product_ids: productIds,
      });
      console.log("Response from server:", data);

      if (data.success) {
        const discount = data.discount1 ?? data.discount2 ?? 0;

        // Check if discount1 applies but the total doesn't meet the min purchase limit.
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

        // Save coupon details.
        setDiscountAmount(data.discount2 ?? 0);
        setCouponValue(data.discount1 ?? 0);
        setMinPurchaseLimit(data.min_purchase_limit ?? 0);

        const newAmount = Math.max(0, calculateTotalPrice() - discount);
        setTotalAmount(newAmount);
        setNewTotalAmount(newAmount);

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

  const [selectedProducts, setSelectedProducts] = useState([]);

  console.log("Selected Products State:", selectedProducts); // Log selected products

  // Function to handle checkbox selection
  const handleCheckboxChange = (id) => {
    console.log(`Checkbox clicked for product ID: ${id}`);

    setSelectedProducts((prevSelected) => {
      const updatedSelection = prevSelected.includes(id)
        ? prevSelected.filter((productId) => productId !== id) // Remove if already selected
        : [...prevSelected, id]; // Add if not selected

      console.log("Updated Selected Products:", updatedSelection);
      return updatedSelection;
    });
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation(); // Prevent event bubbling

    const email = localStorage.getItem("email");
    console.log("User Email:", email);

    if (!email) {
      console.warn("User is not logged in!");
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "You must be logged in to add items to cart!",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/login";
      });
      return;
    }

    if (selectedProducts.length === 0) {
      console.warn("No products selected!");
      Swal.fire({
        icon: "warning",
        title: "No Items Selected",
        text: "Please select at least one item before adding to cart.",
        confirmButtonText: "OK",
        timer: 3000,
      });
      return;
    }

    setIsAdding(true); // Disable button while sending requests

    try {
      let allSuccess = true;

      // Send each product as a separate request
      for (const productId of selectedProducts) {
        console.log(`Adding product: ${productId} with quantity: 1`);

        const response = await axios.post(`${ApiUrl}/api/addtocart`, {
          email,
          productId, // Send single product ID
          quantity: 1, // Send quantity as 1 for each product
          buyLater: true,
        });

        console.log("Server Response:", response.data);

        if (response.status !== 200) {
          allSuccess = false;
        }
      }

      if (allSuccess) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Selected items added to your cart successfully!",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          fetchBuyLaterItems();
        });

        setSelectedProducts([]); // Clear selection after adding to cart
        console.log("Cleared Selected Products State.");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Some items could not be added to the cart.",
          confirmButtonText: "OK",
          timer: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding items to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong while adding items to the cart.",
        confirmButtonText: "OK",
        timer: 3000,
      });
    } finally {
      setIsAdding(false); // Enable button after request
      console.log("Request completed, isAdding set to false.");
    }
  };

  const [buyLaterItems, setBuyLaterItems] = useState([]);
  // This flag is set only when the user clicks the Buy Later button
  const [buyLaterApplied, setBuyLaterApplied] = useState(false);

  const userid = localStorage.getItem("user_id");

  // Toggle product selection for Buy Later
  const handleBuyLaterToggle = (id) => {
    console.log("Toggled product id:", id);
    setBuyLaterItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // API call to store the Buy Later product IDs in the database
  const handleBuyLaterSubmit = () => {
    if (buyLaterItems.length === 0) {
      // Show warning alert if no item is selected
      Swal.fire({
        title: "Warning!",
        text: "Please select at least one item before clicking Buy Later.",
        icon: "warning",
        confirmButtonText: "OK",
        timer: 3000,
      });
      return; // Stop execution
    }
    console.log("Sending product IDs:", buyLaterItems);

    axios
      .post(`${ApiUrl}/api/store-buy-later`, {
        productIds: buyLaterItems,
        userId: userid,
      })
      .then((response) => {
        console.log("Buy later items saved:", response.data);

        // Show success alert
        Swal.fire({
          title: "Success!",
          text: "Items have been added to Buy Later.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
        }).then(() => {
          window.location.reload();
        });

        setBuyLaterApplied(true);
      })
      .catch((error) => {
        console.error("Error saving buy later items:", error);

        // Show error alert
        Swal.fire({
          title: "Error!",
          text: "Failed to add items to Buy Later. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          timer: 3000,
        });
      });
  };

  // Function to remove an item from Buy Later
  const handleRemoveBuyLater = (productId) => {
    console.log("Removing product from Buy Later:", productId);

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from Buy Later?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${ApiUrl}/api/remove-buy-later`, {
            productId,
            userId: userid, // Ensure you have `userid` from context/state
          })
          .then((response) => {
            console.log("Item removed from Buy Later:", response.data);

            Swal.fire({
              title: "Removed!",
              text: "Item has been removed from Buy Later.",
              icon: "success",
              confirmButtonText: "OK",
              timer: 3000,
            });

            // Update the local state to reflect changes
            // setBuyLaterItems((prev) => prev.filter((id) => id !== productId));
            fetchBuyLaterItems();
          })
          .catch((error) => {
            console.error("Error removing item from Buy Later:", error);

            Swal.fire({
              title: "Error!",
              text: "Failed to remove item. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
              timer: 3000,
            });
          });
      }
    });
  };

  const [buyLaterProducts, setBuyLaterProducts] = useState([]);

  const fetchBuyLaterItems = () => {
    axios
      .get(`${ApiUrl}/api/get-buy-later/${userid}`)
      .then((response) => {
        console.log("Fetched buy later items:", response.data);

        setBuyLaterProducts(response.data.buyLater);
      })
      .catch((error) => {
        console.error("Error fetching buy later items:", error);
      });
  };

  // Call this function when the page loads
  useEffect(() => {
    fetchBuyLaterItems();
  }, [userid]);

  // Calculate the total price; only filter out buy later items after the user clicks "Buy Later"
  const calculateTotalPrice = () => {
    // Calculate the total price of cart items
    const totalPrice = cartItems
      .reduce((total, item) => {
        const price = parseFloat(
          item.offer_price > 0 ? item.offer_price : item.prod_price
        );
        const deliveryCharge = parseFloat(item.deliverycharge || 0);

        return (
          total + (isNaN(price) ? 0 : price * item.quantity) + deliveryCharge
        );
      }, 0)
      .toFixed(2);

    let finalPrice = parseFloat(totalPrice);

    // Check if the total price exceeds the min purchase limit
    if (finalPrice >= minPurchaseLimit) {
      // Apply coupon if total price meets the minimum limit
      if (couponValue > 0) {
        finalPrice -= couponValue; // Apply coupon discount
        console.log("Coupon applied. Discounted price:", finalPrice);
      }
    } else {
      console.log(
        "Total price is below minimum purchase limit. Coupon not applied."
      );
    }

    finalPrice = finalPrice < 0 ? 0 : finalPrice;

    return finalPrice.toFixed(2);
  };

  const calculateDeliveryCharge = () => {
    return cartItems
      .reduce((total, item) => {
        const deliveryCharge = parseFloat(item.deliverycharge || 0);
        return total + (isNaN(deliveryCharge) ? 0 : deliveryCharge);
      }, 0)
      .toFixed(2);
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

  const [isLoading, setIsLoading] = useState(true);

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (email) {
      // Function to fetch the cart items
      const fetchCartItems = async () => {
        try {
          const response = await axios.post(`${ApiUrl}/get-cart-items`, {
            email,
            username: localStorage.getItem("username"), // Send username if needed
          });

          if (response.data.products) {
            setCartItems(response.data.products); // Set the fetched products to state
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setIsLoading(false);
        }
      };

      // Fetch cart items immediately
      fetchCartItems();

      // Set an interval to fetch cart items every 5 seconds
      const intervalId = setInterval(fetchCartItems, 5000); // 5000ms = 5 seconds

      // Clean up the interval on component unmount or when `email` changes
      return () => clearInterval(intervalId);
    }
  }, [email]); // Dependency on `email` so it will trigger fetch when email changes

  // const calculateTotalPrice = () => {
  //   return cartItems
  //     .reduce((total, item) => {
  //       const price = parseFloat(item.price);
  //       return total + (isNaN(price) ? 0 : price * item.quantity);
  //     }, 0)
  //     .toFixed(2);
  // };

  const calculateSellingPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const prod_price = parseFloat(
          item.offer_price > 0 ? item.offer_price : item.prod_price
        );
        return total + (isNaN(prod_price) ? 0 : prod_price * item.quantity);
      }, 0)
      .toFixed(2);
  };
  const discount = () => {
    return cartItems
      .reduce((total, item) => {
        const actual_price = parseFloat(item.actual_price);
        const price = parseFloat(
          item.offer_price > 0 ? item.offer_price : item.prod_price
        );
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

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) return; // Prevent reducing quantity below 1

    try {
      // Update the cart item in the local state immediately for responsiveness
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);

      // Send the updated quantity to the server
      const response = await axios.post(`${ApiUrl}/update-cart-quantity`, {
        email,
        itemId,
        quantity: newQuantity,
      });
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
        icon: "warning",
        title: "Cart is Empty",
        text: "Please add items to your cart before proceeding with place order.",
        timer: 5000,
        showConfirmButton: false,
      });
      return;
    }

    const selectedAddressDetails = addressDetails.find(
      (address) => String(address.address_id) === String(addressToUse)
    );
    const finalAmountToSend =
      newTotalAmount > 0 ? newTotalAmount : calculateTotalPrice();
    const phonenumber = `${selectedAddressDetails.phone}`;
    const name = `${selectedAddressDetails.name}`;
    const email = localStorage.getItem("email");

    // console.log("Razorpay Prefill Data:", {
    //   name: name,           // Logs the user's name (or admin's name if hardcoded)
    //   email: email,         // Logs the user's email (or admin's email if hardcoded)
    //   contact: phonenumber  // Logs the phone number for the prefill
    // });

    const options = {
      key: "rzp_live_YExdymlgVGlrcC", // Replace with your Razorpay Test Key ID
      key_secret: "IUFWdAs57nzoQqnrPZM1pzzt", // Replace with your Razorpay Test Key ID
      // key: "rzp_test_mtjdapiflomQkN", // Sample Razorpay Test Key ID (karthick)
      // key_secret: "g13PipAk6MMAEj2Rr3lajUmJ", // Replace with your Razorpay Test Key ID(karthick)
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

    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart is Empty",
        text: "Please add items to your cart before proceeding with payment.",
        timer: 5000,
        showConfirmButton: false,
      });
      return;
    }

    if (!addressToUse) {
      navigate("/UserAddress"); // Update the path to your UserAddress page
      return;
    }

    const selectedAddressDetails = addressDetails.find(
      (address) => String(address.address_id) === String(addressToUse)
    );

    if (!selectedAddressDetails) {
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

    // const enrichedCartItems = cartItems.map((item) => ({
    //   id: item.id,
    //   quantity: item.quantity,
    //   price: item.prod_price,
    //   name: item.prod_name,
    //   image: item.image,
    //   description: item.prod_description,
    //   product_id: item.prod_id,
    //   category: item.category,
    // }));

    const enrichedCartItems = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity, // Map 'prod_quantity' to 'quantity'
      prod_price: item.offer_price > 0 ? item.offer_price : item.prod_price, // Map 'prod_price' to 'prod_price'
      prod_name: item.prod_name, // Map 'prod_name' to 'prod_name'
      prod_img: item.image, // Map 'prod_image' to 'image'
      prod_description: item.prod_description, // Map 'prod_description' to 'prod_description'
      prod_id: item.prod_id,
      prod_category: item.category, // Map 'prod_category' to 'category'
    }));

    console.log("enrichedCartItems", enrichedCartItems);

    const finalAmountToSend =
      newTotalAmount > 0 ? newTotalAmount : calculateTotalPrice();

    const orderData = {
      user_id: userId,
      total_amount: finalAmountToSend,
      shipping_address: fullAddress,
      address_id: addressToUse,
      cartItems: enrichedCartItems,
      payment_method:
        selectedPaymentMethod === "cod"
          ? "COD"
          : selectedPaymentMethod === "pickup"
          ? "Pick Up From Store"
          : "Online", // Payment method based on selection
      status:
        selectedPaymentMethod === "cod"
          ? "Pending"
          : selectedPaymentMethod === "pickup"
          ? "Ready for Pickup"
          : "Paid", // Status based on selection
    };

    try {
      // Send the order data and store cart items in the backend
      const response = await axios.post(`${ApiUrl}/place-order`, orderData);

      if (response.status === 200) {
        console.log("Order placed successfully");

        Swal.fire({
          icon: "success",
          title: "Order Placed",
          text: "Your order has been placed successfully!",
          timer: 5000,
          showConfirmButton: false,
        }).then(async () => {
          try {
            // Call backend to clear the cart after placing order
            await axios.post(`${ApiUrl}/clear-cart`, { email, cartItems });
            console.log("Cart cleared successfully from the database");
          } catch (clearCartError) {
            console.error("Error clearing cart:", clearCartError.message);
          }

          clearCart(); // Clear cart in local state
          const storedEmail = localStorage.getItem("email");
          if (storedEmail) {
            const cartKey = `${storedEmail}-cart`;
            localStorage.removeItem(cartKey); // Clear local storage cart
          }

          navigate("/MyOrders");
        });
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
        timer: 5000,
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
                        title="Change Delivery Address"
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
                  {/* {totalItems === 0 ? ( */}
                  {cartItems.length === 0 ? (
                    <div>
                      <p style={{ marginTop: "5px" }}>Your cart is empty.</p>
                      <a href="/">
                        <button
                          style={{ float: "right" }}
                          className="change-btn browse-btn"
                        >
                          Browse Products
                        </button>
                      </a>
                    </div>
                  ) : (
                    <div>
                      <p>
                        {totalItems === 1
                          ? `${totalItems} item`
                          : `${totalItems} items`}{" "}
                        in cart
                      </p>
                      <button
                        style={{ float: "right" }}
                        className="change-btn"
                        onClick={handleToggleExpand}
                      >
                        View
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="cart-list-container">
                  <strong style={{ fontSize: "1.0rem" }}>
                    ORDER SUMMARY{" "}
                    {totalItems === 0 ? (
                      <FaTimes style={{ color: "red" }} />
                    ) : (
                      <FaCheck style={{ color: "green" }} />
                    )}
                  </strong>
                  <ul className="cart-list">
                    {cartItems.map((item) => {
                      // Check if image is a stringified array and parse it
                      const images = Array.isArray(item.prod_img)
                        ? item.prod_img
                        : JSON.parse(item.prod_img || "[]"); // Handle if it's a stringified array

                      const firstImage = images.length > 0 ? images[0] : null;

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
                            <p className="cart-product-name">
                              {item.prod_name}
                            </p>
                            {/* <p className="cart-product-name">
                                {item.prod_id}
                              </p> */}
                            <p className="cart-product-description">
                              {item.prod_features}
                            </p>
                          </div>
                          <div className="cart-product-price">
                            <div className="cart-quantity-controls">
                              <button
                                onClick={() =>
                                  updateCartItemQuantity(
                                    item.id,
                                    item.quantity - 1
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
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </button>
                              <FaTrash
                                className="cart-remove-btn"
                                onClick={() =>
                                  removeFromCart(
                                    item.id,
                                    item.prod_name,
                                    item.quantity
                                  )
                                }
                              />
                            </div>
                            <p
                              style={{
                                color: "red",
                                textDecoration: "line-through",
                                fontSize: "14px",
                                marginRight: "5px",
                              }}
                            >
                              ₹{item.actual_price * item.quantity}
                            </p>
                            <p>
                              ₹
                              {item.offer_price > 0
                                ? item.offer_price * item.quantity
                                : item.prod_price * item.quantity}
                            </p>

                            <div>
                              <label>
                                <input
                                  style={{ marginLeft: "10px" }}
                                  type="checkbox"
                                  checked={buyLaterItems.includes(item.id)}
                                  onChange={() => handleBuyLaterToggle(item.id)}
                                />{" "}
                                {/* Buy Later */}
                              </label>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {/* <button
                    style={{ float: "right" }}
                    onClick={handleToggleExpand}
                    className="change-btn"
                  >
                    Continue
                  </button> */}

                  {cartItems.length > 0 && (
                    <button
                      style={{ float: "right", marginRight: "10px" }}
                      onClick={handleBuyLaterSubmit}
                      className="Buy-later-btn"
                    >
                      Buy Later
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* <div>  */}
            {buyLaterProducts.length > 0 && (
              <div className="cart-product-card">
                <strong style={{ fontSize: "1.0rem" }}>BUY LATER ITEMS</strong>
                <div className="cart-list-container">
                  <ul className="cart-list">
                    {buyLaterProducts.map((product) => {
                      const images = Array.isArray(product.prod_img)
                        ? product.prod_img
                        : JSON.parse(product.prod_img || "[]");
                      const firstImage = images.length > 0 ? images[0] : null;

                      return (
                        <li
                          key={product.prod_id}
                          className="cart-product d-flex align-items-center"
                        >
                          {firstImage ? (
                            <div
                              key={product.id}
                              onClick={() => handleProductClick(product.id)}
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={`${ApiUrl}/uploads/${product.category.toLowerCase()}/${firstImage}`}
                                alt={product.name}
                                loading="lazy"
                                className="cart-product-image"
                              />
                            </div>
                          ) : (
                            <div className="placeholder-image">
                              No image available
                            </div>
                          )}

                          <div
                            style={{ cursor: "pointer" }}
                            className="cart-product-details"
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                          >
                            <p className="cart-product-name">
                              {product.prod_name}
                            </p>
                            <p className="cart-product-description">
                              {product.prod_features}
                            </p>
                          </div>

                          <div className="cart-product-price">
                            <div className="cart-quantity-controls">
                              <FaTrash
                                className="cart-remove-btn"
                                onClick={() => handleRemoveBuyLater(product.id)}
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
                              ₹{product.actual_price}
                            </p>
                            <p>
                              ₹
                              {product.offer_price > 0
                                ? product.offer_price
                                : product.prod_price}
                            </p>

                            <div>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={selectedProducts.includes(
                                    product.id
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(product.id)
                                  }
                                />{" "}
                              </label>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <button
                    style={{ float: "right", marginRight: "10px" }}
                    onClick={handleAddToCart}
                    className="Addtocart-btn"
                  >
                    Move To Cart{" "}
                    <span style={{ marginLeft: "10px" }}>
                      <FaShoppingBag />
                    </span>
                  </button>
                </div>
              </div>
            )}
            {/* </div> */}
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
            <h4 style={{ marginTop: "10px", marginBottom: "5px" }}>
              PRICE SUMMARY
            </h4>
            <div className="summary-item">
              <span>
                Price (
                {getTotalItemsCount() === 1
                  ? "1 item"
                  : `${getTotalItemsCount()} items`}
                )
              </span>
              <span>₹{calculateSellingPrice()}</span>
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
                <span>₹{calculateDeliveryCharge()}</span>
              </span>
            </div>
            <div className="summary-item">
              <span>Coupon Discount</span>
              <span style={{ color: "green" }}>
                - ₹{discountAmount.toFixed(2)}
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
                <span style={{ color: "green" }}>- ₹{couponValue}</span>
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
                onClick={() => handleApplyCoupon(coupon)}
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
                {/* ₹{calculateTotalPrice()}₹{newTotalAmount.toFixed(2)} */}₹
                {/* {newTotalAmount > 0
                  ? newTotalAmount.toFixed(2)
                  : calculateTotalPrice()} */}
                {finalAmount.toFixed(2)}
              </span>
            </div>
            <hr />
            <div>
              {isCouponApplied && (
                <p className="discount-message">
                  You will save up to ₹{couponValue || discountAmount} on this
                  order!
                </p>
              )}
            </div>
            {/* <div className="summary-item">
              <span style={{ color: "green" }}>
                You will save ₹{discount()} on this order
              </span> 
            </div> */}
            {/* <button
              className="summary-place-order-btn"
              onClick={handlePayment}
              //   onClick={() => navigate("/checkout")}
            >
              Place Order
            </button> */}
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

              {/* <div className={`summary-item2 ${selectedPaymentMethod === 'net-banking' ? 'selected' : ''}`}>
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
        </div> */}
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
                        title="Set this address as current address"
                        onClick={handleConfirm}
                        className="modal4-confirm-btn"
                      >
                        Set Address
                      </button>
                      <a style={{ textDecoration: "none" }} href="/Useraddress">
                        <button
                          title="Add new address"
                          className="modal4-confirm-btn"
                        >
                          Add New Address
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
