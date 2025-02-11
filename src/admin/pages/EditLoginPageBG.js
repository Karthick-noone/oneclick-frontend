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
    if (!newImage ) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Data',
        text: 'Please choose image .',
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', newImage);
    // formData.append('category', category);  // Include category in the form data


    try {
      await axios.post(`${ApiUrl}/loginbg`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Image Added',
        text: 'The image has been uploaded successfully!',
      }).then(() => {
        return axios.get(`${ApiUrl}/fetchloginbg`);
      }).then((productsResponse) => {
        setProducts(productsResponse.data);
        setNewImage(null);
        setCategory('');  // Clear the category
        document.querySelector('input[type="file"]').value = ''; // Clear the input field

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
        await axios.delete(`${ApiUrl}/deleteloginbgimage/${product.id}`);

        Swal.fire({
          icon: 'success',
          title: 'Image Deleted',
          text: 'The image has been deleted successfully!',
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
    // Check if both selectedFile and category are not set
    if (!selectedFile && !editingProduct.category) {
      Swal.fire({
        icon: 'error',
        title: 'No Changes Detected',
        text: 'Please select an image or a category to update.',
      });
      return;
    }
  
    const formData = new FormData();
  
    // Append selected file if it exists
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
  
    // Append category only if it has changed
    if (editingProduct.category) {
      formData.append('category', editingProduct.category);
    }
  
    try {
      const response = await axios.put(`${ApiUrl}/updateloginbgimage/${editingProduct.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Product Updated',
        text: 'The product has been updated successfully!',
      });
  
      // Update the product in the state with the new image or category if they were updated
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                image: selectedFile ? response.data.updatedImage : product.image, // Update image only if selectedFile is present
                category: editingProduct.category !== product.category ? editingProduct.category : product.category, // Update category only if it's changed
              }
            : product
        )
      );
  
      setModalIsOpen(false); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the product. Please try again.',
      });
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
    accept="image/jpeg, image/png" // This allows all image types
  />

  <button onClick={handleAddProduct} className="ad-form-btn">
    Add
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
                    <img
                      src={`${ApiUrl}/uploads/singleadpage/${product.image}`}
                      alt="Ad"
                      className="ad-image4"
                    />
                  ) : (
                    <p>No image available.Please add one image for advertisement.</p>
                  )}
                  <div className="image-actions">
                    <span className="edit-icon" onClick={() => handleEditProduct(product)}>✏️</span>
                    <span className="delete-icon" onClick={() => handleDeleteImage(product)}>🗑️</span>
                  </div>
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
    <div className="adminmodal-header">
      <h2>Edit Image and Category</h2>
      <button onClick={() => setModalIsOpen(false)} className="adminmodal-close-btn">
        &times;
      </button>
    </div>

    {/* Input for Image Upload */}
    <input
      type="file"
      onChange={(e) => setSelectedFile(e.target.files[0])}
      className="adminmodal-input"
      accept="image/jpeg, image/png"  // Allow all image types
    />

    {/* Dropdown for Category Selection */}
    {/* <select
      name="category"
      value={editingProduct.category || ''}  // Ensure category is controlled
      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
      className="adminmodal-input"
    >
      <option value="">Select Category</option>
      <option value="Computers">Computer</option>
      <option value="Mobiles">Mobile</option>
      <option value="Printers">Printers</option>
      <option value="Headphones">Headphone</option>
      <option value="Speaker">Speaker</option>
      <option value="CCTV">CCTV</option>
      <option value="TV">TV</option>
      <option value="Watch">Watch</option>
      <option value="ComputerAccessories">Computer Accessories</option>
      <option value="MobileAccessories">Mobile Accessories</option>
      <option value="PrinterAccessories">Printer Accessories</option>
              <option value="CCTVAccessories">CCTV Accessories</option>
    </select> */}

    {/* Update and Cancel Buttons */}
    <button onClick={handleUpdateImage} className="adminmodal-update-btn">Update</button>
    <button onClick={() => setModalIsOpen(false)} className="adminmodal-cancel-btn">Cancel</button>
  </Modal>
)}


    </div>
  );
};

export default EditSingleImageAd;