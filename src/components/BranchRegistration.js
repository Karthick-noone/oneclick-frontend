import React, { useState } from "react";
import "./css/BranchRegistration.css";
import { Link } from "react-router-dom";
import { ApiUrl } from "./ApiUrl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const BranchRegistration = () => {
    const [form, setForm] = useState({
        branch_name: "",
        company: "",
        gstin: "",
        owner_name: "",
        contact_person: "",
        password: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        place: "",
        state: "Tamil Nadu",
        country: "India",
        pincode: "",
        status: "pending",
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [showGSTPopup, setShowGSTPopup] = useState(true);
    const [gstNumber, setGstNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    };

    const validatePassword = (password) => {
        // Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return passwordRegex.test(password);
    };


    const fetchGSTDetails = async () => {
        if (!gstNumber || gstNumber.length !== 15) {
            toast.warning("Please enter a valid 15-character GSTIN number");
            return;
        }

        setLoading(true);

        try {
            // STEP 1: Check GSTIN already exists in your DB
            const checkRes = await fetch(`${ApiUrl}/api/branch/check-gstin?gstin=${gstNumber}`);
            const checkData = await checkRes.json();

            if (checkData.exists) {
                toast.error("This GSTIN is already registered!");
                setLoading(false);
                return; // ❌ STOP here, don't fetch GST details
            }

            // STEP 2: Only fetch GST details if not exists
            const response = await fetch(`${ApiUrl}/api/gst/gstinfo?gstin=${gstNumber}`);
            const data = await response.json();

            if (response.ok) {
                toast.success("GST details fetched successfully!");

                setForm((prev) => ({
                    ...prev,
                    gstin: gstNumber,
                    owner_name: data.legal_name || "",
                    contact_person: data.legal_name || "",
                    address: data.address,
                    city: data.city || "",
                    place: data.city || "",
                    state: data.state || "Tamil Nadu",
                    pincode: data.pincode || "",
                    branch_name: data.trade_name || "",
                    company: data.trade_name || "",
                }));

                setShowGSTPopup(false);
            } else {
                toast.error(data.message || "Invalid GST number");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🟡 Form submit triggered");
    console.log("🟡 Form data:", form);

    // 1️⃣ Password match check
    if (form.password !== form.confirm_password) {
        console.warn("🔴 Password mismatch");
        toast.error("Passwords do not match!");
        return;
    }

    // 2️⃣ Password validation
    if (!validatePassword(form.password)) {
        console.warn("🔴 Password validation failed:", form.password);
        toast.error(
            "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
        );
        return;
    }

    // 3️⃣ Phone validation
    if (!validatePhone(form.phone)) {
        console.warn("🔴 Phone validation failed:", form.phone);
        toast.error("Phone number must start with 6-9 and be exactly 10 digits.");
        return;
    }

    try {
        console.log("🟡 Sending API request to:", `${ApiUrl}/api/branch/branch-register`);

        const response = await fetch(`${ApiUrl}/api/branch/branch-register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        console.log("🟡 Response status:", response.status);

        const result = await response.json();
        console.log("🟡 Response body:", result);

        if (response.ok) {
            console.log("🟢 Branch registered successfully");
            toast.success("Branch registered successfully!");
            setSubmitted(true);
        } else {
            console.error("🔴 Backend error:", result);
            toast.error(result.message || "Failed to register");
        }

    } catch (err) {
        console.error("🔴 Fetch/network error:", err);
        toast.error("Network error. Please try again.");
    }
};



    return (
        <div className="branch-container">
            {showGSTPopup && (
                <div className="gst-popup-overlay">
                    <div className="gst-popup">
                        <Link to={"/"}>
                            <span title="Go back to home" className="back-to-home-button">
                                <Home size={18} />
                            </span>
                        </Link>
                        <h3 className="gst-header">Enter GSTIN Number</h3>
                        <input
                            type="text"
                            value={gstNumber}
                            onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                            maxLength="15"
                            placeholder="Enter 15-digit GSTIN"
                            autoFocus
                        />
                        <div className="popup-actions">
                            <button onClick={fetchGSTDetails} disabled={loading}>
                                {loading ? "Fetching..." : "Fetch Details"}
                            </button>
                            {/* <button onClick={() => setShowGSTPopup(false)}>Skip</button> */}
                        </div>
                    </div>
                </div>
            )}



            {submitted ? (
                <div className="branch-welcome-container">
                    {/* Left Section - Image */}
                    <div className="branch-welcome-left">
                        <img
                            src="https://img.freepik.com/free-vector/welcome-concept-illustration_114360-4062.jpg"
                            alt="Welcome Branch"
                            className="welcome-image"
                        />
                    </div>

                    {/* Right Section - Text */}
                    <div className="branch-welcome-right">
                        <h2>Welcome to OneClick Family 🎉</h2>
                        <p>
                            Your branch registration has been <strong>successfully submitted! </strong>
                            We’re thrilled to have you join our growing OneClick network.
                        </p>
                        <p>
                            Our team will review your details and get in touch with you shortly.
                            Once approved, you’ll gain access to manage your products, orders, and analytics — all from your personalized dashboard.
                        </p>

                        <div className="welcome-action">
                            <p>Already approved? You can log in below 👇</p>
                            <Link to={"/branch-login"} className="welcome-login-btn">
                                Go to Business Login
                            </Link>
                        </div>
                    </div>
                </div>

            ) : (
                <>
                    <Link to={"/"}>
                        <span className="back-to-home-button">
                            <Home size={18} />Home
                        </span>
                    </Link>
                    <h2 className="branch-title" >Business Registration</h2>
                    {/* <h2 className="branch-title" onClick={() => setSubmitted(true)}>Branch Registration</h2> */}
                    {/* <h2 className="branch-title" >Branch Registration</h2> */}

                    <form onSubmit={handleSubmit}>

                        <div className="form-row">
                            {/* Left side - Name Value Pair */}
                            <div className="form-left">
                                <div className="form-pair">
                                    <span className="field-name">GSTIN</span>
                                    <span className="field-value">{form.gstin}</span>
                                </div>
                                <div className="form-pair">
                                    <span className="field-name">Trade Name</span>
                                    <span className="field-value">{form.branch_name}</span>
                                </div>
                                <div className="form-pair">
                                    <span className="field-name">Owner</span>
                                    <span className="field-value">{form.owner_name}</span>
                                </div>
                                <div className="form-pair">
                                    <span className="field-name">Address</span>
                                    <span className="field-value">{form.address}</span>
                                </div>
                                <div className="form-pair">
                                    <span className="field-name">City</span>
                                    <span className="field-value">{form.city}</span>
                                </div>
                                <div className="form-pair">
                                    <span className="field-name">State</span>
                                    <span className="field-value">{form.state}</span>
                                </div>
                                <div className="form-pair">
                                    <span className="field-name">Pincode</span>
                                    <span className="field-value">{form.pincode}</span>
                                </div>
                                <div className="form-pair">
                                    <span className="field-name">Country</span>
                                    <span className="field-value">{form.country}</span>
                                </div>
                            </div>

                            {/* Right side - Input Fields */}
                            <div className="form-right">
                                <div className="form-group">
                                    <label>Company*</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={form.company}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Person*</label>
                                    <input
                                        type="text"
                                        name="contact_person"
                                        value={form.contact_person}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone*</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                        maxLength="10"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email*</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Place*</label>
                                    <input
                                        type="text"
                                        name="place"
                                        value={form.place}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password*</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span onClick={togglePassword} className="fa-eye-icon">
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password*</label>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirm_password"
                                        value={form.confirm_password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span onClick={toggleConfirmPassword} className="fa-eye-icon">
                                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {error && <p className="form-error">{error}</p>}


                        <button type="submit" className="submit-btn">
                            Register Business
                        </button>


                        <p className="login-link">
                            Already registered?   <Link to={"/branch-login"}>Login</Link>
                        </p>
                    </form>
                </>
            )}
            <ToastContainer position="bottom-center" autoClose={3000} />

        </div>
    );
}

export default BranchRegistration;
