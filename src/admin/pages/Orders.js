import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Orders.css'; // Ensure you create this CSS file
import { ApiUrl } from "../../components/ApiUrl";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchorders`); // Replace with your API URL
        setOrders(response.data); // Assuming your API returns a list of orders
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

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

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
                      <span className={`status ${order.status ? order.status.toLowerCase() : 'unknown'}`}>
                        {order.status || 'Unknown'}
                      </span>
                    </td>
                    <td>{order.total_amount || 'N/A'}</td>
                    <td>
                      <button className="btn btn-view">View</button>
                      <button className="btn btn-edit">Edit</button>
                      <button className="btn btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
