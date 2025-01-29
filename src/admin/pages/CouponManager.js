import React, { useState, useEffect } from "react";
import axios from "axios";
import { ApiUrl } from "../../components/ApiUrl";
import Swal from "sweetalert2";
import "./css/StaffManagement.css";
const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [couponName, setCouponName] = useState("");
  const [couponValue, setCouponValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [minPurchaseLimit, setMinPurchaseLimit] = useState(""); // State for min purchase limit

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/fetchcoupons`);
      setCoupons(response.data);
      console.log("Fetched coupons successfully:", response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      Swal.fire("Error", "Failed to fetch coupons. Please try again.", "error");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {

        const upperCaseName = couponName.toUpperCase(); // Convert name to uppercase

      if (editingId) {
        await axios.put(`${ApiUrl}/api/editcoupons/${editingId}`, {
          name: upperCaseName,
          value: couponValue,
          minPurchaseLimit: minPurchaseLimit,

        });
        console.log("Updated coupon:", { id: editingId, name: upperCaseName, value: couponValue });
        Swal.fire("Success", "Coupon updated successfully.", "success");
        setEditingId(null);
      } else {
        await axios.post(`${ApiUrl}/api/addcoupons`, {
          name: upperCaseName,
          value: couponValue,
          minPurchaseLimit: minPurchaseLimit,

        });
        console.log("Added new coupon:", { name: upperCaseName, value: couponValue });
        Swal.fire("Success", "Coupon added successfully.", "success");
      }
      setCouponName("");
      setCouponValue("");
      setMinPurchaseLimit("");
      fetchCoupons();
    } catch (error) {
      console.error("Error saving coupon:", error);
      Swal.fire("Error", "Failed to save the coupon. Please try again.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone. Do you want to delete this coupon?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });
  
      if (result.isConfirmed) {
        await axios.delete(`${ApiUrl}/api/deletecoupons/${id}`);
        console.log(`Deleted coupon with ID: ${id}`);
        Swal.fire("Deleted!", "Coupon has been deleted.", "success");
        fetchCoupons();
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      Swal.fire("Error", "Failed to delete the coupon. Please try again.", "error");
    }
  };
  
  const handleEdit = (coupon) => {
    console.log("Editing coupon:", coupon);
    setCouponName(coupon.name);
    setCouponValue(coupon.value);
    setMinPurchaseLimit(coupon.min_purchase_limit);
    setEditingId(coupon.id);
    
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    
    // Allow only numeric values and prevent starting with '0'
    if (/^[1-9][0-9]*$|^$/.test(value)) {
      setCouponValue(value);
    }
  };
  

  return (
    <div style={styles.container}>
    <div style={styles.innerBox}>
      <h2 style={styles.title}>🎟️ Coupon Manager</h2>
      <form style={styles.form} onSubmit={handleAddOrUpdate}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Coupon Code:</label>
          <input
            type="text"
            value={couponName}
            onChange={(e) => setCouponName(e.target.value)}
            required
            style={styles.input}
            className="custom-input"

          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Coupon Value (₹):</label>
          <input
            type="number"
            value={couponValue}
            onChange={handleValueChange}
            required
            style={styles.input}
            className="custom-input"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Minimum Purchase (₹):</label>
          <input
            type="number"
            value={minPurchaseLimit}
            id="minPurchaseLimit"
            onChange={(e) => setMinPurchaseLimit(e.target.value)}
            required
            style={styles.input}
            className="custom-input"

          />
        </div>

       
        <button type="submit" style={styles.button}>
          {editingId ? "Update Coupon" : "Add Coupon"}
        </button>
      </form>
      <ul style={styles.couponList}>
        {coupons.map((coupon) => (
          <li key={coupon.id} style={styles.couponItem}>
            <span style={styles.couponText}>
              {coupon.name}: ₹{coupon.value} 
            </span>
            <span> Purchase above - ₹{coupon.min_purchase_limit}</span>
            <div>
              <button onClick={() => handleEdit(coupon)} style={styles.editButton}>
                ✏️ Edit
              </button>
              <button onClick={() => handleDelete(coupon.id)} style={styles.deleteButton}>
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
  
  );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#f9f9f9",
      },
      innerBox: {
        padding: "20px",
        maxWidth: "600px",
        width: "90%", // Ensures responsiveness
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginTop:'50px',
      },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  couponList: {
    listStyleType: "none",
    padding: 0,
  },
  couponItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  couponText: {
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    padding: "5px 10px",
    marginRight: "5px",
    backgroundColor: "#ffc107",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CouponManager;
