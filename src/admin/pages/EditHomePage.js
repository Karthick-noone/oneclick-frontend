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

const EditHomePagesAd = () => {
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
        const response = await axios.get(`${ApiUrl}/fetchedithomepage`);
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected image:", file);
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          console.log("Original image dimensions:", img.width, img.height);
  
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Maintain width
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          console.log("Resizing image to:", canvas.width, canvas.height);
  
          const compressImage = (minQuality, maxQuality) => {
            return new Promise((resolve) => {
              const tryCompression = (quality) => {
                canvas.toBlob(
                  (blob) => {
                    const sizeInKB = blob.size / 1024;
                    console.log(`Compressed image at quality ${quality} has size: ${sizeInKB.toFixed(2)} KB`);
  
                    if (sizeInKB > 500 && quality > minQuality) { // Change to 500 KB
                      // If over 500 KB, lower quality and try again
                      tryCompression(quality - 0.05);
                    } else if (sizeInKB < 500 && quality < maxQuality) {
                      // If under 500 KB, slightly increase quality to get as close as possible
                      tryCompression(quality + 0.02);
                    } else {
                      // Final image close to 500 KB or within acceptable range
                      resolve(blob);
                    }
                  },
                  'image/jpeg',
                  quality
                );
              };
              // Start compression attempt only if size is above 500 KB
              if (file.size / 1024 > 500) {
                tryCompression(maxQuality);
              } else {
                // No compression needed, resolve with original file
                resolve(file);
              }
            });
          };
  
          // Compressing with quality range between 0.5 and 0.95
          compressImage(0.5, 0.95).then((finalBlob) => {
            console.log("Final image blob size:", finalBlob.size / 1024, "KB");
            setNewImage(finalBlob);
          });
        };
      };
    }
  };
  
  
  
  
  
  
  
  const handleAddProduct = async () => {
    if (!newImage || !category) {
      console.log("Missing image or category.");
      Swal.fire({
        icon: 'error',
        title: 'Missing Data',
        text: 'Please select both an image and a category.',
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('category', category);  // Include category in the form data
  
    console.log("Uploading image with category:", category);
  
    try {
      await axios.post(`${ApiUrl}/edithomepage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log("Image uploaded successfully.");
  
      Swal.fire({
        icon: 'success',
        title: 'Image Added',
        text: 'The image has been uploaded successfully!',
      }).then(() => {
        return axios.get(`${ApiUrl}/fetchedithomepage`);
      }).then((productsResponse) => {
        console.log("Fetched updated products list:", productsResponse.data);
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
        await axios.delete(`${ApiUrl}/deleteedithomepageimage/${product.id}`);

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


  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected image for editing:", file);
  
      // Log original image size in KB
      const originalSizeKB = file.size / 1024;
      console.log(`Original image size: ${originalSizeKB.toFixed(2)} KB`);
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          console.log("Original image dimensions:", img.width, img.height);
          console.log(`Original image format: ${file.type}`);
  
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600; // Set max width as needed
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          console.log("Resizing image to:", canvas.width, canvas.height);
  
          const compressImageToExactSize = (targetSizeKB) => {
            return new Promise((resolve) => {
              let quality = 1.0; // Start with the highest quality
              let attempts = 0; // Track attempts to find the correct size
  
              const tryCompression = () => {
                canvas.toBlob((blob) => {
                  const sizeInKB = blob.size / 1024;
                  console.log(`Compressed image at quality ${quality.toFixed(2)} has size: ${sizeInKB.toFixed(2)} KB`);
  
                  if (Math.abs(sizeInKB - targetSizeKB) < 1 || attempts >= 10) {
                    // Stop if we are within 1 KB of the target or reached max attempts
                    resolve(blob);
                    return;
                  }
  
                  if (sizeInKB > targetSizeKB) {
                    // Decrease quality if the size is too large
                    quality -= 0.05; // Decrease quality by 5%
                  } else {
                    // If the size is too small, try to increase quality, but check limit
                    if (quality < 1) quality += 0.05; // Increase quality by 5% if not at max
                  }
  
                  attempts++;
                  tryCompression(); // Re-attempt compression
                }, 'image/jpeg', quality);
              };
  
              // Start the compression attempts
              tryCompression();
            });
          };
  
          // Check if the file size is greater than 150 KB
          if (file.size > 150 * 1024) {
            // Start compression to target size of exactly 150 KB
            compressImageToExactSize(150).then((finalBlob) => {
              const finalSizeKB = finalBlob.size / 1024;
              console.log("Final image blob size after compression:", finalSizeKB.toFixed(2), "KB");
              setSelectedFile(finalBlob); // Set the final compressed image
            });
          } else {
            console.log("Image size is below 150 KB, no compression needed.");
            setSelectedFile(file); // Set the original file if no compression is needed
          }
        };
      };
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
      const response = await axios.put(`${ApiUrl}/updateedithomepageimage/${editingProduct.id}`, formData, {
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
        <h2 className="laptops-page-title">Edit Home Page Slider Images</h2>
        <div className="laptops-card">
          <div className="laptops-card-header">
            <div className="laptops-card-item">Image(2000 x 600)</div>
          </div>
          

           <div className="ad-product-form">
            <input
              type="file"
              multiple
              name="images"
              onChange={handleImageChange}
              className="ad-form-input"
              accept="image/jpg, image/png" // This allows all image types
            />

<select
      name="category"
      // value={editingProduct.category}
      value={category}  // Bind the state to the select value
      onChange={handleCategoryChange}  // Update category on change
      // onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
      className="ad-form-input"
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
    </select>
          
            <button onClick={handleAddProduct} className="ad-form-btn">
              Add
            </button>
          
            <FaInfoCircle  style={{cursor:'pointer',fontSize:'18px'}} title="Add banner size image for better view (1920x600)" />

          </div>
        </div>
      
        <div className="ad-cards-container">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="ad-card3">
                <div >
                  {product.image ? (
                    <img
                      src={`${ApiUrl}/uploads/edithomepage/${product.image}`}
                      alt="Ad"
                      className="ad-image"
                    />
                  ) : (
                    <p>No image available.Please add one image for advertisement.</p>
                  )}
                  <div className="image-actions">
                    <span className="edit-icon" onClick={() => handleEditProduct(product)}>✏️</span>
                    <span className="delete-icon" onClick={() => handleDeleteImage(product)}>🗑️</span>
                  </div>
                </div>

                <div>Category - {product.category}</div>
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
      onChange={handleImageSelection}
      className="adminmodal-input"
      accept="image/*"  // Allow all image types
    />

    {/* Dropdown for Category Selection */}
    <select
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
    </select>

    {/* Update and Cancel Buttons */}
    <button onClick={handleUpdateImage} className="adminmodal-update-btn">Update</button>
    <button onClick={() => setModalIsOpen(false)} className="adminmodal-cancel-btn">Cancel</button>
  </Modal>
)}


    </div>
  );
};

export default EditHomePagesAd;