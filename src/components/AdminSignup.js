import React, { useState } from "react";
import Swal from "sweetalert2";
import { ApiUrl } from "./ApiUrl";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize navigate function

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${ApiUrl}/adminsignup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "You have successfully registered!",
          confirmButtonText: "OK",
        }).then(() => {
          navigate('/adminlogin'); // Use navigate for redirection
        });
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "Something went wrong!",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Failed to connect to the server!",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign Up</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.username && <p style={styles.error}>{errors.username}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.password && <p style={styles.error}>{errors.password}</p>}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.confirmPassword && (
          <p style={styles.error}>{errors.confirmPassword}</p>
        )}
        <button type="submit" style={styles.button}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    margin: "20px 0",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
    margin: "5px 0",
  },
};

export default AdminSignup;