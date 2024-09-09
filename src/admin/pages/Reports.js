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

  // Fetch Sales Data
  const fetchSalesReport = async () => {
    try {
      const response = await axios.get(`${ ApiUrl }/api/salesreport`);
      setSalesReport(response.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  // Fetch Orders Data
  const fetchOrdersReport = async () => {
    try {
      const response = await axios.get(`${ ApiUrl }/api/ordersreport`);
      setOrdersReport(response.data);
    } catch (error) {
      console.error('Error fetching orders report:', error);
    }
  };

  // Fetch Customers Data
  const fetchCustomersReport = async () => {
    try {
      const response = await axios.get(`${ ApiUrl }/api/customersreport`);
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
                <th>Order ID</th>
                <th>User ID</th>
                <th>Total Amount (₹)</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersReport.map((order, index) => (
                <tr key={index}>
                  <td>{order.order_id}</td>
                  <td>{order.user_id}</td>
                  <td>{order.total_amount}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
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