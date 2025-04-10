import React, { useEffect, useState } from "react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Initialize with current network status

  const handleOnline = () => setIsOnline(true);  // Set to online when the network is restored
  const handleOffline = () => setIsOnline(false); // Set to offline when the network is lost

  useEffect(() => {
    // Add event listeners for 'online' and 'offline' events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup listeners when the component unmounts
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div>
      {!isOnline && (
        <div style={{
          backgroundColor: "#f44336",
          color: "white",
          padding: "10px",
          textAlign: "center",
          position: "fixed",
          top: "0",
          width: "100%",
          zIndex: "9999",
          fontSize: "16px",
          fontWeight: "bold",
        }}>
          <p>You are currently offline. Please check your connection.</p>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
