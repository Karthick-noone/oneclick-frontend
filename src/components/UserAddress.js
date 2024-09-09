import React, { useState, useEffect } from 'react';
import './css/UserAddress.css';
import Header2 from './Header2';
import { ApiUrl } from './ApiUrl';
import Swal from 'sweetalert2';

const AddressPage = () => {
  const [userId, setUserId] = useState(null);
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
  });
  const [submittedAddresses, setSubmittedAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchAddresses(storedUserId);
    }
  }, []);

  const fetchAddresses = async (userId) => {
    try {
      const response = await fetch(`${ApiUrl}/useraddress/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSubmittedAddresses(data);
      } else {
        console.error('Error fetching addresses:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  

    
    // Handle clearing the phone number field
    if (name === 'phone' && value === '') {
      setAddress({
        ...address,
        [name]: '', // Clear the phone number field
      });
      return;
    }
  
    // Validate fields based on their name
    if (name === 'phone') {
      if (!/^[6-9]\d{0,9}$/.test(value) || value.length > 10) {
        return; // Prevent setting invalid phone number
      }
    } else if (name === 'postal_code') {
      if (!/^\d*$/.test(value) || value.length > 6) {
        return; // Prevent setting invalid postal code
      }
    } else if (['name', 'city', 'state', 'country'].includes(name)) {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        return; // Prevent setting invalid value containing special characters
      }
    }
  
    setAddress({
      ...address,
      [name]: value,
    });
  };
  

//     // Effect to validate fields when `editingAddress` changes
//     useEffect(() => {
//         if (editingAddress) {
//           // Validate phone number
//           if (editingAddress.phone && !/^[6-9]\d{0,9}$/.test(editingAddress.phone)) {
//             // Prevent invalid phone number from being set
//             setEditingAddress(prev => ({
//               ...prev,
//               phone: prev.phone, // Keep the previous valid phone number
//             }));
//           }
//       // Validate postal code
//       if (editingAddress.postal_code && (!/^\d*$/.test(editingAddress.postal_code) || editingAddress.postal_code.length > 6)) {
//         setEditingAddress(prev => ({
//           ...prev,
//           postal_code: '', // Clear postal code if invalid
//         }));
//       }

//       // Validate other fields
//       const textFields = ['name', 'city', 'state', 'country'];
//       textFields.forEach(field => {
//         if (editingAddress[field] && !/^[a-zA-Z\s]*$/.test(editingAddress[field])) {
//           setEditingAddress(prev => ({
//             ...prev,
//             [field]: '', // Clear field if invalid
//           }));
//         }
//       });
//     }
//   }, [editingAddress]);


const handleChange2 = (e) => {
    const { name, value } = e.target;

    // Validation for phone number
    if (name === 'phone') {
      if (/^[6-9]\d{0,9}$/.test(value) || value === '') {
        setEditingAddress(prev => ({
          ...prev,
          phone: value,
        }));
      }
    }
    else if (name === 'postal_code') {
        if (/^\d{0,6}$/.test(value)) {
          setEditingAddress(prev => ({
            ...prev,
            postal_code: value.length === 6 ? value : value.slice(0, 6),
          }));
        }
      }
    // Validation for text fields (name, city, state, country)
    else if (['name', 'city', 'state', 'country'].includes(name)) {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setEditingAddress(prev => ({
          ...prev,
          [name]: value,
        }));
      }
    }
    // For other fields, update state without validation
    else {
      setEditingAddress(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };



 const handleEditClick = (addr) => {
    setEditingAddress(addr);
  };

const validateAddress = (address) => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  // Validate name, city, state, and country
  if (!nameRegex.test(address.name)) {
    return 'Name, City, State, and Country fields must contain only letters.';
  }
  if (!nameRegex.test(address.city)) {
    return 'City field must contain only letters.';
  }
  if (!nameRegex.test(address.state)) {
    return 'State field must contain only letters.';
  }
  if (!nameRegex.test(address.country)) {
    return 'Country field must contain only letters.';
  }

  // Validate phone number
  if (!phoneRegex.test(address.phone)) {
    return 'Phone number must be exactly 10 digits.';
  }

  return null;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const validationError = validateAddress(address);
  if (validationError) {
    Swal.fire({
      title: 'Validation Error',
      text: validationError,
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  if (!userId) {
    alert('User ID is missing');
    return;
  }

  try {
    const response = await fetch(`${ApiUrl}/useraddress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, address }),
    });

    if (response.ok) {
      Swal.fire({
        title: 'Success',
        text: 'Address added successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      setSubmittedAddresses([ { ...address, address_id: Date.now() }, ...submittedAddresses,]); // Simulate address with ID
      setAddress({
        name: '',
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        phone: '',
      });
    } else {
      console.error('Error submitting address:', await response.text());
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const handleUpdate = async (e) => {
  e.preventDefault();

  const validationError = validateAddress(editingAddress);
  if (validationError) {
    Swal.fire({
      title: 'Validation Error',
      text: validationError,
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  if (!userId || !editingAddress) {
    alert('User ID is missing or no address selected for update');
    return;
  }

  try {
    const response = await fetch(`${ApiUrl}/updateuseraddress/${editingAddress.address_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingAddress),
    });

    if (response.ok) {
      Swal.fire({
        title: 'Success',
        text: 'Address updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      setSubmittedAddresses(submittedAddresses.map(addr => addr.address_id === editingAddress.address_id ? editingAddress : addr));
      setEditingAddress(null);
    } else {
      console.error('Error updating address:', await response.text());
      Swal.fire({
        title: 'Error',
        text: 'Failed to update address. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      title: 'Error',
      text: 'An unexpected error occurred. Please try again later.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

const handleDeleteClick = async (addr) => {
    console.log('Address to delete:', addr); // Debugging line
  
    if (!addr || !addr.address_id) {
      Swal.fire({
        title: 'Error',
        text: 'Invalid address ID',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true, // This will reverse the buttons for a better UX
    });
  
    if (!result.isConfirmed) {
      return; // If the user cancels, simply return without proceeding
    }
  
    try {
      const response = await fetch(`${ApiUrl}/deleteuseraddress/${addr.address_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Address deleted successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
  
        // Update the state to reflect the deletion
        setSubmittedAddresses(submittedAddresses.filter(address => address.address_id !== addr.address_id));
      } else {
        console.error('Error deleting address:', await response.text());
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete address',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while deleting the address',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
  
  // In your component's render method or return statement
  
  
  return (
    <>
      <Header2 />
      <div className="address-page-container">
        <div className="address-form-container">
          <h1>Add New Address</h1>
          <form className="address-form" onSubmit={handleSubmit}>
  <div className="form-group-row">
    <div className="form-group">
      <label htmlFor="name">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={address.name}
        onChange={handleChange}
        pattern="[A-Za-z\s]+"
        title="Name should only contain letters and spaces"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="street">Street Address</label>
      <input
        type="text"
        id="street"
        name="street"
        value={address.street}
        onChange={handleChange}
        required
      />
    </div>
  </div>
  <div className="form-group-row">
    <div className="form-group">
      <label htmlFor="city">City</label>
      <input
        type="text"
        id="city"
        name="city"
        value={address.city}
        onChange={handleChange}
        pattern="[A-Za-z\s]+"
        title="City should only contain letters and spaces"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="state">State</label>
      <input
        type="text"
        id="state"
        name="state"
        value={address.state}
        onChange={handleChange}
        pattern="[A-Za-z\s]+"
        title="State should only contain letters and spaces"
        required
      />
    </div>
  </div>
  <div className="form-group-row">
    <div className="form-group">
      <label htmlFor="postalCode">Postal Code</label>
      <input
        type="text"
        id="postal_code"
        name="postal_code"
        value={address.postal_code}
        onChange={handleChange}
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="country">Country</label>
      <input
        type="text"
        id="country"
        name="country"
        value={address.country}
        onChange={handleChange}
        pattern="[A-Za-z\s]+"
        title="Country should only contain letters and spaces"
        required
      />
    </div>
  </div>
  <div className="form-group">
    <label htmlFor="phone">Phone Number</label>
    <input
      type="text"
      id="phone"
      name="phone"
      value={address.phone}
      onChange={handleChange}
      pattern="[0-9]{10}"
      title="Phone number should be exactly 10 digits"
      required
    />
  </div>
  <button className='adr-btn' type="submit">Save Address</button>
</form>
        </div>

        <div className="submitted-addresses-container">
          <h2>Submitted Addresses:</h2>
          {submittedAddresses.length > 0 ? (
            submittedAddresses.map((addr) => (
              <div className="address-card" key={addr.id}>
                <p><strong>Name:</strong> {addr.name}</p>
                <p><strong>Street Address:</strong> {addr.street}</p>
                <p><strong>City:</strong> {addr.city}</p>
                <p><strong>State:</strong> {addr.state}</p>
                <p><strong>Postal Code:</strong> {addr.postal_code}</p>
                <p><strong>Country:</strong> {addr.country}</p>
                <p><strong>Phone Number:</strong> {addr.phone}</p>
                
                <div className="button-container">
                <button className='adr-btn'  onClick={() => handleEditClick(addr)}>Edit</button>
                <button className='adr-btn' onClick={() => handleDeleteClick(addr)}>Delete</button>
                {/* <button className='adr-btn' >Use this address</button> */}

        </div>
              </div>
            ))
          ) : (
            <p>No addresses added yet.</p>
          )}
        </div>

        {editingAddress && (
          <div className="model">
            <div className="model-content">
            <span className="closee" onClick={() => setEditingAddress(null)}>&times;</span>
            <h2>Edit Address</h2>
              <form onSubmit={handleUpdate}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editingAddress.name}
                      onChange={handleChange2}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="street">Street Address</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={editingAddress.street}
                      onChange={handleChange2}
                      required
                    />
                  </div>
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={editingAddress.city}
                      onChange={handleChange2}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={editingAddress.state}
                      onChange={handleChange2}
                      required
                    />
                  </div>
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postal_ode"
                      name="postal_code"
                      value={editingAddress.postal_code}
                      onChange={handleChange2}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={editingAddress.country}
                      onChange={handleChange2}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={editingAddress.phone}
                    onChange={handleChange2}
                    required
                  />
                </div>
                <button className='adr-btn' type="submit">Update Address</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddressPage;