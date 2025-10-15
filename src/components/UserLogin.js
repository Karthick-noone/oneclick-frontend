import React, { useEffect, useState } from "react";
import "./css/AuthForm.css";
import { FaWhatsapp, FaLock, FaUser, FaEnvelope, FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ApiUrl } from "./ApiUrl";
import Swal from "sweetalert2";
import confetti from 'canvas-confetti'; // Import the confetti package

const AuthForm = () => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("auth-sign-in");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);


  const [formData, setFormData] = useState({
    contact_number: "",
    password: "",
    username: "",
  });

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "", // Add contactNumber to the state
  });




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
    setLoading(true); // show loader
    if (formData.contact_number === "" || formData.password === "") {
      Swal.fire({
        toast: true,
        position: "bottom-center",
        showConfirmButton: false,
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
          toast: true,
          position: "bottom-center",
          icon: 'success',
          title: '🎉Success!',
          text: 'Login successful! Welcome back!',
          timer: 4000,
          showConfirmButton: false,
          customClass: { popup: 'my-popup' },
          willOpen: () => {
            const popupElement = Swal.getPopup();
            Object.assign(popupElement.style, swalStyles.popup);
            const titleElement = popupElement.querySelector('.swal2-title');
            if (titleElement) Object.assign(titleElement.style, swalStyles.title);
            const textElement = popupElement.querySelector('.swal2-html-container');
            if (textElement) Object.assign(textElement.style, swalStyles.text);
          },
          showCloseButton: false,
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
          toast: true,
          position: "bottom-center",
          showConfirmButton: false,
          timer: 3000,
          icon: "error",
          title: "Login failed ",
          html: '<div style="font-size: 2rem;"></div> Invalid credentials!',
          customClass: { popup: 'shake-popup' },
          willOpen: () => {
            const popupElement = Swal.getPopup();
            Object.assign(popupElement.style, swalErrorStyles.popup);
            const titleElement = popupElement.querySelector('.swal2-title');
            if (titleElement) Object.assign(titleElement.style, swalErrorStyles.title);
            const textElement = popupElement.querySelector('.swal2-html-container');
            if (textElement) Object.assign(textElement.style, swalErrorStyles.text);
          },
        });
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "bottom-center",
        showConfirmButton: false,
        timer: 3000,
        icon: "error",
        title: "Oops...",
        html: '<div style="font-size: 2rem;">👎</div> Something went wrong. Please try again later.',
        customClass: { popup: 'shake-popup' },
      });
    } finally {
      setLoading(false); // always stop loader
    }
  };




  useEffect(() => {
    const timer = setTimeout(() => {
      setActive("auth-sign-in");
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const container = document.getElementById("auth-container");
    if (!container) return;

    // Only run animation if viewport is larger than, say, 768px
    if (window.innerWidth < 768) return;

    // reset to full cover
    container.classList.remove("loaded");

    // let browser paint → then trigger animation
    setTimeout(() => {
      container.classList.add("loaded");
    }, 100);
  }, [active]); // run on initial load + every form switch


  const toggle = () => {
    const container = document.getElementById("auth-container");
    if (!container) return;

    // Don't run door animation on smaller screens
    if (window.innerWidth < 768) {
      // just toggle the form without animation
      setActive((prev) =>
        prev === "auth-sign-in" ? "auth-sign-up" : "auth-sign-in"
      );
      return;
    }

    // Step 1: Move text/form immediately
    container.classList.add("closing");

    // Step 2: Start door fill immediately (no wait)
    container.classList.remove("loaded");

    // Step 3: After door fully closed, switch form
    setTimeout(() => {
      setActive((prev) =>
        prev === "auth-sign-in" ? "auth-sign-up" : "auth-sign-in"
      );

      // Step 4: Instantly re-open door + show new content
      container.classList.remove("closing");
      container.classList.add("loaded");
    }, 800); // matches your CSS door transition time
  };

  // this is signup section functions

  const validateForm = () => {
    console.log("📝 Running form validation...");
    const { username, email, password, confirmPassword, contactNumber } = form;
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    if (!contactNumber) newErrors.contactNumber = "Contact number is required";

    console.log(" Validation result:", Object.keys(newErrors).length === 0 ? "Passed" : newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // useEffect(() => {
  //   if (Object.keys(errors).length > 0) {
  //     const timer = setTimeout(() => {
  //       setErrors({});
  //     }, 5000);

  //     return () => clearTimeout(timer); // Cleanup function to avoid memory leaks
  //   }
  // }, [errors]);
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    if (name === "password" || name === "confirmPassword") {
      let error = "";

      if (value.length > 0 && value.length < 5) {
        error = "Password must be at least 5 characters";
      } else if (
        (name === "confirmPassword" && value !== form.password) ||
        (name === "password" && form.confirmPassword && value !== form.confirmPassword)
      ) {
        error = "Passwords do not match";
      }

      setPasswordError(error);
    }
    // Validation for the username field
    if (name === "username") {
      // Allow only alphabetic characters and spaces
      if (/^[A-Za-z\s]*$/.test(value) || value === "") {
        setForm({ ...form, [name]: value });
      }
    }

    // Validation for contact number
    if (name === "contactNumber") {
      // Check if the value is empty or if it starts with 6-9 and is exactly 10 digits long
      if (value === "" || /^[6-9]\d{0,9}$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    }
    // Set email and password values
    if (name === "email" || name === "password" || name === "confirmPassword") {
      setForm({ ...form, [name]: value });
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear the error when user starts typing
    }));
  };


const handleSignupSubmit = async (e) => {
  e.preventDefault();

  //  Validation for 10-digit contact number
  if (form.contactNumber.length !== 10) {
    Swal.fire({
      toast: true,
      position: "bottom-center",
      icon: "error",
      title: "Invalid Contact Number",
      text: "Contact number must be exactly 10 digits!",
      timer: 3000,
      showConfirmButton: false,
      customClass: { popup: "shake-popup" },
      willOpen: () => {
        const popupElement = Swal.getPopup();
        Object.assign(popupElement.style, swalErrorStyles.popup);

        const titleElement = popupElement.querySelector(".swal2-title");
        if (titleElement) Object.assign(titleElement.style, swalErrorStyles.title);

        const textElement = popupElement.querySelector(".swal2-html-container");
        if (textElement) Object.assign(textElement.style, swalErrorStyles.text);
      },
    });
    return; //  stop submission
  }

   if (form.password.length < 5) {
    Swal.fire({
      icon: "error",
      title: "Weak Password",
      text: "Password must be at least 5 characters long.",
      ...swalErrorStyles.popup,
    });
    return;
  }

  //  Validation for password mismatch
  if (form.password !== form.confirmPassword) {
    Swal.fire({
      toast: true,
      position: "bottom-center",
      icon: "error",
      title: "Password Mismatch",
      text: "Passwords do not match. Please re-enter.",
      timer: 3000,
      showConfirmButton: false,
      customClass: { popup: "shake-popup" },
      willOpen: () => {
        const popupElement = Swal.getPopup();
        Object.assign(popupElement.style, swalErrorStyles.popup);

        const titleElement = popupElement.querySelector(".swal2-title");
        if (titleElement) Object.assign(titleElement.style, swalErrorStyles.title);

        const textElement = popupElement.querySelector(".swal2-html-container");
        if (textElement) Object.assign(textElement.style, swalErrorStyles.text);
      },
    });
    return; //  stop submission
  }

  // Run your existing validation
  if (!validateForm()) return;

  setLoading(true); // show loader

  try {
    const response = await fetch(`${ApiUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      // 🎉 Success
      confetti({
        particleCount: 150,
        spread: 100,
        startVelocity: 30,
        zIndex: 9999,
        origin: { y: 0.5 },
      });

      Swal.fire({
        toast: true,
        position: "bottom-center",
        showConfirmButton: false,
        icon: "success",
        timer: 4000,
        title: "🎉 Sign up Successful!",
        text: "You have successfully registered! Welcome aboard!",
        customClass: { popup: "my-popup" },
        willOpen: () => {
          const popupElement = Swal.getPopup();
          Object.assign(popupElement.style, swalStyles.popup);

          const titleElement = popupElement.querySelector(".swal2-title");
          if (titleElement) Object.assign(titleElement.style, swalStyles.title);

          const textElement = popupElement.querySelector(".swal2-html-container");
          if (textElement) Object.assign(textElement.style, swalStyles.text);
        },
      }).then(() => {
        setActive("auth-sign-in"); // redirect to login form
      });

      // Reset form data
      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
      });
      setErrors({});
    } else {
      //  Error response
      const data = await response.json();
      let errorMessage = "Something went wrong!";

      if (data.error === "Email already exists") {
        errorMessage = "The email address is already in use.";
      } else if (data.error === "Username already exists") {
        errorMessage = "The username is already taken.";
      } else if (data.error === "Contact number already exists") {
        errorMessage = "The number is already in use.";
      }

      Swal.fire({
        toast: true,
        position: "bottom-center",
        timer: 5000,
        showConfirmButton: false,
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        customClass: { popup: "shake-popup" },
        willOpen: () => {
          const popupElement = Swal.getPopup();
          Object.assign(popupElement.style, swalErrorStyles.popup);

          const titleElement = popupElement.querySelector(".swal2-title");
          if (titleElement) Object.assign(titleElement.style, swalErrorStyles.title);

          const textElement = popupElement.querySelector(".swal2-html-container");
          if (textElement) Object.assign(textElement.style, swalErrorStyles.text);
        },
      });
    }
  } catch (error) {
    //  Server/Network Error
    Swal.fire({
      toast: true,
      position: "bottom-center",
      showConfirmButton: false,
      timer: 4000,
      icon: "error",
      title: "Server Error",
      text: "Failed to connect to the server!",
      customClass: { popup: "shake-popup" },
      willOpen: () => {
        const popupElement = Swal.getPopup();
        Object.assign(popupElement.style, swalErrorStyles.popup);

        const titleElement = popupElement.querySelector(".swal2-title");
        if (titleElement) Object.assign(titleElement.style, swalErrorStyles.title);

        const textElement = popupElement.querySelector(".swal2-html-container");
        if (textElement) Object.assign(textElement.style, swalErrorStyles.text);
      },
    });
  } finally {
    setLoading(false); // always stop loader
  }
};



  function drawStar(ctx, x, y, r, alpha) {
    const spikes = 5;
    const outerRadius = r;
    const innerRadius = r / 2;
    let rot = Math.PI / 2 * 3;
    let cx = x;
    let cy = y;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      let x1 = cx + Math.cos(rot) * outerRadius;
      let y1 = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x1, y1);
      rot += step;

      let x2 = cx + Math.cos(rot) * innerRadius;
      let y2 = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x2, y2);
      rot += step;
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }

  useEffect(() => {
    const canvas = document.getElementById("star-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const stars = [];
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        alpha: Math.random(),
        delta: Math.random() * 0.02 + 0.005
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        star.alpha += star.delta;
        if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;

        drawStar(ctx, star.x, star.y, star.r, star.alpha);
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div id="auth-container" className={`auth-container ${active}`} >
      {/* <canvas id="star-canvas"></canvas> */}
      {/* FORM SECTION */}
      <div className="auth-row">
        {/* SIGN UP */}
        <div className="auth-col auth-align-center auth-flex-col auth-sign-up">
          <div className="auth-form-wrapper auth-align-center">
            <Link
              to="/"
              className={`auth-back-button ${active !== "auth-sign-in" ? "active-home" : ""}`}
            >
              <FaHome style={{ marginRight: "5px" }} />
              <span className="home-text">Home</span>
            </Link>
            <form className="auth-form auth-sign-up" onSubmit={handleSignupSubmit} autoComplete="off">
              <h2 className="login-title">Create Account</h2>
              <div className="auth-input-group">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleFieldChange}
                  required
                  autoFocus

                />
                <label>User Name</label>
                <FaUser className="auth-input-icon" />

              </div>
              <div className="auth-input-group">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFieldChange}
                  required
                />
                <label>Email</label>
                <FaEnvelope className="auth-input-icon" />

              </div>
              <div className="auth-input-group">
                <input
                  type="text"
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleFieldChange}
                  required
                />
                <label>WhatsApp Number</label>
                <FaWhatsapp className="auth-input-icon" />

              </div>
              <div className="auth-input-group">
                <input
                  name="password"
                  value={form.password}
                  onChange={handleFieldChange}
                  type={showPassword ? "text" : "password"}
                  required
                />
                <label>Password</label>
                <FaLock className="auth-input-icon" />
                <span onClick={togglePassword} className="auth-eye-icon">
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div className="auth-input-group">
                <input
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleFieldChange}
                  type={showConfirmPassword ? "text" : "password"}
                  required
                />
                <label>Confirm Password</label>
                <FaLock className="auth-input-icon" />

                <span onClick={toggleConfirmPassword} className="auth-eye-icon">
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              {passwordError && <p className="auth-error">{passwordError}</p>}

              <button type="submit" disabled={loading || active !== "auth-sign-up"}>
                {loading ? <span className="auth-loader"></span> : "Sign up"}
              </button>
              <p>
                <span>Already have an account? </span>
                <b onClick={toggle} className="auth-pointer">
                  Sign in here
                </b>
              </p>
            </form>
          </div>
        </div>

        {/* SIGN IN */}
        <div className="auth-col auth-align-center auth-flex-col auth-sign-in">
          <div className="auth-form-wrapper auth-align-center">
            <Link
              to="/"
              className={`auth-back-button ${active !== "auth-sign-in" ? "active-home" : ""}`}
            >
              <FaHome style={{ marginRight: "5px" }} />
              <span className="home-text">Home</span>
            </Link>

            <form className="auth-form auth-sign-in" onSubmit={handleSubmit} autoComplete="off">
              <h2 className="login-title">Welcome Back</h2>
              <div className="auth-input-group">
                <input
                  name="contact_number"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.contact_number}
                  onChange={handleChange}
                  autoFocus
                />
                <label>WhatsApp Number</label>
                <FaWhatsapp className="auth-input-icon" />

              </div>

              <div className="auth-input-group">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                />
                <label>Password</label>
                <FaLock className="auth-input-icon" />

                <span onClick={togglePassword} className="auth-eye-icon">
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <button type="submit" disabled={loading || active !== "auth-sign-in"}>
                {loading ? <span className="auth-loader"></span> : "Sign in"}
              </button>
              <Link to="/ForgotPassword" className="no-underline">
                <p>
                  <b>Forgot password?</b>
                </p>
              </Link>

              <p>
                <span>Don’t have an account? </span>
                <b onClick={toggle} className="auth-pointer">
                  Sign up here
                </b>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="auth-row auth-content-row">
        {/* SIGN IN CONTENT */}
        <div className="auth-col auth-align-center auth-flex-col">
          <div className="auth-text auth-sign-in">
            <Link to="/" className="logo-link">
              <img
                src="/img/logo3.png"
                width="230px"
                // style={{ marginLeft: "50px" }}
                alt="Company Logo"
              />
            </Link>
            <h2 className="auth-heading">Login with WhatsApp</h2>
            <p className="auth-content">
              Securely sign in using your WhatsApp number and access your
              account instantly.
            </p>
          </div>
          <div className="auth-img auth-sign-in"></div>
        </div>

        {/* SIGN UP CONTENT */}
        <div className="auth-col auth-align-center auth-flex-col">
          <div className="auth-img auth-sign-up"></div>
          <div className="auth-text auth-sign-up">
            <Link to="/" className="logo-link">
              <img
                src="/img/logo3.png"
                width="230px"
                // style={{ marginLeft: "50px" }}
                alt="Company Logo"
              />
            </Link>
            <h2 className="auth-heading">Join Our Family</h2>
            <p className="auth-content">
              Create your account today to unlock personalized recommendations,
              wishlist, and faster checkout.
            </p>
          </div>
        </div>
      </div>
    </div >
  );
};


const swalErrorStyles = {
  popup: {
    background: 'linear-gradient(145deg, #001a35, #3c68b4)',
    border: 'none',
    boxShadow: '0 0 25px rgba(100, 0, 0, 0.8)', // dark red shadow
    width: '360px',
    borderRadius: '2px',
  },
  title: {
    color: '#ff4d4f', // softer red for error
    fontWeight: 'bold',
    fontSize: '20px',
    textAlign: 'center', //  center title too
  },
  text: {
    color: '#ddddddff', // light gray (almost white)
    fontSize: '14px',
    textAlign: 'center', //  center text
  },
};

const swalStyles = {
  popup: {
    background: 'linear-gradient(145deg, #001a35, #3c68b4)',
    border: 'none',
    boxShadow: '0 0 15px rgba(76, 175, 80, 0.7)', // green shadow
    width: '500px',
    borderRadius: '2px',
  },
  title: {
    color: '#4CAF50', // green for success
    fontWeight: 'bold',
    textAlign: 'center', //  center title
    fontSize: '20px',

  },
  text: {
    color: '#ffffff', // white text
    fontSize: '14px',
    textAlign: 'center', //  center text
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

export default AuthForm;
