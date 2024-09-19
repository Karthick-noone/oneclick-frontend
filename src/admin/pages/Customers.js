import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Customers.css'; // Import external CSS
import { ApiUrl } from '../../components/ApiUrl';

const Customers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

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
                {/* <th>User ID</th> */}
                <th>Username</th>
                <th>Email</th>
                <th>Address</th>
                {/* <th>Street</th>
                <th>City</th>
                <th>State</th>
                <th>Postal Code</th>
                <th>Country</th> */}
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.user_id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  {/* <td>{user.user_id}</td> */}
                  <td>{capitalizeFirstLetter(user.username)}</td>
                  <td>{user.email}</td>
                  <td>{user.address_name || 'N/A'}, {user.street || 'N/A'}, {user.city || 'N/A'}, {user.state || 'N/A'}, {user.postal_code || 'N/A'}, {user.country || 'N/A'}</td>
                 
                  <td>{user.phone || 'N/A'}</td>
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
    </div>
  );
};

export default Customers;
