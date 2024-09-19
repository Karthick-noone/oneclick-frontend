import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from "./ApiUrl";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import logo from './img/logo3.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic frontend validation
    if (formData.username === "" || formData.password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are required!",
      });
      return;
    }
  
    // if (formData.password.length < 5) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Password too short",
    //     text: "Password should be at least 5 characters long.",
    //   });
    //   return;
    // }
  
    try {
      const response = await fetch(`${ApiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const { username, email, user_id } = result;
  
        // Store user details in localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('user_id', user_id); // Store user_id in localStorage
  
        // Success feedback
        Swal.fire({
          icon: "success",
          title: "Login successful",
          text: "You have logged in successfully!",
        }).then(() => {
          // Navigate to home page and pass user_id to address page
          navigate('/', { state: { user_id } });
        });
      } else {
        // Error feedback
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: result.message || "Invalid credentials!",
        });
      }
    } catch (error) {
      // Network or server error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle password visibility
  };

  return (
    <div style={styles.container}>
      <center> 
        <a href="/"> 
          <img src={logo} width={'200px'} alt="Logo" />
        </a>
      </center>

      <h2 style={styles.title}>User Login</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <div style={styles.passwordContainer}>
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.passwordInput}
            required
          />
          <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      <div style={styles.linksContainer}>
        <a href="/ForgotPassword" style={styles.link}>
          Forgot Password?
        </a>
        <a href="/signup" style={styles.link}>
          Don't have an account? Sign Up
        </a>
      </div>
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
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    paddingRight: "40px", // Add space for the eye icon
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
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
  linksContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  link: {
    fontSize: "14px",
    color: "#007BFF",
    textDecoration: "none",
  },
};

export default LoginPage;