// ProductCard.js
import React from 'react';
import './css/EditPageCard.css'; // Create this CSS file for card styling
import { ApiUrl } from "./../../components/ApiUrl";

const ProductCard = ({ product, onEdit }) => {
  return (
    <div className="product-card">
      <div className="product-card-image">
        {product.images.length > 0 && (
          <img src={`${ApiUrl}/uploads/edithomepage/${product.image}`} alt={product.title} />
        )}
      </div>
      <div className="product-card-details">
        <h3>{product.title}</h3>
        <p>{product.description}</p>
      </div>
      <button onClick={() => onEdit(product)} className="product-card-edit-btn">
        Edit
      </button>
    </div>
  );
};

export default ProductCard;
