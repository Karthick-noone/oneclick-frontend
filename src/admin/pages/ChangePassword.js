import React, { useEffect, useState } from 'react';
// import Slidebar from './Slidebar';
// import Topbar from './Topbar';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios'; // Import axios for making API requests
import './css/ChangePassword.css'; // Import the CSS file for styling
import { ApiUrl } from '../../components/ApiUrl';

const ChangePassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = (type) => {
    setShowPassword({
      ...showPassword,
      [type]: !showPassword[type],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { oldPassword, newPassword, confirmPassword } = formData;
  
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'All fields are required!',
      });
      return;
    }
  
    if (newPassword.length < 5) {
      Swal.fire({
        icon: 'error',
        title: 'Password too short',
        text: 'New password should be at least 5 characters long.',
      });
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Confirm password should match the new password.',
      });
      return;
    }
  
    try {
      // Make the API request to change the password
      const response = await axios.post(`${ApiUrl}/api/change-password`, {
        oldPassword,
        newPassword,
      });
  
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password Changed',
          text: 'Your password has been successfully changed!',
        });
        // Optionally, you can navigate the user to another page or clear the form
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        // Handle specific error messages
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Failed to change password.',
        });
      }
    } catch (error) {
      console.error('API request error:', error); // Log the actual error for debugging
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <div className="AdminMain">
      {/* <Slidebar />
      <Topbar /> */}
      <main className="content">
        <div className="change-password-container">
          <div className="change-password-form">
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="oldPassword">Old Password</label>
                <div className="input-container">
                  <input
                    type={showPassword.old ? 'text' : 'password'}
                    id="oldPassword"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    placeholder="Enter your old password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('old')}
                  >
                    {showPassword.old ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-container">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPassword.new ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="input-container">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPassword.confirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button type="submit" className="submit-button">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;