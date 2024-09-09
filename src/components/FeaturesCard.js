import React from 'react';
import { FaTruck, FaTags, FaDollarSign, FaClock } from 'react-icons/fa';
import styles from './css/FeaturesCard.module.css'; // Replace with your CSS module or stylesheet path

const FeaturesCard = () => {
    return (
        <div className={styles.parentContainer}>
            <div className={styles.card}>
                <div className={styles.featuresContainer}>
                    <div className={styles.feature}>
                        <FaTruck className={styles.icon} />
                        <div className={styles.text}>
                            <h4>Curb-side Pickup</h4>
                            <p>Free shipping on orders over ₹500</p>
                        </div>
                    </div>
                    <div className={styles.feature}>
                        <FaTags className={styles.icon} />
                        <div className={styles.text}>
                            <h4>Low Prices Guaranteed</h4>
                            <p>Available to you 24/7</p>
                        </div>
                    </div>
                    <div className={styles.feature}>
                        <FaDollarSign className={styles.icon} />
                        <div className={styles.text}>
                            <h4>Affordable Prices</h4>
                            <p>High quality guaranteed</p>
                        </div>
                    </div>
                    <div className={styles.feature}>
                        <FaClock className={styles.icon} />
                        <div className={styles.text}>
                            <h4>24/7 Support</h4>
                            <p>Always here to help</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturesCard;