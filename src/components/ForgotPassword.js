import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSignOutAlt } from "react-icons/fa";
import logo from "./img/logo3.png";
import { ApiUrl } from "./ApiUrl"; // Ensure you have your API base URL here

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const handleOtpPopup = () => {
    Swal.fire({
      title: "Enter Your Email",
      html: `
        <input type="email" id="email" class="swal2-input" placeholder="Enter Email" required />
      `,
      confirmButtonText: "Get OTP",
      preConfirm: async () => {
        const emailInput = document.getElementById("email").value;
        if (!emailInput.match(/^\S+@\S+\.\S+$/)) {
          Swal.showValidationMessage("Invalid email address");
          return false;
        }
        try {
          const response = await axios.post(`${ApiUrl}/send-email-otp`, { email: emailInput });
          if (response.status === 200) {
            Swal.fire({
              title: "Enter OTP",
              html: `<input type="text" id="otp" class="swal2-input" placeholder="Enter OTP" required />`,
              confirmButtonText: "Verify OTP",
              preConfirm: async () => {
                const otpInput = document.getElementById("otp").value;
                if (!otpInput.match(/^\d{6}$/)) {
                  Swal.showValidationMessage("Invalid OTP format");
                  return false;
                }
                try {
                  const verifyResponse = await axios.post(`${ApiUrl}/verify-email-otp`, {
                    email: emailInput,
                    otp: otpInput,
                  });
                  if (verifyResponse.status === 200) {
                    setVerifiedEmail(emailInput);
                    Swal.fire("Verified!", "Email OTP verified successfully.", "success");
                  } else {
                    Swal.showValidationMessage("Incorrect OTP");
                  }
                } catch (error) {
                  Swal.showValidationMessage("Failed to verify OTP. Try again.");
                }
              },
            });
          } else {
            Swal.showValidationMessage("Failed to send OTP. Try again.");
          }
        } catch (error) {
          Swal.showValidationMessage("Error occurred. Try again.");
        }
      },
    });
  };

  useEffect(() => {
    handleOtpPopup(); // Trigger the OTP popup when the component mounts
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }
    if (!verifiedEmail) {
      Swal.fire("Error", "Email not verified. Verify your email first.", "error");
      return;
    }
    try {
      const response = await axios.post(`${ApiUrl}/reset-password`, {
        email: verifiedEmail,
        password: newPassword,
      });
      if (response.status === 200) {
        Swal.fire("Success", "Password reset successfully!", "success").then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire("Error", "Failed to reset password.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong. Try again later.", "error");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <button style={styles.signOutButton}>
          <a href="/" style={{ color: "white" }}>
            <FaSignOutAlt />
          </a>
        </button>
        <center>
          <a href="/">
            <img src={logo} width="200px" alt="Logo" />
          </a>
        </center>
        <h2 style={styles.title}>Reset Password</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.passwordContainer}>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
            />
            <span onClick={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
              {showNewPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <div style={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <button type="submit" style={styles.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  background: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to bottom right, #add8e6, #ffffff)",
  },
  container: {
    maxWidth: "400px",
    width: "400px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  signOutButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontSize: "18px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
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
  },
  passwordContainer: {
    position: "relative",
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
    marginTop: "10px",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default ForgotPasswordPage;
