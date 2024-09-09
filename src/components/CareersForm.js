import React, { useState } from 'react';

const CareersForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    startDate: '',
    resumeLink: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form data submitted:', formData);
  };

  return (
    <div style={formStyles.container}>
      <h2 style={formStyles.title}>Careers</h2>
      <p style={formStyles.description}>Check out our job postings & opportunities waiting for you</p>
      <form onSubmit={handleSubmit} style={formStyles.form}>
        <div style={formStyles.inputRow}>
          <label style={formStyles.label}>
            First Name
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </label>
          <label style={formStyles.label}>
            Last Name
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </label>
        </div>
        <div style={formStyles.inputRow}>
          <label style={formStyles.label}>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </label>
          <label style={formStyles.label}>
            Phone
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </label>
        </div>
        <div style={formStyles.inputRow}>
          <label style={formStyles.label}>
            Position You Apply for
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              style={formStyles.select}
              required
            >
              <option value="">Select Position</option>
              <option value="developer">In-store Sales</option>
              <option value="designer">Store Leadership</option>
              <option value="manager">In-store Operations</option>
              <option value="manager">Warehouse & Logistics</option>
              <option value="manager">eCommerce</option>
              {/* Add more positions as needed */}
            </select>
          </label>
          <label style={formStyles.label}>
            Available Start Date
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              style={formStyles.input}
              required
            />
          </label>
        </div>
        <div style={formStyles.inputRow}>
          <label style={formStyles.label}>
            Link to Resume
            <input
              type="url"
              name="resumeLink"
              value={formData.resumeLink}
              onChange={handleChange}
              style={formStyles.input}
              placeholder="Enter URL"
              required
            />
          </label>
          <button type="submit" style={formStyles.button}>Submit</button>
        </div>
      </form>
    </div>
  );
};

const formStyles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2em',
    marginBottom: '10px',
    color: '#333',
    textAlign: 'center',
    textDecoration:"underline"
  },
  description: {
    marginBottom: '40px',
    color: '#555',
    textAlign: 'center',
    fontSize: '1.1em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    gap: '20px', // Space between items
  },
  label: {
    flex: '1',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: 'none',
    borderBottom: '2px solid #ccc',
    borderRadius: '0',
    outline: 'none',
    fontSize: '1em',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: 'none',
    borderBottom: '2px solid #ccc',
    borderRadius: '0',
    outline: 'none',
    fontSize: '1em',
  },
  button: {
    padding: '0px 30px',
    border: 'none',
    borderRadius: '50px',
    backgroundColor: '#333',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  },
};

export default CareersForm;
