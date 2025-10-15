import React from "react";
import logo from "./img/logo3.png"; 
import emptyCart from "./img/empty-cart.png"; 

const MaintenancePage = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh", // ensures full screen
                width: "100%",
                textAlign: "center",
                // background: "linear-gradient(135deg, #838bffff, #ebedee)", // light gradient
                color: "#333",
                padding: "20px",
                margin: 0, 
            }}
        >
            <img
                className="store-logo"
                src={logo}
                alt="Company Logo"
                style={{ width: "200px", marginBottom: "20px" }}
            />
            <h1 style={{ fontSize: "2rem", marginBottom: "10px", color:'#333' }}>
                 OneClick is Under Maintenance 
            </h1>
            <p style={{ fontSize: "1.1rem", maxWidth: "500px" }}>
                We’re currently updating our products. Please check back later.
            </p>

            <img
                className="store-logo"
                src={emptyCart}
                alt="Company Logo"
                style={{ width: "300px", marginBottom: "20px" }}
            />
        </div>
    );
};

export default MaintenancePage;
