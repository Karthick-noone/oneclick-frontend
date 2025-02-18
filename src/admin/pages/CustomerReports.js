import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Reports.css';  // Import external CSS
import { ApiUrl } from '../../components/ApiUrl';

const Reports = () => {
  const navigate = useNavigate();
  const [salesReport, setSalesReport] = useState([]);
  const [ordersReport, setOrdersReport] = useState([]);
  const [customersReport, setCustomersReport] = useState([]);
  
  // Pagination States
  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const [currentPageSales, setCurrentPageSales] = useState(1);
  const [currentPageCustomers, setCurrentPageCustomers] = useState(1);

  const [itemsPerPage] = useState(10); // Number of items per page
  const [searchQuery, setSearchQuery] = useState(""); // Search filter for customers

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
        <div className="filters">
          <input
            type="text"
            placeholder="Search by User Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table with Data */}
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>S.No</th>
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
                    <td>{customer.total_orders}</td>
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
