import React, { useMemo } from "react";
import { FaTruck, FaTag, FaDollarSign, FaClock } from "react-icons/fa";
import "./css/FeaturesCard.css";

const FeaturesCard = () => {
  const features = useMemo(() => [
    { icon: <FaTruck aria-hidden="true" />, title: "Curb-side Pickup", text: "Free shipping on orders over ₹500" },
    { icon: <FaDollarSign aria-hidden="true" />, title: "Affordable Prices", text: "High quality guaranteed" },
    { icon: <FaTag aria-hidden="true" />, title: "Low Prices Guaranteed", text: "Available to you 24/7" },
    { icon: <FaClock aria-hidden="true" />, title: "24/7 Support", text: "Always here to help" }
  ], []);

  return (
    <div className="parentContainer">
      <div className="card">
        <div className="featuresContainer">
          {features.map((feature, index) => (
            <div key={index} className="feature">
              <div className="icon">{feature.icon}</div>
              <div className="text">
                <h4>{feature.title}</h4>
                <p>{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesCard;
