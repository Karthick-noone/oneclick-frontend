import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import axios from "axios"; // Ensure you have axios installed
import { ApiUrl } from "./ApiUrl";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa"; // Import the Check icon

const OrderTrackingModal = ({ isOpen, onRequestClose, order_id }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(""); // State for delivery date
  const [loading, setLoading] = useState(false); // Loading state for spinner

  // Define the statuses
  const regularStatuses = [
    "Order Placed",
    "Shipped",
    "Out of Delivery",
    "Delivered",
  ]; // Define the statuses

  const cancelledStatuses = ["Order Placed", "Cancelled"];

  const isCancelled = deliveryStatus === "Cancelled";
  const statuses = isCancelled ? cancelledStatuses : regularStatuses;

  console.log("OrderTrackingModal opened for Order ID:", order_id); // Log the order ID

  // Memoized fetch function to ensure it is stable across renders
  const fetchDeliveryStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ApiUrl}/api/get-order-status`, {
        params: { orderId: order_id },
      });

      const { delivery_status, delivery_date, order_date } = response.data;

      // Format the delivery date to "YYYY-MM-DD"
      const dateObj = new Date(delivery_date);
      const formattedDate = `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

      // setOrderDate(new Date(order_date).toISOString().split("T")[0]);
      setDeliveryStatus(delivery_status);
      setSelectedStatus(delivery_status);
      setDeliveryDate(formattedDate);
    } catch (error) {
      console.error("Error fetching delivery status:", error);
      Swal.fire({
        icon: "error",
        title: "Error Fetching Status",
        text: "Could not fetch delivery status.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false); // Stop loading spinner after fetch completes
    }
  }, [order_id, ApiUrl]);

  useEffect(() => {
    // Fetch data only when the modal opens
    if (isOpen) {
      fetchDeliveryStatus();
    }
  }, [isOpen, fetchDeliveryStatus]);

  const formatDeliveryDate = (dateString) => {
    const dateObj = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return dateObj.toLocaleDateString("en-GB", options); // Custom format
  };

  const handleModalClose = () => {
    console.log("Modal closed"); // Log when the modal is closed
    onRequestClose();
  };

  // Get the index of the current delivery status
  const currentIndex = statuses.indexOf(deliveryStatus);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleModalClose}
      ariaHideApp={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          width: "350px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          zIndex: "1002",
        },
      }}
    >
      {loading ? (
        <div className="spinner-container" style={{ height: "225px" }}>
          <div className="spinner">{/* Spinner content here */}</div>
        </div>
      ) : (
        <>
          <button
            onClick={handleModalClose}
            className="modal-close-button10 close-button"
          >
            &#10006; {/* Using a close icon */}
          </button>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            {isCancelled ? "Order Cancelled" : "Delivery Status"}
          </h2>
          <div className="vertical-tracking-bar">
            {statuses.map((currentStatus, index) => (
              <div className="tracking-step" key={currentStatus}>
                <div
                  className="tracking-dot"
                  style={{
                    backgroundColor: index <= currentIndex ? "green" : "gray",
                    position: "relative",
                  }}
                >
                  {index === currentIndex && (
                    <FaCheck
                      style={{
                        fontSize: "10px",
                        color: "white",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}
                </div>

                <label style={{ marginLeft: "10px" }}>
                  {/* Logic to conditionally display "Delivered" or "Delivery expected on" */}
                  {deliveryStatus === "Delivered" && index === 3
                    ? "Delivered" // Display 'Delivered' if status is 'Delivered'
                    : index === 3
                    ? "Delivery expected on " // Show "Delivery expected on" for the corresponding index
                    : currentStatus}
                  {/* Show delivery date next to "Delivery expected on" */}
                  {index === 3 &&
                    deliveryDate &&
                    deliveryStatus !== "Delivered" && (
                      <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                        {deliveryDate}
                        {(() => {
                          const dateObj = new Date(deliveryDate);
                          const day = String(dateObj.getDate()).padStart(
                            2,
                            "0"
                          ); // Ensure day has leading zero
                          const month = dateObj.toLocaleString("default", {
                            month: "short",
                          }); // Get month as short name
                          const year = dateObj.getFullYear(); // Get year

                          return `${day} ${month} ${year}`; // Return formatted date
                        })()}
                      </span>
                    )}
                  {/* Show delivery date next to "Delivered" */}
                  {deliveryStatus === "Delivered" &&
                    index === 4 &&
                    deliveryDate && (
                      <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                        {deliveryDate}
                      </span>
                    )}
                </label>
              </div>
            ))}
            <div className="tracking-line-container">
              <div className="tracking-line" />
              <div
                className="tracking-line-completed"
                style={{
                  height: `${((currentIndex + 1) * 100) / statuses.length}%`, // Calculate height based on current status
                  transition: "height 0.3s ease", // Optional: Add a transition for smoothness
                }}
              />
              {/* Position tracking dot based on current status */}
              {deliveryStatus !== "Delivered" && !isCancelled && (
                <div
                  className="tracking-dot2"
                  style={{
                    top: `${((currentIndex + 1) * 100) / statuses.length}%`,
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default OrderTrackingModal;
