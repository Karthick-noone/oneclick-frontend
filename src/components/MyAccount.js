import React, { useEffect, useState } from "react";
import Header2 from "./Header2";
import Footer from "./footer";
import fullad from './img/fullad.jpg';

const MyAccount = () => {
  const [user, setUser] = useState({ username: "", email: "" });

  // Fetch user data from localStorage when the component mounts
  useEffect(() => {
    const username = localStorage.getItem("username") || "Guest";
    const email = localStorage.getItem("email") || "Not provided";
    setUser({ username, email });
  }, []);


   // Function to capitalize the first letter of a string
   const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <>
      {/* Header */}
      <Header2 />

      {/* Banner Section */}
      <div style={styles.bannerContainer}>
        <img src={fullad} alt="Banner" style={styles.bannerImage} />
        <div style={styles.bannerTextContainer}>
          <h2 style={styles.bannerText}>Welcome, {user.username  ? capitalizeFirstLetter(user.username) : 'N/A'}!</h2>
        </div>
      </div>

      {/* Main Profile Section */}
      <div style={styles.accountContainer}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <img
              src={fullad} // Placeholder for avatar, replace with actual user image
              alt="User Avatar"
              style={styles.avatar}
            />
            <div>
              <h2 style={styles.profileName}>{user.username  ? capitalizeFirstLetter(user.username) : 'N/A'}</h2>
              <p style={styles.profileEmail}>{user.email}</p>
              <p style={styles.profileAbout}>
                
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div style={styles.infoSection}>
          <h3>Recent Orders</h3>
          <p>No recent orders yet. Start shopping now!</p>
        </div>

        {/* Account Settings */}
        <div style={styles.infoSection}>
          <h3>Account Settings</h3>
          <p>Manage your account, update your profile, and change your password.</p>
          <a href="/ForgotPassword"><button className="change-btn"> Change Password</button></a>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default MyAccount;

// Styles for the enhanced page
const styles = {
  bannerContainer: {
    position: "relative",
    width: "100%",
    height: "250px",
    overflow: "hidden",
    marginTop:'0px'
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  bannerTextContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    textAlign: "center",
  },
  bannerText: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  accountContainer: {
    padding: "20px",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginBottom: "30px",
    textAlign: "left",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    marginRight: "20px",
  },
  profileName: {
    fontSize: "1.8rem",
    margin: 0,
  },
  profileEmail: {
    fontSize: "1rem",
    color: "#666",
  },
  profileAbout: {
    marginTop: "10px",
    fontSize: "1rem",
    color: "#444",
  },
  infoSection: {
    textAlign: "left",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
};