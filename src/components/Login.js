import React, { useEffect, useState } from "react";
import "./css/AuthForm.css";
import { FaWhatsapp, FaLock, FaUser, FaEnvelope, FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ApiUrl } from "./ApiUrl";
import Swal from "sweetalert2";
import confetti from 'canvas-confetti'; // Import the confetti package

const AuthForm = () => {
    const [loading, setLoading] = useState(false);
    const [adminLoading, setAdminLoading] = useState(false);
    const [staffLoading, setStaffLoading] = useState(false);

    const [active, setActive] = useState("auth-sign-in");
    //   const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    //   const [passwordError, setPasswordError] = useState("");
    // 
    const [role, setRole] = useState("Admin"); // Added role state

    const togglePassword = () => setShowPassword(!showPassword);
    //   const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const [adminForm, setAdminForm] = useState({ username: "", password: "" });
    const [staffForm, setStaffForm] = useState({ username: "", password: "" });


    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });
    // };
    const handleAdminChange = (e) => {
        const { name, value } = e.target;
        setAdminForm({ ...adminForm, [name]: value });
    };

    const handleStaffChange = (e) => {
        const { name, value } = e.target;
        setStaffForm({ ...staffForm, [name]: value });
    };

    const handleRoleChange = (e) => {
        setRole(e.target.value); // Update role based on radio button selection
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

        const isAdmin = active === "auth-sign-in"; // or role === "Admin"
        const currentForm = isAdmin ? adminForm : staffForm; // choose correct form data
        const setLoading = isAdmin ? setAdminLoading : setStaffLoading; // choose correct loader

        setLoading(true); // start loader

        // Validate input
        if (!currentForm.username || !currentForm.password) {
            Swal.fire({
                toast: true,
                position: "bottom-center",
                icon: "error",
                title: "Oops...",
                text: "All fields are required!",
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
            setLoading(false);
            return;
        }

        try {
            const loginUrl = isAdmin ? `${ApiUrl}/adminlogin` : `${ApiUrl}/stafflogin`;

            const response = await fetch(loginUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentForm),
            });

            const result = await response.json();

            if (response.ok) {
                // Determine role for storage and message
                const loggedInRole = isAdmin ? "Admin" : "Staff";

                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userRole", loggedInRole);

                if (!isAdmin && result.staff) {
                    localStorage.setItem("staffname", result.staff.staffname);
                }

                // Success popup
                Swal.fire({
                    toast: true,
                    position: "bottom-center",
                    icon: "success",
                    title: `🎉 ${loggedInRole} Login successful`, // use loggedInRole
                    text: "You have logged in successfully!",
                    timer: 5000,
                    customClass: { popup: "my-popup" },
                    showConfirmButton: false,
                    willOpen: () => {
                        const popupElement = Swal.getPopup();
                        Object.assign(popupElement.style, swalStyles.popup);
                        const titleElement = popupElement.querySelector(".swal2-title");
                        if (titleElement) Object.assign(titleElement.style, swalStyles.title);
                        const textElement = popupElement.querySelector(".swal2-html-container");
                        if (textElement) Object.assign(textElement.style, swalStyles.text);

                        confetti({
                            particleCount: 150,
                            spread: 100,
                            startVelocity: 30,
                            zIndex: 9999,
                            origin: { y: 0.5 },
                        });
                    },
                }).then(() => {
                    // Navigate based on role
                    if (!isAdmin && result.staff) {
                        navigate("/Admin/Computers");
                    } else {
                        navigate("/Admin/Dashboard");
                    }
                });
            }
            else {
                // Login failed
                Swal.fire({
                    toast: true,
                    position: "bottom-center",
                    icon: "error",
                    title: `${role} Login failed `,
                    // title: `${role} Login failed `,
                    text: result.message || "Invalid credentials!",
                    showConfirmButton: false,
                    timer: 5000,
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
            Swal.fire({
                toast: true,
                position: "bottom-center",
                icon: "error",
                title: "Oops...",
                text: "Something went wrong. Please try again later.",
                customClass: { popup: "shake-popup" },
                willOpen: () => {
                    const popupElement = Swal.getPopup();
                    Object.assign(popupElement.style, swalErrorStyles.popup);
                    const titleElement = popupElement.querySelector(".swal2-title");
                    if (titleElement) Object.assign(titleElement.style, swalErrorStyles.title);
                    const textElement = popupElement.querySelector(".swal2-content");
                    if (textElement) Object.assign(textElement.style, swalErrorStyles.text);
                },
            });
        } finally {
            setLoading(false); // stop loader
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

        // Skip animation on small screens
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

        // Skip door animation on small screens
        if (window.innerWidth < 768) {
            setActive((prev) =>
                prev === "auth-sign-in" ? "auth-sign-up" : "auth-sign-in"
            );
            setRole((prevRole) => (prevRole === "Admin" ? "Staff" : "Admin"));
            setAdminForm({ username: "", password: "" });
            setStaffForm({ username: "", password: "" });
            return;
        }

        // Step 1: Hide current content instantly
        container.classList.add("closing");

        // Step 2: Close the door right away
        container.classList.remove("loaded");

        // Step 3: After door closing animation ends (match CSS: 0.8s)
        setTimeout(() => {
            setActive((prev) =>
                prev === "auth-sign-in" ? "auth-sign-up" : "auth-sign-in"
            );
            setRole((prevRole) => (prevRole === "Admin" ? "Staff" : "Admin"));
            setAdminForm({ username: "", password: "" });
            setStaffForm({ username: "", password: "" });

            // Step 4: Open door + reveal new content immediately
            container.classList.remove("closing");
            container.classList.add("loaded");
        }, 800); // matches your CSS background transition
    };





    return (
        <div id="auth-container" className={`auth-container ${active}`}>
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
                        <form className="auth-form auth-sign-up" onSubmit={handleSubmit} autoComplete="off" >
                            <h2 className="login-title">Staff Login</h2>
                            <div className="auth-input-group">
                                <input
                                    type="text"
                                    name="username"
                                    value={staffForm.username}
                                    onChange={handleStaffChange}
                                    required
                                    autoFocus

                                />
                                <label>User Name</label>
                                <FaUser className="auth-input-icon" />

                            </div>

                            <div className="auth-input-group">
                                <input
                                    name="password"
                                    value={staffForm.password}
                                    onChange={handleStaffChange}
                                    type={showPassword ? "text" : "password"}
                                    required
                                />
                                <label>Password</label>
                                <FaLock className="auth-input-icon" />

                                <span onClick={togglePassword} className="auth-eye-icon">
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>

                            <button type="submit" disabled={staffLoading || active !== "auth-sign-up"}>
                                {staffLoading ? <span className="auth-loader"></span> : "Sign In"}
                            </button>

                            <p>
                                <span>If you are an admin? </span>
                                <b value={role === "Staff"} onClick={toggle} className="auth-pointer">
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
                            <h2 className="login-title">Admin Login</h2>
                            <div className="auth-input-group">
                                <input
                                    type="text"
                                    name="username"
                                    value={adminForm.username}
                                    onChange={handleAdminChange}
                                    required
                                    autoFocus
                                />
                                <label>User Name</label>
                                <FaUser className="auth-input-icon" />

                            </div>

                            <div className="auth-input-group">
                                <input
                                    name="password"
                                    value={adminForm.password}
                                    onChange={handleAdminChange}
                                    type={showPassword ? "text" : "password"}
                                    required
                                />
                                <label>Password</label>
                                <FaLock className="auth-input-icon" />

                                <span onClick={togglePassword} className="auth-eye-icon">
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                            <button type="submit" disabled={adminLoading || active !== "auth-sign-in"}>
                                {adminLoading ? <span className="auth-loader"></span> : "Sign In"}
                            </button>

                            {/* <Link to="/ForgotPassword" className="no-underline">
                <p>
                  <b>Forgot password?</b>
                </p>
              </Link> */}

                            <p>
                                <span>If you are a staff? </span>
                                <b value={role === "Staff"} onClick={toggle} className="auth-pointer">
                                    Sign In here
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
                        <h2 className="auth-heading">Welcome Back</h2>
                        <p className="auth-content">
                            Enter your credentials to access your account
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
                        <h2 className="auth-heading">Welcome Back</h2>
                        <p className="auth-content">
                            Enter your credentials to access your account
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
        width: '280px',
        borderRadius: '2px',
    },
    title: {
        color: '#ff4d4f', // softer red for error
        fontWeight: 'bold',
        fontSize: '18px',
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
