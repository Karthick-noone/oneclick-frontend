import React, { useState } from "react";
import "./css/BranchLogin.css";
import { Link } from "react-router-dom";
import { ApiUrl } from "./ApiUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function BranchLogin() {
    const [form, setForm] = useState({
        phone: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.phone || !form.password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const response = await fetch(`${ApiUrl}/api/branch/branch-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const result = await response.json();
            console.log("Resuklt", result)

            if (response.ok) {
                toast.success("Login successful!");
                console.log("Resuklt", result)

                // Store login info dynamically
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userRole", "branch_admin");
                localStorage.setItem("branch", JSON.stringify({
                    id: result.branch.id,       // branch_id from backend
                    branch_name: result.branch.branch_name,
                    phone: result.branch.phone,
                    email: result.branch.email,
                    name: result.branch.owner_name,
                    contact_person: result.branch.contact_person,
                }));
                localStorage.setItem("current_branch", result.branch.id);

                setTimeout(() => {
                    window.location.href = "/Admin/BranchDashboard";
                }, 1000); // small delay so user sees toast
            } else {
                toast.error(result.message || "Login failed");
            }
        } catch (err) {
            console.error("Error logging in:", err);
            toast.error("Network error. Please try again.");
        }
    };



    return (
        <div className="login-container">
            <div className="login-left">
                <div className="login-left-content">
                    <h2>Welcome to OneClick </h2>
                    <p>
                        Manage your business efficiently, track sales, and stay connected with
                        the network.
                    </p>
                </div>
            </div>
            <div className="login-right">
                <Link to={"/"}>
                    <span className="back-to-home-button"><Home size={18} />Home</span></Link>
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Business Login</h2>
                    {error && <p className="form-error">{error}</p>}

                    <div className="form-group">
                        <label>Mobile Number</label>
                        <input
                            type="phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter Your Mobile Number"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter Your Password"
                            required
                        />
                        <span onClick={togglePassword} className="fa-eye-icon">
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    {/* <div className="form-options">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />{" "} Remember me
                        </label></div> */}
                    {/* <a href="/forgot-password" className="forgot-link">
              Forgot password?
            </a> */}


                    <button type="submit" className="login-btn">
                        Login
                    </button>

                    <p className="register-link">
                        Don't have a business account? <Link to={"/branch-register"}>Register</Link>
                    </p>
                </form>
            </div>
            <ToastContainer position="bottom-center" autoClose={3000} />

        </div>
    );
}

export default BranchLogin;
