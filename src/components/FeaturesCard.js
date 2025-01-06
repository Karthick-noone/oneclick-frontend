import React from 'react';
import { FaTruck, FaTag, FaDollarSign, FaClock } from 'react-icons/fa';
import './css/FeaturesCard.css'; // Importing the external CSS file

const FeaturesCard = () => {
    return (
        <div className="parentContainer">
            <div className="card">
                <div className="featuresContainer">
                    <div className="feature">
                        <FaTruck className="icon truck" />  
                        <div className="text">
                            <h4>Curb-side Pickup</h4>
                            <p>Free shipping on orders over ₹500</p>
                        </div>
                    </div>
                    <div className="feature">
                        <FaDollarSign className="icon dollar" />
                        <div className="text">
                            <h4>Affordable Prices</h4>
                            <p>High quality guaranteed</p>
                        </div>
                    </div>
                    <div className="feature">
                        <FaTag className="icon tags" />
                        <div className="text">
                            <h4>Low Prices Guaranteed</h4>
                            <p>Available to you 24/7</p>
                        </div>
                    </div>
                    <div className="feature">
                        <FaClock className="icon clock" />
                        <div className="text">
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
