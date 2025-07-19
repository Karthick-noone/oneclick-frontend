import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import "./css/OrderTrackingModal.css"; // Ensure to import your CSS file
import axios from "axios"; // Ensure you have axios installed
import { ApiUrl } from "../../components/ApiUrl";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa"; // Import the Check icon

const OrderTrackingModal = ({ isOpen, onRequestClose, order_id }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(""); // Add state for delivery date
  const [, setLoading] = useState(false); // Loading state for spinner

  const regularStatuses = [
    "Order Placed",
    "Shipped",
    "Out of Delivery",
    "Delivered",
  ]; // Define the statuses

  const cancelledStatuses = ["Order Placed", "Cancelled"];

  const isCancelled = deliveryStatus === "Cancelled";
  const statuses = isCancelled ? cancelledStatuses : regularStatuses;

  const [orderDate, setOrderDate] = useState(""); // State for order date

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

      setOrderDate(new Date(order_date).toISOString().split("T")[0]);
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
  }, [order_id]);

  useEffect(() => {
    // Fetch data only when the modal opens
    if (isOpen) {
      fetchDeliveryStatus();
    }
  }, [isOpen, fetchDeliveryStatus]);

  // const maxDate = () => {
  //   if (orderDate) {
  //     const maxDateObj = new Date(orderDate);
  //     maxDateObj.setDate(maxDateObj.getDate() + 30);
  //     return maxDateObj.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  //   }
  //   return "";
  // };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setSelectedStatus(status);
    console.log(`Status changed to: ${status}`); // Log the new status
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value; // Get the selected date
    const currentDate = new Date(selectedDate); // Convert to a Date object
    const minDate = new Date(orderDate); // Get min date
    const maxDateValue = new Date(orderDate);
    maxDateValue.setDate(maxDateValue.getDate() + 30); // Calculate max date

    // Check if the selected date is valid
    if (currentDate >= minDate && currentDate <= maxDateValue) {
      setDeliveryDate(selectedDate);
      console.log(`Delivery date selected: ${selectedDate}`);
    } else {
      // Optionally reset to the previous valid delivery date
      console.warn("Selected date is invalid. Please select a valid date.");
      // You can also show a warning or reset to a default date here if desired
    }
  };

  const handleUpdateStatus = async () => {
    console.log(`Updating status to: ${selectedStatus}`); // Log the status being updated
    try {
      const response = await axios.put(`${ApiUrl}/api/update-status`, {
        orderId: order_id,
        deliveryStatus: selectedStatus,
        deliveryDate: deliveryDate, // Include delivery date in the update
      });

      console.log("Status updated successfully:", response.data);

      // Update the delivery status and date to trigger re-render
      setDeliveryStatus(selectedStatus);
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "The delivery status and date have been updated successfully!",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        icon: "error",
        title: "Error Updating Status",
        text: error.response
          ? error.response.data.message
          : "An unexpected error occurred.",
        confirmButtonText: "OK",
      });
    }
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
          backgroundColor: "#fff", // Light red for cancelled
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          width: "350px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          zIndex: "1002",
        },
      }}
    >
      {/* {loading ? (
        <div className="spinner-container" style={{ height: "360px" }}>
          <div className="spinner"></div>
        </div>
      ) : ( */}
        <>
          <button
            onClick={handleModalClose}
            className="modal-close-button10 close-button"
          >
            &#10006; {/* Using a close icon (fatimes) */}
          </button>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            {isCancelled ? "Order Cancelled" : "Delivery Status"}
          </h2>

          {/* Delivery Date Input */}
          {!isCancelled && (
            <label htmlFor="delivery-date" style={{ marginBottom: "10px" }}>
              Set Delivery Date:
            </label>
          )}
          {!isCancelled && (
            <input
              type="date"
              id="delivery-date"
              value={deliveryDate}
              min={orderDate}
              max={orderDate && `${new Date(orderDate).getDate() + 30}`}
              onChange={handleDateChange}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          )}
          {/* Vertical Tracking Bar */}
          <div className="vertical-tracking-bar">
            {statuses.map((status, index) => (
              <div className="tracking-step" key={status}>
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
                <input
                  type="radio"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={handleStatusChange}
                  disabled={isCancelled}
                  style={{
                    display: isCancelled ? "none" : "block",
                  }}
                />
                <label style={{ marginLeft: "10px" }}>{status}</label>
                {/* Display delivery date near 'Delivered' status */}
                {status === "Delivered" && deliveryDate && (
                  <p
                    style={{
                      marginLeft: "10px",
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    {/* Format the delivery date to 'dd MMM yyyy' */}
                    {(() => {
                      const dateObj = new Date(deliveryDate);
                      const day = String(dateObj.getDate()).padStart(2, "0"); // Ensure day has leading zero
                      const month = dateObj.toLocaleString("default", {
                        month: "short",
                      }); // Get month as short name
                      const year = dateObj.getFullYear(); // Get year

                      return `${day} ${month} ${year}`; // Return formatted date
                    })()}
                  </p>
                )}
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

          {/* Update Status Button */}

          {!isCancelled && (
            <button
              onClick={handleUpdateStatus}
              disabled={isCancelled}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Update Status
            </button>
          )}
        </>
      {/* )} */}
    </Modal>
  );
};

export default OrderTrackingModal;
