import React, { useState, useEffect } from "react";
// import noInternet from './img/no-internet.png';

const NetworkStatus = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      setIsOnline(navigator.onLine);
      setChecking(false);
    }, 1000); // simulate checking delay
  };

  if (!isOnline) {
    return (
      <div style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#fefefe",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}>
        <img
          src="no-internet.png"
          alt="No Internet"
          style={{
            maxWidth: "100px",
            marginBottom: "25px",
            filter: "drop-shadow(0 0 5px rgba(0,0,0,0.1))"
          }}
        />
        <h2 style={{ fontSize: "28px", color: "#222", marginBottom: "10px" }}>
          You're Offline
        </h2>
        <p style={{
          color: "#666",
          fontSize: "16px",
          maxWidth: "400px",
          marginBottom: "25px",
          lineHeight: "1.5"
        }}>
          Please check your internet connection and try again.
        </p>

        <button
          onClick={handleRetry}
          disabled={checking}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 123, 255, 0.2)",
            transition: "background-color 0.3s ease",
          }}
        >
          {checking ? "Checking..." : "Retry"}
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default NetworkStatus;
