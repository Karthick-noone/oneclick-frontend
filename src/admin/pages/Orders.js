import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Orders.css'; // Ensure you create this CSS file
import { ApiUrl } from "../../components/ApiUrl";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);


  // Function to format the date
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

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.unique_id}>
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
      </div>
    </div>
  );
};

export default Orders;