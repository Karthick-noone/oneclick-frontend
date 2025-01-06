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

  // Pagination States for Orders, Sales, and Customers Reports
  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const [currentPageSales, setCurrentPageSales] = useState(1);
  const [currentPageCustomers, setCurrentPageCustomers] = useState(1);

  const [itemsPerPage] = useState(10); // Number of items per page

  const fetchSalesReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/salesreport`);
      setSalesReport(response.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, []);

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

  // Pagination Logic for Orders Report
  const indexOfLastOrderItem = currentPageOrders * itemsPerPage;
  const indexOfFirstOrderItem = indexOfLastOrderItem - itemsPerPage;
  const currentOrders = ordersReport.slice(indexOfFirstOrderItem, indexOfLastOrderItem);

  // Pagination Logic for Sales Report
  const indexOfLastSalesItem = currentPageSales * itemsPerPage;
  const indexOfFirstSalesItem = indexOfLastSalesItem - itemsPerPage;
  const currentSales = salesReport.slice(indexOfFirstSalesItem, indexOfLastSalesItem);

  // Pagination Logic for Customers Report
  const indexOfLastCustomerItem = currentPageCustomers * itemsPerPage;
  const indexOfFirstCustomerItem = indexOfLastCustomerItem - itemsPerPage;
  const currentCustomers = customersReport.slice(indexOfFirstCustomerItem, indexOfLastCustomerItem);

  // Calculate total pages
  const totalOrderPages = Math.ceil(ordersReport.length / itemsPerPage);
  const totalSalesPages = Math.ceil(salesReport.length / itemsPerPage);
  const totalCustomerPages = Math.ceil(customersReport.length / itemsPerPage);

  // Get Pagination Pages
  const getPaginationPages = (totalPages, currentPage, setCurrentPage) => {
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

  // Pagination handlers
  const handlePageChange = (pageNumber, setCurrentPage) => {
    if (pageNumber === '...') return;
    setCurrentPage(pageNumber);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="reports-container">
      <section className="staff-main-content">
      <div className="orders-header">
        <h2 className="orders-page-title">Sales Report</h2>
      </div>        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Total Sales (₹)</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.length > 0 ? (
                currentSales.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product_name}</td>
                    <td>{item.category}</td>
                    <td>{item.sales}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No sales data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls for Sales Report */}
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPageSales - 1, setCurrentPageSales)}
            disabled={currentPageSales === 1}
          >
            &lt;
          </button>
          {getPaginationPages(totalSalesPages, currentPageSales, setCurrentPageSales)}
          <button
            onClick={() => handlePageChange(currentPageSales + 1, setCurrentPageSales)}
            disabled={currentPageSales === totalSalesPages}
          >
            &gt;
          </button>
        </div>
      </section>

      {/* Orders Report */}
      <section className="staff-main-content">
      <div className="orders-header">
        <h2 className="orders-page-title">Order Report</h2>
      </div>        
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Order ID</th>
                <th>User Name</th>
                <th>Total Amount (₹)</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <tr key={index}>
                  <td>{indexOfFirstOrderItem + index + 1}</td>
                  <td>#{order.unique_id}</td>
                  <td>{capitalizeFirstLetter(order.user_name)}</td>
                  <td>{order.total_amount}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls for Orders Report */}
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPageOrders - 1, setCurrentPageOrders)}
            disabled={currentPageOrders === 1}
          >
            &lt;
          </button>
          {getPaginationPages(totalOrderPages, currentPageOrders, setCurrentPageOrders)}
          <button
            onClick={() => handlePageChange(currentPageOrders + 1, setCurrentPageOrders)}
            disabled={currentPageOrders === totalOrderPages}
          >
            &gt;
          </button>
        </div>
      </section>

      {/* Customers Report */}
      <section className="staff-main-content">
      <div className="orders-header">
        <h2 className="orders-page-title">Customer Report</h2>
      </div>          <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Total Orders</th>
                <th>Total Spent (₹)</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((customer, index) => (
                <tr key={index}>
                  <td>{capitalizeFirstLetter(customer.user_name)}</td>
                  <td>{customer.total_orders}</td>
                  <td>{customer.total_spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls for Customers Report */}
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
