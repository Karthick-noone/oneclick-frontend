import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ApiUrl } from "../../components/ApiUrl";
import { FaTimes } from "react-icons/fa"; // Import icons

const EditCouponModal = ({
  isOpen,
  onClose,
  coupon,
  onCouponUpdated,
  productPrice,
  productId,
}) => {
  const [expiryDate, setExpiryDate] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponValue, setCouponValue] = useState("");

  console.log("productPricehjghjghkhgk", productPrice);
  console.log("productId", productId);
useEffect(() => {
  if (coupon) {
    const dateObj = new Date(coupon.expiry_date);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`; // Local time without timezone shift

    setExpiryDate(formattedDate);
    setCouponCode(coupon.coupon_code);
    setCouponValue(coupon.discount_value);
  }
}, [coupon]);

  const handleUpdateCoupon = async () => {
    try {
      // Convert coupon code to uppercase
      // const upperCouponCode = couponCode.toUpperCase();

      // Validate coupon code and extract numeric part
      // const couponValueMatch = upperCouponCode.match(/\d+/); // Use couponCode from state (in uppercase)
      // const couponValue = couponValueMatch ? Number(couponValueMatch[0]) : 0; // Get the number or default to 0 if not found

      // Check if either coupon code or expiry date is provided
      if (!couponCode || !expiryDate || !couponValue) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Input",
          text: "All fields are required.",
        });
        return;
      }



      // Check if coupon code is provided and not just spaces
      if (couponCode && !couponCode.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Input",
          text: "Coupon code cannot be just spaces.",
        });
        return;
      }

      // Ensure the extracted coupon value is less than the product price
      if (couponValue >= productPrice) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Input",
          text: `Coupon discount must be less than the product price. Product price is ${productPrice}`,
        });
        return;
      }

      // Check if the coupon code contains at least one letter and one digit
      // const hasDigit = /\d/.test(couponCode);
      // const hasLetter = /[a-zA-Z]/.test(couponCode);

      // if (!hasDigit || !hasLetter) {
      //   Swal.fire({
      //     icon: "warning",
      //     title: "Invalid Input",
      //     text: "Coupon code must contain at least one letter and one digit. (e.g., OFF899)",
      //   });
      //   return;
      // }

      // Prepare the updated coupon data
      const updatedCouponData = {
        coupon_code: couponCode, // Store coupon code in uppercase
        couponValue: couponValue, // Store coupon code in uppercase
        expiry_date: expiryDate, // Use updated expiryDate from state
      };
      console.log("updatedCouponData", updatedCouponData);

      // Update coupon details in the database
      const response = await axios.put(
        `${ApiUrl}/edit/coupons/${coupon.coupon_id}`,
        updatedCouponData
      );

      // Handle success response
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Coupon updated successfully!",
        }).then(() => {
          window.location.reload();
        });
        // onCouponUpdated();
        onClose();
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to update coupon. Please try again.",
      });
    }
  };

  // Get today's date and format it as YYYY-MM-DD
  const today = new Date();
  const minDate = today.toISOString().split("T")[0]; // Format to YYYY-MM-DD

  // Calculate max date (30 days from today)
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD

  const handleCouponCodeChange = (e) => {
    const value = e.target.value;

    // Allow only alphanumeric characters (letters and numbers)
    const regex = /^[a-zA-Z0-9]*$/;
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

  if (!isOpen) return null;

  return (
    <div className="pop-overlay">
      <div className="pop-content">
        <h4>
          Edit Coupon for {coupon.coupon_code.split(" ").slice(0, 3).join(" ")}
        </h4>
        <div style={{ marginTop: "10px" }}>
          <label>Coupon Code</label>
          <input
            type="text"
            value={couponCode}
            onChange={handleCouponCodeChange} // Use the new change handler
            placeholder="Enter coupon code"
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Coupon Value</label>
          <input
            type="text"
            placeholder="Coupon Value (e.g., Discount)"
            value={couponValue}
            onChange={handleCouponValueChange} // New handler for Coupon Value
          />
        </div>

        <div>
          <label>Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            min={minDate}
            max={maxDateStr}
          />
        </div>
        <button className="coupon-btn" onClick={handleUpdateCoupon}>
          Update
        </button>
        <button className="close-button7" onClick={onClose}>
          {" "}
          <FaTimes color="black" size={20} />
        </button>
      </div>
    </div>
  );
};

export default EditCouponModal;
