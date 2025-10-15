import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/ContactsTable.css"; // Import the CSS file
import { ApiUrl } from "../../components/ApiUrl";
import { FaTrash } from "react-icons/fa";
// import { FaDownload } from 'react-icons/fa';
import Swal from "sweetalert2";
import BlackTick from './img/check.png'
import BlueTick from './img/double-check.png'

const ContactsTable = () => {
  const [contacts, setContacts] = useState([]);
  //   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for Popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedMessage, setSelectedMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${ApiUrl}/fetchcontacts`) // Adjust this to your actual contacts API endpoint
      .then((response) => {
        setContacts(response.data);
        // setLoading(false);
      })
      .catch((error) => {
        setError(error);
        // setLoading(false);
      });
  }, []);

const handleMessageClick = async (contact) => {
  try {
    // 1 Call API to mark enquiry as read
    await axios.patch(`${ApiUrl}/api/enquiries/mark-read/${contact.id}`);

    // 2 Update frontend state to show blue tick
    const updatedContacts = contacts.map((c) =>
      c.id === contact.id ? { ...c, isRead: 1 } : c
    );
    setContacts(updatedContacts);

    // 3 Set modal data and show popup
    setSelectedSubject(contact.subject);
    setSelectedMessage(contact.message);
    setShowPopup(true);
  } catch (err) {
    console.error("Failed to mark enquiry as read", err);
    alert("Could not mark as read. Please try again.");
  }
};


  const handleClosePopup = () => {
    setShowPopup(false);
  };

  //   if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading contacts: {error.message}</p>;

  // Pagination logic
  const indexOfLastContact = currentPage * itemsPerPage;
  const indexOfFirstContact = indexOfLastContact - itemsPerPage;
  const currentContacts = contacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

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


  const handleDeleteContact = async (id) => {
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
        const response = await axios.delete(`${ApiUrl}/api/deletecontact/${id}`);
        if (response.status === 200) {
          // Show success message
          Swal.fire({
            title: "Deleted!",
            text: "Career entry has been deleted.",
            icon: "success",
            timer: 2000,
            showConfirmButton: true,
          });

          // Update state to remove deleted career
          setContacts(contacts.filter((career) => career.id !== id));
        } else {
          Swal.fire({
            title: "Error",
            text: response.data.message || "Failed to delete the entry.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error deleting career entry:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while deleting the entry.",
          icon: "error",
        });
      }
    }
  };

  
  return (
    <div className="contacts-table-container">
      <main className="staff-main-content">
        <div className="orders-header">
          <h2 className="orders-page-title">Contacted Lists</h2>
        </div>{" "}
        <table className="careers-table">
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date</th> {/* Add Date column */}
              <th>Subject</th>
              <th>Message</th>
              <th>Delete</th>
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
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(contact.created_at))}
                  <br />
                  {new Intl.DateTimeFormat("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true, // 12-hour format with AM/PM
                  }).format(new Date(contact.created_at))}
                </td>


                <td title={contact.subject}>
                  {contact.subject.length > 25
                    ? contact.subject.substring(0, 25) + "..."
                    : contact.subject}
                </td>

                <td >
                  <button
                    className="message-btn"
                    onClick={() => handleMessageClick(contact)}
                  >
                    View
                  </button>
                  {contact.isRead ? (
                    <img alt="Seen" src={BlueTick} title="Seen" style={{marginLeft:'5px'}} width={'17px'}/> // Blue tick
                  ) : (
                    <img alt="Unseen" src={BlackTick} title="Unseen"  style={{marginLeft:'5px'}} width={'17px'}/> // Grey tick
                  )}
                </td>

                <td>
                  <button
                    className="resume-btn"
                    onClick={() => handleDeleteContact(contact.id)}
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
        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            &lt;
          </button>
          {getPaginationPages().map((page, index) =>
            page === "..." ? (
              <span key={index}>...</span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? "active" : ""}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
        {/* Popup for Messages */}
        {showPopup && (
          <div className="popup-overlay-unique">
            <div className="popup-content-unique">
              <button
                className="popup-close-btn"
                onClick={handleClosePopup}
                title="Close"
              >
                &times;
              </button>
              <span className="popup-heading">{selectedSubject}</span>
              <p className="popup-message"><strong> </strong>{selectedMessage}</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ContactsTable;
