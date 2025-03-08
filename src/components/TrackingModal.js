import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import axios from "axios";
import { ApiUrl } from "./ApiUrl";
import Swal from "sweetalert2";
import {
  FaBox,
  FaShippingFast,
  FaTruck,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import "./css/TrackingModal.css";
import Lottie from "lottie-react";
import truckAnimation from "./css/truck2.json"; // Import your Lottie animation

const OrderTrackingModal = ({ isOpen, onRequestClose, order_id }) => {
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Define statuses for regular and cancelled orders
  const regularStatuses = [
    "Order Placed",
    "Shipped",
    "Out of Delivery",
    "Delivered",
  ];
  const cancelledStatuses = ["Order Placed", "Cancelled"];
  const isCancelled = deliveryStatus === "Cancelled";
  const statuses = isCancelled ? cancelledStatuses : regularStatuses;

  // Map statuses to icons
  const statusIcons = {
    "Order Placed": FaBox,
    Shipped: FaShippingFast,
    "Out of Delivery": FaTruck,
    Delivered: FaCheckCircle,
    Cancelled: FaTimes,
  };

  const fetchDeliveryStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ApiUrl}/api/get-order-status`, {
        params: { orderId: order_id },
      });
      const { delivery_status, delivery_date } = response.data;
      const dateObj = new Date(delivery_date);
      const formattedDate = `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

      setDeliveryStatus(delivery_status);
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
      setLoading(false);
    }
  }, [order_id]);

  useEffect(() => {
    if (isOpen) {
      fetchDeliveryStatus();
    }
  }, [isOpen, fetchDeliveryStatus]);

  const handleModalClose = () => {
    onRequestClose();
  };

  // Calculate current status index
  const currentIndex = statuses.indexOf(deliveryStatus);

  // Calculate fillPercentage:
  // If currentIndex is valid and not the last status, set fill to halfway between current and next.
  // Otherwise, 0 or 100%.
  let fillPercentage = 0;
  if (currentIndex === -1) {
    fillPercentage = 0;
  } else if (currentIndex < statuses.length - 1) {
    fillPercentage = ((currentIndex + 0.5) / (statuses.length - 1)) * 100;
  } else {
    fillPercentage = 100;
  }

  // Helper function to format the date for display
  const formatDeliveryDate = (dateString) => {
    const dateObj = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return dateObj.toLocaleDateString("en-GB", options);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleModalClose}
      className="trackorder-modal"
      overlayClassName="trackorder-overlay"
      ariaHideApp={false}
    >
      <button onClick={handleModalClose} className="trackorder-close-button">
        <FaTimes />
      </button>
      <h2 className="trackorder-title">Order Tracking</h2>

      <div className="trackorder-progress-wrapper">
        <div className="trackorder-progress-bar">
          <div
            className="trackorder-progress-fill"
            style={{ width: `${fillPercentage}%` }}
          ></div>
        </div>
        {deliveryStatus !== "Cancelled" && deliveryStatus !== "Delivered" && (
          <div
            className="trackorder-truck"
            style={{ left: `${fillPercentage}%` }}
          >
            <Lottie
              animationData={truckAnimation}
              style={{ width: 50, height: 50 }}
            />
          </div>
        )}

        <div className="trackorder-statuses">
          {statuses.map((status, index) => {
            const IconComponent = statusIcons[status];
            const isActive = index < currentIndex;
            // Blink only for the current status (unless delivered)
            const isCurrent =
              index === currentIndex &&
              deliveryStatus !== "Delivered" &&
              deliveryStatus !== "Cancelled";
            return (
              <div key={index} className="trackorder-status-item">
                <IconComponent
                style={{color:'red'}}
                  className={`trackorder-status-icon ${
                    isActive || index === currentIndex ? "active" : ""
                  } ${isCurrent ? "current" : ""}`}
                />
                <span  className="trackorder-status-label">{status}</span>
              </div>
            );
          })}
        </div>
      </div>

      {deliveryDate && (
        <p className="trackorder-delivery-date">
          {deliveryStatus === "Delivered"
            ? "Delivered on: "
            : "Expected Delivery: "}
          {formatDeliveryDate(deliveryDate)}
        </p>
      )}
    </Modal>
  );
};

export default OrderTrackingModal;
