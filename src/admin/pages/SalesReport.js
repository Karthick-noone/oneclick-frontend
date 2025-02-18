import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiUrl } from '../../components/ApiUrl';
// import "./css/Reports.css"; // Import external CSS

const SalesReport = () => {
  const navigate = useNavigate();
  const [salesReport, setSalesReport] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [currentPageSales, setCurrentPageSales] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  // Fetch Sales Report Data
  const fetchSalesReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/api/salesreport`);
      setSalesReport(response.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    } else {
      fetchSalesReport();
    }
  }, [navigate]);

  // Filter sales data based on the search query
  const filteredSalesReport = salesReport.filter((item) => {
    return (
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination Logic for Sales Report
  const indexOfLastSalesItem = currentPageSales * itemsPerPage;
  const indexOfFirstSalesItem = indexOfLastSalesItem - itemsPerPage;
  const currentSales = filteredSalesReport.slice(indexOfFirstSalesItem, indexOfLastSalesItem);

  const totalSalesPages = Math.ceil(filteredSalesReport.length / itemsPerPage);

  // Get Pagination Pages
  const getPaginationPages = (totalPages, currentPage, setCurrentPage) => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftBoundary = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      const rightBoundary = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

      if (leftBoundary > 2) {
        pages.push(1, '...');
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pages.push(i);
      }

      if (rightBoundary < totalPages - 1) {
        pages.push('...', totalPages);
      }
    }

    return pages.map((page, index) => (
      <button
        key={index}
        onClick={() => handlePageChange(page, setCurrentPage)}
        className={currentPage === page ? 'active' : ''}
      >
        {page}
      </button>
    ));
  };

  const handlePageChange = (pageNumber, setCurrentPage) => {
    if (pageNumber === '...') return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="reports-container">
      <section className="staff-main-content">
        <div className="orders-header">
          <h2 className="orders-page-title">Sales Report</h2>
          <div className='filters'>
          <input
            type="text"
            placeholder="Search by Product Name or Category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          /></div>
        </div>
        <div className="table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Total Sales (₹)</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.length > 0 ? (
                currentSales.map((item, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstSalesItem + index + 1}</td>
                    <td>{item.product_name}</td>
                    <td>{item.category}</td>
                    <td>{item.sales}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No sales data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls for Sales Report */}
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPageSales - 1, setCurrentPageSales)}
            disabled={currentPageSales === 1}
          >
            &lt;
          </button>
          {getPaginationPages(totalSalesPages, currentPageSales, setCurrentPageSales)}
          <button
            onClick={() => handlePageChange(currentPageSales + 1, setCurrentPageSales)}
            disabled={currentPageSales === totalSalesPages}
          >
            &gt;
          </button>
        </div>
      </section>
    </div>
  );
};

export default SalesReport;
