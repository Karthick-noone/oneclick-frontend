import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { ApiUrl } from "./ApiUrl";
import './css/Homepage.css'; // Ensure your styles are correctly imported

const Homepage = () => {
    const [data, setData] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        axios.get(`${ApiUrl}/fetchedithomepage`)
            .then(response => {
                setData(response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const settings = {
        dots: true,
        infinite: true, // Ensures the slider loops infinitely
        speed: 500, // Animation speed in milliseconds
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Enables autoplay
        autoplaySpeed: 5000, // 5 seconds
        arrows: false, // Optional: Set to true if you want navigation arrows
    };

    return (
        <div style={{
            width: '100%',
            height: '80vh',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {data ? (
                <Slider {...settings}>
                    {data.image && data.image.split(',').map((img, index) => (
                        <div key={index}>
                            <img
                                src={`${ApiUrl}/uploads/edithomepage/${img}`}
                                alt={`Ad ${index + 1}`}
                                style={{
                                    width: '100%',
                                    height: '80vh',
                                    objectFit: 'cover',
                                    pointerEvents: 'none',
                                }}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </Slider>
            ) : (
                <div className="spinner center">
                    {[...Array(12)].map((_, index) => (
                        <div key={index} className="spinner-blade"></div>
                    ))}
                </div>
            )}
            {data && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '5vh 5vw',
                    borderRadius: '15px',
                    maxWidth: '85%',
                    color: '#fff',
                    textAlign: 'center',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.9)',
                    backdropFilter: 'blur(5px)',
                    animation: 'fadeIn 1.5s ease-in-out',
                    pointerEvents: 'auto',
                }}>
                    <h1 style={{
                        fontSize: '4vw',
                        color: 'white',
                        fontWeight: '900',
                        marginBottom: '3vh',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2vw',
                        textShadow: '2px 4px 6px rgba(0, 0, 0, 0.3)',
                        animation: 'slideInFromLeft 1.2s ease-out',
                    }}>{data.title}</h1>
                    <p style={{
                        fontSize: '2vw',
                        fontWeight: '300',
                        marginBottom: '4vh',
                        lineHeight: '1.6',
                        color: '#f1f1f1',
                        animation: 'slideInFromRight 1.2s ease-out',
                    }}>
                        {data.description}
                    </p>
                   <a style={{textDecoration:'none', color:'white'}} href={`/${data.category}`}> <button
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            padding: '2vh 4vw',
                            backgroundColor: isHovered ? 'transparent' : '#ff6600',
                            color: '#fff',
                            border: isHovered ? '2px solid white' : 'none',
                            borderRadius: '30px',
                            fontSize: '1.3vw',
                            fontWeight: '200',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease, transform 0.3s ease',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        }}>
                        Shop Now
                    </button></a>
                </div>
            )}
        </div>
    );
};

export default Homepage;