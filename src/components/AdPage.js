import React, { useEffect, useState } from 'react';
import './css/AdPage.css'; // Adjust path as needed
import { ApiUrl } from './ApiUrl'; 
import axios from 'axios'; // Ensure axios is installed

const AdPage = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    axios.get(`${ApiUrl}/fetchdoubleadpage`)
      .then(response => {
        setAds(response.data); // Assuming the response data is an array of ads
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <section className="ad-page">
      <div className="ads-container">
        {ads.length > 0 ? (
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
                {/* Conditional linking based on the ad's index */}
                {/* <a href={index === 0 ? '/Mobiles' : '/Headphones'}> */}
                  <a style={{textDecoration:'none', color:'white'}} href={`/${ad.category}`}><button className="shop-now-button">Shop</button></a>
                {/* </a> */}
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