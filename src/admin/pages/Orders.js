import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Orders.css";
import { ApiUrl } from "../../components/ApiUrl";
import Modal from "react-modal"; // Install if needed using `npm install react-modal`
import Swal from "sweetalert2"; // For better confirmation, install with `npm install sweetalert2`
import OrderTrackingModal from "./OrderTrackingModal";
import {
  FaEye,
  FaTimes,
  FaTrash,
  FaPrint,
  FaEdit,
  FaCheck,
} from "react-icons/fa";

import ReactDOMServer from "react-dom/server"; // Add this import at the top
import Invoice from "./Invoice";
const Orders = ({ year, setYear, month, setMonth, updateOrderStatus }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [productDetails, setProductDetails] = useState(null); // To store fetched product details
  const [modalIsOpen, setModalIsOpen] = useState(false); // To open and close modal
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null); // State for the current order ID
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  // Function to handle search
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState("All");
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    console.log("Selected status:", newStatus); // Log the selected status
  };

  const handleSaveClick = async (orderId) => {
    // Find the order that is being edited
    const order = orders.find((order) => order.unique_id === orderId);

    // Check if there is a change in the selected status
    if (selectedStatus === order?.status) {
      console.log("No status change, ignoring update."); // Log if no change
      setEditingRow(null); // Close the select dropdown without making changes
      return; // Exit without making any further changes
    }

    console.log("Saving new status:", selectedStatus); // Log when saving

    try {
      // Send the status update to the backend
      const response = await fetch(`${ApiUrl}/api/update-order-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          status: selectedStatus,
        }),
      });

      if (response.ok) {
        console.log("Status updated successfully!"); // Log success

        // Directly update the status in the UI state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.unique_id === orderId
              ? { ...order, status: selectedStatus } // Update only the row being edited
              : order
          )
        );

        // Optionally, refetch the updated order list to ensure data consistency
        await fetchOrders();
      } else {
        console.error("Failed to update the status."); // Log failure
      }
    } catch (error) {
      console.error("Error updating status:", error); // Log any errors
    } finally {
      setEditingRow(null); // Stop editing after saving
    }
  };

  const yearRef = useRef(null);
  const monthRef = useRef(null);

  const handleYearChange = (event) => {
    setYear(event.target.value);
    yearRef.current.focus(); // Set focus back to the year field
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
    monthRef.current.focus(); // Set focus back to the month field
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Fetch order status from the backend
  const fetchOrderStatus = async (orderId) => {
    try {
      const response = await fetch(
        `${ApiUrl}/api/get-order-status?orderId=${orderId}`
      );
      const data = await response.json();
      return data.delivery_status; // Return delivery status from the response
    } catch (error) {
      console.error("Error fetching delivery status:", error);
      return "Unknown"; // Fallback value if there's an error
    }
  };

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
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ApiUrl}/fetchorders`);
      const orders = response.data.reverse();

      const ordersWithStatus = await Promise.all(
        orders.map(async (order) => {
          const deliveryStatus = await fetchOrderStatus(order.unique_id);
          return {
            ...order,
            delivery_status: deliveryStatus,
            products: order.products || [], // Ensure products is an array
          };
        })
      );

      setOrders(ordersWithStatus);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Call fetchOrders when the component mounts
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
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
      // printInvoice(order, productResponse.data); // Pass the product details to printInvoice
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

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;

  // Filter orders based on the search query and additional filters
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.order_date); // Convert the order date to a Date object
    const orderMonth = orderDate.getMonth() + 1; // Get month (0-based, so add 1)
    const orderYear = orderDate.getFullYear(); // Get year
    const normalizedStatus =
      order.delivery_status === "Order Placed"
        ? "New Order"
        : order.delivery_status;

    return (
      ((order.customerName &&
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.unique_id &&
          order.unique_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.payment_method &&
          order.payment_method
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (normalizedStatus &&
          normalizedStatus.toLowerCase().includes(searchQuery.toLowerCase())) || // Use normalized status
        (order.status &&
          order.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.order_date &&
          order.order_date
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))) &&
      (!filterMonth || orderMonth === parseInt(filterMonth)) && // Match month if filterMonth is set
      (!filterYear || orderYear === parseInt(filterYear)) &&
      (filterDeliveryStatus === "All" ||
        order.delivery_status === filterDeliveryStatus ||
        (filterDeliveryStatus === "Refund Pending" &&
          order.status &&
          order.status === "Refund Pending") ||
        (filterDeliveryStatus === "Refund" &&
          order.status &&
          order.status === "Refund"))
      // Filter by selected delivery status
    );
  });

  // Calculate the total pages based on the filtered orders
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Paginate filtered orders
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPaginationPages = () => {
    const pages = [];
    const maxPagesToShow = 6; // Total number of page numbers to show at a time

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftBoundary = Math.max(
        1,
        currentPage - Math.floor(maxPagesToShow / 2)
      );
      const rightBoundary = Math.min(
        totalPages,
        currentPage + Math.floor(maxPagesToShow / 2)
      );

      if (leftBoundary > 2) {
        pages.push(1, "...");
      } else {
        for (let i = 1; i < leftBoundary; i++) {
          pages.push(i);
        }
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pages.push(i);
      }

      if (rightBoundary < totalPages - 1) {
        pages.push("...", totalPages);
      } else {
        for (let i = rightBoundary + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  // Delete order function
  const deleteOrder = async (orderId) => {
    const confirmed = await Swal.fire({
      title: "Do you want to delete this order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`${ApiUrl}/deleteOrder/${orderId}`);
        setOrders(orders.filter((order) => order.unique_id !== orderId)); // Update the order state
        Swal.fire("Deleted!", "Your order has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting order:", error);
        Swal.fire(
          "Error!",
          "Failed to delete the order. Please try again later.",
          "error"
        );
      }
    }
  };

  // const printInvoice = async (orderId) => {
  //   const response = await axios.get(`${ApiUrl}/api/invoice/${orderId}`, { responseType: 'blob' });
  //   const pdfBlob = response.data;
  //   const pdfUrl = URL.createObjectURL(pdfBlob);

  //   // Open PDF in new tab
  //   window.open(pdfUrl);
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
      console.log("Product Response Data:", productResponse.data);

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
          });
          // Refresh orders data
          fetchOrders();
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

  return (
    <div className="orders-page">
      <main className="staff-main-content">
        <div className="orders-header">
          <h2 className="orders-page-title">Orders</h2>
        </div>
        <div className="search-box2-container">
  {/* Radio Buttons Filter */}
  <div className="filters-container">
    <div className="filter-radio-buttons">
      <label>
        <input
          type="radio"
          name="deliveryStatus"
          value="All"
          checked={filterDeliveryStatus === "All"}
          onChange={() => setFilterDeliveryStatus("All")}
        />
        All
      </label>
      <label>
        <input
          type="radio"
          name="deliveryStatus"
          value="Order Placed"
          checked={filterDeliveryStatus === "Order Placed"}
          onChange={() => setFilterDeliveryStatus("Order Placed")}
        />
        New Order
      </label>
      <label>
        <input
          type="radio"
          name="deliveryStatus"
          value="Shipped"
          checked={filterDeliveryStatus === "Shipped"}
          onChange={() => setFilterDeliveryStatus("Shipped")}
        />
        Shipped
      </label>
      <label>
        <input
          type="radio"
          name="deliveryStatus"
          value="Out of Delivery"
          checked={filterDeliveryStatus === "Out of Delivery"}
          onChange={() => setFilterDeliveryStatus("Out of Delivery")}
        />
        Out of Delivery
      </label>
      <label>
        <input
          type="radio"
          name="deliveryStatus"
          value="Delivered"
          checked={filterDeliveryStatus === "Delivered"}
          onChange={() => setFilterDeliveryStatus("Delivered")}
        />
        Delivered
      </label>
      <label>
        <input
          type="radio"
          name="deliveryStatus"
          value="Cancelled"
          checked={filterDeliveryStatus === "Cancelled"}
          onChange={() => setFilterDeliveryStatus("Cancelled")}
        />
        Cancelled
      </label>
      <label>
        <input
          type="radio"
          name="deliveryStatus"
          value="Refund Pending"
          checked={filterDeliveryStatus === "Refund Pending"}
          onChange={() => setFilterDeliveryStatus("Refund Pending")}
        />
        Refund Pending
      </label>
      <label>
        <input
          type="radio"
          name="deliveryStatus"
          value="Refund"
          checked={filterDeliveryStatus === "Refund"}
          onChange={() => setFilterDeliveryStatus("Refund")}
        />
        Refund
      </label>
    </div>
  </div>

  {/* Month and Year Filter */}
  <div className="month-year-container">
    <select
      value={filterMonth}
      onChange={(e) => setFilterMonth(e.target.value)}
      className="filter-select"
    >
      <option value="">Months</option>
      <option value="1">January</option>
      <option value="2">February</option>
      <option value="3">March</option>
      <option value="4">April</option>
      <option value="5">May</option>
      <option value="6">June</option>
      <option value="7">July</option>
      <option value="8">August</option>
      <option value="9">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>

    <select
      value={filterYear}
      onChange={(e) => setFilterYear(e.target.value)}
      className="filter-select"
    >
      <option value="">Years</option>
      {Array.from({ length: 11 }, (_, i) => 2023 + i).map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>

  {/* Search Box */}
  <input
    type="text"
    placeholder="Search"
    value={searchQuery}
    onChange={handleSearch}
    className="search-box2"
  />
  {searchQuery && (
    <span
      className="clear-button"
      onClick={() => setSearchQuery("")}
    >
      X
    </span>
  )}
</div>

        
        {/* Search Box */}

        <div className="orders-content">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Sl.No</th>
                    <th>Order ID</th>
                    {/* <th>Name</th> */}
                    <th>Order Date</th>
                    <th>Payment Status</th>
                    <th>Payment Method</th>
                    <th>Price</th>
                    <th>View/Delete</th>
                    <th>Delivery Status</th>
                    <th>Current Status</th> {/* New Column */}
                    <th>Print Invoice</th>
                    <th>Cancel Order</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders // Use the currentOrders array for pagination
                      .map((order, index) => (
                        <tr
                          key={order.unique_id}
                          order={order}
                          updateOrderStatus={updateOrderStatus}
                          className={
                            order.delivery_status === "Cancelled"
                              ? "row-cancelled"
                              : order.delivery_status === "Delivered"
                              ? "row-delivered"
                              : ""
                          }
                        >
                          <td>
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </td>
                          <td>#{order.unique_id || "N/A"}</td>
                          {/* <td>
                            {order.customerName
                              ? capitalizeFirstLetter(order.customerName)
                              : "N/A"}
                          </td> */}
                          <td>{formatDate(order.order_date)}</td>
                          <td style={{ width: "100%", position: "relative" }}>
                            {editingRow === order.unique_id ? (
                              <>
                                <select
                                  value={selectedStatus}
                                  onChange={handleStatusChange}
                                  style={{
                                    display: "inline", // Keeps the select inline
                                    marginRight: "17px",
                                  }}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Paid">Paid</option>
                                  <option value="Refund Pending">
                                    Refund Pendng
                                  </option>
                                  <option value="Refund">Refund</option>
                                </select>
                                <FaCheck
                                  className="tick-icon"
                                  onClick={() =>
                                    handleSaveClick(order.unique_id)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    color: "green",
                                    position: "absolute", // Position the icon to the right
                                    right: "10px", // Keeps the icon close to the right edge
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                <span
                                  className={
                                    order?.status?.toLowerCase() || "unknown"
                                  }
                                  style={{
                                    display: "inline",
                                  }}
                                >
                                  {order?.status || "Unknown"}
                                </span>
                                <FaEdit
                                  className="edit-icon"
                                  onClick={() => {
                                    if (order.delivery_status !== "Cancelled") {
                                      setEditingRow(order.unique_id);
                                      setSelectedStatus(order.status);
                                    }
                                  }}
                                  style={{
                                    cursor:
                                      order.delivery_status === "Cancelled"
                                        ? "not-allowed"
                                        : "pointer", // Disable cursor on cancel
                                    position: "absolute",
                                    right: "10px",
                                  }}
                                />
                              </>
                            )}
                          </td>

                          <td>{order.payment_method || "N/A"}</td>
                          <td>₹{order.total_amount || "N/A"}</td>
                          <td>
                            <div className="btn-container">
                              <button
                                className="btn btn-view"
                                onClick={() => openModal(order)}
                              >
                                <FaEye />
                              </button>
                              <button
                                className="btn btn-delete"
                                onClick={() => deleteOrder(order.unique_id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                          <td>
                            <center>
                              <button
                                onClick={() => openModal2(order)}
                                className="btn btn-view"
                              >
                                <FaEye />
                              </button>
                            </center>
                            <OrderTrackingModal
                              isOpen={isModalOpen2}
                              onRequestClose={closeModal2}
                              order_id={currentOrderId} // Pass the order ID
                            />
                          </td>
                          <td>
                            <span
                              className={
                                order.delivery_status === "Order Placed"
                                  ? "status-new-order"
                                  : order.delivery_status === "Shipped"
                                  ? "status-shipped"
                                  : order.delivery_status === "Delivered"
                                  ? "status-delivered"
                                  : order.delivery_status === "Out of Delivery"
                                  ? "status-Out-of-Delivery"
                                  : order.delivery_status === "Cancelled"
                                  ? "status-cancelled"
                                  : "status-unknown"
                              }
                            >
                              {order.delivery_status === "Order Placed"
                                ? "New Order"
                                : order.delivery_status || "Unknown"}
                            </span>
                          </td>
                          {/* Display delivery_status */}
                          <td>
                            <button
                              className="btn btn-print"
                              onClick={() =>
                                printInvoice(order, productDetails)
                              }
                            >
                              <FaPrint style={{ fontSize: "16px" }} />
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-cancel"
                              onClick={() => cancelOrder(order.unique_id)}
                              disabled={
                                order.delivery_status === "Cancelled" ||
                                order.delivery_status === "Delivered"
                              }
                            >
                              {order.delivery_status === "Cancelled"
                                ? "Cancelled"
                                : "Cancel"}
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No record found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

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
                    <span className="info-value">
                      #{selectedOrder.unique_id}
                    </span>
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

          <div className="pagination-controls">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              &lt;
            </button>
            {getPaginationPages().map((page, index) => (
              <button
                key={index}
                onClick={() => {
                  if (page !== "...") handlePageChange(page);
                }}
                className={`pagination-button ${
                  currentPage === page ? "active" : ""
                }`}
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              &gt;
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;
