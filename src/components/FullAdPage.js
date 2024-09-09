import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed and imported
import { ApiUrl } from './ApiUrl'; // Import your API URL

const FullAdPage = () => {
    const [adImages, setAdImages] = useState([]); // State to hold the array of ad images
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Function to fetch the images
        const fetchAdImages = async () => {
            try {
                // Fetch data from your API
                const response = await axios.get(`${ApiUrl}/fetchsingleadpage`);
                setAdImages(response.data); // Assuming the API returns an array of images
                setLoading(false);
            } catch (err) {
                console.error('Error fetching the images:', err);
                setError('Failed to load images');
                setLoading(false);
            }
        };

        fetchAdImages();
    }, []);

    if (loading) return <div>Loading...</div>; // Display a loading indicator
    if (error) return <div>{error}</div>; // Display error message if fetching fails

    return (
        <div style={styles.fullPageContainer}>
            {adImages.length > 0 ? (
                adImages.map((ad, index) => (
                    <div key={index} style={styles.adImageContainer}>
                        <img
                            src={`${ApiUrl}/uploads/singleadpage/${ad.image}`} // Adjust path as needed
                            alt={`Ad ${index + 1}`}
                            style={styles.fullPageImage}
                            loading="lazy"
                        />
                        {/* <div style={styles.overlayContent}>
                            <button style={styles.shopNowButton}>Shop Now</button>
                        </div> */}
                    </div>
                ))
            ) : (
                <p>No ads available</p>
            )}
        </div>
    );
};

const styles = {
    fullPageContainer: {
        width: '100%',
        height: '90vh',
        position: 'relative', // Needed for positioning the overlay
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Ensures no unwanted scrollbars
        marginTop:'10px',

    },
    adImageContainer: {
        position: 'relative', // Needed for overlay positioning
        width: '95%', // Adjust width as needed
        maxWidth: '1400px', // Maximum width for larger screens
        height: 'auto', // Adjust height automatically
        display: 'flex',
        justifyContent: 'center', // Center image horizontally
        borderRadius:'10px',
        marginTop:'20px',
    },
    fullPageImage: {
        width: '95%', // The image takes the width of its container
        height: '80vh', // Maintain aspect ratio
        objectFit: 'cover', // Ensures the image covers the entire area
    },
    overlayContent: {
        position: 'absolute', // Overlay on top of the image
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '40px 60px',
        borderRadius: '15px',
        maxWidth: '85%',
        color: '#fff',
        textAlign: 'center',
    },
    shopNowButton: {
        padding: '18px 36px',
        backgroundColor: '#ff6600',
        color: '#fff',
        border: 'none',
        borderRadius: '30px',
        fontSize: '20px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    }

};

export default FullAdPage;