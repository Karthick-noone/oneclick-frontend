import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Orders.css";
import { ApiUrl } from "../../components/ApiUrl";
import Modal from "react-modal"; // Install if needed using `npm install react-modal`
import Swal from "sweetalert2"; // For better confirmation, install with `npm install sweetalert2`
import OrderTrackingModal from "./OrderTrackingModal";
import { FaTimes } from "react-icons/fa";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [productDetails, setProductDetails] = useState(null); // To store fetched product details
  const [modalIsOpen, setModalIsOpen] = useState(false); // To open and close modal
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null); // State for the current order ID

  const openModal2 = (order) => {
    console.log('Opening modal for order ID:', order.unique_id); // Log the order ID being opened
    setCurrentOrderId(order.unique_id); // Set the current order ID
    setIsModalOpen2(true);
  };
  
  const closeModal2 = () => {
    setIsModalOpen2(false);
    console.log('Closing modal for order ID:', currentOrderId); // Log the order ID when closing the modal
    setCurrentOrderId(null); // Reset the order ID when modal closes
  };
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchorders`);
        setOrders(response.data.reverse());
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

 const openModal = async (order) => {
    setSelectedOrder(order); 
    setModalIsOpen(true); 
  
    try {
      const orderId = order.unique_id; 
      console.log("Fetching product details for Order ID:", orderId);
  
      // Fetch product IDs using order_id
      const productResponse = await axios.get(`${ApiUrl}/getProductByOrderId/${orderId}`);
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
  const hasProducts = Array.isArray(productDetails) && productDetails.length > 0;

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
  const currentProduct = hasProducts ? productDetails[currentProductIndex] : null;
  const closeModal = () => {
    setModalIsOpen(false);
    setProductDetails(null);
  };

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPaginationPages = () => {
    const pages = [];
    const maxPagesToShow = 6; // Total number of page numbers to show at a time

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftBoundary = Math.max(
        1,
        currentPage - Math.floor(maxPagesToShow / 2)
      );
      const rightBoundary = Math.min(
        totalPages,
        currentPage + Math.floor(maxPagesToShow / 2)
      );

      if (leftBoundary > 2) {
        pages.push(1, "...");
      } else {
        for (let i = 1; i < leftBoundary; i++) {
          pages.push(i);
        }
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pages.push(i);
      }

      if (rightBoundary < totalPages - 1) {
        pages.push("...", totalPages);
      } else {
        for (let i = rightBoundary + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  // Delete order function
  const deleteOrder = async (orderId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`${ApiUrl}/deleteOrder/${orderId}`);
        setOrders(orders.filter((order) => order.unique_id !== orderId)); // Update the order state
        Swal.fire("Deleted!", "Your order has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting order:", error);
        Swal.fire(
          "Error!",
          "Failed to delete the order. Please try again later.",
          "error"
        );
      }
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2 className="orders-page-title">Orders</h2>
      </div>
      <div className="orders-content">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="table-wrapper">
          <table className="orders-table">
  <thead>
    <tr>
      <th>Sl.No</th>
      <th>Order ID</th>
      <th>Name</th>
      <th>Date</th>
      <th>Payment Status</th>
      <th>Price</th>
      <th>Actions</th>
      <th>Delivery Status</th>
    </tr>
  </thead>
  <tbody>
    {currentOrders
      .map((order, index) => (
        <tr key={order.unique_id}>
          <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
          <td>#{order.unique_id || "N/A"}</td>
          <td>
            {order.customerName
              ? capitalizeFirstLetter(order.customerName)
              : "N/A"}
          </td>
          <td>{formatDate(order.order_date)}</td>
          <td>
            <span
              className={`${
                order.status ? order.status.toLowerCase() : "unknown"
              }`}
            >
              {order.status || "Unknown"}
            </span>
          </td>
          <td>₹{order.total_amount || "N/A"}</td>
          <td>
            <button
              className="btn btn-view"
              onClick={() => openModal(order)}
            >
              View
            </button>
            {/* <button className="btn btn-edit">Edit</button> */}
            <button
              className="btn btn-delete"
              onClick={() => deleteOrder(order.unique_id)}
            >
              Delete
            </button>
          </td>
          <td>
            <button onClick={() => openModal2(order)} className="btn btn-view">
              View
            </button>
            <OrderTrackingModal
              isOpen={isModalOpen2}
              onRequestClose={closeModal2}
              order_id={currentOrderId} // Pass the order ID
            />
          </td>
        </tr>
      ))}
  </tbody>
</table>
          </div>
        )}

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
            {currentProduct && currentProduct.prod_img && (
              // Check if prod_img is a string and parse it if necessary
              (() => {
                const images = Array.isArray(currentProduct.prod_img) 
                  ? currentProduct.prod_img 
                  : JSON.parse(currentProduct.prod_img || '[]');

                // Display the first image if available
                const firstImage = images.length > 0 ? images[0] : null;

                return firstImage ? (
                  <center>
                    <img 
                      src={`${ApiUrl}/uploads/${currentProduct.category.toLowerCase()}/${firstImage}`} 
                      alt={currentProduct.prod_name} 
                      className="product-image10" 
                    />
                  </center>
                ) : (
                  <div>No image available</div> // Fallback message if no image is available
                );
              })()
            )}
            {currentProduct && (
              <>
                <p className="info-row">
                  <span className="info-label">Product Name</span>
                  <span className="info-value product-namee">{currentProduct.prod_name}</span>
                </p>
                <p className="info-row">
                  <span className="info-label">Price</span>
                  <span className="info-value ">₹{currentProduct.prod_price}</span>
                </p>
                <p className="info-row">
                  <span className="info-label">Description</span>
                  <span className="info-value product-descriptionn">{currentProduct.prod_features}</span>
                </p>
              </>
            )}
          </div>
        </div>
        
        {selectedOrder && (
          <>
            <p className="info-row">
              <span className="info-label">Order ID</span>
              <span className="info-value">#{selectedOrder.unique_id}</span>
            </p>
            <p className="info-row">
              <span className="info-label">Ordered Date</span>
              <span className="info-value">{formatDate(selectedOrder.order_date)}</span>
            </p>
            {/* <p className="info-row">
              <span className="info-label">Payment Status</span>
              <span className={`info-value status ${selectedOrder.status ? selectedOrder.status.toLowerCase() : 'unknown'}`}>
                {selectedOrder.status}
              </span>
            </p> */}
            <p className="info-row">
              <span className="info-label">Total Amount</span>
              <span className="info-value">₹{selectedOrder.total_amount}</span>
            </p>
            <p className="info-row">
              <span className="info-label">Shipping Address</span>
              <span className="info-value">{selectedOrder.shipping_address}</span>
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
      style={{ marginLeft: '5px' }}
      className="add-to-cart"
      onClick={handleNextProduct}
      disabled={!hasProducts || currentProductIndex === productDetails.length - 1}
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

<div className="pagination-controls">
  <button
    onClick={handlePrevPage}
    disabled={currentPage === 1}
    className="pagination-button"
  >
    &lt;
  </button>
  {getPaginationPages().map((page, index) => (
    <button
      key={index}
      onClick={() => {
        if (page !== "...") handlePageChange(page);
      }}
      className={`pagination-button ${currentPage === page ? "active" : ""}`}
      disabled={page === "..."}
    >
      {page}
    </button>
  ))}
  <button
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
    className="pagination-button"
  >
    &gt;
  </button>
</div>
      </div>
    </div>
  );
};

export default Orders;
