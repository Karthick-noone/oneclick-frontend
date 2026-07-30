import React, { useState, useEffect } from "react";
import axios from "axios";
import { Gift, Info } from "lucide-react";
import { ApiUrl } from "../../components/ApiUrl";
import "./css/AdminScratchRewards.css";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminScratchRewards = () => {
    const [rewards, setRewards] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        discount_type: "flat",
        discount_value: "",
        max_discount: "",
        min_order_amount: "",
        probability: "",
        expiry_date: "",
    });

    // ==============================
    // FETCH ALL REWARDS
    // ==============================
    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${ApiUrl}/api/fetch-scratch-coupons`
            );

            console.log("🔥 API RESPONSE:", res.data);

            // ✅ Extract the array properly
            setRewards(res.data.data || []);

        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // HANDLE INPUT CHANGE
    // ==============================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    // ==============================
    // FORM VALIDATION
    // ==============================
const validateForm = () => {

    if (!form.discount_value || form.discount_value <= 0) {
        toast.error("Discount value must be greater than 0");
        return false;
    }

    if (form.discount_type === "percentage") {

        if (form.discount_value > 100) {
            toast.error("Percentage cannot exceed 100%");
            return false;
        }

        if (!form.max_discount || form.max_discount <= 0) {
            toast.error("Max discount is required for percentage type");
            return false;
        }
    }

    if (!form.min_order_amount || form.min_order_amount < 0) {
        toast.error("Minimum order amount is required");
        return false;
    }

    if (!form.probability || form.probability <= 0 || form.probability > 100) {
        toast.error("Probability must be between 1 and 100");
        return false;
    }

    if (!form.expiry_date) {
        toast.error("Expiry date is required");
        return false;
    } else {
        const selected = new Date(form.expiry_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selected <= today) {
            toast.error("Expiry date must be a future date");
            return false;
        }
    }

    const totalProbability =
        rewards.reduce((sum, r) => sum + Number(r.probability || 0), 0) +
        Number(form.probability);

    if (totalProbability > 100) {
        toast.error("Total probability cannot exceed 100%");
        return false;
    }

    return true;
};

    const generateCouponCode = (discountValue) => {
        const random = Math.random()
            .toString(36)
            .substring(2, 5)
            .toUpperCase();

        return `SCR${discountValue}${random}`;
    };

    // ==============================
    // ADD REWARD
    // ==============================
    const handleAdd = async () => {
        console.log("🚀 Add Reward Clicked");

        if (!validateForm()) {
            console.log("❌ Validation Failed", errors);
            // toast.error("Please fix validation errors");
            return;
        }

        try {
            const payload = {
                coupon_code: generateCouponCode(form.discount_value),
                discount_type: form.discount_type,
                discount_value: form.discount_value,
                max_discount:
                    form.discount_type === "percentage"
                        ? form.max_discount
                        : null,
                min_order_amount: form.min_order_amount,
                probability: form.probability,
                expiry_date: form.expiry_date,
                is_active: true,
            };

            console.log("📦 Payload Sending to Backend:");
            console.table(payload);

            const response = await axios.post(
                `${ApiUrl}/api/add-scratch-coupons`,
                payload
            );

            console.log("✅ Backend Response:", response.data);

            toast.success("Reward added successfully 🎉");

            fetchRewards();

            setForm({
                discount_type: "flat",
                discount_value: "",
                max_discount: "",
                min_order_amount: "",
                probability: "",
                expiry_date: "",
            });

        } catch (error) {
            console.error("❌ Add Reward Error:", error);

            if (error.response) {
                toast.error(error.response.data.message || "Server error");
            } else {
                toast.error("Network error");
            }
        }
    };

    // ==============================
    // DELETE REWARD
    // ==============================
    const deleteReward = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This reward will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            console.log("🗑 Deleting Reward ID:", id);

            await axios.delete(`${ApiUrl}/api/scratch-coupons/${id}`);

            await fetchRewards();

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Reward has been deleted successfully.",
                timer: 1500,
                showConfirmButton: false,
            });

        } catch (error) {
            console.error("❌ Delete error:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong while deleting.",
            });
        }
    };


    // ==============================
    // TOGGLE STATUS
    // ==============================
    const toggleStatus = async (reward) => {
        try {
            await axios.put(`${ApiUrl}/api/scratch-coupons/toggle/${reward.id}`, {
                is_active: !reward.is_active,
            });

            fetchRewards();
        } catch (error) {
            console.error("Toggle error:", error);
        }
    };

    const totalProbability = rewards.reduce(
        (sum, r) => sum + Number(r.probability || 0),
        0
    );

    return (
        <div className="oc-scratch-wrapper">
            <div className="oc-scratch-header">
                <div className="oc-header-top">
                    <h2>🎁 Scratch Reward Management</h2>


                </div>

                <div className="oc-probability-line">
                    <p>
                        Total Probability Used:
                        <span className="oc-probability-value">
                            {totalProbability}%
                        </span> / 100%
                    </p>

                    <div className="oc-probability-info">
                        <Info size={18} className="oc-info-icon" />
                        <div className="oc-tooltip">
                            Probability determines how often a reward is assigned.
                            The total of all active rewards must equal 100%.
                            Higher percentage = higher chance of winning.
                        </div>
                    </div>
                </div>

            </div>

            <div className="oc-scratch-card">
                <h3 className="oc-scratch-title">Add New Reward</h3>

                <div className="oc-scratch-form-grid">

                    <div className="oc-scratch-field">
                        <label>Discount Type</label>
                        <select
                            name="discount_type"
                            value={form.discount_type}
                            onChange={handleChange}
                        >
                            <option value="flat">Flat</option>
                            <option value="percentage">Percentage</option>
                        </select>
                    </div>

                    <div className="oc-scratch-field">
                        <label>Discount Value(Rs.)</label>
                        <input
                            type="number"
                            name="discount_value"
                            value={form.discount_value}
                            onChange={handleChange}
                        />
                        {errors.discount_value && (
                            <span className="oc-scratch-error">
                                {errors.discount_value}
                            </span>
                        )}
                    </div>

                    {form.discount_type === "percentage" && (
                        <div className="oc-scratch-field">
                            <label>Max Discount(Rs.)</label>
                            <input
                                type="number"
                                name="max_discount"
                                value={form.max_discount}
                                onChange={handleChange}
                            />
                            {errors.max_discount && (
                                <span className="oc-scratch-error">
                                    {errors.max_discount}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="oc-scratch-field">
                        <label>Minimum Order(Rs.)</label>
                        <input
                            type="number"
                            name="min_order_amount"
                            value={form.min_order_amount}
                            onChange={handleChange}
                        />
                        {errors.min_order_amount && (
                            <span className="oc-scratch-error">
                                {errors.min_order_amount}
                            </span>
                        )}
                    </div>

                    <div className="oc-scratch-field">
                        <label>Probability (%)</label>
                        <input
                            type="number"
                            name="probability"
                            value={form.probability}
                            onChange={handleChange}
                        />
                        {errors.probability && (
                            <span className="oc-scratch-error">
                                {errors.probability}
                            </span>
                        )}
                    </div>

                    <div className="oc-scratch-field">
                        <label>Expiry Date</label>
                        <input
                            type="date"
                            name="expiry_date"
                            value={form.expiry_date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                        />
                        {errors.expiry_date && (
                            <span className="oc-scratch-error">
                                {errors.expiry_date}
                            </span>
                        )}
                    </div>

                </div>

                <button className="oc-scratch-primary-btn" onClick={handleAdd}>
                    <Gift size={16} /> Add Reward
                </button>
            </div>

            <div className="oc-scratch-card">
                <h3 className="oc-scratch-title">Reward Pool</h3>

                <table className="oc-scratch-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Value</th>
                            <th>Min Order</th>
                            <th>Probability</th>
                            <th>Expiry</th>
                            {/* <th>Status</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7">Loading...</td>
                            </tr>
                        ) : rewards.length === 0 ? (
                            <tr>
                                <td colSpan="7">No rewards found</td>
                            </tr>
                        ) : (
                            rewards.map((r, idx) => (
                                <tr key={r.id}>
                                    <td>{idx + 1}</td>
                                    <td>{r.coupon_code}</td>
                                    <td>{r.discount_type}</td>
                                    <td>
                                        {r.discount_type === "flat"
                                            ? `₹${r.discount_value}`
                                            : `${r.discount_value}%`}
                                    </td>
                                    <td>₹{r.min_order_amount}</td>
                                    <td>{r.probability}%</td>
                                    <td>
                                        {r.expiry_date
                                            ? (() => {
                                                const date = new Date(r.expiry_date);
                                                const day = String(date.getDate()).padStart(2, "0");
                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                const year = date.getFullYear();
                                                return `${day}-${month}-${year}`;
                                            })()
                                            : ""}
                                    </td>
                                    {/* <td>
                                        <span
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleStatus(r);
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className={
                                                r.is_active
                                                    ? "oc-scratch-badge-active"
                                                    : "oc-scratch-badge-inactive"
                                            }
                                        >
                                            {r.is_active ? "Active" : "Inactive"}
                                        </span>

                                    </td> */}
                                    <td>
                                        {/* <button
                      className="oc-scratch-toggle-btn"
                      onClick={() => toggleStatus(r)}
                    >
                      Toggle
                    </button> */}

                                        <button
                                            className="oc-scratch-delete-btn"
                                            onClick={() => deleteReward(r.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer position="top-right" autoClose={2000} />

        </div>
    );
};

export default AdminScratchRewards;
