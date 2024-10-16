import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Customers.css'; // Import external CSS
import { ApiUrl } from '../../components/ApiUrl';
import Modal from 'react-modal'; // Importing Modal

const Customers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch Users Data
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/users`);
      setUsers(response.data);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
    } catch (error) {
      console.error('Error fetching users:', error);
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
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

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
      const leftBoundary = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      const rightBoundary = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

      if (leftBoundary > 2) {
        pages.push(1, '...');
      } else {
        for (let i = 1; i < leftBoundary; i++) {
          pages.push(i);
        }
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pages.push(i);
      }

      if (rightBoundary < totalPages - 1) {
        pages.push('...', totalPages);
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

  return (
    <div className="customers-container">
      <h3 className="page-titlee">Customer Details</h3>

      {/* Customers Table */}
      <section className="customers-section">
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Username</th>
                <th>Email</th>
                <th>Number</th>
                <th>View</th> {/* New View column */}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.user_id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{capitalizeFirstLetter(user.username)}</td>
                  <td>{user.email}</td>
                  <td>{user.contact_number}</td>
                  <td>
                    <button onClick={() => openModal(user)} className="view-button">
                      View
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
              if (page !== '...') handlePageChange(page);
            }} 
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            disabled={page === '...'}
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
  {selectedUser && (
    <div>
      <p><strong>Username:</strong> {capitalizeFirstLetter(selectedUser.username)}</p>
      <p><strong>Email:</strong> {selectedUser.email}</p>
      <p><strong>Number:</strong> {selectedUser.contact_number}</p>
      <p><strong>Addresses:</strong></p>
      {selectedUser.address_names && selectedUser.address_names.split(', ').map((address, i) => {
        const street = selectedUser.streets?.split(', ')[i] || 'N/A';
        const city = selectedUser.cities?.split(', ')[i] || 'N/A';
        const state = selectedUser.states?.split(', ')[i] || 'N/A';
        const postalCode = selectedUser.postal_codes?.split(', ')[i] || 'N/A';
        const country = selectedUser.countries?.split(', ')[i] || 'N/A';
        const phone = selectedUser.phones?.split(', ')[i] || 'N/A'; // Corresponding phone number

        return (
          <div key={i}>
            <p>
              {i + 1}. {address}, {street}, {city}, {state}, {postalCode}, {country} 
              <br />
              <strong>Phone:</strong> {phone}
            </p>
          </div>
        );
      })}
    </div>
  )}
  <button onClick={closeModal}>Close</button>
</Modal>

    </div>
  );
};

export default Customers;
