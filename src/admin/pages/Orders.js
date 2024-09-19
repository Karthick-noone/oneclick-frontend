import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Orders.css'; 
import { ApiUrl } from "../../components/ApiUrl";
import Modal from 'react-modal'; // Install if needed using `npm install react-modal`

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [productDetails, setProductDetails] = useState(null); // To store fetched product details
  const [modalIsOpen, setModalIsOpen] = useState(false); // To open and close modal
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
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', err);
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
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

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

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
      const leftBoundary = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      const rightBoundary = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

      if (leftBoundary > 2) {
        pages.push(1, '...');
      } else {
        for (let i = 1; i < leftBoundary; i++) {
          pages.push(i);
        }
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pages.push(i);
      }

      if (rightBoundary < totalPages - 1) {
        pages.push('...', totalPages);
      } else {
        for (let i = rightBoundary + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2 className='orders-page-title'>Orders</h2>
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
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={order.unique_id}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{order.unique_id || 'N/A'}</td>
                    <td>{order.customerName ? capitalizeFirstLetter(order.customerName) : 'N/A'}</td>
                    <td>{formatDate(order.order_date)}</td>
                    <td>
                      <span  className={`  ${order.status ? order.status.toLowerCase() : 'unknown'}`}>
                        {order.status || 'Unknown'}
                      </span>
                    </td>
                    <td>{order.total_amount || 'N/A'}</td>
                    <td>
                      <button className="btn btn-view" onClick={() => openModal(order)}>View</button>
                      <button className="btn btn-edit">Edit</button>
                      <button className="btn btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
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
        <span className="info-value">{selectedOrder.unique_id}</span>
      </p>
      <p className="info-row">
        <span className="info-label">Customer Name</span>
        <span className="info-value">{capitalizeFirstLetter(selectedOrder.customerName)}</span>
      </p>
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
                if (page !== '...') handlePageChange(page);
              }} 
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              disabled={page === '...'}
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