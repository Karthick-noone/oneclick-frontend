import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from "../../components/ApiUrl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './css/EditDoubleAdpage.css';

Modal.setAppElement('#root');

const EditSingleImageAd = () => {
  const [products, setProducts] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchsingleadpage`);
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleAddProduct = async () => {
    if (!newImage) {
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select an image to upload.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', newImage);

    try {
      await axios.post(`${ApiUrl}/singleadpage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Image Added',
        text: 'The image has been uploaded successfully!',
      }).then(() => {
        return axios.get(`${ApiUrl}/fetchsingleadpage`);
      }).then((productsResponse) => {
        setProducts(productsResponse.data);
        setNewImage(null);
      });

    } catch (error) {
      console.error('Error adding image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error uploading the image. Please try again.',
      });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setSelectedFile(null);
    setModalIsOpen(true);
  };

  const handleDeleteImage = async (product) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this image? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`${ApiUrl}/deletesingleadpageimage/${product.id}`);

        Swal.fire({
          icon: 'success',
          title: 'Image Deleted',
          text: 'The image has been deleted successfully!',
        });

        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== product.id)
        );
      } catch (error) {
        console.error('Error deleting image:', error);
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: 'There was an error deleting the image. Please try again.',
        });
      }
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select an image to update.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.put(`${ApiUrl}/updatesingleadpageimage/${editingProduct.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Image Updated',
        text: 'The image has been updated successfully!',
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id ? { ...product, image: response.data.updatedImage } : product
        )
      );
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error updating image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the image. Please try again.',
      });
    }
  };

  return (
    <div className="laptops-page">
      <div className="laptops-content">
        <h2 className="laptops-page-title">Edit Single Image Ad Page</h2>
        <div className="laptops-card">
          <div className="laptops-card-header">
            <div className="laptops-card-item">Images</div>
            <div className="laptops-card-item">Action</div>
          </div>
          <div className="laptops-card-row">
         
            <input
              type="file"
              multiple
              name='images'
              onChange={handleImageChange}
              className="laptops-card-input"
            />
         
            <button onClick={handleAddProduct} className="laptops-add-btn">Add</button>
          </div>
        </div>
      
        <div className="ad-cards-container">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="ad-card">
                <div className="ad-image-container">
                  {product.image ? (
                    <img
                      src={`${ApiUrl}/uploads/singleadpage/${product.image}`}
                      alt="Ad"
                      className="ad-image"
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                  <div className="image-actions">
                    <span className="edit-icon" onClick={() => handleEditProduct(product)}>✏️</span>
                    <span className="delete-icon" onClick={() => handleDeleteImage(product)}>🗑️</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No images available.</p>
          )}
        </div>
      </div>

      {/* Modal for editing image */}
      {editingProduct && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Edit Image"
          className="adminmodal"
          overlayClassName="adminmodal-overlay"
        >
          <div className="adminmodal-header">
            <h2>Edit Image</h2>
            <button onClick={() => setModalIsOpen(false)} className="adminmodal-close-btn">
              &times;
            </button>
          </div>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="adminmodal-input"
          />
          <button onClick={handleUpdateImage} className="adminmodal-update-btn">Update</button>
          <button onClick={() => setModalIsOpen(false)} className="adminmodal-cancel-btn">Cancel</button>
        </Modal>
      )}
    </div>
  );
};

export default EditSingleImageAd;