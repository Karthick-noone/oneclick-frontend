import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../components/ApiUrl";
import { toast } from "react-toastify";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  FileText,
  Globe
} from "lucide-react";
import "./css/BranchAdminProfile.css";

const BranchAdminProfile = () => {
  const [branchDetails, setBranchDetails] = useState(null);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const currentBranchId = localStorage.getItem("current_branch") || "all";
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    fetchBranchDetails();
  }, []);

  const fetchBranchDetails = async () => {
    try {
      // setLoading(true);
      
      const response = await fetch(`${ApiUrl}/api/branch/get-all`);
      const data = await response.json();
      
      if (response.ok && data.branches) {
        const currentBranch = data.branches.find(branch => 
          branch.id.toString() === currentBranchId.toString()
        );
        
        if (currentBranch) {
          setBranchDetails(currentBranch);
        } else {
          toast.error("Branch details not found");
        }
      } else {
        throw new Error(data.message || "Failed to fetch branches");
      }
    } catch (error) {
      console.error("Error fetching branch details:", error);
      toast.error("Failed to load branch details");
    } finally {
      // setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="profile-container">
  //       <div className="loading-spinner">
  //         <div className="spinner"></div>
  //         <p>Loading Branch Profile...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!branchDetails) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <h2>Branch Details Not Found</h2>
          <p>Unable to load branch information. Please try again.</p>
          {/* <button 
            className="back-button"
            onClick={() => navigate("/Admin/BranchDashboard")}
          >
            ← Back to Dashboard
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-content">
          <h1>Admin Profile</h1>
          <p>Complete details of your branch information</p>
        </div>
        {/* <button 
          className="back-button"
          onClick={() => navigate("/Admin/BranchDashboard")}
        >
          ← Back to Dashboard
        </button> */}
      </div>

      <div className="profile-card">
        {/* Header Section */}
        <div className="profile-hero">
          <div className="hero-content">
            <div className="logo-section">
              {branchDetails.logo ? (
                <img 
                  src={`${ApiUrl}${branchDetails.logo}`} 
                  alt="Branch Logo" 
                  className="branch-logo"
                />
              ) : (
                <div className="logo-placeholder">
                  <Building size={32} />
                </div>
              )}
            </div>
            <div className="hero-info">
              <h2>{branchDetails.company}</h2>
              <p className="branch-name">{branchDetails.branch_name}</p>
              <div className="status-container">
                <span className={`status-badge ${branchDetails.status}`}>
                  {branchDetails.status}
                </span>
                <span className="role-badge">
                  {branchDetails.user_role === "branch_admin" ? "Branch Admin" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="info-section">
          <div className="section-header">
            <User className="section-icon" />
            <h3>Contact Information</h3>
          </div>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">
                <User size={20} />
              </div>
              <div className="info-content">
                <label>Contact Person</label>
                <p>{branchDetails.contact_person}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Mail size={20} />
              </div>
              <div className="info-content">
                <label>Email Address</label>
                <p>{branchDetails.email}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Phone size={20} />
              </div>
              <div className="info-content">
                <label>Phone Number</label>
                <p>{branchDetails.phone}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <User size={20} />
              </div>
              <div className="info-content">
                <label>Owner Name</label>
                <p>{branchDetails.owner_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="info-section">
          <div className="section-header">
            <MapPin className="section-icon" />
            <h3>Address Information</h3>
          </div>
          <div className="info-grid">
            <div className="info-card full-width">
              <div className="info-icon">
                <MapPin size={20} />
              </div>
              <div className="info-content">
                <label>Full Address</label>
                <p>{branchDetails.address}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Building size={20} />
              </div>
              <div className="info-content">
                <label>City</label>
                <p>{branchDetails.city}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Globe size={20} />
              </div>
              <div className="info-content">
                <label>State</label>
                <p>{branchDetails.state}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <MapPin size={20} />
              </div>
              <div className="info-content">
                <label>Pincode</label>
                <p>{branchDetails.pincode}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Globe size={20} />
              </div>
              <div className="info-content">
                <label>Country</label>
                <p>{branchDetails.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="info-section">
          <div className="section-header">
            <FileText className="section-icon" />
            <h3>Business Information</h3>
          </div>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">
                <FileText size={20} />
              </div>
              <div className="info-content">
                <label>GSTIN Number</label>
                <p className="gstin-number">{branchDetails.gstin}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Calendar size={20} />
              </div>
              <div className="info-content">
                <label>Joined Date</label>
                <p>{new Date(branchDetails.joined_date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Building size={20} />
              </div>
              <div className="info-content">
                <label>Registration Date</label>
                <p>{new Date(branchDetails.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchAdminProfile;