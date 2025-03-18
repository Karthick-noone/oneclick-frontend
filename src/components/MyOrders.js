import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/MyOrders.css"; // Add CSS for styles
import Header2 from "./Header2";
import Footer from "./footer";
import { ApiUrl } from "./ApiUrl";
import Modal from "react-modal"; // Install if needed using `npm install react-modal`
import { FaTimes, FaPrint } from "react-icons/fa";
import OrderTrackingModal from "./TrackingModal";
import Swal from "sweetalert2";

import stamp2 from "./img/cancelled-stamp.png";

import ReactDOMServer from "react-dom/server"; // Add this import at the top
import Invoice from "../admin/pages/Invoice";
import RecentlyViewed from "./RecentlyViewed";
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [productDetails, setProductDetails] = useState(null); // To store fetched product details
  const [modalIsOpen, setModalIsOpen] = useState(false); // To open and close modal
  const [deliveryStatus, ] = useState("");
  const statuses = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"]; // Define the statuses
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null); // State for the current order ID
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Month is 0-indexed
  const [filteredOrders, setFilteredOrders] = useState(orders);

  useEffect(() => {
    filterOrders(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, orders]);

  const filterOrders = (year, month) => {
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.order_date);
      const orderYear = orderDate.getFullYear();
      const orderMonth = orderDate.getMonth() + 1; // Month is 0-indexed

      return orderYear === year && orderMonth === month;
    });

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  const openModal2 = (order) => {
    console.log("Opening modal for order ID:", order.unique_id); // Log the order ID being opened
    setCurrentOrderId(order.unique_id); // Set the current order ID
    setIsModalOpen2(true);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
    console.log("Closing modal for order ID:", currentOrderId); // Log the order ID when closing the modal
    setCurrentOrderId(null); // Reset the order ID when modal closes
  };

  const openModal = async (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);

    try {
      const orderId = order.unique_id;
      console.log("Fetching product details for Order ID:", orderId);

      // Fetch product IDs using order_id
      const productResponse = await axios.get(
        `${ApiUrl}/getProductByOrderId/${orderId}`
      );
      console.log("Product Response Data:", productResponse.data);

      // Check if any product details are present
      if (!productResponse.data || productResponse.data.length === 0) {
        console.error("No products found for Order ID:", orderId);
        return;
      }

      // Set product details directly from the response
      setProductDetails(productResponse.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const [currentProductIndex, setCurrentProductIndex] = useState(0); // State to track the current product index

  // Check if productDetails is an array and has elements
  const hasProducts =
    Array.isArray(productDetails) && productDetails.length > 0;

  const handleNextProduct = () => {
    if (hasProducts && currentProductIndex < productDetails.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1); // Move to the next product
    }
  };

  const handlePreviousProduct = () => {
    if (hasProducts && currentProductIndex > 0) {
      setCurrentProductIndex(currentProductIndex - 1); // Move to the previous product
    }
  };

  // Only get the current product if hasProducts is true
  const currentProduct = hasProducts
    ? productDetails[currentProductIndex]
    : null;

  const closeModal = () => {
    setModalIsOpen(false);
    setProductDetails(null);
  };

  useEffect(() => {
    // Get userId from localStorage
    const userId = localStorage.getItem("user_id"); // Make sure to store 'user_id' when user logs in

    if (userId) {
      // Fetch orders from the backend
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${ApiUrl}/api/my-orders/${userId}`); // Replace with actual API
          setOrders(response.data.orders);

          console.log("response", response.data.orders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  // const capitalizeFirstLetter = (string) => {
  //   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  // };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // const currentIndex = statuses.indexOf(deliveryStatus);
  const cancelOrder = async (orderId) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to cancel this order? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!",
      });

      if (confirmation.isConfirmed) {
        const response = await fetch(`${ApiUrl}/cancelOrder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        const result = await response.json();
        if (response.ok) {
          await Swal.fire({
            title: "Cancelled!",
            text: result.message,
            icon: "success",
          }).then(() => {
            window.location.reload();
          });
          // Refresh orders data
          // fetchOrders();
        } else {
          await Swal.fire({
            title: "Error!",
            text: result.error || "Failed to cancel the order.",
            icon: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      await Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again later.",
        icon: "error",
      });
    }
  };
  const [selectedProduct, setSelectedProduct] = useState(
    orders[0]?.products?.[0]?.product_id
  );
  const [, setCurrentOrder] = useState(null);
  const [, setCurrentProduct] = useState(null);

  const handleProductChange = (event) => {
    const productId = event.target.value;
    setSelectedProduct(productId);
  };

  // const handleViewOrder = (order) => {
  //   const product = order.products.find(
  //     (product) => product.product_id === selectedProduct
  //   );
  //   setCurrentOrder(order);
  //   setCurrentProduct(product);
  // };

  // Fetch product details function
  const fetchProductDetails = async (orderId) => {
    if (!orderId) return; // Prevent fetching if no orderId is provided
    try {
      console.log("Fetching product details for Order ID:", orderId);

      // Fetch product IDs using order_id
      const productResponse = await axios.get(
        `${ApiUrl}/getProductByOrderId/${orderId}`
      );
      // console.log("Product Response Data:", productResponse.data);

      // Check if any product details are present
      if (!productResponse.data || productResponse.data.length === 0) {
        console.error("No products found for Order ID:", orderId);
        return []; // Return empty array if no products found
      }

      // Return product details from the response
      return productResponse.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return []; // Return empty array in case of error
    }
  };

  // Fetch product details when the selected order changes
  useEffect(() => {
    if (selectedOrder) {
      fetchProductDetails(selectedOrder.unique_id); // Call function with selected order's unique ID
    }
  }, [selectedOrder]); // Run effect when selectedOrder changes

  const printInvoice = async (order) => {
    console.log("Preparing to print invoice for order:", order);

    // Fetch product details before printing
    const details = await fetchProductDetails(order.unique_id); // Get product details

    // Log the product details to be printed
    console.log("Product details to print:", details);

    if (!details || details.length === 0) {
      console.error("No product details available to print. Aborting print.");
      return; // Exit if no product details
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          ${ReactDOMServer.renderToStaticMarkup(
            <Invoice order={order} productDetails={details} />
          )}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <Header2 />
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="filters-container">
          <span className="filters-title">Filter By</span>

          <div className="filter-group">
            <label htmlFor="year" className="filter-label">
              Year
            </label>
            <select
              className="filter-dropdown"
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from(
                { length: 5 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="month" className="filter-label">
              Month
            </label>
            <select
              className="filter-dropdown"
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {new Date(0, month - 1).toLocaleString("en-US", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="order-container">
          {filteredOrders.length === 0 ? (
            <p className="no-orders">No orders found.</p>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.unique_id}
                className={`order-card ${
                  order.delivery_status === "Cancelled"
                    ? "cancelled-order-card"
                    : ""
                }`}
              >
                {" "}
                <div className="order-header">
                  <h3>Order #{order.unique_id}</h3>
                  <span
                    className={`order-status ${order.status.toLowerCase()}`}
                  >
                    {order.status.toLowerCase() === "pending"
                      ? "Payment Pending"
                      : order.status.toLowerCase() === "refund pending"
                      ? "Refund Pending"
                      : order.status.toLowerCase() === "refunded"
                      ? "Refunded"
                      : "Payment Paid"}
                  </span>
                </div>
                {/* Row Layout: Left Side (Details) & Right Side (Cancelled Seal) */}
                <div className="order-details">
                  {/* Left Side: Order Information */}
                  <div className="order-info">
                    <div className="products-list">
                      {order.products && order.products.length > 1 ? (
                        <select
                          value={selectedProduct}
                          onChange={handleProductChange}
                          className="product-dropdown"
                        >
                          {order.products.map((product) => (
                            <option
                              // className="product-name"
                              key={product.product_id}
                              value={product.product_id}
                            >
                              {product.name.split(" ").slice(0, 4).join(" ")}
                            </option>
                          ))}
                        </select>
                      ) : (
                        order.products &&
                        order.products.length === 1 && (
                          <span
                            className="product-namee"
                            style={{ fontWeight: "bold", marginLeft:'10px' }}
                          >
                            {order.products[0].name
                              .split(" ")
                              .slice(0, 3)
                              .join(" ")}
                          </span>
                        )
                      )}
                    </div>{" "}
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {formatDate(order.order_date)}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> ₹{order.total_amount}
                    </p>
                  </div>

                  {/* Right Side: Cancelled Seal */}
                  {order.delivery_status === "Cancelled" && (
                    <div className="cancelled-seal">
                      <img src={stamp2} loading="lazy" width={"85px"} alt="" />
                    </div>
                  )}
                </div>
                {/* Buttons */}
                <div className="buttons-row">
                  <button
                    onClick={() => openModal(order)}
                    className="view-details-button"
                  >
                    View Order
                  </button>
                  <button
                    onClick={() => openModal2(order)}
                    className="view-details-button"
                  >
                    Track Order
                  </button>
                  {order.delivery_status !== "Cancelled" && (
                  <button
                  title="Print Invoice"
                    className="btn btn-print"
                    onClick={() => printInvoice(order, productDetails)}
                  >
                    <FaPrint style={{ fontSize: "16px" }} />
                  </button>
                  )}

                </div>
                <OrderTrackingModal
                  isOpen={isModalOpen2}
                  onRequestClose={closeModal2}
                  order_id={currentOrderId} // Pass the order ID
                />
              </div>
            ))
          )}
        </div>

        {/* Modal for Product Details */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Product Details"
          className="custom-modal10"
          overlayClassName="modal-overlay"
        >
          <h2>Order Details</h2>
          <div className="order-details10">
            <div className="details-and-image10">
              <div className="product-info10">
                {currentProduct &&
                  currentProduct.prod_img &&
                  // Check if prod_img is a string and parse it if necessary
                  (() => {
                    const images = Array.isArray(currentProduct.prod_img)
                      ? currentProduct.prod_img
                      : JSON.parse(currentProduct.prod_img || "[]");

                    // Display the first image if available
                    const firstImage = images.length > 0 ? images[0] : null;

                    return firstImage ? (
                      <center>
                        <img
                          src={`${ApiUrl}/uploads/${currentProduct.category.toLowerCase()}/${firstImage}`}
                          alt={currentProduct.prod_name}
                          className="product-image10"
                          loading="lazy"
                        />
                      </center>
                    ) : (
                      <div>No image available</div> // Fallback message if no image is available
                    );
                  })()}
                {currentProduct && (
                  <>
                    <p className="info-row">
                      <span className="info-label">Product Name</span>
                      <span className="info-value product-namee">
                        {currentProduct.prod_name}
                      </span>
                    </p>
                    <p className="info-row">
                      <span className="info-label">Price</span>
                      <span className="info-value ">
                        ₹{currentProduct.prod_price}
                      </span>
                    </p>
                    {/* <p className="info-row">
                  <span className="info-label">Description</span>
                  <span className="info-value product-descriptionn">{currentProduct.prod_features}</span>
                </p> */}
                  </>
                )}
              </div>
            </div>

            {selectedOrder && (
              <>
                <p className="info-row">
                  <span className="info-label">Order ID</span>
                  <span className="info-value">#{selectedOrder.unique_id}</span>
                </p>
                <p className="info-row">
                  <span className="info-label">Ordered Date</span>
                  <span className="info-value">
                    {formatDate(selectedOrder.order_date)}
                  </span>
                </p>
                {/* <p className="info-row">
              <span className="info-label">Payment Status</span>
              <span className={`info-value status ${selectedOrder.status ? selectedOrder.status.toLowerCase() : 'unknown'}`}>
                {selectedOrder.status}
              </span>
            </p> */}
                <p className="info-row">
                  <span className="info-label">Total Amount</span>
                  <span className="info-value">
                    ₹{selectedOrder.total_amount}
                  </span>
                </p>
                <p className="info-row">
                  <span className="info-label">Shipping Address</span>
                  <span className="info-value">
                    {selectedOrder.shipping_address}
                  </span>
                </p>

                {selectedOrder.delivery_status !== "Delivered" && (
                  <p>
                    <button
                      className="btn btn-cancel"
                      onClick={() => cancelOrder(selectedOrder.unique_id)}
                      disabled={selectedOrder.delivery_status === "Cancelled"}
                    >
                      {selectedOrder.delivery_status === "Cancelled"
                        ? "Order Cancelled"
                        : "Cancel Order"}
                    </button>
                  </p>
                )}
              </>
            )}

            {/* Navigation Buttons */}
            {productDetails && productDetails.length > 1 && (
              <div className="navigation-buttons">
                <button
                  className="add-to-cart"
                  onClick={handlePreviousProduct}
                  disabled={!hasProducts || currentProductIndex === 0}
                >
                  &lt; Prev
                </button>
                <button
                  style={{ marginLeft: "5px" }}
                  className="add-to-cart"
                  onClick={handleNextProduct}
                  disabled={
                    !hasProducts ||
                    currentProductIndex === productDetails.length - 1
                  }
                >
                  Next &gt;
                </button>
              </div>
            )}
          </div>

          <button onClick={closeModal} className="modal-close-button10">
            <FaTimes />
          </button>
        </Modal>
      </div>
      {/* <RecentlyViewed /> */}
      <Footer />
    </>
  );
};

export default MyOrders;
