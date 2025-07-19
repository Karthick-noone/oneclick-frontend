import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/Cart.css";
import { ApiUrl } from "./ApiUrl";
// import Header1 from './Header1';
// import Header2 from "./Header2";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import Swal from "sweetalert2";
import Footer from "./footer";
import { Link } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // State for selected address
  // const [, setWishlistItems] = useState([]);
  const [addresses, setAddresses] = useState([]); // State for storing fetched addresses
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null); // Initially selected address
  const [, setIsAddressSelected] = useState(false);

  const [addressDetails, setAddressDetails] = useState([]);
  const [, setIsAdding] = useState(false); // Track the adding state to prevent multiple clicks

  // const [isOfferActive, setIsOfferActive] = useState(true);
  // const [item, setitem] = useState(null);

  const [buyLaterProducts, setBuyLaterProducts] = useState([]);
  const [buyLaterItems, setBuyLaterItems] = useState([]);
  // This flag is set only when the user clicks the Buy Later button
  const [, setBuyLaterApplied] = useState(false);

  const userid = localStorage.getItem("user_id");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const location = useLocation();
  const { isOfferActive, product } = location.state || {}; // Ensure it doesn't break if undefined

  console.log("Received in Cart:", { isOfferActive, product });

  const handleViewCheckout = () => {
    navigate("/Checkout", { state: { isOfferActive, product } });
  };

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
        timer: 5000,
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
          toast: true,
          position:'top-right',
          title: false,
          text: "Selected items added to Buy Later.",
          icon: "success",
          showConfirmButton: false,
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
              confirmButtonText: false,
              showConfirmButton: false,
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

  const fetchBuyLaterItems = useCallback(() => {
  axios
    .get(`${ApiUrl}/api/get-buy-later/${userid}`)
    .then((response) => {
      console.log("Fetched buy later items:", response.data);

      setBuyLaterProducts(response.data.buyLater);
    })
    .catch((error) => {
      console.error("Error fetching buy later items:", error);
    });
}, [ userid]); //  dependencies

  // Call this function when the page loads
useEffect(() => {
  fetchBuyLaterItems();
}, [fetchBuyLaterItems]); //  added fetchBuyLaterItems
  // useEffect(() => {
  //   if (item && item.offer_end_time) {
  //     const now = new Date();
  //     const offerEndTime = new Date(item.offer_end_time);

  //     // Set offer active based on whether the offer end time is in the future
  //     setIsOfferActive(offerEndTime > now);
  //   }
  // }, [item]);

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
    []
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

  // useEffect(() => {
  //   // Fetch the selected address from local storage
  //   const storedAddressId = localStorage.getItem("selectedAddressId");
  //   if (storedAddressId) {
  //     setSelectedAddress(storedAddressId);
  //   }
  // }, []);

  const handleConfirm = async () => {
    // fetchAddress(); // Fetch the latest address data when the Confirm button is clicked

    if (selectedAddress) {
      try {
        const response = await axios.post(`${ApiUrl}/update-current-address`, {
          userId: userId, // Ensure userId is set correctly
          addressId: selectedAddress,
        });
        // window.location.reload();
        if (response.status === 200) {
          // Update the default address to the newly selected address
          setDefaultAddress(selectedAddress);
          await fetchAddress(userId);
           Swal.fire({
          toast:true,
          timer: 3000,
          position:'top-end',
          // title: "Success",
          text: "Address updated successfully",
          icon: "success",
          confirmButtonText: "OK",
          showConfirmButton:false,
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

  const [, setIsLoading] = useState(true);

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) return; // Exit early if no user

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

    // Fetch cart items immediately on mount
    fetchCartItems();

    //  Listen for cart-updated events
    const handleCartUpdate = () => {
      console.log("[Event] Cart updated, fetching fresh cart data...");
      fetchCartItems();
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    // Cleanup: Remove event listener on unmount
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [email]);
  // Dependency on `email` so it will trigger fetch when email changes

  // useEffect(() => {
  //   const fetchLocalStorageData = () => {
  //     const storedEmail = localStorage.getItem("email");

  //     if (storedEmail) {
  //       const cartKey = `${storedEmail}-cart`;
  //       const wishlistKey = `${storedEmail}-wishlist`;

  //       const storedCartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
  //       const storedWishlistItems =
  //         JSON.parse(localStorage.getItem(wishlistKey)) || [];

  //       const updatedCartItems = storedCartItems.map((item) => ({
  //         ...item,
  //         quantity: item.quantity || 1,
  //       }));

  //       const updatedWishlistItems = storedWishlistItems.map((item) => ({
  //         ...item,
  //         quantity: item.quantity || 1,
  //       }));

  //       setCartItems(updatedCartItems);
  //       setWishlistItems(updatedWishlistItems);
  //     }
  //   };

  //   fetchLocalStorageData();
  //   // Fetch data every second (if needed)
  //   const intervalId = setInterval(fetchLocalStorageData, 200);

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(
          item.offer_price > 0 && isOfferActive ? item.offer_price : item.prod_price
        );
        const deliveryCharge = parseFloat(item.deliverycharge || 0);

        return (
          total + (isNaN(price) ? 0 : price * item.quantity) + deliveryCharge
        );
      }, 0)
      .toFixed(2);
  };
  const calculateSellingPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const prod_price = parseFloat(
          item.offer_price > 0 && isOfferActive ? item.offer_price : item.prod_price
        );
        return total + (isNaN(prod_price) ? 0 : prod_price * item.quantity);
      }, 0)
      .toFixed(2);
  };
  // const discount = () => {
  //   return cartItems
  //     .reduce((total, item) => {
  //       const actual_price = parseFloat(item.actual_price);
  //       const price = parseFloat(
  //         item.offer_price > 0 && isOfferActive ? item.offer_price : item.prod_price
  //       );
  //       const discountPerItem = actual_price - price;
  //       return (
  //         total + (isNaN(discountPerItem) ? 0 : discountPerItem * item.quantity)
  //       );
  //     }, 0)
  //     .toFixed(2);
  // };

  const save = () => {
    return cartItems
      .reduce((total, item) => {
        const actual_price = parseFloat(item.actual_price);
        const price = parseFloat(
          item.offer_price > 0 && isOfferActive ? item.offer_price : item.prod_price
        );
        const discountPerItem = actual_price - price;
        return (
          total + (isNaN(discountPerItem) ? 0 : discountPerItem * item.quantity)
        );
      }, 0)
      .toFixed(0);
  };

  const calculateDeliveryCharge = () => {
    return cartItems
      .reduce((total, item) => {
        const deliveryCharge = parseFloat(item.deliverycharge || 0);
        return total + (isNaN(deliveryCharge) ? 0 : deliveryCharge);
      }, 0)
      .toFixed(2);
  };
  const getTotalItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // const updateCartItemQuantity = (itemId, itemCategory, newQuantity) => {
  //   const updatedCartItems = cartItems.map((item) =>
  //     item.id === itemId && item.category === itemCategory
  //       ? { ...item, quantity: Math.max(newQuantity, 1) }
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
  //   // Display confirmation dialog
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, remove it!",
  //   });

  //   if (result.isConfirmed) {
  //     // Proceed with removing the item from the cart
  //     const updatedCartItems = cartItems.filter(
  //       (item) => !(item.id === itemId && item.category === itemCategory)
  //     );
  //     setCartItems(updatedCartItems);

  //     const storedEmail = localStorage.getItem("email");
  //     if (storedEmail) {
  //       const cartKey = `${storedEmail}-cart`;
  //       localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));

  //       try {
  //         const response = await axios.post(`${ApiUrl}/remove-from-cart`, {
  //           email: storedEmail,
  //           itemId: itemId,
  //           itemCategory: itemCategory,
  //         });

  //         if (response.status === 200) {
  //           toast.success("Item removed from cart!", {
  //             position: "top-right",
  //             autoClose: 2000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //           });
  //         } else {
  //           throw new Error("Unexpected response status");
  //         }
  //       } catch (error) {
  //         console.error(
  //           "Error removing item from cart:",
  //           error.response || error.message || error
  //         );
  //         toast.error(
  //           `An error occurred: ${
  //             error.response?.data?.message || error.message
  //           }`,
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
  //       }
  //     }
  //   }
  // };
  const updateCartItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) return;

    const previousCartItems = [...cartItems];

    // Optimistically update UI
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);

    try {
      const response = await axios.post(`${ApiUrl}/update-cart-quantity`, {
        email,
        itemId,
        quantity: newQuantity,
      });

      console.log("API Response:", response);

      // Adjust this line based on actual API response
      if (response.status === 200) {
        // ✅ API success, do nothing
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        // ❌ API failed, rollback
        setCartItems(previousCartItems);
        toast.error("Failed to update item quantity", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);

      // Rollback UI on error
      setCartItems(previousCartItems);
      toast.error("Error updating item quantity", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };




  const removeFromCart = async (itemId, itemName, quantity) => {
  // Show confirmation popup
  const confirmation = await Swal.fire({
    title: "Are you sure?",
    text: `Do you want to remove "${itemName}" from your cart?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c", // Red color for delete
    cancelButtonColor: "#6c757d",  // Grey for cancel
    confirmButtonText: "Yes, remove it!",
    cancelButtonText: "Cancel",
  });

  if (!confirmation.isConfirmed) return; // User clicked Cancel

  try {
    const response = await axios.post(`${ApiUrl}/remove-from-cart`, {
      email,
      itemId,
      quantity,
    });

    if (response.data.success) {
      // Update local state
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);

      // Fire global event so navbar/sidebar updates cart count
      window.dispatchEvent(new Event("cart-updated"));

      // Show success toast
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `"${itemName}" has been removed from your cart!`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      console.error("Failed to remove item from cart");

      // Show error toast
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to remove item from cart!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);

    // Show error toast
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Error removing item from cart!",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
};

  // Assuming addressDetails is already available, you can set the initial address
  useEffect(() => {
    if (addressDetails.length > 0 && !defaultAddress) {
      setDefaultAddress(addressDetails[0].address_id);
    }
  }, [addressDetails, defaultAddress]);

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
          toast:true,
          position:'top-right',
          icon: "success",
          title: false,
          text: "Selected items added to your cart.",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          fetchBuyLaterItems();
        });

        //  Dispatch cart-updated event
        window.dispatchEvent(new Event("cart-updated"));

        setSelectedProducts([]); // Clear selection after adding to cart
        console.log("Cleared Selected Products State.");
      }
      else {
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

  // const handlePlaceOrder = async () => {
  //   console.log("handlePlaceOrder function called");

  //   // Use the selected address if available, otherwise fall back to the default address
  //   const addressToUse = selectedAddress || defaultAddress;

  //   if (!addressToUse) {
  //     console.log("No address selected or default address found");
  //     Swal.fire({
  //       icon: "error",
  //       title: "Address Required",
  //       text: "Please select a shipping address.",
  //       timer: 2000,
  //       showConfirmButton: false,
  //     });
  //     return;
  //   }

  //   console.log("Selected or Default Address ID:", addressToUse);
  //   console.log("Address Details:", addressDetails);

  //   // Log all address IDs to verify the correct comparison
  //   console.log(
  //     "All address IDs:",
  //     addressDetails.map((address) => address.address_id)
  //   );

  //   // Find the address details using the address ID (either default or selected)
  //   const selectedAddressDetails = addressDetails.find(
  //     (address) => String(address.address_id) === String(addressToUse)
  //   );

  //   if (!selectedAddressDetails) {
  //     console.log("Selected address details not found");
  //     Swal.fire({
  //       icon: "error",
  //       title: "Address Not Found",
  //       text: "Selected address not found.",
  //       timer: 2000,
  //       showConfirmButton: false,
  //     });
  //     return;
  //   }

  //   // Construct the full address string
  //   const fullAddress = `${selectedAddressDetails.name}, ${selectedAddressDetails.street}, ${selectedAddressDetails.city}, ${selectedAddressDetails.state}, ${selectedAddressDetails.country}, ${selectedAddressDetails.postal_code}`;

  //   // Enrich cart items with additional details
  //   const enrichedCartItems = cartItems.map((item) => ({
  //     id: item.id,
  //     quantity: item.quantity,
  //     price: item.price,
  //     name: item.name,
  //     image: item.image,
  //     description: item.description,
  //     product_id: item.prod_id,
  //     delivery_charge: item.delivery_charge,
  //     category: item.category,
  //   }));

  //   const orderData = {
  //     user_id: userId,
  //     total_amount: calculateTotalPrice(),
  //     shipping_address: fullAddress,
  //     address_id: addressToUse,
  //     cartItems: enrichedCartItems,
  //   };

  //   console.log("Order Data:", orderData);

  //   try {
  //     const response = await axios.post(`${ApiUrl}/place-order`, orderData);

  //     if (response.status === 200) {
  //       console.log("Order placed successfully");
  //       Swal.fire({
  //         icon: "success",
  //         title: "Order Placed",
  //         text: "Your order has been placed successfully!",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //       // Clear cart or navigate to a confirmation page
  //     } else {
  //       console.log("Unexpected response status:", response.status);
  //       throw new Error("Unexpected response status");
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error placing order:",
  //       error.response?.data || error.message
  //     );
  //     Swal.fire({
  //       icon: "error",
  //       title: "Order Error",
  //       text: `An error occurred: ${error.response?.data?.message || error.message
  //         }`,
  //       timer: 2000,
  //       showConfirmButton: false,
  //     });
  //   }
  // };

  const handleProductClick = (product) => {
    const slugify = (name) =>
      name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    navigate(`/shop/${product.id}-${slugify(product.prod_name)}`);
  };


  return (
    <>
      {/* <Header1 /> */}
      {/* <Header2 /> */}
      <div className="cart-container">
        <div className="cart-header">
          <h1>
            <i className="fas fa-shopping-cart"></i> Your Cart
          </h1>
        </div>
        <div className="cart-content row">
          <div className="cart-products">
            <div className="cart-address">
              {/* <h3>Select Delivery Address</h3> */}
              {addressDetails.length > 0 ? (
                <ul>
                  {addressDetails.map((address) => (
                    <li
                      className={`addr-list ${selectedAddress === address.address_id ? "selected" : ""
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
                        {selectedAddress === address.address_id
                          ? "Change"
                          : "Change"}
                      </button>
                      <strong>Delivery to :</strong>
                      <label>
                        <span style={{ fontSize: "15px", marginTop: "5px" }}>
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
                  <Link to="/Useraddress">
                    <button style={{ float: "right" }} className="change-btn">Add Address</button>
                  </Link>
                </div>
              )}
            </div>
            <div className="cart-product-cardd">
              <strong style={{ fontSize: "1.0rem" }}>CART ITEMS</strong>

              <ul className="cart-list">
                {cartItems.length === 0 ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ marginTop: "5px" }}>Your cart is empty.</p>
                    <Link to="/">
                      <button className="change-btn browse-btn">Browse Products</button>
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    // Check if image is a stringified array and parse it
                    const images = Array.isArray(item.prod_img)
                      ? item.prod_img
                      : JSON.parse(item.prod_img || "[]"); // Handle if it's a stringified array

                    const firstImage = images.length > 0 ? images[0] : null; // Get the first image or fallback to null

                    return (
                      <li
                        key={item.id}
                        className="cart-product "
                      >

                        {/* <Link
                          style={{ textDecoration: "none" }}
                          to={`/product/${item.id}`}
                        > */}
                        <div className="cart-product-header">
                          {firstImage ? (
                            <img
                              src={`${ApiUrl}/uploads/${item.category.toLowerCase()}/${firstImage}`}
                              alt={item.prod_name || "Product"}
                              loading="lazy"
                              className="cart-product-image"
                              onClick={() => handleProductClick(item)}
                              name="image"
                            />
                          ) : (
                            <div className="placeholder-image">No image available</div>
                          )}
                          <div
                            className="cart-product-details"
                            onClick={() => handleProductClick(item)}
                          >
                            <p className="cart-product-name">{item.prod_name}</p>
                          </div>
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
                          </div>

                          <p
                            style={{
                              color: "red",
                              textDecoration: "line-through",
                              fontSize: "13px",
                              marginRight: "5px",
                            }}
                          >
                            ₹{item.actual_price * item.quantity}
                          </p>
                          <p>
                            {" "}
                            ₹
                            {item.offer_price > 0 && isOfferActive
                              ? item.offer_price * item.quantity
                              : item.prod_price * item.quantity}
                          </p>
                          <FaTrash
                            className="cart-remove-btn"
                            title="Remove this item from cart"
                            onClick={() =>
                              removeFromCart(
                                item.id,
                                item.prod_name,
                                item.quantity
                              )
                            }
                          />
                          <div>
                            <label className="checkbox-container">
                              <input
                                type="checkbox"
                                checked={buyLaterItems.includes(item.id)}
                                onChange={() => handleBuyLaterToggle(item.id)}
                              />
                              <svg viewBox="0 0 64 64" height="2em" width="2em">
                                <path
                                  d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                  pathLength="575.0541381835938"
                                  className="path"
                                ></path>
                              </svg>
                            </label>
                          </div>

                        </div>
                      </li>
                    );
                  })
                )}
                {cartItems.length > 0 && (
                  <button
                    style={{ float: "right", marginRight: "10px" }}
                    onClick={handleBuyLaterSubmit}
                    className="Buy-later-btn"
                  >
                    Save For Later
                  </button>
                )}
              </ul>
            </div>
            {buyLaterProducts.length > 0 && (
              <div className="cart-product-card">
                <strong style={{ fontSize: "1.0rem" }}>SAVED FOR LATER</strong>
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
                          className="cart-product "
                        >

                          <div className="cart-product-header">

                            {firstImage ? (
                              <div
                                key={product.id}
                                onClick={() => handleProductClick(product)}
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
                              onClick={() => handleProductClick(product)}
                            >
                              <p className="cart-product-name">
                                {product.prod_name}
                              </p>
                              {product.status === "unavailable" && (

                                <p style={{ color: 'red' }}>Out Of Stock</p>
                              )}
                              <p className="cart-product-description">
                                {product.prod_features}
                              </p>
                            </div>
                          </div>

                          <div className="cart-product-price">

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
                            <p style={{ marginRight: '5px' }}>
                              ₹
                              {product.offer_price > 0 && isOfferActive
                                ? product.offer_price
                                : product.prod_price}
                            </p>

                            <div className="cart-quantity-controls">
                              <FaTrash
                                title="Remove this item "
                                className="cart-remove-btn"
                                onClick={() => handleRemoveBuyLater(product.id)}
                              />
                            </div>
                            {product.status === "available" && (
                              <div>
                                <label className="checkbox-container">
                                  <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(product.id)}
                                    onChange={() => handleCheckboxChange(product.id)}
                                  />
                                  <svg viewBox="0 0 64 64" height="2em" width="2em">
                                    <path
                                      d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                      pathLength="575.0541381835938"
                                      className="path"
                                    ></path>
                                  </svg>
                                </label>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {buyLaterProducts.length >= 1 &&
                    buyLaterProducts.some((product) => product.status === "available") && (
                      <button
                        style={{ float: "right", marginRight: "10px" }}
                        onClick={handleAddToCart} // Pass product list if needed
                        className="Addtocart-btn"
                      >
                        Move To Cart{" "}
                        <span style={{ marginLeft: "10px" }}>
                          <FaShoppingBag />
                        </span>
                      </button>
                    )
                  }

                </div>
              </div>
            )}
          </div>

          <div className="cart-summary">
            <h4 style={{ marginTop: "10px", marginBottom: "5px" }}>
              Price Summary:
            </h4>
            <div className="summary-item">
              <span>
                Price
                {getTotalItemsCount() > 0 && (
                  getTotalItemsCount() === 1 ? " (1 item)" : ` (${getTotalItemsCount()} items)`
                )}


              </span>
              <span>₹{calculateSellingPrice()}</span>
            </div>
            {/* <div className="summary-item">
              <span>Discount</span>
              <span style={{color:'green'}}>- ₹0</span>
            </div> */}
            <div className="summary-item">
              <span>Platform fee</span>
              <span>-</span>
            </div>
            <div className="summary-item">
              <span>Delivery charge</span>
              <span>
                {/* <span style={{ textDecoration: "line-through" }}>₹40</span> <span style={{color:'green'}}>FREE Delivery</span> */}
                <span>₹{calculateDeliveryCharge()}</span>
              </span>
            </div>
            {/* <div className="summary-item">
              <span>You will save on this order</span>
              <span>₹10000</span>
            </div> */}{" "}
            <hr />
            <div className="summary-item">
              <strong>Total Amount</strong>
              <span style={{ fontWeight: "bold" }}>
                ₹{calculateTotalPrice()}
              </span>
            </div>
            <hr />
            <div className="summary-item">
              {save() > 0 &&
                <span style={{ color: "green" }}>
                  You will save ₹{save()} on this order
                </span>}
              {/* <span>₹10000</span> */}
            </div>
            <button
              className="summary-place-order-btn"
              onClick={handleViewCheckout}
            // onClick={handlePlaceOrder}
            >
              Checkout
            </button>
            {isModalOpen && (
              <div className="modal4-overlay">
                <div className="modal4-content">
                  <h3>Select Delivery Address</h3>
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
                      title="Set this address as delivery address"
                      onClick={handleConfirm}
                      className="modal4-confirm-btn"
                    >
                      Set Address
                    </button>
                    <Link style={{ textDecoration: "none" }} to="/Useraddress">
                      <button
                        title="Add new address"
                        className="modal4-confirm-btn"
                      >
                        Add new address
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Address Section */}
        </div>
      </div>
      <Footer />
      <ToastContainer />

    </>
  );
};

export default CartPage;
