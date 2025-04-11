import React, { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ApiUrl } from "./ApiUrl";
import "./css/LoginPage.css";
import logo from "./img/logo3.png";
import { FaSignOutAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import confetti from "canvas-confetti"; // Import the confetti package
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState("Admin"); // Added role state
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleRoleChange = (e) => {
    setRole(e.target.value); // Update role based on radio button selection
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (formData.username === "" || formData.password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are required!",
        customClass: {
          popup: "shake-popup", // Add a custom shake animation class
        },
        willOpen: () => {
          const popupElement = Swal.getPopup();
          Object.assign(popupElement.style, swalErrorStyles.popup); // Apply custom styles
          const titleElement = popupElement.querySelector(".swal2-title");
          if (titleElement) {
            Object.assign(titleElement.style, swalErrorStyles.title);
          }
          const textElement = popupElement.querySelector(".swal2-content");
          if (textElement) {
            Object.assign(textElement.style, swalErrorStyles.text);
          }
        },
      });
      return;
    }

    try {
      const loginUrl =
        role === "Admin" ? `${ApiUrl}/adminlogin` : `${ApiUrl}/stafflogin`;
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", role); // Store the role (Admin/Staff)
        // localStorage.setItem("staffname", username);  // Store the role (Admin/Staff)
        if (role === "Staff" && result.staff) {
          // Store staff's name in localStorage
          localStorage.setItem("staffname", result.staff.staffname);
        }

        Swal.fire({
          icon: "success",
          title: `🎉 ${role} Login successful`,
          text: "You have logged in successfully!",
          timer:4000,
          customClass: {
            popup: "my-popup", // Custom class for success popup
          },
          willOpen: () => {
            const popupElement = Swal.getPopup();
            Object.assign(popupElement.style, swalStyles.popup); // Apply success styles
            const titleElement = popupElement.querySelector(".swal2-title");
            if (titleElement) {
              Object.assign(titleElement.style, swalStyles.title);
            }
            const textElement = popupElement.querySelector(".swal2-content");
            if (textElement) {
              Object.assign(textElement.style, swalStyles.text);
            }

            // Fire confetti burst for success
            confetti({
              particleCount: 150,
              spread: 100,
              startVelocity: 30,
              zIndex: 9999, // Ensure confetti is on top
              origin: { y: 0.5 },
            });
          },
        }).then(() => {
          if (role === "Staff" && result.staff) {
            // Store staff's name in localStorage
            localStorage.setItem("staffname", result.staff.staffname);
          navigate("/Admin/Computers"); // Redirect to admin dashboard

          }
          else{
            navigate("/Admin/Dashboard")
          }

        });
      } else {
        // Handle login failures
        Swal.fire({
          icon: "error",
          title: `${role} Login failed 👎`,
          text: result.message || "Invalid credentials!",
          customClass: {
            popup: "shake-popup", // Add a custom shake animation class
          },
          willOpen: () => {
            const popupElement = Swal.getPopup();
            Object.assign(popupElement.style, swalErrorStyles.popup); // Apply error styles
            const titleElement = popupElement.querySelector(".swal2-title");
            if (titleElement) {
              Object.assign(titleElement.style, swalErrorStyles.title);
            }
            const textElement = popupElement.querySelector(".swal2-content");
            if (textElement) {
              Object.assign(textElement.style, swalErrorStyles.text);
            }
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
        customClass: {
          popup: "shake-popup", // Add a custom shake animation class
        },
        willOpen: () => {
          const popupElement = Swal.getPopup();
          Object.assign(popupElement.style, swalErrorStyles.popup); // Apply error styles
          const titleElement = popupElement.querySelector(".swal2-title");
          if (titleElement) {
            Object.assign(titleElement.style, swalErrorStyles.title);
          }
          const textElement = popupElement.querySelector(".swal2-content");
          if (textElement) {
            Object.assign(textElement.style, swalErrorStyles.text);
          }
        },
      });
    }
  };

  // Add styles for shake animation and error popup
  const swalErrorStyles = {
    popup: {
      background: "rgba(255, 255, 255, 0.9)",
      border: "none",
      boxShadow: "0 0 15px rgba(255, 0, 0, 0.9)", // Red shadow for error
      width: "500px",
    },
    title: {
      color: "#FF0000", // Red title color
      fontWeight: "bold",
    },
    text: {
      color: "#333", // Darker text for message
    },
  };

  const swalStyles = {
    popup: {
      background: "rgba(255, 255, 255, 0.9)",
      border: "none",
      boxShadow: "0 0 15px rgba(76, 175, 80, 0.7)", // Green shadow with some transparency
      width: "500px",
    },
    title: {
      color: "#4CAF50", // Green color for title
      fontWeight: "bold",
    },
    text: {
      color: "#333", // Darker text color for content
    },
  };

  // Fetch the background image from the server
  useEffect(() => {
    console.log('Fetching background image from:', `${ApiUrl}/fetchloginbg`); // Log the API URL being used

    axios.get(`${ApiUrl}/fetchloginbg`)
      .then((response) => {
        console.log('Response data:', response.data); // Log the data received from the server
        
        if (response.data.length > 0) {
          console.log('Background image found:', response.data[0].image); // Log the image being used
          setBackgroundImage(response.data[0].image); // Only set the filename, base path is handled in style
        } else {
          console.log('No background image found, using gradient instead');
          setBackgroundImage(''); // No image, fallback to gradient
        }
      })
      .catch((error) => {
        console.error('Error fetching background image:', error); // Log any errors that occur
      });
  }, []);

  return (
    <div className="login-page">
       {backgroundImage && (
              <div
                style={{
                  ...styles.blurredBackground,
                  backgroundImage: `url(${ApiUrl}/uploads/singleadpage/${backgroundImage})`,
                }}
              />
            )}
      <div className="login-container">
    
        <div className="login-header">
        <Link to="/">
        {" "}
            <img src={logo} width={"200px"} loading="lazy" alt="" />
            </Link>
          <Link to="/">
            <button className="close-btnn" >
              <FaSignOutAlt />
            </button>
          </Link>
          <h1>{role} Login</h1>
          <p>Enter your credentials to access your account</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="radio-group">
            <div className="radio-wrapper">
              {/* <label> */}
              <input
                type="radio"
                name="role"
                value="Admin"
                checked={role === "Admin"}
                onChange={handleRoleChange}
                className="radio-input"
              />{" "}
              <label htmlFor="admin" className="radio-label">
                Admin
              </label>
              {/* </label> */}
              {/* <label> */}
              <input
                type="radio"
                name="role"
                value="Staff"
                checked={role === "Staff"}
                onChange={handleRoleChange}
                className="radio-input"
              />{" "}
              <label htmlFor="admin" className="radio-label">
                Staff
              </label>
              {/* </label> */}
            </div>
          </div>
          <div className="form-group">
            <label
              style={{ color: "white" }}
              className="admin-label"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="staff-input"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label
              style={{ color: "white" }}
              className="admin-label"
              htmlFor="password"
            >
              Password
            </label>
            <div className="password-wrapper">
              <input
                // type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className={`staff-input ${
                  showPassword ? "" : "password-hidden"
                }`}
              />
              <span
                style={{ color: "white" }}
                onClick={togglePasswordVisibility}
                className="eye-icon"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          <button type="submit" className="button">
            Login
          </button>
        </form>
      </div>
      
    </div>
  );
};

const styles = {
  background: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(to bottom right, #add8e6, #ffffff)',
    backgroundSize: 'cover',
    position: 'relative',
    overflow: 'hidden',
  },
  blurredBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(4px)',
    zIndex: 1,
  }
};


export default LoginPage;
