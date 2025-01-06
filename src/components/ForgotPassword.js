import React, { useState , useEffect} from "react";
import Swal from "sweetalert2";
import { ApiUrl } from './ApiUrl';
import { FaEye, FaEyeSlash,FaSignOutAlt } from 'react-icons/fa'; // Import icons
import logo from './img/logo3.png';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");  // Mobile number state
  const [otp, setOtp] = useState("");        // OTP state
  const [showNewPassword, setShowNewPassword] = useState(false); // For new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility
  const [backgroundImage, setBackgroundImage] = useState('');
  const navigate = useNavigate(); // Initialize navigate function
  const [verifiedMobile, setVerifiedMobile] = useState('');

  const handleOtpPopup = () => {
    console.log('OTP Popup Triggered');
  
    // Step 1: Show mobile number input and "Get OTP" button
    Swal.fire({
      title: 'Enter Your Mobile Number',
      html: `
        <input type="text" id="mobile" class="swal2-input" placeholder="Enter Mobile Number" maxlength="10" required />
      `,
      focusConfirm: false,
      showCancelButton: false,
      confirmButtonText: 'Get OTP',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: async () => {
        const mobileInput = document.getElementById('mobile').value;
        console.log('Mobile Input:', mobileInput); // Log mobile input
  
        // Validate mobile number (ensuring it starts with 6-9 and is 10 digits long)
        if (!mobileInput.match(/^[6-9][0-9]{9}$/)) {
          Swal.showValidationMessage('Invalid Mobile Number');
          console.log('Invalid mobile number');
          return false; // Prevent further execution if mobile is invalid
        }
  
        // Step 2: If the mobile number is valid, send OTP
        console.log('Mobile number is valid, sending OTP...');
        try {
          const response = await sendOtp(mobileInput); // Send OTP API call
  
          if (response.status === 200) {
            console.log('OTP sent successfully');
  
            // After sending OTP, show the OTP input field for verification
            const otpResult = await Swal.fire({
              title: 'Enter OTP',
              html: `
                <input type="text" id="otp" class="swal2-input" placeholder="Enter OTP" required style="margin-top: 10px;" />
              `,
              focusConfirm: false,
              showCancelButton: false,
              confirmButtonText: 'Verify OTP',
              allowOutsideClick: false,
              allowEscapeKey: false,
              footer: `
                <button id="resendOtp" class="swal2-button" style="
                  background-color: #f0ad4e; 
                  color: white; 
                  margin-top: 10px; 
                  padding: 10px 20px; 
                  border-radius: 5px; 
                  font-size: 14px; 
                  font-weight: bold; 
                  transition: background-color 0.3s, transform 0.3s; 
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  border: none;
                  cursor: pointer;
                ">
                  Resend OTP
                </button>
              `,
              didOpen: () => {
                // Add event listener to the Resend OTP button
                document.getElementById('resendOtp').addEventListener('click', async () => {
                  console.log('Resending OTP...');
                  const resendResponse = await sendOtp(mobileInput); // Resend OTP
                  if (resendResponse.status === 200) {
                    console.log('OTP resent successfully');
                    Swal.showValidationMessage('OTP resent successfully');
                  } else {
                    Swal.showValidationMessage('Failed to resend OTP');
                  }
                });
              },
              preConfirm: async () => {
                const otpInput = document.getElementById('otp').value;
                console.log('OTP Input:', otpInput);
  
                // Check if the OTP is valid (only digits and exactly 6 characters)
                if (!otpInput.match(/^\d{6}$/)) {
                  Swal.showValidationMessage('Please enter valid otp');
                  return false; // Prevent further execution if OTP is invalid
                }
  
                // Verify the OTP entered by the user
                const otpVerified = await verifyOtp(mobileInput, otpInput); // Call verify OTP function
                if (otpVerified) {
                  Swal.fire('OTP Verified', '', 'success'); // Show success message
                  return true; // Proceed to close the popup after OTP is verified
                } else {
                  return false; // Prevent closing if OTP is not verified
                }
              },
            });
  
            return otpResult.isConfirmed; // Return the result of OTP verification
          } else {
            throw new Error('Failed to send OTP');
          }
        } catch (error) {
          console.error('Error sending OTP:', error);
          // Show the error message returned from the backend
          Swal.showValidationMessage(error.response?.data || 'Failed to send OTP. Try again.');
          return false; // Prevent further execution
        }
      },
    });
  
    // Event listener to restrict invalid input for mobile number
    document.getElementById('mobile')?.addEventListener('input', (e) => {
      let input = e.target.value;
      // Allow only digits and prevent input when the first character isn't 6-9 or if the length exceeds 10
      if (input.length === 1 && !/[6-9]/.test(input[0])) {
        e.target.value = ''; // Clear the input if the first digit is not 6-9
      } else if (/[^0-9]/.test(input)) {
        e.target.value = input.replace(/[^0-9]/g, ''); // Remove non-digit characters
      } else if (input.length > 10) {
        e.target.value = input.slice(0, 10); // Limit to 10 digits
      }
    });
    document.getElementById('otp')?.addEventListener('input', (e) => {
      let input = e.target.value;
      // Allow only digits and prevent input when the first character isn't 6-9 or if the length exceeds 10
      if (input.length === 1 && !/[0-9]/.test(input[0])) {
        e.target.value = ''; // Clear the input if the first digit is not 6-9
      } else if (/[^0-9]/.test(input)) {
        e.target.value = input.replace(/[^0-9]/g, ''); // Remove non-digit characters
      } else if (input.length > 6) {
        e.target.value = input.slice(0, 10); // Limit to 10 digits
      }
    });
  
    // Event listener to restrict invalid input for OTP
    // document.getElementById('otp')?.addEventListener('input', (e) => {
    //   let input = e.target.value;
    //   // Allow only digits and prevent input if length exceeds 6 digits
    //   if (/[^0-9]/.test(input)) {
    //     e.target.value = input.replace(/[^0-9]/g, ''); // Remove non-digit characters
    //   } else if (input.length > 6) {
    //     e.target.value = input.slice(0, 6); // Limit to 6 digits
    //   }
    // });
  };
  
  // Function to send OTP
  const sendOtp = async (mobileInput) => {
    try {
      const response = await axios.post(`${ApiUrl}/sendotp`, { number: mobileInput });
      return response; // Return the API response
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error; // Rethrow error to be caught in handleOtpPopup
    }
  };
  
  // Function to verify OTP
  const verifyOtp = async (mobileInput, otpInput) => {
    try {
      const response = await axios.post(`${ApiUrl}/verifyotp`, { number: mobileInput, otp: otpInput });
      if (response.status === 200) {
        console.log('OTP verified successfully');
        setVerifiedMobile(mobileInput); // Store the verified mobile number
        return true;
      } else {
        Swal.showValidationMessage('Incorrect OTP');
        console.log('Incorrect OTP');
        return false;
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Swal.showValidationMessage('Failed to verify OTP. Try again.');
      return false;
    }
  };
  
  
  
  
  // Trigger the OTP Popup when the page loads (or on any desired event)
  useEffect(() => {
    console.log('Fetching background image from:', `${ApiUrl}/fetchloginbg`);
  
    axios.get(`${ApiUrl}/fetchloginbg`)
      .then((response) => {
        console.log('Response data for background image:', response.data);
    
        if (response.data.length > 0) {
          setBackgroundImage(response.data[0].image);
        } else {
          setBackgroundImage('');
        }
      })
      .catch((error) => {
        console.error('Error fetching background image:', error);
      });
  
    // Trigger the OTP Popup when the page loads
    handleOtpPopup();
  }, []);
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        html: '<div style="font-size: 2rem;">👎</div>Passwords do not match!',
        text: "Passwords do not match!",
        customClass: {
          popup: 'shake-popup',
        },
      });
      return;
    }
  
    // Validate contact number (assuming it's a 10-digit number starting with 6-9)
    if (!verifiedMobile.match(/^[6-9][0-9]{9}$/)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid contact number",
        customClass: {
          popup: 'shake-popup',
        },
      });
      return;
    }
  
    try {
      const response = await fetch(`${ApiUrl}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactNumber: verifiedMobile, newPassword }), // Send contactNumber instead of email
      });
  
      const result = await response.text();
  
      if (response.ok) {
        // Show success alert and navigate after it's closed
        Swal.fire({
          icon: "success",
          title: '🎉Success!',
          text: result,
          customClass: {
            popup: 'my-popup',
          },
          willOpen: () => {
            const popupElement = Swal.getPopup();
            Object.assign(popupElement.style, swalStyles.popup);
            const titleElement = popupElement.querySelector('.swal2-title');
            if (titleElement) {
              Object.assign(titleElement.style, swalStyles.title);
            }
            const textElement = popupElement.querySelector('.swal2-content');
            if (textElement) {
              Object.assign(textElement.style, swalStyles.text);
            }
          },
        }).then(() => {
          // Navigate to the /login route after the success alert
          navigate('/login');
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Password update failed 👎",
          text: result,
          customClass: {
            popup: 'shake-popup', // Custom shake animation class
          },
          willOpen: () => {
            const popupElement = Swal.getPopup();
            Object.assign(popupElement.style, swalErrorStyles.popup);
  
            const titleElement = popupElement.querySelector('.swal2-title');
            if (titleElement) {
              Object.assign(titleElement.style, swalErrorStyles.title);
            }
  
            // Apply text styles
            const textElement = popupElement.querySelector('.swal2-content');
            if (textElement) {
              Object.assign(textElement.style, swalErrorStyles.text);
            }
          },
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
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

// Inject the shake styles into the head of the document
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);



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

// // Keyframes for the bounce animation
// const bounceKeyframes = `
// @keyframes bounce {
//   0%, 20%, 50%, 80%, 100% {
//     transform: translateY(0);
//   }
//   40% {
//     transform: translateY(-20px);
//   }
//   60% {
//     transform: translateY(-10px);
//   }
// }
// `;

  return (
    <div style={styles.background}>
    {backgroundImage && (
      <div
        style={{
          ...styles.blurredBackground,
          backgroundImage: `url(${ApiUrl}/uploads/singleadpage/${backgroundImage})`, // Set the blurred background image
        }}
      />
    )}
  {/* Optional overlay for the blur effect */}
  {backgroundImage && <div style={styles.blurOverlay} />}
    <div style={styles.container}>
    <button style={styles.signOutButton} className="close-btn">
          <a href="/" style={{color:'white'}}>
            <FaSignOutAlt />
          </a>
        </button>
       <center> 
        <a href="/"> 
          <img src={logo} width={'200px'} alt="Logo" />
        </a>
      </center>
      <h2 style={styles.title}>Change Password</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        
        <div style={styles.passwordContainer}>
          <input
            type={showNewPassword ? "text" : "password"} // Toggle between text and password
            name="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
            required
          />
          <span
            onClick={() => setShowNewPassword(!showNewPassword)}
            style={styles.eyeIcon}
          >
            {showNewPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <div style={styles.passwordContainer}>
          <input
            type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <button type="submit" style={styles.button}>
          Reset Password
        </button>
      </form>
      <button onClick={handleOtpPopup} style={{display:'none'}}>
          Verify Mobile
        </button>

    </div>
    </div>
  );
};

const styles = {

  background: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full height of the viewport
    background: 'linear-gradient(to bottom right, #add8e6, #ffffff)', // Default gradient
    backgroundSize: 'cover', // Ensure the background covers the entire area
    position: 'relative', // To position the overlay
    overflow: 'hidden', // Hide overflow to keep blur contained
  },
  blurredBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover', // Ensure the background covers the entire area
    filter: 'blur(4px)', // Adjust the blur effect here
    backgroundPosition: 'center', // Center the background image
    zIndex: 1, // Place behind other content
  },
  container: {
    maxWidth: "400px",
    width:'400px',
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 1, // Place behind other content
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
    fontSize: "16px",
    width:'100%',
    backgroundColor: "black",
    color: "white",
    background:'transparent',
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: "16px",
    top: "21px",
    cursor: "pointer",
    color:'white',
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
};

export default ForgotPasswordPage;