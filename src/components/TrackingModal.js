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
import delivery_truck from "./css/delivery_truck2.json"; // Import your Lottie animation
import cityBG from "./css/city-bg-2.json"; // Import your Lottie animation
import citybg from "./img/city.jpg"

const OrderTrackingModal = ({ isOpen, onRequestClose, order_id }) => {
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [, setLoading] = useState(false);

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
  const totalSteps = statuses.length - 1;

  let fillPercentage = 0;

  if (currentIndex === -1) {
    fillPercentage = 0;
  } else if (deliveryStatus === 'Delivered') {
    fillPercentage = 90; // Custom value for 'Delivered'
  } else if (currentIndex < totalSteps) {
    fillPercentage = ((currentIndex + 0.35) / totalSteps) * 100;
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
  {/* Background Layer */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 0, // background z-index
      pointerEvents: "none", // make sure background doesn’t block content
    }}
  >
    {deliveryStatus === "Delivered" ? (
      <img
        src={citybg}
        alt="Delivered Background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    ) : (
      <Lottie
        animationData={cityBG}
        loop
        autoplay
        style={{
          objectFit: "cover",
        }}
      />
    )}
  </div>

  {/* Modal Close Button */}
  <button onClick={handleModalClose} className="trackorder-close-button">
    <FaTimes />
  </button>

  {/* Modal Title */}
  <h2
    className="trackorder-title"
    style={{
      marginBottom: deliveryStatus === "Delivered" ? "242px" : "",
      position: "relative", // ensure it appears above background
      zIndex: 1,
    }}
  >
    Track Order
  </h2>

  {/* Progress Bar */}
  <div className="trackorder-progress-wrapper" style={{ position: "relative", zIndex: 1 }}>
    <div
      className={`trackorder-progress-bar ${deliveryStatus === "Delivered" ? "no-animation" : ""}`}
    >
      <div
        className="trackorder-progress-fill"
        style={{ width: `${fillPercentage}%` }}
      ></div>
    </div>

    {/* Truck Animations */}
    {deliveryStatus !== "Cancelled" && deliveryStatus !== "Delivered" && (
      <div
        className="trackorder-truck"
        style={{ left: `${fillPercentage}%` }}
      >
        <Lottie
          animationData={truckAnimation}
          style={{ width: 55, height: 55 }}
        />
      </div>
    )}

    {deliveryStatus !== "Cancelled" && deliveryStatus === "Delivered" && (
      <div
        className="trackorder-truck"
        style={{ left: `${fillPercentage}%` }}
      >
        <Lottie
          animationData={delivery_truck}
          style={{ width: 70, height: 70, transform: "rotateY(180deg)" }}
        />
      </div>
    )}

    {/* Status Labels */}
    <div className="trackorder-statuses">
      {statuses.map((status, index) => {
        const IconComponent = statusIcons[status];
        const isActive = index < currentIndex;
        const isCurrent =
          index === currentIndex &&
          deliveryStatus !== "Delivered" &&
          deliveryStatus !== "Cancelled";
        return (
          <div key={index} className="trackorder-status-item">
            <IconComponent
              className={`trackorder-status-icon ${
                isActive || index === currentIndex ? "active" : ""
              } ${isCurrent ? "current" : ""}`}
            />
            <span className="trackorder-status-label">{status}</span>
          </div>
        );
      })}
    </div>
  </div>

  {/* Delivery Date */}
  {deliveryDate && (
    <p
      className="trackorder-delivery-date"
      style={{
        position: "relative",
        zIndex: 1, // ensure date text appears above background
      }}
    >
      {deliveryStatus === "Delivered"
        ? "Product delivered on "
        : "Expected delivery: "}
      {formatDeliveryDate(deliveryDate)}
    </p>
  )}
</Modal>

  );
};

export default OrderTrackingModal;
