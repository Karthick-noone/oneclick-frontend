import React, { useEffect, useState } from "react";
import Header2 from "./Header2";
import Footer from "./footer";
import fullad from "./img/banar.jpg";
import Logo from "./img/user.jpg";
import { ApiUrl } from "./ApiUrl";
import axios from "axios";
import Modal from "react-modal"; // Install if needed using `npm install react-modal`
import { FaTimes } from "react-icons/fa";
import "./css/MyAccount.css"
const MyAccount = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [productDetails, setProductDetails] = useState(null); // To store fetched product details
  const [modalIsOpen, setModalIsOpen] = useState(false); // To open and close modal
  const [address, setAddress] = useState(null);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    // Fetch user data (profile info) from localStorage or API
    // Example: You may fetch user info via API or just use stored data
    // Assuming you have user info in localStorage as an example
    const storedUser = {
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
    };
    setUser(storedUser);

    // Fetch address for the user
    axios
      .get(`${ApiUrl}/singleaddress/${userId}`)
      .then((response) => {
        const address = response.data[0];
        console.log(address);
        setAddress(address); // Assuming the address array is returned and we need the first entry
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Fetch user data from localStorage when the component mounts
  useEffect(() => {
    const username = localStorage.getItem("username") || "Guest";
    const email = localStorage.getItem("email") || "Not provided";
    setUser({ username, email });
  }, []);

  useEffect(() => {
    // Get userId from localStorage
    // const userId = localStorage.getItem("user_id"); // Make sure to store 'user_id' when user logs in

    if (userId) {
      // Fetch orders from the backend
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${ApiUrl}/api/my-orders/${userId}`); // Replace with actual API
          setOrders(response.data.orders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const openModal = async (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);

    try {
      const orderId = order.unique_id;
      console.log("Fetching product details for Order ID:", orderId);

      // Fetch product IDs using order_id
      const productResponse = await axios.get(
        `${ApiUrl}/getProductByOrderId/${orderId}`
      );
      console.log("Product Response Data:", productResponse.data);

      // Check if any product details are present
      if (!productResponse.data || productResponse.data.length === 0) {
        console.error("No products found for Order ID:", orderId);
        return;
      }

      // Set product details directly from the response
      setProductDetails(productResponse.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const [currentProductIndex, setCurrentProductIndex] = useState(0); // State to track the current product index

  // Check if productDetails is an array and has elements
  const hasProducts =
    Array.isArray(productDetails) && productDetails.length > 0;

  const handleNextProduct = () => {
    if (hasProducts && currentProductIndex < productDetails.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1); // Move to the next product
    }
  };

  const handlePreviousProduct = () => {
    if (hasProducts && currentProductIndex > 0) {
      setCurrentProductIndex(currentProductIndex - 1); // Move to the previous product
    }
  };

  // Only get the current product if hasProducts is true
  const currentProduct = hasProducts
    ? productDetails[currentProductIndex]
    : null;

  const closeModal = () => {
    setModalIsOpen(false);
    setProductDetails(null);
  };

  const handleProductChange = (event) => {
    const productId = event.target.value;
    setSelectedProduct(productId);
  };

    const [selectedProduct, setSelectedProduct] = useState(
      orders[0]?.products?.[0]?.product_id
    );

  return (
    <>
    <Header2 />
    <div className="ac-banner-container">
      <img src={fullad} loading="lazy" alt="Banner" className="ac-banner-image" />
      <div className="ac-banner-text-container">
        <h2 className="ac-banner-text">
          Welcome, {user.username ? capitalizeFirstLetter(user.username) : "N/A"}!
        </h2>
      </div>
    </div>

    <div className="ac-account-container">
      <div className="ac-profile-card">
        <div className="ac-profile-header">
          <div className="ac-profile-left">
            <img src={Logo} loading="lazy" alt="User Avatar" className="ac-avatar" />
            <div>
              <h2 className="ac-profile-name">
                {user.username ? capitalizeFirstLetter(user.username) : "N/A"}
              </h2>
              <p className="ac-profile-email">{user.email}</p>
            </div>
          </div>

          <div className="ac-address-card">
            {address ? (
              <div>
                <h3>Current Address</h3>
                <p>{address.street}, {address.city}, {address.state}, {address.postal_code}</p>
                <p>{address.phone}</p>
              </div>
            ) : (
              <p className="ac-no-address">No address available</p>
            )}
            <a href="/UserAddress">
              <button className="ac-button">Change/Add Address</button>
            </a>
          </div>
        </div>
      </div>

        {/* Recent Orders Section */}
       
      </div>
      <div style={{paddingRight:'50px', paddingLeft:'50px'}}>
      <div style={styles.infoSection}>
          <h3 style={{marginBottom:'10px'}}>Recent Orders</h3>
          {/* <p>No recent orders yet. Start shopping now!</p> */}
          <div className="order-container">
            {orders.length === 0 ? (
              <p className="no-orders">No orders found.</p>
            ) : (
              // Slice the array to show only the first 3 orders
              orders.slice(0, 3).map((order) => (
                <div key={order.unique_id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order.unique_id}</h3>
                    <span
                    className={`order-status ${order.status.toLowerCase()}`}
                  >
                    {order.status.toLowerCase() === "pending"
                      ? "Payment Pending"
                      : order.status.toLowerCase() === "refund pending"
                      ? "Refund Pending"
                      : order.status.toLowerCase() === "refund"
                      ? "Refund"
                      : "Payment Paid"}
                  </span>
                  </div>

                  <div className="products-list">
                  {order.products && order.products.length > 1 ? (
                    <select
                      value={selectedProduct}
                      onChange={handleProductChange}
                      className="product-dropdown"
                    >
                      {order.products.map((product) => (
                        <option
                        className="product-name"

                          key={product.product_id}
                          value={product.product_id}
                        >
                          {product.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    order.products &&
                    order.products.length === 1 && (
                      <span  className="product-name"  style={{ fontWeight: "bold" }}>
                        {order.products[0].name}
                      </span>
                    )
                  )}
                </div>
                  <p>Order Date: {formatDate(order.order_date)}</p>
                  <p>Total Amount: ₹{order.total_amount}</p>
                  <button
                    onClick={() => openModal(order)}
                    className="view-details-button"
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
          {/* Modal for Product Details */}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Product Details"
            className="custom-modal10"
            overlayClassName="modal-overlay"
          >
            <h2>Order Details</h2>
            <div className="order-details10">
              <div className="details-and-image10">
                <div className="product-info10">
                  {currentProduct &&
                    currentProduct.prod_img &&
                    // Check if prod_img is a string and parse it if necessary
                    (() => {
                      const images = Array.isArray(currentProduct.prod_img)
                        ? currentProduct.prod_img
                        : JSON.parse(currentProduct.prod_img || "[]");

                      // Display the first image if available
                      const firstImage = images.length > 0 ? images[0] : null;

                      return firstImage ? (
                        <center>
                          <img
                            src={`${ApiUrl}/uploads/${currentProduct.category.toLowerCase()}/${firstImage}`}
                            alt={currentProduct.prod_name}
                            className="product-image10"
                    loading="lazy"

                          />
                        </center>
                      ) : (
                        <div>No image available</div> // Fallback message if no image is available
                      );
                    })()}
                  {currentProduct && (
                    <>
                      <p className="info-row">
                        <span className="info-label">Product Name</span>
                        <span className="info-value product-namee">
                          {currentProduct.prod_name}
                        </span>
                      </p>
                      <p className="info-row">
                        <span className="info-label">Price</span>
                        <span className="info-value ">
                          ₹{currentProduct.prod_price}
                        </span>
                      </p>
                      {/* <p className="info-row">
                        <span className="info-label">Description</span>
                        <span className="info-value product-descriptionn">
                          {currentProduct.prod_features}
                        </span>
                      </p> */}
                    </>
                  )}
                </div>
              </div>

              {selectedOrder && (
                <>
                  <p className="info-row">
                    <span className="info-label">Order ID</span>
                    <span className="info-value">
                      #{selectedOrder.unique_id}
                    </span>
                  </p>
                  <p className="info-row">
                    <span className="info-label">Ordered Date</span>
                    <span className="info-value">
                      {formatDate(selectedOrder.order_date)}
                    </span>
                  </p>
                  {/* <p className="info-row">
              <span className="info-label">Payment Status</span>
              <span className={`info-value status ${selectedOrder.status ? selectedOrder.status.toLowerCase() : 'unknown'}`}>
                {selectedOrder.status}
              </span>
            </p> */}
                  <p className="info-row">
                    <span className="info-label">Total Amount</span>
                    <span className="info-value">
                      ₹{selectedOrder.total_amount}
                    </span>
                  </p>
                  <p className="info-row">
                    <span className="info-label">Shipping Address</span>
                    <span className="info-value">
                      {selectedOrder.shipping_address}
                    </span>
                  </p>
                </>
              )}

              {/* Navigation Buttons */}
              {productDetails && productDetails.length > 1 && (
                <div className="navigation-buttons">
                  <button
                    className="add-to-cart"
                    onClick={handlePreviousProduct}
                    disabled={!hasProducts || currentProductIndex === 0}
                  >
                    &lt; Prev
                  </button>
                  <button
                    style={{ marginLeft: "5px" }}
                    className="add-to-cart"
                    onClick={handleNextProduct}
                    disabled={
                      !hasProducts ||
                      currentProductIndex === productDetails.length - 1
                    }
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </div>

            <button onClick={closeModal} className="modal-close-button10">
              <FaTimes />
            </button>
          </Modal>
        </div>

        {/* Account Settings */}
        <div style={styles.infoSection}>
          <h3>Account Settings</h3>
          <p>
            Manage your account, update your profile, and change your password.
          </p>
          <a href="/ForgotPassword">
            <button className="change-btn"> Change Password</button>
          </a>
        </div></div>

      {/* Footer */}
      <Footer />
    </>
  );
};



export default MyAccount;




// Styles for the enhanced page
const styles = {
  bannerContainer: {
    position: "relative",
    width: "100%",
    height: "250px",
    overflow: "hidden",
    marginTop: "0px",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    // objectFit: "cover",
  },
  bannerTextContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "black",
    textAlign: "center",
  },
  bannerText: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  accountContainer: {
    padding: "20px",
    textAlign: "center",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginBottom: "30px",
    textAlign: "left",
  },
  profileHeader: {
    display: "flex",
    alignItems: "flex-start", // Align items to the top of the card
    justifyContent: "space-between", // Distribute space between left and right sections
    flexWrap: "wrap", // Allows wrapping for responsiveness
  },
  profileLeft: {
    display: "flex",
    alignItems: "center",
    flex: 1, // Left side takes available space
    marginRight: "20px", // Adds space between the left and right side
    flexWrap: "wrap", // Allows wrapping for smaller screens
    gap: "10px", // Adds spacing between elements
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    marginRight: "20px",
  },
  profileName: {
    fontSize: "1.8rem",
    margin: 0,
  },
  profileEmail: {
    fontSize: "1rem",
    color: "#666",
  },
  profileAbout: {
    marginTop: "10px",
    fontSize: "1rem",
    color: "#444",
  },
  addressCard: {
    flex: 1, // Right side takes available space
    textAlign: "left",
    padding: "15px",
    borderLeft: "2px solid #ddd", // Adds a separator between the two sections
    marginTop: "10px",
  },
  infoSection: {
    textAlign: "left",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    
  },
  "@media (max-width: 768px)": {
    profileHeader: {
      flexDirection: "column", // Stack image and details vertically
      alignItems: "center", // Center align for a clean look
      textAlign: "center",
    },
    avatar: {
      marginRight: 0, // Remove right margin when stacked vertically
      marginBottom: "15px", // Add some spacing below the image
    },
    profileName: {
      fontSize: "1.5rem",
    },
  },
};
