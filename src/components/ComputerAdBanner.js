import React, { useEffect, useState } from 'react';
import './css/ComputerAdBanner.css';  // Importing styles
import Header2 from './Header2';
import axios from "axios";
import { ApiUrl } from './ApiUrl';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';

const AdBanner = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchcomputersofferspage`);
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAdClick = (product) => {
    navigate(`/${product.category}?search=${product.brand_name.toLowerCase()}`);
  };

  const filteredBanners = products.filter(product => product.image && product.image.startsWith('banner'));
  const filteredBanners2 = products.filter(product => product.image && product.image.startsWith('potrait'));

  return (
    <>
      <Header2 />
      <div className="ad-section-container4">
        {filteredBanners.slice(0, 2).map((banner, index) => (
          <div className='box' key={index}>
            <div className="bannerr-container4">
              <div className="banner-image-display">
                <img
                  onClick={() => handleAdClick(banner)}
                  src={`${ApiUrl}/uploads/offerspage/${banner.image}`}
                  alt={`Banner for ${banner.brand_name}`}
                  className="banner-image"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}

        {products.length > 0 && (
          <div className='box'>
            <div className="offer-ad-container4">
              {products.map((product) => {
                const firstImage = product.image ? product.image.split(",")[0] : '';
                if (firstImage.startsWith('banner') || firstImage.startsWith('potrait')) {
                  return null;
                }
                return (
                  <div key={product.id} className="single-ad-container4" onClick={() => handleAdClick(product)}>
                    <div className="image-wrapper">
                      {product.image ? (
                        <>
                          <p className="brand-namee">{product.brand_name}</p>
                          <img
                            src={`${ApiUrl}/uploads/offerspage/${firstImage}`}
                            alt="Product"
                            className="offer-add"
                            loading="lazy"
                          />
                        </>
                      ) : (
                        <p>No images available</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {filteredBanners.slice(2, 4).map((banner, index) => (
          <div className='box' key={index}>
            <div className="bannerr-container4">
              <div className="banner-image-display">
                <img
                  onClick={() => handleAdClick(banner)}
                  src={`${ApiUrl}/uploads/offerspage/${banner.image}`}
                  alt={`Banner for ${banner.brand_name}`}
                  className="banner-image"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}

        {filteredBanners2.length > 0 && (
          <div className='box'>
            <div className="potrait-container2">
              {filteredBanners2.map((banner, index) => (
                <div key={index}>
                  <img
                    onClick={() => handleAdClick(banner)}
                    src={`${ApiUrl}/uploads/offerspage/${banner.image}`}
                    alt={`Banner for ${banner.brand_name}`}
                    className="potrait-image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdBanner;