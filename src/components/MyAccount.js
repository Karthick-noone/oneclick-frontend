import React, { useEffect, useState } from "react";
import Header2 from "./Header2";
import Footer from "./footer";
import fullad from './img/banar.jpg';
import Logo from './img/user.jpg';
import { ApiUrl } from "./ApiUrl";
import axios from "axios";
import Modal from 'react-modal'; // Install if needed using `npm install react-modal`

const MyAccount = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [productDetails, setProductDetails] = useState(null); // To store fetched product details
  const [modalIsOpen, setModalIsOpen] = useState(false); // To open and close modal


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
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
    const userId = localStorage.getItem('user_id'); // Make sure to store 'user_id' when user logs in

    if (userId) {
      // Fetch orders from the backend
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${ApiUrl}/api/my-orders/${userId}`); // Replace with actual API
          setOrders(response.data);
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
  
      // Fetch product_id using order_id
      const productResponse = await axios.get(`${ApiUrl}/getProductByOrderId/${orderId}`);
      console.log("Product Response Data:", productResponse.data);
  
      // Check if product_id is present
      if (!productResponse.data || !productResponse.data.product_id) {
        console.error("No product_id found for Order ID:", orderId);
        return;
      }
  
      const { product_id } = productResponse.data;
  
      // Fetch product details from the relevant table
      const productDetailsResponse = await axios.get(`${ApiUrl}/getProductDetails`, {
        params: { product_id }
      });
  
      console.log("Product Details Response Data:", productDetailsResponse.data);
  
      // Check if product details are present
      if (!productDetailsResponse.data) {
        console.error("No product details found for Product ID:", product_id);
        return;
      }
  
      setProductDetails(productDetailsResponse.data);
      
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setProductDetails(null);
  };

  return (
    <>
      {/* Header */}
      <Header2 />

      {/* Banner Section */}
      <div style={styles.bannerContainer}>
        <img src={fullad} alt="Banner" style={styles.bannerImage} />
        <div style={styles.bannerTextContainer}>
          <h2 style={styles.bannerText}>Welcome, {user.username  ? capitalizeFirstLetter(user.username) : 'N/A'}!</h2>
        </div>
      </div>

      {/* Main Profile Section */}
      <div style={styles.accountContainer}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <img
              src={Logo} // Placeholder for avatar, replace with actual user image
              alt="User Avatar"
              style={styles.avatar}
            />
            <div>
              <h2 style={styles.profileName}>{user.username  ? capitalizeFirstLetter(user.username) : 'N/A'}</h2>
              <p style={styles.profileEmail}>{user.email}</p>
              <p style={styles.profileAbout}>
                
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div style={styles.infoSection}>
        <h3>Recent Orders</h3>
        {/* <p>No recent orders yet. Start shopping now!</p> */}
        <div className="order-container">
  {orders.length === 0 ? (
    <p className="no-orders">No orders found.</p>
  ) : (
    // Slice the array to show only the first 3 orders
    orders.slice(0, 3).map(order => (
      <div key={order.unique_id} className="order-card">
        <div className="order-header">
          <h3>Order #{order.unique_id}</h3>
          <span className={`order-status ${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
        <p>Date: {formatDate(order.order_date)}</p>
        <p>Total: ₹{order.total_amount}</p>
        <button onClick={() => openModal(order)} className="view-details-button">
          View Details
        </button>
      </div>
    ))
  )}
</div>
        {modalIsOpen && selectedOrder && (
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
          {productDetails && (
           <center> <img 
              src={`${ApiUrl}/uploads/${productDetails.category}/${productDetails.prod_img}`} 
              alt={productDetails.prod_name} 
              className="product-image10" 
            /></center>
          )}
          {productDetails && (
            <>
              <p className="info-row">
                <span className="info-label">Product Name</span>
                <span className="info-value">{productDetails.prod_name}</span>
              </p>
              <p className="info-row">
                <span className="info-label">Description</span>
                <span className="info-value">{productDetails.prod_features}</span>
              </p>
            </>
          )}
        </div>
      </div>
      <p className="info-row">
        <span className="info-label">Order ID</span>
        <span className="info-value">#{selectedOrder.unique_id}</span>
      </p>
      {/* <p className="info-row">
        <span className="info-label">Customer Name</span>
        <span className="info-value">{selectedOrder.customerName}</span>
      </p> */}
      <p className="info-row">
        <span className="info-label">Ordered Date</span>
        <span className="info-value">{formatDate(selectedOrder.order_date)}</span>
      </p>
      <p className="info-row">
        <span className="info-label">Status</span>
        <span className={`info-value status ${selectedOrder.status ? selectedOrder.status.toLowerCase() : 'unknown'}`}>{selectedOrder.status}</span>
      </p>
      <p className="info-row">
        <span className="info-label">Total Amount</span>
        <span className="info-value">₹{selectedOrder.total_amount}</span>
      </p>
    </div>
    <button onClick={closeModal} className="modal-close-button10">Close</button>
  </Modal>
)}
        </div>

        {/* Account Settings */}
        <div style={styles.infoSection}>
          <h3>Account Settings</h3>
          <p>Manage your account, update your profile, and change your password.</p>
          <a href="/ForgotPassword"><button className="change-btn"> Change Password</button></a>
        </div>
      </div>

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
    marginTop:'0px'
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
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
    maxWidth: "1200px",
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
    alignItems: "center",
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
  infoSection: {
    textAlign: "left",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
};