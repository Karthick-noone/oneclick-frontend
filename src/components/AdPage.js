import React, { useEffect, useState } from 'react';
import './css/AdPage.css'; // Adjust path as needed
import { ApiUrl } from './ApiUrl'; 
import axios from 'axios'; // Ensure axios is installed

const AdPage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch data from the API
    axios.get(`${ApiUrl}/fetchdoubleadpage`)
      .then(response => {
        setAds(response.data); // Assuming the response data is an array of ads
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Ensure loading is false on error
      });
  }, []);

  return (
    <section className="ad-page">
      <div className="ads-container">
        {loading ? ( // Conditional rendering based on loading state
          <div className="spinner-container">
            <div className="spinner">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="spinner-blade"></div>
              ))}
            </div>
          </div>
        ) : ads.length > 0 ? (
          ads.map((ad, index) => (
            <div key={ad.id || index} className="ad">
              <div className="ad-image-card">
                {ad.image && ad.image.split(',').map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={`${ApiUrl}/uploads/doubleadpage/${img}`} // Adjust path as needed
                    alt={`Ad ${imgIndex + 1}`}
                    className="add-image"
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="ad-text">
                <h2>{ad.title}</h2>
                <p>{ad.description}</p>
                <a style={{textDecoration:'none', color:'white'}} href={`/${ad.category}`}>
                  <button className="shop-now-button2">Shop</button>
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No ads available</p>
        )}
      </div>
    </section>
  );
};

export default AdPage;
