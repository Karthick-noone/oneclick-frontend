import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from "../../components/ApiUrl"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import './css/AddComputers.css';
import './css/EditDoubleAdpage.css';

Modal.setAppElement('#root');

const EditDoubleImageAd = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    images: []
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState(null); // To track which image is being edited
  const [selectedFiles, setSelectedFiles] = useState(null);

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
        const response = await axios.get(`${ApiUrl}/fetchdoubleadpage`);
        console.log('Fetched products:', response.data);
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
      images: Array.from(e.target.files)
    });
  };

  const handleAddProduct = async () => {

    if (!newProduct.title || !newProduct.description || !newProduct.category) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
      });
      return;
    }
  
    if (newProduct.images.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Images',
        text: 'Please select at least one image.',
      });
      return;
    }


    const formData = new FormData();
    formData.append('title', newProduct.title);
    formData.append('description', newProduct.description);
    formData.append('category', newProduct.category);
    newProduct.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.post(`${ApiUrl}/doubleadpage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Product Added',
        text: 'The product has been added successfully!',
      }).then(() => {
        return axios.get(`${ApiUrl}/fetchdoubleadpage`);
      }).then((productsResponse) => {
        setProducts(productsResponse.data);
        setNewProduct({
          title: '',
          description: '',
          category: '',
          images: []
        });
      });

    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error adding the product. Please try again.',
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct.id) {
      console.error('Error: Product ID is missing.');
      return;
    }

    if (!editingProduct.title || !editingProduct.description || !editingProduct.category) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
      });
      return;
    }
  
    // if (editingProduct.images.length === 0) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'No Images',
    //     text: 'Please select at least one image.',
    //   });
    //   return;
    // }

    const formData = new FormData();
    formData.append('title', editingProduct.title);
    formData.append('description', editingProduct.description);
    formData.append('category', editingProduct.category);
    editingProduct.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.put(`${ApiUrl}/updatedoubleadpage/${editingProduct.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Product Updated',
        text: 'The product has been updated successfully!',
      }).then(() => {
        return axios.get(`${ApiUrl}/fetchdoubleadpage`);
      }).then((fetchResponse) => {
        setProducts(fetchResponse.data);
        setEditingProduct(null);
        setModalIsOpen(false);
      });

    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the product. Please try again.',
      });
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      images: [] // reset images so the user has to select new ones if desired
    });
    setModalIsOpen(true);
  };




  const handleEditImage = (product, index) => {
    setEditingProduct(product);
    setEditingImageIndex(index);
    setModalIsOpen2(true);
  };

  const handleDeleteImage = async (product, imageIndex) => {
    // Split the image list by comma, handle edge cases like empty strings
    const imageArray = product.image ? product.image.split(',') : [];
    // Filter out the image to be deleted
    const updatedImages = imageArray.filter((_, index) => index !== imageIndex);
  
    // Confirm deletion with the user
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
        // Send updated image list to the server
        await axios.put(`${ApiUrl}/deletedoubleadpageimage/${product.id}`, { images: updatedImages.join(',') });
  
        // Provide success feedback
        Swal.fire({
          icon: 'success',
          title: 'Image Deleted',
          text: 'The image has been deleted successfully!',
        });
  
        // Update the state to reflect the change
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === product.id ? { ...p, image: updatedImages.join(',') } : p
          )
        );
      } catch (error) {
        console.error('Error deleting image:', error);
        Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: 'There was an error deleting the image. Please try again.',
        });
      }
    } else {
      console.log('Image deletion was cancelled by the user.');
    }
  };
  

  const handleUpdateImage = async () => {
    if (!selectedFiles) {
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select an image to update.',
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('image', selectedFiles);
  
    try {
      const response = await axios.put(`${ApiUrl}/updatedoubleadpageimage/${editingProduct.id}/${editingImageIndex}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Image Updated',
        text: 'The image has been updated successfully!',
      });
  
      // Update the product images after successful update
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id ? { ...product, image: response.data.updatedImages.join(',') } : product
        )
      );
      setModalIsOpen2(false);
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
        <h2 className="laptops-page-title">Edit Double Images Ad Page And Description</h2>
        <div className="laptops-card">
          <div className="laptops-card-header">
            <div className="laptops-card-item">Title</div>
            <div className="laptops-card-item">Images</div>
            <div className="laptops-card-item">Description</div>
            <div className="laptops-card-item">Category</div>
            <div className="laptops-card-item">Action</div>
          </div>
          <div className="laptops-card-row">
            <input
              type="text"
              name="title"
              value={newProduct.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="laptops-card-input"
            />
            <input
              type="file"
              multiple
              name='images'
              onChange={handleImageChange}
              className="laptops-card-input"
            />
            <input
              type="text"
              name="description"
              value={newProduct.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="laptops-card-input"
            />

<select
      name="category"
      value={newProduct.category}
      onChange={handleChange}
      className="laptops-card-input"
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
    </select>
            <button onClick={handleAddProduct} className="laptops-add-btn">Add</button>
          </div>
        </div>
        <div className="ad-cards-container">
  {products && products.length > 0 ? (
    products.map((product) => (
      <div
        key={product.id}
        className="ad-card"
        style={{ '--image-count': product.image ? product.image.split(',').length : 1 }}
      >
        {/* Product Info and Upload Section */}
        <div className="ad-card-content">
          {/* Title and Description Card */}
          <div className="ad-info-card">
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>Category - {product.category}</p>
            <button onClick={() => handleEditProduct(product)} className="laptops-edit-btn">
              Edit
            </button>
          </div>

        
        </div>

        {/* Image Cards */}
        <div className="ad-images-container">
          {product.image && product.image.length > 0 ? (
            product.image.split(',').map((image, index) => (
              <div key={index} className="ad-image-card">
                <img
                  src={`${ApiUrl}/uploads/doubleadpage/${image}`}
                  alt={`Product ${index + 1}`}
                  className="ad-image"
                />
                <div className="image-actions">
                  <span className="edit-icon" onClick={() => handleEditImage(product, index)}>✏️</span>
                  <span className="delete-icon" onClick={() => handleDeleteImage(product, index)}>🗑️</span>
                </div>
              </div>
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>
    ))
  ) : (
    <p>No products available.</p>
  )}
</div>
      </div>

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
            <h2>Edit Title And Description</h2>
            <button onClick={() => setModalIsOpen(false)} className="adminmodal-close-btn">
              &times; {/* or use a close icon */}
            </button>
          </div>
          <input
            type="text"
            name="title"
            value={editingProduct.title}
            onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
            placeholder="Enter title"
            className="adminmodal-input"
          />
          
          <input
            type="text"
            name="description"
            value={editingProduct.description}
            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            placeholder="Enter description"
            className="adminmodal-input"
          />

<select
      name="category"
      value={editingProduct.category}
      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
      className="laptops-card-input"
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
    </select>
          <button onClick={handleUpdateProduct} className="adminmodal-update-btn">Update</button>
          <button onClick={() => setModalIsOpen(false)} className="adminmodal-cancel-btn">Cancel</button>
        </Modal>
      )}

{editingProduct && (
        <Modal
        isOpen={modalIsOpen2}
        onRequestClose={() => setModalIsOpen2(false)}
        contentLabel="Edit Image"
        className="adminmodal"
        overlayClassName="adminmodal-overlay"
      >
        <div className="adminmodal-header">
          <h2>Edit Image</h2>
          <button onClick={() => setModalIsOpen2(false)} className="adminmodal-close-btn">
            &times;
          </button>
        </div>
      
        <input
          type="file"
          onChange={(e) => setSelectedFiles(e.target.files[0])}  // Store the selected file in state
          className="adminmodal-input"
        />
      
        <div className="adminmodal-footer">
          <button onClick={handleUpdateImage} className="adminmodal-update-btn">
            Update
          </button>
          <button onClick={() => setModalIsOpen2(false)} className="adminmodal-cancel-btn">
            Cancel
          </button>
        </div>
      </Modal>
      )}
    </div>
  );
};

export default EditDoubleImageAd;