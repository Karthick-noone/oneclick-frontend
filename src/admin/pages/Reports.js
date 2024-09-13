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

  // Pagination States for Orders Report
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  // Fetch Sales Data
  const fetchSalesReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/salesreport`);
      setSalesReport(response.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  // Fetch Orders Data
  const fetchOrdersReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/ordersreport`);
      setOrdersReport(response.data);
    } catch (error) {
      console.error('Error fetching orders report:', error);
    }
  };

  // Fetch Customers Data
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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = ordersReport.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(ordersReport.length / itemsPerPage);

  // Get Pagination Pages
  const getPaginationPages = () => {
    const pages = [];
    const maxPagesToShow = 5; // Total number of page numbers to show at a time

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

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    if (pageNumber === '...') return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="reports-container">
      <h1 className="page-title">Admin Reports</h1>

      {/* Sales Report */}
      <section className="report-section">
        <h2>Sales Report</h2>
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Total Sales (₹)</th>
              </tr>
            </thead>
            <tbody>
              {salesReport.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>{item.category}</td>
                  <td>{item.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Orders Report */}
      <section className="report-section">
        <h2>Orders Report</h2>
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Total Amount (₹)</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <tr key={index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{order.unique_id}</td>
                  <td>{order.user_id}</td>
                  <td>{order.total_amount}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; 
          </button>
          {getPaginationPages().map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
             &gt;
          </button>
        </div>
      </section>

      {/* Customers Report */}
      <section className="report-section">
        <h2>Customers Report</h2>
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Total Orders</th>
                <th>Total Spent (₹)</th>
              </tr>
            </thead>
            <tbody>
              {customersReport.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.user_id}</td>
                  <td>{customer.total_orders}</td>
                  <td>{customer.total_spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;