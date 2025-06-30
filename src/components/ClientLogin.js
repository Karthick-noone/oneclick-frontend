import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ApiUrl } from "./ApiUrl";
import { FaEye, FaEyeSlash, FaSignOutAlt } from "react-icons/fa"; // Import eye icons
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
  
  // const location = useLocation();

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



  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
    const { name, value } = e.target;

    // Validation for contact number
    if (name === "contact_number") {
      // Check if the value is empty or if it starts with 6-9 and is exactly 10 digits long
      if (value === "" || /^[6-9]\d{0,9}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    }

    if (name === "password") {
      setFormData({ ...formData, [name]: value });
    }


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


  // const from = location.state?.from?.pathname || '/';

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.contact_number === "" || formData.password === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      timer: 3000,
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

      localStorage.setItem('contact_number', contact_number);
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);
      localStorage.setItem('user_id', user_id);

      confetti({
        particleCount: 150,
        spread: 100,
        startVelocity: 30,
        zIndex: 9999,
        origin: { y: 0.5 },
      });

      Swal.fire({
        icon: 'success',
        title: '🎉Success!',
        text: 'Login successful! Welcome back!',
        timer: 4000,
        customClass: { popup: 'my-popup' },
        willOpen: () => {
          const popupElement = Swal.getPopup();
          Object.assign(popupElement.style, swalStyles.popup);
          const titleElement = popupElement.querySelector('.swal2-title');
          if (titleElement) Object.assign(titleElement.style, swalStyles.title);
          const textElement = popupElement.querySelector('.swal2-content');
          if (textElement) Object.assign(textElement.style, swalStyles.text);
        },
        showCloseButton: true,
      }).then(() => {
        const referrer = document.referrer;
        const isFromSignup = referrer.includes("/signup");
        const isFromForgetPassword = referrer.includes("/ForgotPassword");

        if (!referrer || isFromSignup || isFromForgetPassword) {
          navigate("/");
        } else {
          const url = new URL(referrer);
          if (url.origin === window.location.origin) {
            navigate(url.pathname + url.search);
          } else {
            navigate("/");
          }
        }
      });

    } else {
      Swal.fire({
        icon: "error",
        title: "Login failed 👎",
        html: '<div style="font-size: 2rem;"></div> Invalid credentials!',
        customClass: { popup: 'shake-popup' },
        willOpen: () => {
          const popupElement = Swal.getPopup();
          Object.assign(popupElement.style, swalErrorStyles.popup);
          const titleElement = popupElement.querySelector('.swal2-title');
          if (titleElement) Object.assign(titleElement.style, swalErrorStyles.title);
          const textElement = popupElement.querySelector('.swal2-content');
          if (textElement) Object.assign(textElement.style, swalErrorStyles.text);
        },
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      html: '<div style="font-size: 2rem;">👎</div> Something went wrong. Please try again later.',
      customClass: { popup: 'shake-popup' },
    });
  }
};



  // Add styles for shake animation and error popup
  const swalErrorStyles = {
    popup: {
      background: 'rgba(255, 255, 255, 0.9)',
      border: 'none',
      boxShadow: '0 0 15px rgba(255, 0, 0, 0.9)', // Red shadow for error
      width: '500px'
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
          <Link to="/" style={styles.signOutLink}>
            <FaSignOutAlt />
          </Link>
        </button>
        <center>
          <Link to="/">
            <img src={logo} width={'200px'} alt="Logo" />
          </Link>
        </center>
        <h2 style={styles.title}>User Login</h2>

        <form style={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <label style={styles.label} htmlFor="name">WhatsApp Number</label>
          <input
            type="tel"
            name="contact_number"
            placeholder="WhatsApp Number"
            value={formData.contact_number}
            onChange={handleChange}
            style={styles.input}
            required
            className="staff-input"
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
          <Link to="/ForgotPassword" style={styles.link}>
            Forgot Password?
          </Link>
          <Link to="/signup" style={styles.link}>
            Don't have an account? Sign Up
          </Link>
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
    top: "65%",
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
  label: {
    color: 'white'
  }
};

export default LoginPage;