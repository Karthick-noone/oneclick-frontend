import "./css/NewProduct.css";
import { useState } from "react";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    image: "",
    mrp_price: "",
    selling_price: "",
    offer_label: "",
    subtitle: "",
    delivery_charge: "",
    category: "",
    features: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError(null);
      } else {
        setError(data.message);
        setMessage(null);
      }
    } catch (err) {
      setError("Failed to add product. Try again!");
      setMessage(null);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Product</h2>
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required />
        <input type="text" name="image" placeholder="Product Image URL" onChange={handleChange} required />
        <input type="number" name="mrp_price" placeholder="M.R.P Price" onChange={handleChange} required />
        <input type="number" name="selling_price" placeholder="Selling Price" onChange={handleChange} required />
        <input type="text" name="offer_label" placeholder="Offer Label" onChange={handleChange} />
        <input type="text" name="subtitle" placeholder="Subtitle" onChange={handleChange} />
        <input type="number" name="delivery_charge" placeholder="Delivery Charge" onChange={handleChange} />
        <input type="text" name="category" placeholder="Product Category" onChange={handleChange} required />
        <textarea name="features" placeholder="Product Features" onChange={handleChange} required></textarea>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
