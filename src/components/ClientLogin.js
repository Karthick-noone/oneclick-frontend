import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from "./ApiUrl";
import { FaEye, FaEyeSlash , FaSignOutAlt} from "react-icons/fa"; // Import eye icons
import logo from './img/logo3.png';
import confetti from 'canvas-confetti'; // Import the confetti package
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    contact_number: "",
    password: "",
    username: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
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



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
// Function to inject keyframes
const injectKeyframes = () => {
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(bounceKeyframes, styleSheet.cssRules.length);
};

// Call the function to inject the keyframes when the component mounts
React.useEffect(() => {
  injectKeyframes();
}, []);


const handleSubmit = async (e) => {
  e.preventDefault();

  // Basic frontend validation
  if (formData.contact_number === "" || formData.password === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      html: '<div style="font-size: 2rem;">👎</div> All fields are required!',
      customClass: {
        popup: 'shake-popup',
      },
    });
    return;
  }

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
      const { contact_number, email, user_id, username } = result;

      // Store user details in localStorage
      localStorage.setItem('contact_number', contact_number);
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);
      localStorage.setItem('user_id', user_id); // Store user_id in localStorage

      // Fire confetti burst for success
      confetti({
        particleCount: 150,
        spread: 100,
        startVelocity: 30,
        zIndex: 9999, // Ensure confetti is on top
        origin: { y: 0.5 },
      });

      Swal.fire({
        icon: 'success',
        title: '🎉Success!',
        text: 'Login successful! Welcome back!',
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
        showCloseButton: true,
      })
      .then(() => {
        navigate('/', { state: { user_id } });
      });

    } else {
      // Error feedback with thumbs down icon and shake effect
      Swal.fire({
        icon: "error",
        title: "Login failed 👎",
        html: '<div style="font-size: 2rem;"></div> Invalid credentials!',
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
    // Network or server error feedback
    Swal.fire({
      icon: "error",
      title: "Oops...",
      html: '<div style="font-size: 2rem;">👎</div> Something went wrong. Please try again later.',
      customClass: {
        popup: 'shake-popup',
      },
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle password visibility
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
      {backgroundImage && <div style={styles.blurOverlay} />}
      <div style={styles.container}>
        <button style={styles.signOutButton} className="close-btn">
          <a href="/" style={styles.signOutLink}>
            <FaSignOutAlt />
          </a>
        </button>
        <center>
          <a href="/">
            <img src={logo} width={'200px'} alt="Logo" />
          </a>
        </center>
        <h2 style={styles.title}>User Login</h2>
  
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="name">WhatsApp Number</label>
          <input
            type="tel"
            name="contact_number"
            placeholder="Mobile Number"
            value={formData.contact_number}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <label style={styles.label} htmlFor="name">Password</label>
          <div style={styles.passwordContainer}>
            <input
              // type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.passwordInput}
              required
              className={`staff-input ${passwordVisible ? "" : "password-hidden"}`}

            />
            {/* <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </span> */}
            <span onClick={togglePasswordVisibility} style={styles.eyeIcon} className="eye-icon">
                            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                          </span>
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <div style={styles.linksContainer}>
           {/* <a href="/ForgotPassword" style={styles.link}>
            Forgot Password? 
          </a>  */}
          <a href="/signup" style={styles.link}>
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}



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

// Keyframes for the bounce animation
const bounceKeyframes = `
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}
`;




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
    width:'350px',
    margin: "30px auto",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
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
    width: "100%",
  },
  passwordInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid grey",
    fontSize: "14px",
    paddingRight: "35px",
    marginTop: "10px",
    backgroundColor: "black",
    color: "white",
    background: 'transparent',
  },
  eyeIcon: {
    position: "absolute",
    right: "15px",
    top: "60%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: 'white',
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
  label:{
    color:'white'
  }
};

export default LoginPage;