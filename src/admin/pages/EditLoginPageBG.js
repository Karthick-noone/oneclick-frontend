import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from "../../components/ApiUrl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './css/EditDoubleAdpage.css';
import { FaInfoCircle } from "react-icons/fa";

Modal.setAppElement('#root');

const EditSingleImageAd = () => {
  const [products, setProducts] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState(''); // Add a new state to track the selected category


  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0); // optional if needed


  const handleCategoryChange = (e) => {
    setCategory(e.target.value); // Update category value when a new category is selected
  };
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
        const response = await axios.get(`${ApiUrl}/fetchloginbg`);
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
        icon: "error",
        title: "Missing Data",
        text: "Please select both an image and a category.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", newImage);
    // formData.append("category", category);

    setIsUploading(true); // Start loader

    try {
      await axios.post(`${ApiUrl}/loginbg`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Image Added",
        text: "The image has been uploaded successfully!",
        timer: 3000,
      }).then(() => {
        setIsUploading(false); //  Stop loader immediately
        setUploadProgress(0);
        // return axios.get(`${ApiUrl}/fetchedithomepage`);
      });

      const res = await axios.get(`${ApiUrl}/fetchloginbg`);
      setProducts(res.data);
      setNewImage(null);
      setCategory("");
      document.querySelector('input[type="file"]').value = "";
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error uploading the image. Please try again.",
      });
    } finally {
      setIsUploading(false); // Stop loader
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
        await axios.delete(`${ApiUrl}/deleteloginbgimage/${product.id}`);

        Swal.fire({
          icon: 'success',
          title: 'Image Deleted',
          text: 'The image has been deleted successfully!',
          timer: 3000,
        }).then(() => {
          window.location.reload();
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
    if (!selectedFile && !editingProduct.category) {
      Swal.fire({
        icon: 'error',
        title: 'No Changes Detected',
        text: 'Please select an image or a category to update.',
      });
      return;
    }

    const formData = new FormData();

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    if (editingProduct.category) {
      formData.append('category', editingProduct.category);
    }

    setIsUpdating(true); // Show overlay before starting
    setUpdateProgress(0); // Reset progress

    try {
      const response = await axios.put(
        `${ApiUrl}/updateloginbgimage/${editingProduct.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUpdateProgress(percentCompleted);
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Product Updated',
        text: 'The product has been updated successfully!',
        timer: 3000,
      });

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id
            ? {
              ...product,
              image: selectedFile ? response.data.updatedImage : product.image,
              category:
                editingProduct.category !== product.category
                  ? editingProduct.category
                  : product.category,
            }
            : product
        )
      );

      setModalIsOpen(false); // Close modal
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the product. Please try again.',
      });
    } finally {
      setIsUpdating(false); // Hide overlay
      setUpdateProgress(0); // Optional: Reset progress for next time
    }
  };



  return (
    <div className="laptops-page">
      <div className="laptops-content">
        <h2 className="laptops-page-title">Edit User Login Page Background Image</h2>
        <div className="laptops-card">
          <div className="laptops-card-header">
            <div className="laptops-card-item">Image(1920 X 1080)</div>
            {/* <div className="laptops-card-item">Category</div> */}
            {/* <div className="laptops-card-item">Action</div> */}
          </div>

          <div className="ad-product-form">
            <input
              type="file"
              multiple
              name="images"
              onChange={handleImageChange}
              className="ad-form-input"
              accept="image/jpeg, image/png, image/webp" // This allows all image types
            />

            <button onClick={handleAddProduct} className="add-btn" disabled={isUploading}>
              {isUploading ? (
                <div className="circular-progress-wrapper">
                  <svg className="circular-progress" viewBox="0 0 36 36">
                    <g transform="rotate(95 18 18)">
                      <path
                        className="circle-bg"
                        d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="circle"
                        strokeDasharray={`${uploadProgress}, 100`}
                        d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </g>
                    <text x="18" y="20.35" className="percentage-text">
                      {uploadProgress}%
                    </text>
                  </svg>
                </div>
              ) : (
                "Add"
              )}
            </button>

            <FaInfoCircle
              className="ad-form-info"
              title="Add banner size image for better view (1920 X 1080)"
            />
          </div>

        </div>

        <div className="ad-cards-container">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="ad-cardd4">
                <div className="ad-image-container">
                  {product.image ? (
                    <>
                      <img
                        src={`${ApiUrl}/uploads/singleadpage/${product.image}`}
                        alt="Ad"
                        className="ad-image4"
                      />
                      <button
                        onClick={() => handleEditProduct(product)} // Pass 'true' for portrait images
                        className="laptops-edit-btnn"
                      >
                        Edit
                      </button></>
                  ) : (
                    <p>No image available.Please add one image for advertisement.</p>
                  )}

                </div>

                {/* <div>Category - {product.category}</div> */}
              </div>
            ))
          ) : (
            <p>No images available.Please add one image for advertisement.</p>
          )}
        </div>
      </div>

      {editingProduct && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Edit Image and Category"
          className="adminmodal"
          overlayClassName="adminmodal-overlay"
        >
          {isUpdating && (
            <div className="modal-upload-overlay">
              <div className="circular-progress-wrapper">
                <svg className="circular-progress" viewBox="0 0 36 36">
                  <g transform="rotate(-0 18 18)">
                    <path
                      className="circle-bg"
                      d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      strokeDasharray={`${updateProgress}, 100`}
                      d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </g>
                  <text x="18" y="20.35" className="percentage-text">
                    {updateProgress}%
                  </text>
                </svg>
              </div>
            </div>
          )}
          <div className="adminmodal-header">
            <h2>Edit Image </h2>
            <button onClick={() => setModalIsOpen(false)} className="adminmodal-close-btn">
              &times;
            </button>
          </div>

          {/* Input for Image Upload */}
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="adminmodal-input"
            accept="image/jpeg, image/png, image/webp"  // Allow all image types
          />


          {/* Update and Cancel Buttons */}
          <button onClick={handleUpdateImage} className="adminmodal-update-btn">Update</button>
          <button onClick={() => handleDeleteImage(editingProduct)} className="adminmodal-cancel-btn">Delete</button>
        </Modal>
      )}


    </div>
  );
};

export default EditSingleImageAd;