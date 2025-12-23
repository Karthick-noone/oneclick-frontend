import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onApplyFilters }) => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const navigate = useNavigate(); // Hook from react-router-dom to change URL

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const applyFilters = () => {
    if (selectedBrand) {
      const params = new URLSearchParams();
      params.append('search', selectedBrand);
      navigate(`?${params.toString().toLowerCase()}`); // Append the selected brand to the URL
    }
    // onApplyFilters(selectedBrand); // Pass the selected brand to the parent component
  };

  useEffect(() => {
    // Extract the query params from the URL and set them when the component mounts
    const query = new URLSearchParams(window.location.search);
    const searchBrand = query.get('search');
    if (searchBrand) {
      setSelectedBrand(searchBrand);
    }
  }, []);

  return (
    <div style={styles.sidebar} className='filter-sidebar'>
      <h3 style={styles.title}>Filter by Mobile Brand</h3>
      <div style={styles.filterOptions}>
        {['Samsung', 'Apple', 'OnePlus', 'Redmi', 'Vivo', 'Realme', 'Oppo','Poco', 'Infinix', 'Moto', 'IQOO'].map((brand) => (
          <label key={brand} style={styles.radioLabel}>
            <input
              type="radio"
              value={brand}
              checked={selectedBrand === brand}
              onChange={handleBrandChange}
              style={styles.radioInput} // Apply styles to the input
            />
            {brand}
          </label>
        ))}
      </div>
        {/* <h3>Filter by</h3>
                    <div className="price-filter">
                        <label>
                            Price
                            <input type="range" min="0" max="100000" /><br />
                            <span>₹39,499.00 - ₹72,999.00</span>
                        </label>
                    </div> */}
      <button style={styles.applyButton} onClick={applyFilters}>
        Apply
      </button>
    </div>
  );
};

// Enhanced styles
const styles = {
  sidebar: {
    width: '250px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    // boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    // borderRadius: '8px',
  },
  title: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#333',
  },
  filterOptions: {
    marginBottom: '20px',
  },
  radioLabel: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '16px',
    color: '#555',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  radioInput: {
    marginRight: '8px', // Add some spacing between the input and label text
  },
  applyButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  applyButtonHover: {
    backgroundColor: '#0056b3',
  },
};

export default Sidebar;
