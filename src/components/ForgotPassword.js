import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSignOutAlt } from "react-icons/fa";
import logo from "./img/logo3.png";
import { ApiUrl } from "./ApiUrl";
import "./css/ForgotPasswordPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: mobile, 2: otp, 3: reset
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forceShowResetForm, setForceShowResetForm] = useState(false);
  const [timer, setTimer] = useState(60);
  const [showResend, setShowResend] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only 0-9 digits

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // Move focus to next input if value is entered
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const getCombinedOtp = () => otpValues.join("");

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    const savedTimestamp = localStorage.getItem("resetFormStartTime");

    if (savedTimestamp) {
      const now = Date.now();
      const diff = now - parseInt(savedTimestamp, 10);

      if (diff < 5 * 60 * 1000) {
        // Less than 5 minutes passed
        setForceShowResetForm(true);
      } else {
        // More than 5 minutes passed, clear it
        localStorage.removeItem("resetFormStartTime");
        setForceShowResetForm(false);
      }
    }
  }, []);

  useEffect(() => {
    if (step === 3) {
      const current = localStorage.getItem("resetFormStartTime");
      if (!current) {
        localStorage.setItem("resetFormStartTime", Date.now().toString());
        setForceShowResetForm(true);
      }
    }
  }, [step]);

  const navigate = useNavigate();

  const preloadImage = (src) => {
    const img = new Image();
    img.src = src;
  };

  const [backgroundImage, setBackgroundImage] = useState(() => {
    const cachedImage = localStorage.getItem("cachedLoginBg");
    if (cachedImage) {
      preloadImage(`${ApiUrl}/uploads/singleadpage/${cachedImage}`);
    }
    return cachedImage || "";
  });

  useEffect(() => {
    const fetchAndCacheBackgroundImage = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchloginbg`);
        if (response.data.length > 0) {
          const image = response.data[0].image;

          // If image is new or different
          if (image !== localStorage.getItem("cachedLoginBg")) {
            const img = new Image();
            img.src = `${ApiUrl}/uploads/singleadpage/${image}`;
            img.onload = () => {
              localStorage.setItem("cachedLoginBg", image);
              setBackgroundImage(image);
            };
          }
        } else {
          localStorage.removeItem("cachedLoginBg");
          setBackgroundImage("");
        }
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchAndCacheBackgroundImage();
  }, []);


  const handleSendOtp = async () => {
     if (!mobile) {
    toast.error("Mobile number is required!");
    return;
  }
    if (!mobile.match(/^[6-9]\d{9}$/)) {
      toast.error("Enter valid mobile number!");
      return;
    }
    try {
      const response = await axios.post(`${ApiUrl}/send-otp`, { mobile });
      if (response.status === 200) {
        toast.success(`Verification code sent to ${mobile}`);
        setStep(2);
        setTimer(60);       // Start countdown
        setShowResend(false); // Hide resend button
      }
    } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error("Mobile number is not registered!");
    } else {
      toast.error("Failed to send OTP. Try again.");
    }
  }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otpValues.join("");

    if (!/^\d{6}$/.test(enteredOtp)) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      const res = await axios.post(`${ApiUrl}/verify-otp`, { mobile, otp: enteredOtp });

      if (res.status === 200) {
        toast.success("OTP verified successfully");
        setStep(3);
      } else {
        toast.error("OTP is incorrect");
      }
    } catch (error) {
      toast.error("OTP is incorrect");
    }
  };


  const handleResendOtp = () => {
    handleSendOtp(); // Reuse the same function
    toast.info("OTP resent successfully");
  };

  const handlePasteOtp = (e) => {
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const otpArr = pastedData.split("").slice(0, 6);
      setOtpValues(otpArr);

      // Focus last input
      setTimeout(() => {
        if (inputsRef.current[5]) {
          inputsRef.current[5].focus();
        }
      }, 50);
    }
  };


  const validateForm = (formData) => {
    const { password, confirmPassword } = formData;
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 5) {
      newErrors.password = "Password should be at least 5 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    if (!validateForm({ password: newPassword, confirmPassword })) return;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${ApiUrl}/change-password`, {
        mobile,
        password: newPassword,
      });

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);

        localStorage.removeItem("resetFormStartTime");
        setForceShowResetForm(false);
        // setStep(4);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(msg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error when user starts typing
    }));
  };


  const showForm = step === 3 || forceShowResetForm;

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
      {backgroundImage && <div style={styles.blurOverlay} />}
      <div style={styles.container}>
        <button style={styles.signOutButton} className="close-btn">
          <Link to="/login" style={styles.signOutLink}>
            <FaSignOutAlt />
          </Link>
        </button>
        <center>
          <Link to="/login">
            <img src={logo} width={'200px'} alt="Logo" />
          </Link>
        </center>
        <h2 style={styles.title}>Reset Password</h2>

        {step === 1 && !showForm && (
          <>
          <div style={styles.form} autoComplete="off">
            <label style={styles.label} htmlFor="name">WhatsApp Number</label>

            <input
              type="text"
              placeholder="Enter WhatsApp Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="staff-input"
              style={styles.input}
            />
            <button onClick={handleSendOtp} style={styles.button}>Request OTP</button>
          </div>
          <div style={styles.linksContainer}>
                    {/* <Link to="/ForgotPassword" style={styles.link}>
                      Forgot Password?
                    </Link> */}
                    <Link to="/signup" style={styles.link}>
                      Don't have an account? Sign Up
                    </Link>
                  </div>
          </>
        )}

        {step === 2 && (
          <div style={styles.form} autoComplete="off">
            <label style={styles.label}>Enter OTP</label>

            <div style={styles.otpContainer}>
              {otpValues.map((val, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  name={`otp-${index}`}
                  maxLength="1"
                  value={val}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePasteOtp}
                  autoFocus={index === 0}
                  style={{
                    ...styles.otpBox,
                    borderColor: val ? "#2A55E5" : "#ccc",
                  }}
                />
              ))}

            </div>

            <div style={{ marginTop: '10px', fontSize: '14px', color: '#ccc' }}>
              {showResend ? (
                <button onClick={handleResendOtp} style={{ ...styles.button, padding: "6px 14px" }}>
                  Resend OTP
                </button>
              ) : (
                `Resend OTP in ${timer}s`
              )}
            </div>

            <button
              onClick={() => handleVerifyOtp(getCombinedOtp())}
              style={{ ...styles.button, marginTop: '15px' }}
            >
              Verify OTP
            </button>
          </div>

        )}

        {showForm && (
          <form style={styles.form} autoComplete="off" onSubmit={handleSubmitPassword}>
            <div style={styles.passwordContainer}>
              <label style={styles.label} htmlFor="newPassword">Reset Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={handleChange}
                name="newPassword"
                required
                className="staff-input"
                style={styles.passwordInput}
              />

              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                style={styles.eyeIcon}
                className="eye-icon"
              >
                {showNewPassword ? <FaEye /> : <FaEyeSlash />}
              </span>

            </div>
            {errors.password && <p style={styles.error}>{errors.password}</p>}
            <div style={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                required
                className="staff-input"
                style={styles.passwordInput}
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={styles.eyeIcon2}
                className="eye-icon"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>} {/* Correct placement */}
            <button type="submit" style={styles.button}>Reset Password</button>
          </form>
        )}
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      // icon={false} 
      />


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
  },
  container: {
    maxWidth: "400px",
    width: '350px',
    margin: "30px auto",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 0 5px rgba(0, 123, 255, 0.9)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    marginTop: '100px',
    zIndex: 2,
    position: 'relative',
  },
  signOutButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '18px',
  },
  signOutLink: {
    color: 'white',
    textDecoration: 'none',
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "8px",
    margin: "8px 0",
    borderRadius: "5px",
    border: '1px solid grey',
    fontSize: "14px",
    backgroundColor: "black",
    color: "white",
    background: 'transparent',
  },
  passwordContainer: {
    position: "relative",
    marginBottom: "20px",
  },
  passwordInput: {
    width: "100%",
    padding: "8px",
    paddingRight: "35px", // space for the eye icon
    borderRadius: "5px",
    border: "1px solid grey",
    fontSize: "14px",
    marginTop: "10px",
    backgroundColor: "black",
    color: "white",
    background: "transparent",
  },
  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "75%", // Corrected to vertical center
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "white",
    fontSize: "16px",
  },
  eyeIcon2: {
    position: "absolute",
    right: "10px",
    top: "65%", // Corrected to vertical center
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "white",
    fontSize: "16px",
  },
  button: {
    padding: "8px",
    margin: "15px 0",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
  linksContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  link: {
    fontSize: "14px",
    color: "white",
    textDecoration: "none",
    marginLeft: "5px",
  },
  label: {
    color: 'white'
  },
  error: {
    color: "red",
    fontSize: "14px", // Reduce error message font size
    marginTop: "4px 0", // Reduce error message margin
  },
  otpContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    marginTop: '12px',
  },

  otpBox: {
    width: '40px',
    height: '45px',
    textAlign: 'center',
    fontSize: '20px',
    border: '2px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: 'black',
    color: 'white',
    transition: 'border-color 0.3s',
  },

};
export default ForgotPasswordPage;
