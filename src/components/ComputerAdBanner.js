import React, { useEffect, useState } from 'react';
import './css/ComputerAdBanner.css';  // Importing styles
import Header2 from './Header2';
import axios from "axios";
import { ApiUrl } from './ApiUrl';
import offerAd from './img/design.png';
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


  const filteredBanners = products.filter(product => product.image && product.image.startsWith('banner'));
  const filteredBanners2 = products.filter(product => product.image && product.image.startsWith('potrait'));

return (
  <>
    <Header2 />
    <div className="ad-section-container4">
      {/* Single Ads Section */}


      {filteredBanners.length > 0 && filteredBanners[0].image ? (
<div className='box'>

  <div className="bannerr-container4">
    <div className="banner-image-display" style={{ marginTop: '-10px', position: 'relative', marginBottom: '5px' }}>
      <img
        onClick={() => handleAdClick(filteredBanners[0])}
        src={`${ApiUrl}/uploads/offerspage/${filteredBanners[0].image}`}
        alt={`Banner for ${filteredBanners[0].brand_name}`}
        className="banner-image"
        loading="lazy"

        // style={{ width: '1250px', marginTop: '20px', height: 'auto' }} // Styling for the image

      />
    </div>
  </div>
  </div>
) : null}



{filteredBanners.length > 1 && filteredBanners[1].image ? (
<div className='box'>

  <div className="bannerr-container4">
    <div className="banner-image-display" style={{ marginTop: '-10px', position: 'relative', marginBottom: '5px' }}>
      <img
        onClick={() => handleAdClick(filteredBanners[1])}
        src={`${ApiUrl}/uploads/offerspage/${filteredBanners[1].image}`}
        alt={`Banner for ${filteredBanners[1].brand_name}`}
        className="banner-image"
        loading="lazy"

        // style={{ width: '1250px', marginTop: '20px', height: 'auto' }} // Styling for the image

      />
    </div>
  </div>
  </div>
) : null}


{products && products.length > 0 && ( // Only render the box if there are products
  <div className='box'>
    <div className="offer-ad-container4">
      {products.map((product) => {
        const firstImage = product.image ? product.image.split(",")[0] : '';
        if (firstImage.startsWith('banner') || firstImage.startsWith('potrait')) {
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
                <div>
                  <p className="brand-namee">{product.brand_name}</p>
                  <img
                    src={`${ApiUrl}/uploads/offerspage/${firstImage}`}
                    alt="Product"
                    className="offer-add"
                    loading="lazy"

                  />
                </div>
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
{products.length === 0 && (
  <p style={{ color: 'white' }}>No products available.</p>
)}


      {/* Banner Section (Rendered after single ads) */}
      {filteredBanners.length > 2 && filteredBanners[2].image ? (
<div className='box'>

  <div className="bannerr-container4">
    <div className="banner-image-display" style={{ marginTop: '-10px', position: 'relative', marginBottom: '5px' }}>
      <img
        onClick={() => handleAdClick(filteredBanners[2])}
        src={`${ApiUrl}/uploads/offerspage/${filteredBanners[2].image}`}
        alt={`Banner for ${filteredBanners[2].brand_name}`}
        className="banner-image"
        loading="lazy"

        // style={{ width: '1250px', marginTop: '20px', height: 'auto' }} // Styling for the image

      />
    </div>
  </div>
  </div>
) : null}


{filteredBanners.length > 3 && filteredBanners[3].image ? (
<div className='box'>

  <div className="bannerr-container4">
    <div className="banner-image-display" style={{ marginTop: '-10px', position: 'relative', marginBottom: '5px' }}>
      <img
        onClick={() => handleAdClick(filteredBanners[3])}
        src={`${ApiUrl}/uploads/offerspage/${filteredBanners[3].image}`}
        alt={`Banner for ${filteredBanners[3].brand_name}`}
        className="banner-image"
        loading="lazy"

        // style={{ width: '1250px', marginTop: '20px', height: 'auto' }} // Styling for the image

      />
    </div>
  </div>
  </div>
) : null}

{filteredBanners2.length > 0 && filteredBanners2.some(banner => banner.image) ? (
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
) : null}






      
    </div>
    <Footer />
  </>
);

};

export default AdBanner;
