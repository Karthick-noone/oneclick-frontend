import React, { useEffect, useState, useRef, useMemo } from 'react';
import './css/AdPage.css';
import { ApiUrl } from './ApiUrl';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

const AdPage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchdoubleadpage`);
        setAds(response.data || []);
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const debounceResize = () => {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(handleResize, 200);
    };

    window.addEventListener('resize', debounceResize);
    return () => window.removeEventListener('resize', debounceResize);
  }, []);

  // Preprocess images to avoid repeated operations
  const processedAds = useMemo(() => {
    return ads.map((ad) => ({
      ...ad,
      images: ad.image ? ad.image.split(',') : [],
    }));
  }, [ads]);

  return (
    <section className="ad-page">
      <div className="ad-first-page">
        <div className="ad-second-page">
          <h2 className="text-center offer-heading">Exclusive Offers For You!</h2>

          <div className="ads-container">
            {loading ? (
              <div className="skeleton-container">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="skeleton-ad">
                    <div className="skeleton-image"></div>
                  </div>
                ))}
              </div>
            ) : isMobile ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="ads-slider"
              >
                {processedAds.map((ad, index) => (
                  <SwiperSlide key={ad.id || index}>
                    <div className="ad">
                      <div className="ad-image-card">
                        {ad.images.map((img, imgIndex) => (
                          <a href={`/${ad.category}`} key={imgIndex}>
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
              processedAds.map((ad, index) => (
                <div key={ad.id || index} className="ad">
                  <div className="ad-image-card">
                    {ad.images.map((img, imgIndex) => (
                      <a href={`/${ad.category}`} key={imgIndex}>
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
              ))
            )}

            {isMobile && swiperRef.current && (
              <div className="swiper-arrows">
                <button className="swiper-arrow prev" onClick={() => swiperRef.current.slidePrev()}>
                  &#8249;
                </button>
                <button className="swiper-arrow next" onClick={() => swiperRef.current.slideNext()}>
                  &#8250;
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
