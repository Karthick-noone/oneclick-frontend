import React, { useState } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../components/ApiUrl';
import './css/CouponEditPopup.css';
import { FaTimes } from "react-icons/fa"; // Import icons
import Swal from 'sweetalert2'; // Ensure to import SweetAlert for notifications
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CouponEditPopup = ({ isOpen, onClose, productId, prodPrice }) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  console.log("prodPrice", prodPrice);
  console.log("productId", productId);

  const handleAddCoupon = async () => {
    // Convert coupon code to uppercase
    // const upperCouponCode = couponCode.toUpperCase();

    // Validation checks
    if (!couponCode || !expiryDate || !couponValue) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Input",
        text: "All fields are required.",
      });
      return;
    }

    if (couponValue >= prodPrice) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Input",
        text: `Coupon value must be less than the price ${prodPrice}`,
      });
      return;
    }
    if (Number(couponValue) === 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Input",
        text: "Coupon value should not be 0",
      });
      return;
    }



    if (!couponCode && !expiryDate) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Input",
        text: "Please enter a coupon code (e.g., OFF899).",
      });
      return;
    }


    // if (upperCouponCode.trim() === "" || !upperCouponCode.match(/[a-zA-Z]/) || !upperCouponCode.match(/\d/)) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Invalid Input",
    //     text: "Coupon code must contain at least one letter and one digit.",
    //   });
    //   return;
    // }

    try {
      const coupon = {
        product_id: productId,
        coupon_code: couponCode,
        discount_value: Number(couponValue), // Convert string to number
        expiry_date: expiryDate,
      };
      console.log("Coupon", coupon)

      const response = await axios.post(`${ApiUrl}/multiplecoupons`, {
        coupons: [coupon],
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Coupon added successfully!',
        }).then(() => { window.location.reload(); });
        onClose();
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'Failed to add coupon. Please try again.',
      });
    }
  };

  if (!isOpen) return null;

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const handleCouponCodeChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;
    if (regex.test(value) || value === "") {
      setCouponCode(value);
    }
  };

  const handleCouponValueChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*$/; // Only allow numeric characters
    if (regex.test(value) || value === "") {
      setCouponValue(value);
    }
  };


  return (
    <div className="pop-overlay">
      <div className="pop-content">
        <h2>Add Coupon Code</h2>
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={handleCouponCodeChange}
          className='coupon-input'
        />
        <input
          type="text"
          placeholder="Coupon Price (e.g., Discount Amount)"
          value={couponValue}
          onChange={handleCouponValueChange} // New handler for Coupon Value
          className='coupon-input'

        />
        <input
          type="date"
          placeholder="Expiry Date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          min={minDate}
          max={maxDateStr}
          className='coupon-input'

        />
        <button className='coupon-btn' onClick={handleAddCoupon}>Add Coupon</button>
        <button className='close-button7' onClick={onClose}>
          <FaTimes color="black" size={20} />
        </button>
      </div>
    </div>
  );
};

export default CouponEditPopup;
