import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/MarginSettings.css";
import { ApiUrl } from "../../components/ApiUrl";

const MarginSettings = () => {
    const [ranges, setRanges] = useState([]);
    const [rangeFrom, setRangeFrom] = useState("");
    const [rangeTo, setRangeTo] = useState("");
    const [marginAmount, setMarginAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchMargins();
    }, []);

    const fetchMargins = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${ApiUrl}/api/margins/get-margins`);
            setRanges(res.data || []);
        } catch (error) {
            console.error("Error fetching margins:", error);
            setErrorMessage("Failed to load margin rules. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const validateInputs = () => {
        const from = Number(rangeFrom);
        const to = Number(rangeTo);
        const margin = Number(marginAmount);

        if (!from || !to || !margin) {
            return "All fields are required";
        }
        if (from < 0 || to < 0 || margin < 0) {
            return "Values cannot be negative";
        }
        if (from >= to) {
            return "'Range From' must be less than 'Range To'";
        }
        if (margin > to - from) {
            return "Margin cannot exceed the price range gap";
        }

        for (let r of ranges) {
            if (
                (from >= r.range_from && from <= r.range_to) ||
                (to >= r.range_from && to <= r.range_to) ||
                (from <= r.range_from && to >= r.range_to)
            ) {
                return "Range overlaps with an existing margin rule";
            }
        }

        return "";
    };

    const handleAddMargin = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        try {
            setSaving(true);
            setErrorMessage("");

            await axios.post(`${ApiUrl}/api/margins/add-margin`, {
                range_from: rangeFrom,
                range_to: rangeTo,
                margin_amount: marginAmount,
            });

            setRangeFrom("");
            setRangeTo("");
            setMarginAmount("");
            setErrorMessage("");

            fetchMargins();
        } catch (error) {
            console.error("Error adding margin:", error);
            setErrorMessage("Failed to add margin rule. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddMargin();
        }
    };

    const askDelete = (id) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${ApiUrl}/api/margins/delete-margin/${deleteId}`);
            fetchMargins();
        } catch (error) {
            console.error("Error deleting margin:", error);
            setErrorMessage("Failed to delete margin rule. Please try again.");
        } finally {
            setShowDeleteConfirm(false);
            setDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setDeleteId(null);
    };

    return (
        <div className="margin-wrapper">
            <div className="header-section">
                <h1 className="margin-title">Margin Settings</h1>
                <p className="margin-subtitle">
                    Configure margin rules for branch admin product pricing
                </p>
            </div>

            {/* Input Card */}
            <div className="enhanced-card">
                <h3 style={{ 
                    color: '#2d3748', 
                    marginBottom: '24px', 
                    fontSize: '1.25rem',
                    fontWeight: '600'
                }}>
                    Add New Margin Rule
                </h3>
                
                <div className="margin-row">
                    <div className="margin-group">
                        <label>Range From (₹)</label>
                        <input
                            type="number"
                            value={rangeFrom}
                            onChange={(e) => setRangeFrom(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="1000"
                            min="0"
                        />
                    </div>

                    <div className="margin-group">
                        <label>Range To (₹)</label>
                        <input
                            type="number"
                            value={rangeTo}
                            onChange={(e) => setRangeTo(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="2000"
                            min="0"
                        />
                    </div>

                    <div className="margin-group">
                        <label>Margin Amount (₹)</label>
                        <input
                            type="number"
                            value={marginAmount}
                            onChange={(e) => setMarginAmount(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="100"
                            min="0"
                        />
                    </div>

                    <button
                        className="enhanced-save"
                        onClick={handleAddMargin}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <span className="loading-spinner"></span>
                                Adding...
                            </>
                        ) : (
                            "Add Margin"
                        )}
                    </button>
                </div>

                {errorMessage && (
                    <div className="error-box">
                        {errorMessage}
                    </div>
                )}
            </div>

            {/* Rules List Card */}
            <div className="enhanced-card">
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <h3 style={{ 
                        color: '#2d3748', 
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        margin: 0
                    }}>
                        Current Margin Rules
                    </h3>
                    <span style={{ 
                        color: '#718096', 
                        fontSize: '0.875rem',
                        background: '#f7fafc',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0'
                    }}>
                        {ranges.length} rules
                    </span>
                </div>

                {loading ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 24px',
                        color: '#718096'
                    }}>
                        <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            border: '3px solid #e2e8f0',
                            borderTop: '3px solid #3182ce',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                        }}></div>
                        Loading margin rules...
                    </div>
                ) : ranges.length === 0 ? (
                    <div className="empty-text">
                        No margin rules configured. Add your first rule above.
                    </div>
                ) : (
                    <table className="enhanced-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Range From</th>
                                <th>Range To</th>
                                <th>Margin</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ranges.map((item, idx) => (
                                <tr key={item.id}>
                                    <td>{idx + 1}</td>
                                    <td>₹{item.range_from.toLocaleString()}</td>
                                    <td>₹{item.range_to.toLocaleString()}</td>
                                    <td>
                                        <span style={{
                                            background: '#f0fff4',
                                            color: '#276749',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600'
                                        }}>
                                            ₹{item.margin_amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td>{new Date(item.created_at).toLocaleDateString('en-IN')}</td>
                                    <td>
                                        <button 
                                            className="button-delete"
                                            onClick={() => askDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="confirm-overlay">
                    <div className="confirm-box">
                        <h3>Delete Margin Rule?</h3>
                        <p>
                            This action cannot be undone. The margin rule will be permanently 
                            removed from the system.
                        </p>
                        <div className="confirm-actions">
                            <button className="button-cancel" onClick={cancelDelete}>
                                Cancel
                            </button>
                            <button className="button-confirm" onClick={confirmDelete}>
                                Delete Rule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarginSettings;