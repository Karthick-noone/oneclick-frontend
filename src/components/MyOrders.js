import React, { useEffect, useState } from "react";
import axios from "axios";
import './css/MyOrders.css'; // Add CSS for styles
import Header2 from "./Header2";
import Footer from "./footer";
import { ApiUrl } from "./ApiUrl";
import Modal from 'react-modal'; // Install if needed using `npm install react-modal`

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [productDetails, setProductDetails] = useState(null); // To store fetched product details
  const [modalIsOpen, setModalIsOpen] = useState(false); // To open and close modal


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

  // const capitalizeFirstLetter = (string) => {
  //   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  // };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  

  return (
    <>
      <Header2 />
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="order-container">
          {orders.length === 0 ? (
            <p className="no-orders">No orders found.</p>
          ) : (
            orders.map(order => (
              <div key={order.unique_id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.unique_id}</h3>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <p>Date: {formatDate(order.order_date)}</p>
                <p>Total: ₹{order.total_amount}</p>
                <button onClick={() => openModal(order)} className="view-details-button">View Details</button>
              </div>
            ))
          )}
        </div>
         {/* Modal for Product Details */}
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
      <Footer />
    </>
  );
};

export default MyOrders;