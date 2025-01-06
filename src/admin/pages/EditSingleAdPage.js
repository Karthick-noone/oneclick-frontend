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
        const response = await axios.get(`${ApiUrl}/fetchsingleadpage`);
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const compressImage = (file, maxSizeKB = 450) => {  // Set maxSizeKB to 450
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500; // Set maximum width for the image
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          // Compression function with adjustable quality
          const compress = (quality) => {
            return new Promise((resolveInner) => {
              canvas.toBlob((blob) => {
                if (blob.size / 1024 <= maxSizeKB || quality < 0.3) {
                  resolveInner(blob); // Return if under size limit or at minimum quality
                } else {
                  resolveInner(compress(quality - 0.1)); // Retry with lower quality
                }
              }, 'image/jpeg', quality);
            });
          };
  
          // Start compressing with initial quality of 0.8
          compress(0.8).then(resolve);
        };
      };
    });
  };
  

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
            const compressedFile = new File([finalBlob], file.name, { type: file.type });
            setNewImage(compressedFile); // Set the compressed image in state
            console.log("Compressed single image size for setNewImage:", (compressedFile.size / 1024).toFixed(2), "KB");
          });
        };
      };
    }
  };
  
  

  const handleAddProduct = async () => {
    if (!newImage || !category) {
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
        await axios.delete(`${ApiUrl}/deletesingleadpageimage/${product.id}`);

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
      const response = await axios.put(`${ApiUrl}/updatesingleadpageimage/${editingProduct.id}`, formData, {
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
  
  const onChangeCompressedImage = (e) => {
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
  
                    if (sizeInKB > 500 && quality > minQuality) {
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
          compressImage(0.5, 0.95).then((compressedBlob) => {
            const compressedFile = new File([compressedBlob], file.name, { type: file.type });
  
            // Check the compressed file size
            if (compressedFile.size <= 500 * 1024) {  // 500 KB limit
              setSelectedFile(compressedFile);  // Update state with the compressed image
              console.log("Compressed image size:", (compressedFile.size / 1024).toFixed(2), "KB");
            } else {
              console.error("Image compression failed to reduce size under 500 KB");
            }
          });
        };
      };
    }
  };
  
  

  return (
    <div className="laptops-page">
      <div className="laptops-content">
        <h2 className="laptops-page-title">Edit Single Image Ad Page</h2>
        <div className="laptops-card">
          <div className="laptops-card-header">
            <div className="laptops-card-item">Image(2000 X 600)</div>
            <div className="laptops-card-item">Category</div>
            <div className="laptops-card-item">Action</div>
          </div>
          <div className="laptops-card-row">
         
            <input
              type="file"
              multiple
              name='images'
              onChange={handleImageChange}
              className="laptops-card-input"
              accept="image/*"  // This allows all image types
            />
         
         <select
      name="category"
      // value={editingProduct.category}
      value={category}  // Bind the state to the select value
      onChange={handleCategoryChange}  // Update category on change
      // onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
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
      <option value="PrinterAccessories">Printer Accessories</option>
              <option value="CCTVAccessories">CCTV Accessories</option>
    </select>
         
            <button onClick={handleAddProduct} className="laptops-add-btn">Add</button>
            <FaInfoCircle  style={{cursor:'pointer',fontSize:'18px'}} title="Add banner size image for better view (2000 x 600)" />

          </div>
        </div>
      
        <div className="ad-cards-container">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="ad-cardd">
                <div className="ad-image-container">
                  {product.image ? (
                    <img
                      src={`${ApiUrl}/uploads/singleadpage/${product.image}`}
                      alt="Ad"
                      className="ad-image3"
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
      onChange={onChangeCompressedImage}
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

export default EditSingleImageAd;