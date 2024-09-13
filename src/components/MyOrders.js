import React, { useEffect, useState } from "react";
import axios from "axios";
import './css/MyOrders.css'; // Add CSS for styles
import Header2 from "./Header2";
import Footer from "./footer";
import { ApiUrl } from "./ApiUrl";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

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
                <p>Date: {new Date(order.order_date).toLocaleDateString()}</p>
                <p>Total: ₹{order.total_amount}</p>
                <button className="view-details-button">View Details</button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;