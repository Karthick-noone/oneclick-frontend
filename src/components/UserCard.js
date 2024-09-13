import React from 'react';
import './css/UserCard.css'; // Add styles for dropdown
import { FaAddressBook, FaCalendarCheck, FaUser, FaBox, FaHeart,  FaPowerOff } from 'react-icons/fa';

const UserCard = ({ onLogout }) => {
  return (
    <div className="dropdownnn-container">
      <div className="dropdownnn-content">
        <a href="/UserAddress"><FaAddressBook /> My Addresses</a>
        {/* <a href="/my-subscription"><FaCalendarCheck /> My Subscription</a> */}
        <a href="/MyAccount"><FaUser /> My Account</a>
        <a href="/MyOrders"><FaBox /> My Orders</a>
        {/* <a href="/my-wishlist"><FaHeart /> My Wishlist</a> */}
        <hr />
        <a href="#" onClick={onLogout}><FaPowerOff /> Logout</a>
      </div>
    </div>
  );
};

export default UserCard;
