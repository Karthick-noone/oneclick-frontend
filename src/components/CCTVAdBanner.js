import React, { useEffect, useState } from 'react';
import './css/ComputerAdBanner.css';  // Importing styles
import Header2 from './Header2';
import axios from "axios";
import { ApiUrl } from './ApiUrl';
import offerAd from './img/design.png';
import { useNavigate } from 'react-router-dom';


const AdBanner = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchcctvofferspage`);
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Click handler function
  const handleAdClick = (product) => {
    const url = `/${product.category}?search=${product.brand_name.toLowerCase()}`;
    navigate(url); // Navigate to the constructed URL
  };
  // Click handler function
  const handlePageClick = (product) => {
    // const url = `/${product.category}?search=${product.brand_name.toLowerCase()}`;
    navigate(`/${product.category}`); // Navigate to the constructed URL
  };

  return (
    <>
      <Header2 />
      <div className="ad-section-container4">
        {/* Single Ads Section */}
        <div className="offer-ad-container4">
          {products && products.length > 0 ? (
            products.map((product, index) => {
              const firstImage = product.image ? product.image.split(",")[0] : '';
              if (firstImage.startsWith('banner')) {
                return null; // Skip banner images in this section
              }
  
              return (
                <div
                  key={product.id}
                  className="single-ad-container4"
                  onClick={() => handleAdClick(product)}
                >
                  <div className="image-wrapper" style={{ position: 'relative' }}>
                    {product.image && product.image.length > 0 ? (
                      <div className="product-image-wrapper">
                        <p className="brand-name">{product.brand_name}</p>
                        <img
                          src={`${ApiUrl}/uploads/offerspage/${firstImage}`}
                          alt="Product"
                          className="offer-add"
                          // style={{ width: '440px', height: '240px' }}
                        />
                      </div>
                    ) : (
                      <p>No images available</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: 'white' }}>No products available.</p>
          )}
        </div>
  
        {/* Banner Section (Rendered after single ads) */}
        <div className="bannerr-container4">
        {products.length > 0 &&
        products.some(product => product.image && product.image.startsWith('banner')) ? (
          products
            .filter(product => product.image && product.image.startsWith('banner'))
            .map((product, index) => (
              <div key={index} className="banner-image-display" style={{ marginTop: '-30px', position: 'relative', marginBottom: '5px' }}>
                <p style={{ marginTop: '30px' }} className="brand-name">{product.brand_name}</p>
                <img
                  onClick={() => handleAdClick(product)}
                  src={`${ApiUrl}/uploads/offerspage/${product.image}`}
                  alt={`Banner for ${product.brand_name}`}  
                  className="banner-image"
                  style={{ }}
                />
              </div>
            ))
        ) : (
          <h4 className="banner-title"></h4>
        )}
      </div>
      </div>
    </>
  );
  
};

export default AdBanner;
