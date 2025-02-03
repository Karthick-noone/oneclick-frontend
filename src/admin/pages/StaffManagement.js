import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/StaffManagement.css";
import { ApiUrl } from "../../components/ApiUrl";
import Swal from "sweetalert2";
import {  FaEye, FaEyeSlash } from "react-icons/fa";

const StaffManagementPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({
    staffname: "",
    username: "",
    password: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Pagination logic
  const indexOfLastStaff = currentPage * rowsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - rowsPerPage;
  const currentStaff = staffList.slice(indexOfFirstStaff, indexOfLastStaff);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

    // Pagination controls (page buttons)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(staffList.length / rowsPerPage); i++) {
      pageNumbers.push(i);
    }

  const validateForm = () => {
    const errors = {};
    const usernameRegex = /^[a-zA-Z]+$/;
    // const mobileRegex = /^[6-9][0-9]{9}$/;

    if (!formData.username || !usernameRegex.test(formData.username)) {
      errors.username = "Username should only contain alphabets.";
    }
    if (!formData.staffname || !usernameRegex.test(formData.staffname)) {
      errors.staffname = "Staffname should only contain alphabets.";
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

   

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

// Fetch staff function defined outside useEffect
const fetchStaff = async () => {
  try {
    const response = await axios.get(`${ApiUrl}/api/fetchstaff`);
    const sortedData = response.data.sort((a, b) => b.id - a.id); // Sort in descending order by id
    setStaffList(sortedData);
  } catch (error) {
    console.error("Error fetching staff data:", error);
    Swal.fire("Error!", "Failed to fetch staff data.", "error");
  }
};

// Fetch staff data on component mount
useEffect(() => {
  fetchStaff();
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  // Check for existing username in the staff list
  const isUsernameTaken = staffList.some(
    (staff) => staff.username === formData.username && staff.id !== formData.id
  );

  if (isUsernameTaken) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      username: "This username is already taken. Please choose a different one."
    }));
    return;
  }

  // Proceed with form validation
  if (!validateForm()) return;

  if (editingIndex !== null) {
    const updatedList = [...staffList];
    updatedList[editingIndex] = formData;
    setStaffList(updatedList);
    setEditingIndex(null);

    try {
      await axios.put(`${ApiUrl}/api/updatestaff/${formData.id}`, formData);
      Swal.fire("Updated!", "Staff details updated successfully.", "success");
      await fetchStaff(); // Refresh staff list
    } catch (error) {
      console.error("Error updating staff:", error);
      Swal.fire("Error!", "Failed to update staff.", "error");
    }
  } else {
    try {
      const response = await axios.post(`${ApiUrl}/api/addstaff`, formData);
      setStaffList([...staffList, response.data]);
      Swal.fire("Success!", "New staff added successfully.", "success");
      await fetchStaff(); // Refresh staff list
    } catch (error) {
      console.error("Error adding staff:", error);
      Swal.fire("Error!", "Failed to add staff.", "error");
    }
  }

  setFormData({ staffname: "", username: "", password: "", status: "active" });
};

  const handleDelete = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const idToDelete = staffList[index].id;
        try {
          await axios.delete(`${ApiUrl}/api/deletestaff/${idToDelete}`);
          const updatedList = staffList.filter((_, i) => i !== index);
          setStaffList(updatedList);
          Swal.fire("Deleted!", "Staff has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting staff:", error);
          Swal.fire("Error!", "Failed to delete staff.", "error");
        }
      }
    });
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(staffList[index]);
  };



  return (
    <div className="staff-management-container">
      <main className="staff-main-content">
      <div className="orders-header">
        <h2 className="orders-page-title">Staff Login</h2>
      </div>
        <form className="staff-form" onSubmit={handleSubmit}>
          <div className="staff-form-group">
            <label>Staff Name</label>
            <input
              type="text"
              value={formData.staffname}
              required
              onChange={(e) =>
                setFormData({ ...formData, staffname: e.target.value })
              }
              className={errors.staffname ? "staff-error-input" : "staff-input"}
            />
            {errors.staffname && (
              <small className="staff-error-text">{errors.staffname}</small>
            )}
          </div>
          <div className="staff-form-group">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              required
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className={errors.username ? "staff-error-input" : "staff-input"}
            />
            {errors.username && (
              <small className="staff-error-text">{errors.username}</small>
            )}
          </div>
          <div className="staff-form-group">
  <label>Password</label>
  <div className="password-input-container">
    <input
      required
      type="text" // Always "text" since we'll use CSS to control visibility
      value={formData.password}
      onChange={(e) =>
        setFormData({ ...formData, password: e.target.value })
      }
      className={`staff-input ${showPassword ? "" : "password-hidden"}`}
    />
    <span onClick={togglePasswordVisibility} className="eye-icon">
      {showPassword ? <FaEye /> : <FaEyeSlash />}
    </span>
  </div>
  {errors.password && (
    <small className="staff-error-text">{errors.password}</small>
  )}
</div>



          <div className="staff-form-group">
            <label>Active Status</label>
            <select
              value={formData.status}
              className="staff-input"
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button type="submit" className="staff-btn-submit">
            {editingIndex !== null ? "Update" : "Add"}
          </button>
        </form>

        <table className="staff-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Staff Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentStaff.map((staff, index) => (
              <tr key={index}>
                <td>{indexOfFirstStaff + index + 1}</td>
                <td>{staff.staffname}</td>
                <td>{staff.username}</td>
                <td>{staff.password}</td>
                <td>{staff.status}</td>
                <td>
                  <button
                    onClick={() => handleEdit(index)}
                    className="staff-btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="staff-btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`page-btn ${currentPage === number ? "active" : ""}`}
            >
              {number}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StaffManagementPage;
