import React, { useState , useEffect} from "react";
import Swal from "sweetalert2";
import { ApiUrl } from './ApiUrl';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons
import logo from './img/logo3.png';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false); // For new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility
  const [backgroundImage, setBackgroundImage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        html: '<div style="font-size: 2rem;">👎</div> All fields are required!',
        text: "Passwords do not match!",
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
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.text();

      if (response.ok) {
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
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login failed 👎",
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
       <center> 
        <a href="/"> 
          <img src={logo} width={'200px'} alt="Logo" />
        </a>
      </center>
      <h2 style={styles.title}>Change Password</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
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