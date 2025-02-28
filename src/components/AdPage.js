import React, { useEffect, useState, useRef } from 'react';
import './css/AdPage.css'; // Adjust path as needed
import { ApiUrl } from './ApiUrl';
import axios from 'axios'; // Ensure axios is installed
import { Swiper, SwiperSlide } from 'swiper/react'; // Import Swiper components
import 'swiper/css'; // Import Swiper styles
import 'swiper/css/navigation'; // Import Navigation styles

const AdPage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [isMobile, setIsMobile] = useState(false); // To check if it's a mobile view
  const swiperRef = useRef(null); // Ref to control Swiper

  useEffect(() => {
    // Fetch data from the API
    axios
      .get(`${ApiUrl}/fetchdoubleadpage`)
      .then((response) => {
        setAds(response.data); // Assuming the response data is an array of ads
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Ensure loading is false on error
      });

    // Check if the window width is mobile size
    const checkMobileView = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView);

    // Run the check initially
    checkMobileView();

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  return (
    <section className="ad-page">
      <div className="ad-first-page">
        <div className="ad-second-page">
        <h2
  className="text-center offer-heading"
  style={{
    marginBottom: "10px",
    textAlign: "left",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "24px",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  }}
>
  Exclusive Offers For You!
</h2>


          <div className="ads-container">
            {loading ? (
              <div className="spinner-container">
                <div className="spinner">
                  {[...Array(12)].map((_, index) => (
                    <div key={index} className="spinner-blade"></div>
                  ))}
                </div>
              </div>
            ) : ads.length > 0 ? (
              isMobile ? (
                // Use Swiper on mobile view with navigation enabled
                <Swiper
                  spaceBetween={10}
                  slidesPerView={isMobile ? 1 : 3} // Adjust per view based on screen size
                  ref={swiperRef} // Attach the swiper ref
                  className="ads-slider"
                >
                  {ads.map((ad, index) => (
                    <SwiperSlide key={ad.id || index}>
                      <div className="ad">
                        <div className="ad-image-card">
                          {ad.image &&
                            ad.image.split(',').map((img, imgIndex) => (
                              <a
                                style={{ textDecoration: 'none', color: 'white' }}
                                href={`/${ad.category}`}
                                key={imgIndex}
                              >
                                <img
                                  src={`${ApiUrl}/uploads/doubleadpage/${img}`}
                                  alt={`Ad ${imgIndex + 1}`}
                                  className="add-image"
                                  loading="lazy"
                                />
                              </a>
                            ))}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                // Display images statically for larger screens
                ads.map((ad, index) => (
                  <div key={ad.id || index} className="ad">
                    <div className="ad-image-card">
                      {ad.image &&
                        ad.image.split(',').map((img, imgIndex) => (
                          <a
                            style={{ textDecoration: 'none', color: 'white' }}
                            href={`/${ad.category}`}
                            key={imgIndex}
                          >
                            <img
                              src={`${ApiUrl}/uploads/doubleadpage/${img}`} // Adjust path as needed
                              alt={`Ad ${imgIndex + 1}`}
                              className="add-image"
                              loading="lazy"
                            />
                          </a>
                        ))}
                    </div>
                  </div>
                ))
              )
            ) : (
              <p>No ads available</p>
            )}

            {/* Custom navigation arrows for mobile */}
            {isMobile && (
              <div className="swiper-arrows">
                <button
                  className="swiper-arrow prev"
                  onClick={() => swiperRef.current.swiper.slidePrev()}
                >
                  &#8249; {/* Left Arrow */}
                </button>
                <button
                  className="swiper-arrow next"
                  onClick={() => swiperRef.current.swiper.slideNext()}
                >
                  &#8250; {/* Right Arrow */}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdPage;
