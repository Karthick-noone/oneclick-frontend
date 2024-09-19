import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/AddComputers.css'; // Ensure this CSS file is created for styling
import { ApiUrl } from "./../../components/ApiUrl";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Set up the modal root element
Modal.setAppElement('#root');

const AddHeadphones = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    image: null,
    features: '',
    price: ''
  });
  const [editingProduct, setEditingProduct] = useState(null); // To handle the product being edited
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal open/close state

  const navigate = useNavigate();
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchheadphones`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    setNewProduct({
      ...newProduct,
      image: e.target.files[0]
    });
  };

  const handleAddProduct = async () => {

     // Basic validation checks
  if (!newProduct.name.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Product name is required.',
    });
    return;
  }
  if (!newProduct.features.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Product features are required.',
    });
    return;
  }
  if (!newProduct.price || isNaN(newProduct.price) || Number(newProduct.price) <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'A valid product price is required.',
    });
    return;
  }
  if (!newProduct.image) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Product image is required.',
    });
    return;
  }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('features', newProduct.features);
    formData.append('price', newProduct.price);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }
  
    try {
      await axios.post(`${ApiUrl}/headphones`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Product Added',
        text: 'The product has been added successfully!',
      });
  
      // Fetch updated list of products
      const response = await axios.get(`${ApiUrl}/fetchheadphones`);
      setProducts(response.data);
      setNewProduct({
        name: '',
        image: null,
        features: '',
        price: ''
      });

      document.querySelector('input[type="file"]').value = '';

    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error adding the product. Please try again.',
      });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ 
      id: product.id, 
      name: product.prod_name,
      image: null,  // reset image so the user has to select a new one if desired
      features: product.prod_features, 
      price: product.prod_price, 
      status: product.status
    });
    setModalIsOpen(true);
  };
  
  const handleUpdateProduct = async () => {

     // Validation checks
  if (!editingProduct.name.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Product name is required.',
    });
    return;
  }
  if (!editingProduct.features.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Product features are required.',
    });
    return;
  }
  if (!editingProduct.price || isNaN(editingProduct.price) || Number(editingProduct.price) <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'A valid product price is required.',
    });
    return;
  }

    console.log('Editing Product State:', editingProduct);
  
    // Check if id is set correctly
    if (!editingProduct.id) {
      console.error('Error: Product ID is missing.');
      return;
    }
  
    // Log the product details that will be sent to the backend
    console.log('Updating product with details:', {
      name: editingProduct.name,
      features: editingProduct.features,
      price: editingProduct.price,
      status: editingProduct.status,
      image: editingProduct.image ? editingProduct.image.name : 'No new image'
    });
  
    const formData = new FormData();
    formData.append('name', editingProduct.name);
    formData.append('features', editingProduct.features);
    formData.append('price', editingProduct.price);
    formData.append('status', editingProduct.status);
    if (editingProduct.image) {
      formData.append('image', editingProduct.image);
    }
  
    try {
      // Log the request URL
      console.log('Sending update request to:', `${ApiUrl}/updateheadphones/${editingProduct.id}`);
  
      // Send the update request
      const response = await axios.put(`${ApiUrl}/updateheadphones/${editingProduct.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Log the response from the server
      console.log('Update response:', response.data);
  
      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Product Updated',
        text: 'The product has been updated successfully!',
      });
  
      // Fetch updated list of products
      const fetchResponse = await axios.get(`${ApiUrl}/fetchheadphones`);
      setProducts(fetchResponse.data);
  
      // Log successful fetch
      console.log('Updated products list:', fetchResponse.data);
  
      // Close the modal and reset the state
      setEditingProduct(null);
      setModalIsOpen(false);
    } catch (error) {
      // Log any errors that occur
      console.error('Error updating product:', error);
  
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the product. Please try again.',
      });
    }
  };


  
  
  
  const handleDeleteProduct = async (id) => {
    console.log('Attempting to delete product with ID:', id);
  
    // Show confirmation dialog
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    // Check if the user confirmed the deletion
    if (confirmResult.isConfirmed) {
      try {
        // Log before sending delete request
        console.log('Sending delete request to:', `${ApiUrl}/deleteheadphones/${id}`);
        
        // Perform the delete operation
        const deleteResponse = await axios.delete(`${ApiUrl}/deleteheadphones/${id}`);
        
        // Log response from delete request
        console.log('Delete response:', deleteResponse.data);
  
        // Fetch updated list of products
        const response = await axios.get(`${ApiUrl}/fetchheadphones`);
        setProducts(response.data);
  
        // Log the updated product list
        console.log('Updated products list after deletion:', response.data);
  
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The product has been deleted successfully.',
        });
      } catch (error) {
        console.error('Error deleting product:', error);
  
        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'There was an error deleting the product. Please try again.',
        });
      }
    } else {
      console.log('Product deletion canceled by user.');
    }
  };

  return (
    <div className="laptops-page">
      <div className="laptops-content">
        <h2 className="laptops-page-title">Add Headphones</h2>
        <div className="laptops-card">
          <div className="laptops-card-header">
            <div className="laptops-card-item">Product Name</div>
            <div className="laptops-card-item">Product Image</div>
            <div className="laptops-card-item">Product Features</div>
            <div className="laptops-card-item">Product Price</div>
            <div className="laptops-card-item">Action</div>
          </div>
          <div className="laptops-card-row">
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="laptops-card-input"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="laptops-card-input"
            />
            <input
              type="text"
              name="features"
              value={newProduct.features}
              onChange={handleChange}
              placeholder="Enter product features"
              className="laptops-card-input"
            />
            <input
              type="text"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
              placeholder="Enter product price"
              className="laptops-card-input"
            />
            <button onClick={handleAddProduct} className="laptops-add-btn">Add</button>
          </div>
        </div>
        <div className="laptops-products-list">
          {products.length > 0 && products.map((product, index) => (
        <div className="laptops-product-card">
        <div className="laptops-product-image">
          <img
            src={`${ApiUrl}/uploads/headphones/${product.prod_img}`} 
            alt={product.prod_name} 
            className="laptops-product-img" 
          />
        </div>
        <div className="laptops-product-details">
          <h3 className="laptops-product-name">{product.prod_name}</h3>
          <p className="laptops-product-features">{product.prod_features}</p>
          <p className="laptops-product-price">${product.prod_price}</p>
        </div>
        <div className="laptops-product-actions">
          <button onClick={() => handleEditProduct(product)} className="laptops-action-btn">
            <FaEdit /> Edit
          </button>
          <button onClick={() => handleDeleteProduct(product.id)} className="laptops-action-btn">
            <FaTrash /> Delete
          </button>
        </div>
      </div>
      
          ))}
        </div>
      </div>

     {/* Modal for editing a product */}
{/* Modal for editing a product */}
{editingProduct && (
  <Modal
    isOpen={modalIsOpen}
    onRequestClose={() => setModalIsOpen(false)}
    contentLabel="Edit Product"
    className="adminmodal"
    overlayClassName="adminmodal-overlay"
  >
    <div className="adminmodal-header">
      <h2>Edit Product</h2>
      <button onClick={() => setModalIsOpen(false)} className="adminmodal-close-btn">
        &times; {/* or use a close icon */}
      </button>
    </div>
    <input
      type="text"
      name="name"
      value={editingProduct.name}
      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
      placeholder="Enter product name"
      className="adminmodal-input"
    />
    <input
      type="file"
      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.files[0] })}
      className="adminmodal-input"
    />
    <input
      type="text"
      name="features"
      value={editingProduct.features}
      onChange={(e) => setEditingProduct({ ...editingProduct, features: e.target.value })}
      placeholder="Enter product features"
      className="adminmodal-input"
    />
    <input
      type="text"
      name="price"
      value={editingProduct.price}
      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
      placeholder="Enter product price"
      className="adminmodal-input"
    />
    <select
      name="status"
      value={editingProduct.status}
      onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
      className="adminmodal-input"
    >
       <option value="available">Active</option>
       <option value="unavailable">Inactive</option>
    </select>
    <button onClick={handleUpdateProduct} className="adminmodal-update-btn">Update</button>
    <button onClick={() => setModalIsOpen(false)} className="adminmodal-cancel-btn">Cancel</button>
  </Modal>
)}

    </div>
  );
};

export default AddHeadphones;