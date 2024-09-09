import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Customers.css'; // Import external CSS
import { ApiUrl } from '../../components/ApiUrl';

const Customers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  // Fetch Users Data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    } else {
      fetchUsers();
    }
  }, [navigate]);

  return (
    <div className="customers-container">
      <h1 className="page-title">Customer Details</h1>

      {/* Customers Table */}
      <section className="customers-section">
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Address Name</th>
                <th>Street</th>
                <th>City</th>
                <th>State</th>
                <th>Postal Code</th>
                <th>Country</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.user_id}>
                  <td>{index + 1}</td>
                  <td>{user.user_id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.address_name || 'N/A'}</td>
                  <td>{user.street || 'N/A'}</td>
                  <td>{user.city || 'N/A'}</td>
                  <td>{user.state || 'N/A'}</td>
                  <td>{user.postal_code || 'N/A'}</td>
                  <td>{user.country || 'N/A'}</td>
                  <td>{user.phone || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Customers;