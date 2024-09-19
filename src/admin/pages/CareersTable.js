import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/CareersTable.css'; // Import the CSS file
import { ApiUrl } from '../../components/ApiUrl';

const CareersTable = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState('');

  useEffect(() => {
    axios.get(`${ApiUrl}/api/careers`)
      .then(response => {
        setCareers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading careers: {error.message}</p>;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const openModal = (resumeUrl) => {
    setCurrentResumeUrl(resumeUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentResumeUrl('');
  };

  return (
    <div className="careers-table-container">
      <h2>Careers List</h2>
      <table className="careers-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Start Date</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {careers.map((career, index) => (
            <tr key={career.id}>
              <td>{index + 1}</td>
              <td>{career.name}</td>
              <td>{career.email}</td>
              <td>{career.phone}</td>
              <td>{career.position}</td>
              <td>{formatDate(career.startDate)}</td>
              <td>
                {career.resumeLink && (
                  <button className='resume-btn' onClick={() => openModal(`${ApiUrl}/uploads/resumes/${career.resumeLink}`)}>
                    View Resume
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Inline Modal */}
      {modalOpen && (
        <div className="modall-overlay">
          <div className="modall-content">
            <button className="modall-close" onClick={closeModal}>×</button>
            <iframe src={currentResumeUrl} title="Resume" className="modall-iframe"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersTable;
