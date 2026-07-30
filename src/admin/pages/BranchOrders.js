import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Orders.css";
import { ApiUrl } from "../../components/ApiUrl";
import Modal from "react-modal"; // Install if needed using `npm install react-modal`
import Swal from "sweetalert2"; // For better confirmation, install with `npm install sweetalert2`
import OrderTrackingModal from "./OrderTrackingModal";
// import logo from "./img/logo3.png"; // Ensure the path is correct
import PrintModal from "./PrintModal";
import Invoice from "./Invoice"; // Your invoice component
import { InfoIcon, CopyIcon, X } from "lucide-react";
import {
    FaEye,
    FaTimes,
    FaTrash,
    FaPrint,
    FaEdit,
    FaCheck,
    FaTruckMonster,
    FaTruckMoving,
    FaTruckPickup,
    FaTruck,
} from "react-icons/fa";

// import ReactDOMServer from "react-dom/server"; // Add this import at the top
import { SearchIcon } from "lucide-react";

const Orders = ({ setYear, setMonth, updateOrderStatus }) => {
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
    const [branches, setBranches] = useState([]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ order: null, productDetails: [] });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentPaymentId, setCurrentPaymentId] = useState(""); //  Add this
    // load default selected branch from localstorage
    const savedBranch = localStorage.getItem("current_branch") || "all";
    const [selectedBranch, setSelectedBranch] = useState(savedBranch);

    //  Fetch all branches
    const fetchBranches = async () => {
        try {
            const res = await fetch(`${ApiUrl}/api/branch/get-all`);
            const data = await res.json();
            console.log("branches", data.branches)

            if (res.ok) {
                setBranches(data.branches || []);
            } else {
                // toast
                console.error(data.message || "Failed to fetch branches");
            }
        } catch (err) {
            // console.error(err);
            console.error("Network error. Could not fetch branches", err);
        }
    };
    useEffect(() => {
        fetchBranches();
    }, []);



    const handleCopyPaymentId = (paymentId) => {
        navigator.clipboard.writeText(paymentId);
        setShowPaymentModal(false)

        Swal.fire({
            toast: true,
            position: "top-end", // Top-right corner
            icon: "success",
            title: "Payment ID copied to clipboard!",
            showConfirmButton: false,
            timer: 2000, // Auto close after 2 seconds
            timerProgressBar: false,
            customClass: {
                popup: "swal-toast",
            },
            //  Add zIndex for toast
            didOpen: (toast) => {
                toast.style.zIndex = "1002";
            },
        });
    };



    const handlePrintClick = async (order) => {
        console.log("Preparing invoice for order:", order);

        const details = await fetchProductDetails(order.unique_id);

        if (!details || details.length === 0) {
            console.error("No product details available to print.");
            return;
        }

        // Set modal data
        setModalData({ order, productDetails: details });
        setModalOpen(true);
    };

    // const handlePrintModal = () => {
    //   window.print();
    // };


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

    // const yearRef = useRef(null);
    // const monthRef = useRef(null);

    // const handleYearChange = (event) => {
    //   setYear(event.target.value);
    //   yearRef.current.focus(); // Set focus back to the year field
    // };

    // const handleMonthChange = (event) => {
    //   setMonth(event.target.value);
    //   monthRef.current.focus(); // Set focus back to the month field
    // };

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
    const userRole = localStorage.getItem("userRole");

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const currentBranch = localStorage.getItem("current_branch");
            const userRole = localStorage.getItem("userRole");

            const response = await axios.get(`${ApiUrl}/fetchorders`);
            const orders = response.data.reverse();

            const ordersWithStatus = await Promise.all(
                orders.map(async (order) => {
                    const deliveryStatus = await fetchOrderStatus(order.unique_id);
                    return {
                        ...order,
                        delivery_status: deliveryStatus,
                        products: order.products || [],
                    };
                })
            );

            let filteredOrders = ordersWithStatus;

            // ADMIN — ALL — show all EXCEPT null branch_id
            if (userRole === "Admin" && selectedBranch === "all") {
                filteredOrders = filteredOrders.filter(o => o.branch_id !== null);
            }

            // ADMIN — branch chosen
            else if (userRole === "Admin" && selectedBranch !== "all") {
                filteredOrders = filteredOrders.filter(o => (
                    o.branch_id !== null && o.branch_id == selectedBranch
                ));
            }

            // BRANCH ADMIN — only their branch
            else if (userRole === "branch_admin") {
                filteredOrders = filteredOrders.filter(o => (
                    o.branch_id !== null && o.branch_id === currentBranch
                ));
            }

            setOrders(filteredOrders);
            console.log("Filtered orders", filteredOrders)

        } catch (err) {
            setError("Failed to fetch orders. Please try again later.");
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    }, [selectedBranch]);


    useEffect(() => {
        fetchOrders(); // Call fetchOrders when the component mounts
    }, [fetchOrders]); //  Safe dependency array


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

            // console.log("log for effective price",productResponse.data)
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
                (filterDeliveryStatus === "Refunded" &&
                    order.status &&
                    order.status === "Refunded"))
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

    // const printInvoice = async (order) => {
    //   console.log("Preparing to print invoice for order:", order);

    //   // Fetch product details before printing
    //   const details = await fetchProductDetails(order.unique_id); // Get product details

    //   // Log the product details to be printed
    //   console.log("Product details to print:", details);

    //   if (!details || details.length === 0) {
    //     console.error("No product details available to print. Aborting print.");
    //     return; // Exit if no product details
    //   }

    //   const printWindow = window.open("", "_blank");
    //   printWindow.document.write(`
    //     <html>
    //       <head>
    //         <title>Invoice</title>
    //         <style>
    //           body { font-family: Arial, sans-serif; }
    //           table { width: 100%; border-collapse: collapse; }
    //           th, td { border: 1px solid black; padding: 8px; text-align: left; }
    //         </style>
    //       </head>
    //       <body>
    //         ${ReactDOMServer.renderToStaticMarkup(
    //     <Invoice order={order} productDetails={details} />
    //   )}
    //       </body>
    //     </html>
    //   `);
    //   printWindow.document.close();
    //   printWindow.print();
    // };

    const cancelOrder = async (orderId) => {
        try {
            const confirmation = await Swal.fire({
                title: "Are you sure?",
                text: "Do you really want to cancel this order? This action cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: 'No',
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
                {userRole === "Admin" && (
                    <div className="dashboard-header">
                        <h2>
                            {selectedBranch === "all"
                                ? "All Branches Orders"
                                : `${branches.find(b => b.id == selectedBranch)?.company || ""} Orders`
                            }
                        </h2>

                        <div className="dashboard-filter">
                            <select
                                value={selectedBranch}
                                onChange={(e) => {
                                    setSelectedBranch(e.target.value);
                                    localStorage.setItem("current_branch", e.target.value);
                                }}
                                className="branch-select"
                            >
                                <option value="all">All Branches</option>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.company}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                )}
                <div className="search-box2-container">


                    {/* Radio Buttons Filter */}
                    <div className="filters-container">
                        <div className="custom-radio-buttons">
                            {[
                                "All",
                                "Order Placed",
                                "Shipped",
                                "Out of Delivery",
                                "Delivered",
                                "Cancelled",
                                "Refund Pending",
                                "Refunded",
                            ].map((status, i) => (
                                <label className="custom-radio-container" key={i}>
                                    <input
                                        type="checkbox"
                                        checked={filterDeliveryStatus === status}
                                        onChange={() => setFilterDeliveryStatus(status)}
                                    />
                                    <div className="checkmark"></div>
                                    <span className="label-text">{status === "Order Placed" ? "New Order" : status}</span>
                                </label>
                            ))}
                        </div>

                    </div>


                    <div
                        className="search-box2-container"
                        style={{
                            display: "flex",
                            justifyContent: "space-between", // 👈 Pushes left/right sections apart
                            alignItems: "center",
                            backgroundColor: "#f8f8f8",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            gap: "10px",
                        }}
                    >

                        <div
                            className="current-filters"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #ddd",        //  Outer border
                                borderRadius: "6px",             //  Rounded corners
                                overflow: "hidden",              //  Clip borders on spans
                            }}
                        >
                            <span
                                style={{
                                    padding: "3px 12px",
                                    borderRight: "1px solid #ddd", //  Right border
                                }}
                            >
                                <strong>Year:</strong> {filterYear || "All"}
                            </span>
                            <span
                                style={{
                                    padding: "3px 12px",
                                    borderRight: "1px solid #ddd", //  Right border
                                }}
                            >
                                <strong>Month:</strong>{" "}
                                {filterMonth
                                    ? new Date(0, filterMonth - 1).toLocaleString("en-US", {
                                        month: "long",
                                    })
                                    : "All"}
                            </span>
                            <span
                                style={{
                                    padding: "3px 12px",
                                }}
                            >
                                <strong>Status:</strong> {filterDeliveryStatus || "All"}
                            </span>
                        </div>



                        {/*  Month/Year Filter + Search Box (right side) */}
                        <div
                            className="filter-controls"
                            style={{ display: "flex", alignItems: "center", gap: "10px" }}
                        >
                            <select
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Months</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                    <option key={month} value={month}>
                                        {new Date(0, month - 1).toLocaleString("en-US", { month: "long" })}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Years</option>
                                {Array.from({ length: 11 }, (_, i) => 2023 + i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>

                            {/* Search Box */}
                            <span style={{ position: "relative" }}>
                                <SearchIcon className="SearchIcon" width={"18px"} />
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
                            </span>
                        </div>
                    </div>

                </div>


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
                                        <th>Print</th>
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
                                                    <td style={{ width: "100px", position: "relative" }}>
                                                        {editingRow === order.unique_id ? (
                                                            <>
                                                                <select
                                                                    value={selectedStatus}
                                                                    onChange={handleStatusChange}
                                                                    className="payment-select"
                                                                >
                                                                    <option value="Pending">Pending</option>
                                                                    <option value="Paid">Paid</option>
                                                                    <option value="Refund Pending">Refund Pending</option>
                                                                    <option value="Refunded">Refunded</option>
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
                                                                        right: "-1px", // Keeps the icon close to the right edge
                                                                        top: '15px'
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
                                                                        setEditingRow(order.unique_id);
                                                                        setSelectedStatus(order.status);
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

                                                    <td style={{ width: "100px", position: "relative" }}>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "6px",
                                                            }}
                                                        >
                                                            <span>{order.payment_method || "N/A"}</span>

                                                            {order.payment_method === "Online" && order.payment_id && (
                                                                <div className="info-tooltip-container">
                                                                    <button
                                                                        onClick={() => {
                                                                            setCurrentPaymentId(order.payment_id);
                                                                            setShowPaymentModal(true);
                                                                        }}
                                                                        className="icon-btn"
                                                                    >
                                                                        <InfoIcon style={{ marginTop: "2px" }} size={16} color="black" />
                                                                    </button>
                                                                    <span className="info-tooltip-text">View Payment ID</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>




                                                    <td>₹{order.total_amount || "N/A"}</td>
                                                    <td>
                                                        <div className="btn-container">
                                                            <button
                                                                className="btn btn-view"
                                                                title="View this order"
                                                                onClick={() => openModal(order)}
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            <button
                                                                className="btn btn-delete"
                                                                title="Delete this order"
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
                                                                title="View delivery status"
                                                            >
                                                                <FaTruck />
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
                                                            title="Print invoice for this order"

                                                            onClick={() => handlePrintClick(order)}
                                                        >
                                                            <FaPrint style={{ fontSize: "16px" }} />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            title="Cancel this order"

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

                            {showPaymentModal && (
                                <div
                                    style={{
                                        position: "fixed",
                                        inset: 0,
                                        backgroundColor: "rgba(0, 0, 0, 0.4)", // semi-transparent overlay
                                        backdropFilter: "blur(6px)", // adds the blur effect
                                        WebkitBackdropFilter: "blur(8px)", // for Safari support
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        zIndex: 9999,
                                    }}
                                >
                                    <div
                                        style={{
                                            background: "white",
                                            padding: "20px",
                                            borderRadius: "8px",
                                            maxWidth: "400px",
                                            width: "100%",
                                            textAlign: "center",
                                            position: "relative",
                                        }}
                                    >
                                        <button
                                            onClick={() => setShowPaymentModal(false)}
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                right: "10px",
                                                background: "transparent",
                                                border: "none",
                                                fontSize: "1.5rem",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <X size={20} />
                                        </button>
                                        <h3 style={{ marginBottom: "10px" }}>Payment ID</h3>
                                        <div
                                            style={{
                                                display: "flex",               //  Arrange content in a row
                                                alignItems: "center",          //  Vertically center text and icon
                                                padding: "10px",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                                wordBreak: "break-all",
                                            }}
                                        >
                                            <span style={{ flex: 1 }}>{currentPaymentId}</span>

                                            <button
                                                onClick={() => handleCopyPaymentId(currentPaymentId)}
                                                style={{
                                                    marginLeft: "10px",          // Small space between text & button
                                                    background: "transparent",
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                                title="Copy Payment ID"
                                            >
                                                <CopyIcon size={18} color="black" />
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            )}
                            <PrintModal
                                isOpen={isModalOpen}
                                onClose={() => setModalOpen(false)}
                            >
                                <Invoice
                                    order={modalData.order}
                                    productDetails={modalData.productDetails}
                                />
                            </PrintModal>


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
                                                <span className="info-value">
                                                    {currentProduct.prod_name}
                                                </span>
                                            </p>
                                            <p className="info-row">
                                                <span className="info-label">Price</span>
                                                <span className="info-value ">
                                                    {currentProduct.is_buy_together
                                                        ? currentProduct.effectiveprice === 0
                                                            ? "Free"
                                                            : `₹${currentProduct.effectiveprice}`
                                                        : `₹${currentProduct.prod_price}`}
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
                    {orders.length > 10 && (
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
                                    className={`pagination-button ${currentPage === page ? "active" : ""
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
                    )}

                </div>
            </main>
        </div>
    );

};

export default Orders;
