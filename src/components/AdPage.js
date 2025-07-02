import React, { useRef, useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "./css/AdPage.css";
import { ApiUrl } from "./ApiUrl";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

// Fetch ads with cache
const fetchAds = async () => {
  const { data } = await axios.get(`${ApiUrl}/fetchdoubleadpage`, {
    headers: { "Cache-Control": "max-age=300" },
  });
  return data || [];
};

// Skeleton loader component
const AdSkeleton = () => (
  <div className="skeleton-container">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="skeleton-ad">
        <div className="skeleton-image"></div>
      </div>
    ))}
  </div>
);

const AdPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const swiperRef = useRef(null);

  const {
    data: ads = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doubleAdPage"],
    queryFn: fetchAds,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    let resizeTimer;
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const debounceResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    };
    window.addEventListener("resize", debounceResize);
    return () => window.removeEventListener("resize", debounceResize);
  }, []);

  const processedAds = useMemo(() => {
    return ads.map((ad) => ({
      ...ad,
      images: ad.image ? ad.image.split(",") : [],
    }));
  }, [ads]);

 return (
  processedAds.some(ad => ad.images && ad.images.length > 0) ? (
    <section className="ad-page">
      <div className="ad-second-page">
        <h2 className="text-center offer-heading">Exclusive Offers For You!</h2>

        <div className="ads-container">
          {isLoading ? (
            <AdSkeleton />
          ) : isError ? (
            <div className="error-message">Failed to load ads</div>
          ) : isMobile ? (
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="ads-slider"
            >
              {processedAds
                .filter(ad => ad.images && ad.images.length > 0)
                .map((ad, index) => (
                  <SwiperSlide key={ad.id || index}>
                    <div className="ad">
                      <div className="ad-image-card">
                        {ad.images.map((img, imgIndex) => (
                          <Link to={`/${ad.category}`} key={imgIndex}>
                            <img
                              src={`${ApiUrl}/uploads/doubleadpage/${img}`}
                              alt={`Ad ${imgIndex + 1}`}
                              className="add-image"
                              loading="lazy"
                            />
                          </Link>
                        ))}

                        <div className="ad-bottom">
                          {/* <span className="ad-category">{ad.category}</span> */}
                          <button className="shop-now-btn">Shop Now</button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          ) : (
            processedAds
              .filter(ad => ad.images && ad.images.length > 0)
              .map((ad, index) => (
                <div key={ad.id || index} className="ad">
                  <div className="ad-image-card">
                    {ad.images.map((img, imgIndex) => (
                      <Link to={`/${ad.category}`} key={imgIndex}>
                        <img
                          src={`${ApiUrl}/uploads/doubleadpage/${img}`}
                          alt={`Ad ${imgIndex + 1}`}
                          className="add-image"
                          loading="lazy"
                        />
                      </Link>
                    ))}
                    <div className="ad-bottom">
                      {/* <span className="ad-category">{ad.category}</span> */}
                      <button className="shop-now-btn">Shop Now</button>
                    </div>
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
    </section>
  ) : null
);

};

export default AdPage;
