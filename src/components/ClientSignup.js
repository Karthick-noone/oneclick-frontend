import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ApiUrl } from "./ApiUrl";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { FaEye, FaEyeSlash, FaSignOutAlt } from "react-icons/fa"; // Import eye icons
import logo from "./img/logo3.png";
// import { Zoom } from "react-toastify";
import confetti from "canvas-confetti"; // Ensure you import confetti
import axios from "axios";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "", // Add contactNumber to the state
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize navigate function
  const [backgroundImage, setBackgroundImage] = useState("");

  // Fetch the background image from the server
  useEffect(() => {
    console.log("Fetching background image from:", `${ApiUrl}/fetchloginbg`); // Log the API URL being used

    axios
      .get(`${ApiUrl}/fetchloginbg`)
      .then((response) => {
        console.log("Response data:", response.data); // Log the data received from the server

        if (response.data.length > 0) {
          console.log("Background image found:", response.data[0].image); // Log the image being used
          setBackgroundImage(response.data[0].image); // Only set the filename, base path is handled in style
        } else {
          console.log("No background image found, using gradient instead");
          setBackgroundImage(""); // No image, fallback to gradient
        }
      })
      .catch((error) => {
        console.error("Error fetching background image:", error); // Log any errors that occur
      });
  }, []);

  const validateForm = () => {
    const { username, email, password, confirmPassword, contactNumber } =
      formData;
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    } else if (!email.endsWith(".com")) {
      newErrors.email = "Email must end with .com";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 5) {
      // Check if password is at least 5 characters long
      newErrors.password = "Password should be at least 5 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!contactNumber) {
      newErrors.contactNumber = "Contact number is required"; // Validate contact number
    } else if (!/^[6-9]\d{9}$/.test(contactNumber)) {
      // Validate the contact number format
      newErrors.contactNumber =
        "Contact number must be a valid 10-digit number starting with 6-9";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for the username field
    if (name === "username") {
      // Allow only alphabetic characters and spaces
      if (/^[A-Za-z\s]*$/.test(value) || value === "") {
        setFormData({ ...formData, [name]: value });
      }
    }

    // Validation for contact number
    if (name === "contactNumber") {
      // Check if the value is empty or if it starts with 6-9 and is exactly 10 digits long
      if (value === "" || /^[6-9]\d{0,9}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    }
    // Set email and password values
    if (name === "email" || name === "password" || name === "confirmPassword") {
      setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${ApiUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Fire confetti on success
        confetti({
          particleCount: 150,
          spread: 100,
          startVelocity: 30,
          zIndex: 9999, // Ensure confetti is on top
          origin: { y: 0.5 },
        });

        Swal.fire({
          icon: "success",
          title: "🎉 Registration Successful!",
          text: "You have successfully registered! Welcome aboard!",
          customClass: {
            popup: "my-popup",
          },
          willOpen: () => {
            const popupElement = Swal.getPopup();
            Object.assign(popupElement.style, swalStyles.popup);

            const titleElement = popupElement.querySelector(".swal2-title");
            if (titleElement) {
              Object.assign(titleElement.style, swalStyles.title);
            }

            const textElement = popupElement.querySelector(".swal2-content");
            if (textElement) {
              Object.assign(textElement.style, swalStyles.text);
            }
          },
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login"); // Redirect to login page
        });

        // Reset form data after success
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          contactNumber: "",
        });
        setErrors({});
      } else {
        const data = await response.json();
        let errorMessage = "Something went wrong!";

        // Check if the error is related to the email, username, or contact number
        if (data.error === "Email already exists") {
          errorMessage =
            "The email address is already in use. Please use a different email.";
        } else if (data.error === "Username already exists") {
          errorMessage =
            "The username is already taken. Please choose a different username.";
        } else if (data.error === "Contact number already exists") {
          errorMessage =
            "The contact number is already in use. Please use a different number.";
        }

        // Trigger error with shake animation and custom styles
        Swal.fire({
          icon: "error",
          title: "Registration failed 👎",
          html: `<div style="font-size: 2rem;"></div> ${errorMessage}`,
          customClass: {
            popup: "shake-popup",
          },
          willOpen: () => {
            const popupElement = Swal.getPopup();
            Object.assign(popupElement.style, swalErrorStyles.popup);

            const titleElement = popupElement.querySelector(".swal2-title");
            if (titleElement) {
              Object.assign(titleElement.style, swalErrorStyles.title);
            }

            const textElement = popupElement.querySelector(".swal2-content");
            if (textElement) {
              Object.assign(textElement.style, swalErrorStyles.text);
            }
          },
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      // Network or server error
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Failed to connect to the server!",
        customClass: {
          popup: "shake-popup",
        },
        willOpen: () => {
          const popupElement = Swal.getPopup();
          Object.assign(popupElement.style, swalErrorStyles.popup);

          const titleElement = popupElement.querySelector(".swal2-title");
          if (titleElement) {
            Object.assign(titleElement.style, swalErrorStyles.title);
          }

          const textElement = popupElement.querySelector(".swal2-content");
          if (textElement) {
            Object.assign(textElement.style, swalErrorStyles.text);
          }
        },
        confirmButtonText: "Try Again",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div style={styles.background}>
      {backgroundImage && (
        <div
          style={{
            ...styles.blurredBackground,
            backgroundImage: `url(${ApiUrl}/uploads/singleadpage/${backgroundImage})`,
          }}
        />
      )}
      <div style={styles.container}>
        <button style={styles.signOutButton}>
          <a href="/" style={{ color: "white" }}>
            <FaSignOutAlt />
          </a>
        </button>
        <center>
          <a href="/">
            <img src={logo} width={"200px"} alt="Logo" />
          </a>
        </center>
        <h2 style={styles.title}>User SignUp</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            className="staff-input"

          />
          {errors.username && <p style={styles.error}>{errors.username}</p>}

          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            className="staff-input"

          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}

          <label style={styles.label} htmlFor="contactNumber">
            WhatsApp Number
          </label>
          <span style={{ color: "grey", fontSize: "12px" }}>
            (Use your WhatsApp number to get more updates and exclusive
            coupons!)
          </span>
          <input
            type="text"
            name="contactNumber"
            placeholder="Mobile Number"
            value={formData.contactNumber}
            onChange={handleChange}
            style={styles.input}
            className="staff-input"

          />
          {errors.contactNumber && (
            <p style={styles.error}>{errors.contactNumber}</p>
          )}

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <div style={styles.passwordContainer}>
            <input
              // type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.passwordInput}
              className={`staff-input ${
                passwordVisible ? "" : "password-hidden"
              }`}
            />
            <span
              onClick={togglePasswordVisibility}
              style={styles.eyeIcon}
              className="eye-icon"
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          {errors.password && <p style={styles.error}>{errors.password}</p>}

          <label style={styles.label} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div style={styles.passwordContainer}>
            <input
              // type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.passwordInput}
              className={`staff-input ${
                confirmPasswordVisible ? "" : "password-hidden"
              }`}
            />
            <span
              onClick={toggleConfirmPasswordVisibility}
              style={styles.eyeIcon}
              className="eye-icon"
            >
              {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p style={styles.error}>{errors.confirmPassword}</p>
          )}

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
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

const styles = {
  background: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full height of the viewport
    background: "linear-gradient(to bottom right, #add8e6, #ffffff)", // Default gradient
    backgroundSize: "cover", // Ensure the background covers the entire area
    position: "relative", // To position the overlay
    overflow: "hidden", // Hide overflow to keep blur contained
  },

  blurredBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: "cover", // Ensure the background covers the entire area
    backgroundPosition: "center", // Center the background image
    filter: "blur(4px)", // Adjust the blur effect here
    zIndex: 1, // Place behind other content
  },
  label: {
    color: "white",
    marginTop: "5px",
  },
  container: {
    maxWidth: "400px",
    width: "100%",
    margin: "20px auto",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 0 5px rgba(0, 123, 255, 0.9)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    position: "relative",
    zIndex: 2,
  },
  signOutButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px", // Reduce margin for a compact look
    fontSize: "20px", // Slightly reduce the title font size
    fontWeight: "bold",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "8px", // Reduce input padding for a smaller card
    margin: "8px 0", // Reduce spacing between inputs
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px", // Adjust font size to match the smaller design
    backgroundColor: "transparent",
    border: "1px solid grey",

    color: "white",
    "::placeholder": {
      color: "white",
      opacity: "0.7",
    },
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    width: "100%",
    padding: "8px", // Adjust padding for password fields as well
    borderRadius: "5px",
    border: "1px solid grey",
    backgroundColor: "transparent",
    fontSize: "14px",
    paddingRight: "35px", // Adjust padding for eye icon space
    marginTop: "10px", // Reduce margin for compact design
    color: "white",
    "::placeholder": {
      color: "white",
      opacity: "0.7",
    },
  },
  eyeIcon: {
    position: "absolute",
    right: "15px", // Adjust position to fit smaller card
    top: "60%", // Adjust top position for better alignment
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "white",
  },
  button: {
    padding: "8px", // Reduce button padding
    margin: "15px 0", // Reduce margin for a smaller card layout
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "16px", // Adjust button font size
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "12px", // Reduce error message font size
    margin: "4px 0", // Reduce error message margin
  },
};

export default SignupPage;
