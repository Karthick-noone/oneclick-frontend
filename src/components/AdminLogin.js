import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ApiUrl } from './ApiUrl';
import './css/LoginPage.css';
import logo from './img/logo3.png';
import { FaSignOutAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import confetti from 'canvas-confetti'; // Import the confetti package

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (formData.username === '' || formData.password === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'All fields are required!',
        customClass: {
          popup: 'shake-popup', // Add a custom shake animation class
        },
        willOpen: () => {
          const popupElement = Swal.getPopup();
          Object.assign(popupElement.style, swalErrorStyles.popup); // Apply custom styles
          const titleElement = popupElement.querySelector('.swal2-title');
          if (titleElement) {
            Object.assign(titleElement.style, swalErrorStyles.title);
          }
          const textElement = popupElement.querySelector('.swal2-content');
          if (textElement) {
            Object.assign(textElement.style, swalErrorStyles.text);
          }
        }
      });
      return;
    }

    try {
      const response = await fetch(`${ApiUrl}/adminlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");

        Swal.fire({
          icon: 'success',
          title: '🎉 Login successful',
          text: 'You have logged in successfully!',
          customClass: {
            popup: 'my-popup', // Custom class for success popup
          },
          willOpen: () => {
            const popupElement = Swal.getPopup();
            Object.assign(popupElement.style, swalStyles.popup); // Apply success styles
            const titleElement = popupElement.querySelector('.swal2-title');
            if (titleElement) {
              Object.assign(titleElement.style, swalStyles.title);
            }
            const textElement = popupElement.querySelector('.swal2-content');
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
          }
        }).then(() => {
          navigate('/Admin/Dashboard'); // Redirect to admin dashboard
        });
      } else {
        // Handle login failures
        Swal.fire({
          icon: 'error',
          title: 'Login failed 👎',
          text: result.message || 'Invalid credentials!',
          customClass: {
            popup: 'shake-popup', // Add a custom shake animation class
          },
          willOpen: () => {
            const popupElement = Swal.getPopup();
            Object.assign(popupElement.style, swalErrorStyles.popup); // Apply error styles
            const titleElement = popupElement.querySelector('.swal2-title');
            if (titleElement) {
              Object.assign(titleElement.style, swalErrorStyles.title);
            }
            const textElement = popupElement.querySelector('.swal2-content');
            if (textElement) {
              Object.assign(textElement.style, swalErrorStyles.text);
            }
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
        customClass: {
          popup: 'shake-popup', // Add a custom shake animation class
        },
        willOpen: () => {
          const popupElement = Swal.getPopup();
          Object.assign(popupElement.style, swalErrorStyles.popup); // Apply error styles
          const titleElement = popupElement.querySelector('.swal2-title');
          if (titleElement) {
            Object.assign(titleElement.style, swalErrorStyles.title);
          }
          const textElement = popupElement.querySelector('.swal2-content');
          if (textElement) {
            Object.assign(textElement.style, swalErrorStyles.text);
          }
        }
      });
    }
  };


  // Add styles for shake animation and error popup
const swalErrorStyles = {
  popup: {
    background: 'rgba(255, 255, 255, 0.9)', 
    border: 'none',
    boxShadow: '0 0 15px rgba(255, 0, 0, 0.9)', // Red shadow for error
    width:'500px'
  },
  title: {
    color: '#FF0000', // Red title color
    fontWeight: 'bold', 
  },
  text: {
    color: '#333', // Darker text for message
  },
};


const swalStyles = {
  popup: {
    background: 'rgba(255, 255, 255, 0.9)', 
    border: 'none',
    boxShadow: '0 0 15px rgba(76, 175, 80, 0.7)', // Green shadow with some transparency
    width: '500px',
  },
  title: {
    color: '#4CAF50', // Green color for title
    fontWeight: 'bold', 
  },
  text: {
    color: '#333', // Darker text color for content
  },
};

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <a href="/"> <img src={logo} width={'200px'} alt="" /></a>
          <a href="/"><button style={{ color: 'white' }} className="close-btn"><FaSignOutAlt /></button></a>
          <h1>Admin Login</h1>
          <p>Enter your credentials to access your account</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ color: 'white' }} className='admin-label' htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label style={{ color: 'white' }} className='admin-label' htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <span onClick={togglePasswordVisibility} className="eye-icon">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          <button type="submit" className="button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
