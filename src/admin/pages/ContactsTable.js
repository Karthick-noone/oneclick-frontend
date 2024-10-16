import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/ContactsTable.css'; // Import the CSS file
import { ApiUrl } from '../../components/ApiUrl';
// import { FaDownload } from 'react-icons/fa';

const ContactsTable = () => {
  const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for Popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('');

  useEffect(() => {
    axios.get(`${ApiUrl}/fetchcontacts`) // Adjust this to your actual contacts API endpoint
      .then(response => {
        setContacts(response.data);
        // setLoading(false);
      })
      .catch(error => {
        setError(error);
        // setLoading(false);
      });
  }, []);

  const handleMessageClick = (contact) => {
    setSelectedSubject(contact.subject); // Assuming the contact object has a subject
    setSelectedMessage(contact.message); // Assuming the contact object has a message
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

//   if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading contacts: {error.message}</p>;

  // Pagination logic
  const indexOfLastContact = currentPage * itemsPerPage;
  const indexOfFirstContact = indexOfLastContact - itemsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  const totalPages = Math.ceil(contacts.length / itemsPerPage);

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

  return (
    <div className="contacts-table-container">
      <h2>Contacts List</h2>
      <table className="contacts-table">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Message</th> {/* Add Message column */}
    </tr>
  </thead>
<tbody>
  {currentContacts.map((contact, index) => (
    <tr key={contact.id}>
      <td>{index + 1 + indexOfFirstContact}</td>
      <td>{contact.name}</td>
      <td>{contact.email}</td>
      <td>{contact.phone}</td>
      <td>
        <button className='message-btn' onClick={() => handleMessageClick(contact)}>View</button>
      </td>
    </tr>
  ))}
</tbody>
</table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          &lt;
        </button>
        {getPaginationPages().map((page, index) =>
          page === '...' ? (
            <span key={index}>...</span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={page === currentPage ? 'active' : ''}
            >
              {page}
            </button>
          )
        )}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>

      {/* Popup for Messages */}
      {showPopup && (
  <div className="popuppp-overlay">
    <div className="popuppp-content">
      <h2>Subject: {selectedSubject}</h2>
      <p>Message: {selectedMessage}</p>
      <button style={{ background: 'red' }} className='changee-btn' onClick={handleClosePopup}>
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default ContactsTable;
