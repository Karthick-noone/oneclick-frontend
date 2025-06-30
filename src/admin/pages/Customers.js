import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Customers.css"; // Import external CSS
import { ApiUrl } from "../../components/ApiUrl";
import Modal from "react-modal"; // Importing Modal
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import userlogo from "./img/user.jpg";
import checkIcon from './img/check-mark.png'
import { SearchIcon } from "lucide-react";

const Customers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Users Data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/users`);
      setUsers(response.data);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    } else {
      fetchUsers();
    }
  }, [navigate]);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;

  const filteredUsers = users.filter((user) =>
    `${user.username} ${user.email} ${user.contact_number}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  useEffect(() => {
    const newTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [filteredUsers, itemsPerPage, currentPage]);


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

    return pages;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Function to handle opening the modal with user details
  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (id) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${ApiUrl}/api/deleteuser/${id}`);
        if (response.status === 200) {
          // Show success message
          Swal.fire({
            title: "Deleted!",
            text: "User entry has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: true,
          });

          // Update state to remove deleted user
          setUsers(users.filter((user) => user.id !== id)); // Filter by user_id
        } else {
          Swal.fire({
            title: "Error",
            text: response.data.message || "Failed to delete the user entry.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error deleting user entry:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while deleting the user entry.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="customers-container">
      <main className="staff-main-content">
        <div className="orders-header">
          <h2 className="orders-page-title">Customer Details</h2>
        </div>
        <div className="filters-section">
          <div className="product-search-wrapper">
            <span className="product-search-icon">

              <SearchIcon width={'18px'} className="search-icon-btn" />
            </span>
            <input
              type="text"
              placeholder="Search by Username, email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="product-search-input"
            />
            {searchQuery && (
              <button
                className="product-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
        {/* Customers Table */}
        <section className="customers-section">
          <div className="table-wrapper">
            <table className="careers-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Number</th>
                  <th>Full Address</th> {/* New View column */}
                  <th>Delete</th> {/* New View column */}
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.user_id}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{capitalizeFirstLetter(user.username)}</td>
                    <td>{user.email}</td>
                    {/* <td>{user.id}</td> */}
                    <td>{user.contact_number}</td>
                    <td>
                      <button
                        onClick={() => openModal(user)}
                        className="view-button"
                      >
                        View
                      </button>
                    </td>
                    <td>
                      <button
                        className="resume-btn"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete"
                      >
                        <FaTrash
                          style={{
                            // color: "red",
                            color: "black",
                            // fontSize: isMobile ? "20px" : "16px",
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pagination Controls */}
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

        {/* Modal for Viewing User Details */}
        {/* Modal for Viewing User Details */}

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="User Details"
          ariaHideApp={false}
          className="user-details-modal"
        >
          <h2>User Details</h2>
          <div className="user-details-container">
            <div className="user-details-info">
              {selectedUser && (
                <>
                  <p>
                    <strong>Username:</strong>{" "}
                    {capitalizeFirstLetter(selectedUser.username)}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>Number:</strong> {selectedUser.contact_number}
                  </p>
                </>
              )}
            </div>
            <div className="user-details-image">
              <img src={userlogo} alt="User Logo" />
            </div>
          </div>

          {/* Addresses displayed below the container */}
          {selectedUser &&
            selectedUser.address_names &&
            selectedUser.address_names.split(", ").map((address, i) => {
              const street = selectedUser.streets?.split(", ")[i] || "N/A";
              const city = selectedUser.cities?.split(", ")[i] || "N/A";
              const state = selectedUser.states?.split(", ")[i] || "N/A";
              const postalCode = selectedUser.postal_codes?.split(", ")[i] || "N/A";
              const country = selectedUser.countries?.split(", ")[i] || "N/A";
              const phone = selectedUser.phones?.split(", ")[i] || "N/A";
              const isCurrent =
                selectedUser.current_addresses?.split(", ")[i] === "1";

              return (
                <div
                  key={i}
                  className={`address-box ${isCurrent ? "current-address" : ""}`}
                >
                  {isCurrent && (
                    <p className="current-label">Current Address</p>
                  )}
                  {isCurrent && (
                    <img src={checkIcon} className="current-icon" alt="Current" />
                  )}
                  <p>
                    <strong>Address {i + 1}:</strong> {address}, {street}, {city}, {state},{" "}
                    {postalCode}, {country}
                  </p>
                  <p>
                    <strong>Phone:</strong> {phone}
                  </p>

                </div>
              );
            })}


          <button onClick={closeModal}>Close</button>
        </Modal>
      </main>
    </div>
  );
};

export default Customers;
