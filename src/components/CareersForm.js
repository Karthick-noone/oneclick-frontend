import React, { useState } from 'react';
import { ApiUrl } from './ApiUrl';
import Swal from 'sweetalert2';

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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required.';
    if (!formData.lastName) newErrors.lastName = 'Last name is required.';
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits.';
    }
    if (!formData.position) newErrors.position = 'Position is required.';
    if (!formData.startDate) newErrors.startDate = 'Start date is required.';
    if (!formData.resumeLink) newErrors.resumeLink = 'Resume link is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "phone") {
      // Validate number input
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      if (
        sanitizedValue.length > 0 &&
        !(sanitizedValue[0] >= "6" && sanitizedValue[0] <= "9")
      ) {
        setFormData({ ...formData, [name]: sanitizedValue.slice(1) });
      } else {
        setFormData({ ...formData, [name]: sanitizedValue });
      }
    } else if (name === "resumeLink") {
      // Ensure URL input is valid
      setFormData({ ...formData, [name]: value });
    } else if (name === "firstName" || name === "lastName") {
      // Validate name input
      const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      // Handle other inputs
      setFormData({ ...formData, [name]: value });
    }
  };
  

  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (validateForm()) {
      const { firstName, lastName, ...rest } = formData;
      const formDataWithName = {
        ...rest,
        name: `${firstName} ${lastName}`, // Combine names
      };
  
      fetch(`${ApiUrl}/submit-careers-form`, { // Update with your server endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithName),
      })
        .then((response) => {
          if (response.ok) {
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              position: '',
              startDate: '',
              resumeLink: ''
            });
            setErrors({});
            Swal.fire({
              title: 'Success!',
              text: 'Form submitted successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          } else {
            return response.json().then((data) => {
              if (data.message === 'Email already exists.') {
                Swal.fire({
                  title: 'Error!',
                  text: 'The email you provided is already registered. Please use a different email.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                });
              } else {
                throw new Error(data.message || 'Failed to submit form');
              }
            });
          }
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to submit form. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      setIsSubmitting(false);
    }
  };
  

  const getTodayDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based
    const year = today.getFullYear();
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  };
  
  const getMaxDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 4); // Add 4 months
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based
    const year = today.getFullYear();
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  };
  

  const todayDate = getTodayDate();
  const maxDate = getMaxDate();

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
            />
            {errors.firstName && <p style={formStyles.error}>{errors.firstName}</p>}
          </label>
          <label style={formStyles.label}>
            Last Name
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={formStyles.input}
            />
            {errors.lastName && <p style={formStyles.error}>{errors.lastName}</p>}
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
            />
            {errors.email && <p style={formStyles.error}>{errors.email}</p>}
          </label>
          <label style={formStyles.label}>
            Phone
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={formStyles.input}
            />
            {errors.phone && <p style={formStyles.error}>{errors.phone}</p>}
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
            >
              <option value="">Select Position</option>
              <option value="developer">In-store Sales</option>
              <option value="designer">Store Leadership</option>
              <option value="manager">In-store Operations</option>
              <option value="manager">Warehouse & Logistics</option>
              <option value="manager">eCommerce</option>
            </select>
            {errors.position && <p style={formStyles.error}>{errors.position}</p>}
          </label>
          <label style={formStyles.label}>
            Available Start Date
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              min={todayDate}
              max={maxDate}
              onChange={handleChange}
              style={formStyles.input}
            />
            {errors.startDate && <p style={formStyles.error}>{errors.startDate}</p>}
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
            />
            {errors.resumeLink && <p style={formStyles.error}>{errors.resumeLink}</p>}
          </label>
        
        </div>
        <center><button
  type="submit"
  style={{
    ...formStyles.button,
    ...(isHovered ? formStyles.buttonHover : {}),
    ...(isFocused ? formStyles.buttonFocus : {}),
  }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
>
  Submit
</button></center>
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
    textDecoration: 'underline'
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
    gap: '20px',
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
    padding: '12px 30px',
    border: 'none',
    borderRadius: '50px',
    backgroundColor: '#007BFF', // Blue background
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s, transform 0.2s', // Smooth transitions
    marginTop: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
    outline: 'none',
    width:'200px'
  },
  buttonHover: {
    backgroundColor: '#0056b3', // Darker blue on hover
    transform: 'scale(1.05)', // Slightly enlarge on hover
  },
  buttonFocus: {
    outline: '2px solid #0056b3', // Outline on focus
  },
  error: {
    color: 'red',
    fontSize: '0.9em',
  },
};


export default CareersForm;