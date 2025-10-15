import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Reports.css';  // Import external CSS
import { ApiUrl } from '../../components/ApiUrl';
import { SearchIcon } from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();
  const [, setSalesReport] = useState([]);
  const [, setOrdersReport] = useState([]);
  const [customersReport, setCustomersReport] = useState([]);

  // Pagination States
  // const [currentPageOrders, setCurrentPageOrders] = useState(1);
  // const [currentPageSales, setCurrentPageSales] = useState(1);
  const [currentPageCustomers, setCurrentPageCustomers] = useState(1);

  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchQuery, setSearchQuery] = useState(""); // Search filter for customers
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchCustomerOrders = async (mobile) => {
    try {
      const res = await axios.get(`${ApiUrl}/customer-orders-by-mobile/${mobile}`);
      setSelectedCustomerOrders(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Fetching data functions
  const fetchSalesReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/salesreport`);
      setSalesReport(response.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  const fetchOrdersReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/ordersreport`);
      setOrdersReport(response.data);
    } catch (error) {
      console.error('Error fetching orders report:', error);
    }
  };

  const fetchCustomersReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/customersreport`);
      setCustomersReport(response.data);
    } catch (error) {
      console.error('Error fetching customers report:', error);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    } else {
      // Fetch all reports once the page loads
      fetchSalesReport();
      fetchOrdersReport();
      fetchCustomersReport();
    }
  }, [navigate]);

  // Pagination Logic for Customers Report
  const indexOfLastCustomerItem = currentPageCustomers * itemsPerPage;
  const indexOfFirstCustomerItem = indexOfLastCustomerItem - itemsPerPage;
  const currentCustomers = customersReport.slice(indexOfFirstCustomerItem, indexOfLastCustomerItem);

  // Filter customers based on search query
  const filteredCustomers = currentCustomers.filter(customer =>
    customer.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total pages for customers
  const totalCustomerPages = Math.ceil(customersReport.length / itemsPerPage);

  // Pagination handler
  const handlePageChange = (pageNumber, setCurrentPage) => {
    if (pageNumber === '...') return;
    setCurrentPage(pageNumber);
  };

  // Get Pagination Pages
  const getPaginationPages = (totalPages, currentPage, setCurrentPage) => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftBoundary = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      const rightBoundary = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

      if (leftBoundary > 2) {
        pages.push(1, '...');
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pages.push(i);
      }

      if (rightBoundary < totalPages - 1) {
        pages.push('...', totalPages);
      }
    }

    return pages.map((page, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(page, setCurrentPage)}
        className={currentPage === page ? 'active' : ''}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="reports-container">
      {/* Customers Report */}
      <section className="staff-main-content">
        <div className="orders-header">
          <h2 className="orders-page-title">Customer Report</h2>
        </div>

        {/* Search Box for Filtering Customers */}
          <div className="filters-section">
  <div className="product-search-wrapper">
    <span className="product-search-icon">

 <SearchIcon width={'18px'} className="search-icon-btn" />
    </span>
    <input
      type="text"
      placeholder="Search by Name"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="product-search-input"
    />
    {searchQuery && (
      <button
        className="product-clear-btn"
        onClick={() => setSearchQuery("")}
        aria-label="Clear search"
      >
        ×
      </button>
    )}
  </div>
</div>

        {/* Table with Data */}
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>User Name</th>
                <th>Total Orders</th>
                <th>Total Spent (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{customer.user_name}</td>
                    <td>
                      {customer.total_orders}{" "}
                      <button
                        className="view-orders-btn"
                        onClick={() => fetchCustomerOrders(customer.contact_number)}
                      >
                        View
                      </button>
                    </td>

                    <td>{customer.total_spent}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No customers found matching your search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="order-modal-overlay">
            <div className="order-modal-content">
              <h3>Order Details</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>X</button>
              {selectedCustomerOrders.length > 0 ? (
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>Order ID</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Order Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCustomerOrders.map((order, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>#{order.unique_id}</td>
                        <td>₹{order.total_amount}</td>
                        <td>{order.status}</td>
                        <td>{formatDate(order.order_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No orders found.</p>
              )}
            </div>
          </div>
        )}


        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPageCustomers - 1, setCurrentPageCustomers)}
            disabled={currentPageCustomers === 1}
          >
            &lt;
          </button>
          {getPaginationPages(totalCustomerPages, currentPageCustomers, setCurrentPageCustomers)}
          <button
            onClick={() => handlePageChange(currentPageCustomers + 1, setCurrentPageCustomers)}
            disabled={currentPageCustomers === totalCustomerPages}
          >
            &gt;
          </button>
        </div>
      </section>


    </div>


  );
};

export default Reports;
