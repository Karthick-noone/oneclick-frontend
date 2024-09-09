import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ApiUrl } from './ApiUrl';
import './css/LoginPage.css';
import logo from './img/logo3.png'
import { FaSignOutAlt } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username === '' || formData.password === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'All fields are required!',
      });
      return;
    }

    if (formData.password.length < 5) {
      Swal.fire({
        icon: 'error',
        title: 'Password too short',
        text: 'Password should be at least 5 characters long.',
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
          title: 'Login successful',
          text: 'You have logged in successfully!',
        }).then(() => {
          navigate('/Admin/Dashboard');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: result.message || 'Invalid credentials!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
        <a href="/"> <img src={logo} width={'200px'} alt="" /></a>
      <a href="/"><button style={{color:'black'}} className="close-btn" ><FaSignOutAlt /></button></a>

          <h1>Admin Login</h1>
          <p>Enter your credentials to access your account</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="button">Login</button>
        </form>
        {/* <div className="login-footer">
          <p>Don't have an account? <a href="/Adminregister">Sign up</a></p>
          <p><a href="/AdminForgotPassword">Forgot Password?</a></p>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;
