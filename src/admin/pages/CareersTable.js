import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/CareersTable.css"; // Import the CSS file
import { ApiUrl } from "../../components/ApiUrl";
import { FaDownload, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";


const CareersTable = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(`${ApiUrl}/api/careers`)
      .then((response) => {
        setCareers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading careers: {error.message}</p>;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleDownload = (resumeUrl) => {
    fetch(resumeUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = resumeUrl.split("/").pop(); // Extract file name
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed:", error);
      });
  };

  const openModal = (resumeUrl) => {
    if (isMobile) {
      handleDownload(resumeUrl); // Handle download on mobile
    } else {
      setCurrentResumeUrl(resumeUrl);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentResumeUrl("");
  };

  // Pagination logic
  const indexOfLastCareer = currentPage * itemsPerPage;
  const indexOfFirstCareer = indexOfLastCareer - itemsPerPage;
  const currentCareers = careers.slice(indexOfFirstCareer, indexOfLastCareer);

  const totalPages = Math.ceil(careers.length / itemsPerPage);

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


  const handleDeleteCareer = async (id) => {
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
        const response = await axios.delete(`${ApiUrl}/api/deletecareers/${id}`);
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
          setCareers(careers.filter((career) => career.id !== id));
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
    <div className="careers-table-container">
      <div className="orders-header">
        <h2 className="orders-page-title">Careers List</h2>
      </div>{" "}
      <table className="careers-table">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Start Date</th>
            <th>Resume</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentCareers.map((career, index) => (
            <tr key={career.id}>
              <td>{index + 1 + indexOfFirstCareer}</td>
              <td>{career.name}</td>
              <td>{career.email}</td>
              <td>{career.phone}</td>
              <td>{career.position}</td>
              <td>{formatDate(career.startDate)}</td>
              <td>
                {career.resumeLink && (
                  <button
                    title="Download"
                    className={isMobile ? "download-btn" : "resume-btn"}
                    onClick={() =>
                      openModal(
                        `${ApiUrl}/uploads/resumes/${career.resumeLink}`
                      )
                    }
                  >
                    <FaDownload
                      style={{
                        color: "black",
                        fontSize: isMobile ? "20px" : "16px",
                      }}
                    />{" "}
                    {/* Adjust icon size for mobile */}
                  </button>
                )}
              </td>
              <td>
        <button
                    className="resume-btn"
                    onClick={() => handleDeleteCareer(career.id)}
          title="Delete"
        >
          <FaTrash
            style={{
              // color: "red",
              color: "black",
              fontSize: isMobile ? "20px" : "16px",
            }}
          />
        </button>
      </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Inline Modal */}
      {modalOpen && !isMobile && (
        <div className="modall-overlay">
          <div className="modall-content">
            <button className="modall-close" onClick={closeModal}>
              ×
            </button>
            <FaDownload className="download-btn" />
            <iframe
              src={currentResumeUrl}
              title="Resume"
              className="modall-iframe"
            ></iframe>
          </div>
        </div>
      )}
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
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default CareersTable;
