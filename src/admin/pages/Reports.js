import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Reports.css"; // Import external CSS
import { ApiUrl } from "../../components/ApiUrl";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const Reports = () => {
  const navigate = useNavigate();
  const [salesReport, setSalesReport] = useState([]);
  const [ordersReport, setOrdersReport] = useState([]);
  const [customersReport, setCustomersReport] = useState([]);
  const [address, setAddress] = useState(null);

  // Pagination States for Orders, Sales, and Customers Reports
  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const [currentPageSales, setCurrentPageSales] = useState(1);
  const [currentPageCustomers, setCurrentPageCustomers] = useState(1);

  const [itemsPerPage] = useState(10); // Number of items per page
  const userId = localStorage.getItem("user_id");
  // const [user, setUser] = useState({ username: "", email: "" });

  // useEffect(() => {
  //   // Fetch user data (profile info) from localStorage or API
  //   // Example: You may fetch user info via API or just use stored data
  //   // Assuming you have user info in localStorage as an example
  //   const storedUser = {
  //     username: localStorage.getItem("username"),
  //     email: localStorage.getItem("email"),
  //   };
  //   setUser(storedUser);

  //   // Fetch address for the user
  //   axios
  //     .get(`${ApiUrl}/singleaddress/${userId}`)
  //     .then((response) => {
  //       const address = response.data[0];
  //       console.log("address",address);
  //       setAddress(address); // Assuming the address array is returned and we need the first entry
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching address:", error);
  //     });
  // }, [userId]);

  const fetchSalesReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/salesreport`);
      setSalesReport(response.data);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    fetchSalesReport();
  }, []);

  // Fetch Orders Data
  const fetchOrdersReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/ordersreport`);
      const details = response.data;
      console.log(details);
      setOrdersReport(details);
    } catch (error) {
      console.error("Error fetching orders report:", error);
    }
  };

  // Fetch Customers Data
  const fetchCustomersReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/customersreport`);
      setCustomersReport(response.data);
    } catch (error) {
      console.error("Error fetching customers report:", error);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    } else {
      // Fetch all reports once the page loads
      fetchSalesReport();
      fetchOrdersReport();
      fetchCustomersReport();
    }
  }, [navigate]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // const years = [2023, 2024, 2025]; // Example years
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const statuses = ["Pending", "Paid", "Refund Pending", "Refunded"];

  // Filter orders based on year, month, and status
  const filteredOrders = ordersReport.filter((order) => {
    const orderYear = new Date(order.order_date).getFullYear();
    const orderMonth = new Date(order.order_date).getMonth(); // 0 for January, 1 for February, etc.

    return (
      (selectedYear ? orderYear === parseInt(selectedYear) : true) &&
      (selectedMonth ? orderMonth === months.indexOf(selectedMonth) : true) &&
      (selectedStatus ? order.status === selectedStatus : true) &&
      (searchQuery
        ? order.unique_id.toLowerCase().includes(searchQuery.toLowerCase()) || // Filter by unique ID
          order.username.toLowerCase().includes(searchQuery.toLowerCase()) || // Filter by username
          (address && address.phone && address.phone.includes(searchQuery)) // Filter by phone if available
        : true)
    );
  });

  // Pagination Logic
  const indexOfLastOrderItem = currentPageOrders * itemsPerPage;
  const indexOfFirstOrderItem = indexOfLastOrderItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrderItem,
    indexOfLastOrderItem
  );

  // Pagination Logic for total pages
  const totalOrderPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const totalSalesPages = Math.ceil(salesReport.length / itemsPerPage);
  const totalCustomerPages = Math.ceil(customersReport.length / itemsPerPage);

  // Get Pagination Pages
  const getPaginationPages = (totalPages, currentPage, setCurrentPage) => {
    const pages = [];
    const maxPagesToShow = 5; // Total number of page numbers to show at a time

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

    return pages.map((page, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(page, setCurrentPage)}
        className={currentPage === page ? "active" : ""}
      >
        {page}
      </button>
    ));
  };

  // Pagination handlers
  const handlePageChange = (pageNumber, setCurrentPage) => {
    if (pageNumber === "...") return;
    setCurrentPage(pageNumber);
  };

  // const capitalizeFirstLetter = (string) => {
  //   return string.toUpperCase() + string.slice(1).toLowerCase();
  // };

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
        // setOrders(orders.filter((order) => order.unique_id !== orderId)); // Update the order state

        Swal.fire("Deleted!", "Your order has been deleted.", "success");
        fetchOrdersReport();
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

  return (
    <div className="reports-container">
      {/* Orders Report */}
      <section className="staff-main-content">
        <div className="orders-header">
          <h2 className="orders-page-title">Order Report</h2>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            onChange={(e) => setSelectedStatus(e.target.value)}
            value={selectedStatus}
            className="order_status_filter"
          >
            <option  value="">Order Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
            <span className="order_status_option">{status}</span>
                
              </option>
            ))}
          </select>

          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ width: "25px" }}
            className="order_month_filter"

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

          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={{ width: "25px" }}
            className="order_year_filter"

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
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>User Name</th>
                <th>User Mobile</th>
                <th>Total Amount (₹)</th>
                <th>Payment Method</th>
                <th>Order Status</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
            {currentOrders.length > 0 ? (

              currentOrders.map((order, index) => (
                <tr key={index}>
                  <td>{indexOfFirstOrderItem + index + 1}</td>
                  <td>#{order.unique_id}</td>
                  <td>{formatDate(order.order_date)}</td>
                  <td>{order.username}</td>
                  <td>{order.contact_number}</td>

                  <td>{order.total_amount}</td>
                  <td>{order.payment_method}</td>
                  <td>{order.status}</td>
                  <td>
                    {" "}
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteOrder(order.unique_id)}
                    >
                      <FaTrash />
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
                        No orders found
                      </td>
                    </tr>
                  )}


            </tbody>
          </table>
        </div>
        {/* Pagination Controls for Orders Report */}
        <div className="pagination-controls">
          <button
            onClick={() =>
              handlePageChange(currentPageOrders - 1, setCurrentPageOrders)
            }
            disabled={currentPageOrders === 1}
          >
            &lt;
          </button>
          {getPaginationPages(
            totalOrderPages,
            currentPageOrders,
            setCurrentPageOrders
          )}
          <button
            onClick={() =>
              handlePageChange(currentPageOrders + 1, setCurrentPageOrders)
            }
            disabled={currentPageOrders === totalOrderPages}
          >
            &gt;
          </button>
        </div>
      </section>

      {/* Customers Report */}
    </div>
  );
};

export default Reports;
