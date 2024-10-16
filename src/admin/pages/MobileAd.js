import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../components/ApiUrl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import './css/Addmobile.css';
import "./css/ComputerAdpage.css";
// import { FaInfoCircle } from "react-icons/fa";
// import offerAd from './img/design.png';


Modal.setAppElement("#root");

const MobileAd = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    brand_name: "",
    description: "",
    offer: "",
    images: [],
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState(null); // To track which image is being edited
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageName, setBannerImageName] = useState(null);
  const [bannerKeyword, setBannerKeyword] = useState(''); // Define state for bannerKeyword

  const [isBannerEdit, setIsBannerEdit] = useState(false); // Track if the edit is for the banner


  
  const navigate = useNavigate();

 // Fetch products and the banner image
 useEffect(() => {
  const fetchProducts = async () => {
    console.log("Starting to fetch products...");
    try {
      const response = await axios.get(`${ApiUrl}/fetchmobileofferspage`);
      console.log("Fetched products:", response.data);
      setProducts(response.data);

      // Extract the banner image name from the fetched products
      const bannerImage = response.data.find(product => 
        product.image && product.image.startsWith('banner') // Adjust property name if needed
      );

      if (bannerImage) {
        console.log("Banner image found:", bannerImage.image);
        setBannerImageName(bannerImage.image);
      } else {
        console.log("No banner image found that starts with 'banner'.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, []);


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e, isBanner = false) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
  
    files.forEach((file) => {
      const fileName = file.name;
  
      // Regular expression to match valid file names without special characters
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]+/g, '_');
  
      // Create a new File object with the sanitized name
      const sanitizedFile = new File([file], sanitizedFileName, { type: file.type });
  
      // Check if the file has a valid image extension
      const validExtensions = ['jpg', 'jpeg', 'png', 'jfif'];
      const fileExtension = sanitizedFile.name.split('.').pop().toLowerCase();
  
      if (validExtensions.includes(fileExtension)) {
        // If the current input is the banner input, prefix the file name
        if (isBanner) {
          const bannerFileName = `banner_${sanitizedFileName}`;
          const bannerFile = new File([sanitizedFile], bannerFileName, { type: sanitizedFile.type });
          validFiles.push(bannerFile); // Push the renamed banner file
        } else {
          validFiles.push(sanitizedFile); // Push the normal file
        }
      } else {
        console.error(`${sanitizedFileName} is not a valid image format (jpg, jpeg, png, jfif)`);
      }
    });
  
    // Update the state for new product images
    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles], // Append new valid files
    }));
  };
  
  

  const handleAddProduct = async () => {
    // Check for missing fields
    if (!newProduct.brand_name) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      });
      return;
    }
  
    if (newProduct.images.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Images",
        text: "Please select at least one image.",
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("title", newProduct.title);
    formData.append("description", newProduct.description);
    formData.append("offer", newProduct.offer);
    formData.append("brand_name", newProduct.brand_name);
  
    // Add banner image with prefix if it exists
    if (bannerImage) {
      const bannerImageName = `banner_${bannerImage.name}`; // Prefix the banner image
      const renamedBannerImage = new File([bannerImage], bannerImageName, { type: bannerImage.type });
      formData.append("images", renamedBannerImage);
    }
  
    // Append other images without prefix
    newProduct.images.forEach((image) => {
      const originalImageName = image.name; // Keep the original name
      const imageToUpload = new File([image], originalImageName, { type: image.type });
      formData.append("images", imageToUpload);
    });
  
    try {
      await axios.post(`${ApiUrl}/mobileofferspage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "The product has been added successfully!",
      }).then(() => {
        return axios.get(`${ApiUrl}/fetchmobileofferspage`);
      }).then((productsResponse) => {
        setProducts(productsResponse.data);
        setNewProduct({
          title: "",
          description: "",
          brand_name: "",
          images: [],
        });
      });
  
      // Reset file input
      document.querySelector('input[type="file"]').value = '';
  
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error adding the product. Please try again.",
      });
    }
  };
  
  

  const handleUpdateProduct = async () => {
    console.log("Updating product:", editingProduct); // Log the current state of the editing product
  
    if (!editingProduct.id) {
      console.error("Error: Product ID is missing.");
      return;
    }
  
    if (!editingProduct.brand_name) {
      console.warn("Warning: Brand name is missing.");
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("brand_name", editingProduct.brand_name);
    
    editingProduct.images.forEach((image) => {
      console.log("Appending image:", image); // Log each image being appended
      formData.append("images", image);
    });
  
    try {
      console.log("Sending update request for product ID:", editingProduct.id); // Log the request
      await axios.put(
        `${ApiUrl}/mobileupdateofferspage/${editingProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      Swal.fire({
        icon: "success",
        title: "Product Updated",
        text: "The product has been updated successfully!",
      }).then(() => {
        return axios.get(`${ApiUrl}/fetchmobileofferspage`);
      }).then((fetchResponse) => {
        console.log("Updated product list:", fetchResponse.data); // Log the updated product list
        setProducts(fetchResponse.data);
        setEditingProduct(null);
        setModalIsOpen(false);
      });
    } catch (error) {
      console.error("Error updating product:", error); // Log any errors
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the product. Please try again.",
      });
    }
  };
  

  const handleEditProduct = (product) => {
    console.log("Editing product:", product); // Log the product being edited
  
    setEditingProduct({
      id: product.id,
      brand_name: product.brand_name,
      images: [], // Reset images, the user has to select new ones if desired
    });
  
    setModalIsOpen(true);
  };
  
  const handleEditImage = (product, index) => {
    console.log(`Editing image for product ID: ${product.id} at index: ${index}`);

    setEditingProduct(product);
    setEditingImageIndex(index);
    setModalIsOpen2(true);
  };

 
  const handleSecondEditIcon = (product, index, bannerKeyword) => {
    console.log(`Second editing option for product ID: ${product.id} at index: ${index} with banner keyword: ${bannerKeyword}`);
    
    // Set flag to indicate that this is a banner image edit
    setIsBannerEdit(true);
    
    setEditingProduct(product);
    setEditingImageIndex(index);
    
    // Save the banner keyword in the state if needed
    setBannerKeyword(bannerKeyword); // This will now correctly reference the state variable
  
    setModalIsOpen2(true); // Use the correct modal state
  };
  
  
  const handleDeleteProduct = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${ApiUrl}/api/deletemobileofferspage/${editingProduct.id}`, {
            method: 'DELETE',
          });
  
          if (response.ok) {
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success').then(() => {
              // Optionally close the modal
              setModalIsOpen(false); // Close modal
  
              // Refresh the page after a successful deletion
              window.location.reload(); // Refresh the page
            });
          } else {
            Swal.fire('Error', 'Failed to delete product', 'error');
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          Swal.fire('Error', 'An error occurred while deleting the product', 'error');
        }
      }
    });
  };
  
  const handleDeleteImage = async (product, imageIndex) => {
    // Split the image list by comma, handle edge cases like empty strings
    const imageArray = product.image ? product.image.split(",") : [];
    // Filter out the image to be deleted
    const updatedImages = imageArray.filter((_, index) => index !== imageIndex);

    // Confirm deletion with the user
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this image? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        // Send updated image list to the server
        await axios.put(`${ApiUrl}/deletemobileofferspageimage/${product.id}`, {
          images: updatedImages.join(","),
        });

        // Provide success feedback
        Swal.fire({
          icon: "success",
          title: "Image Deleted",
          text: "The image has been deleted successfully!",
        });

        // Update the state to reflect the change
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === product.id ? { ...p, image: updatedImages.join(",") } : p
          )
        );
      } catch (error) {
        console.error("Error deleting image:", error);
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: "There was an error deleting the image. Please try again.",
        });
      }
    } else {
      console.log("Image deletion was cancelled by the user.");
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
    const imageNamePrefix = isBannerEdit ? `${bannerKeyword}${selectedFiles.name}` : selectedFiles.name; // Use the banner keyword if applicable
    formData.append('image', new File([selectedFiles], imageNamePrefix)); // Create a new File object with the prefixed name
  
    try {
      const response = await axios.put(
        `${ApiUrl}/updatemobileofferspageimage/${editingProduct.id}`, // Update the endpoint to only include the product ID
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      Swal.fire({
        icon: 'success',
        title: 'Image Updated',
        text: 'The image has been updated successfully!',
      });
  
      // Update the product images after a successful update
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editingProduct.id
            ? { ...product, image: response.data.updatedImages } // Adjust how you set the image data
            : product
        )
      );
  
      // Optionally, reset the state
      setSelectedFiles(null);
      setEditingProduct(null);
      // Close the modal if you have one
    } catch (error) {
      console.error('Error updating image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating the image. Please try again.',
      });
    }
  };
  

  // Function to handle file change
const handleFileChange = (e) => {
  const file = e.target.files[0]; // Get the first selected file

  if (file) {
    // Sanitize the filename
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
    
    // Create a new File object with the sanitized name
    const sanitizedFile = new File([file], sanitizedFileName, { type: file.type });

    // Validate the file extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'jfif'];
    const fileExtension = sanitizedFile.name.split('.').pop().toLowerCase();

    if (validExtensions.includes(fileExtension)) {
      setSelectedFiles(sanitizedFile); // Store the sanitized file in state
    } else {
      console.error(`${sanitizedFileName} is not a valid image format (jpg, jpeg, png, jfif)`);
      // Optionally, you can set an error state to show a message to the user
    }
  }
};
return (
  <div className="laptops-page">
    <div className="laptops-content">
      <h2 className="laptops-page-title">Edit mobile Offers</h2>
      <div className="laptops-card">
        <div className="laptops-card-header">
          <div className="laptops-card-item">Brand Name</div>
          {/* <div className="laptops-card-item">Title</div> */}
          <div className="laptops-card-item">Image(6912 x 3456)</div>
          {/* <div className="laptops-card-item">Description</div> */}
          {/* <div className="laptops-card-item">Offer</div> */}
          <div className="laptops-card-item">Action</div>
        </div>
        <div className="laptops-card-row">
          <input
            type="text"
            name="brand_name"
            value={newProduct.brand_name}
            onChange={handleChange}
            placeholder="Enter brand name"
            className="laptops-card-input"
          />
          {/* <input
            type="text"
            name="title"
            value={newProduct.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="laptops-card-input"
          /> */}
          <input
            type="file"
            multiple // Allow multiple images
            name="images"
            onChange={(e) => handleImageChange(e)} // Normal images
            className="laptops-card-input"
            accept="image/*"  // This allows all image types
          />
          {/* <input
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="laptops-card-input"
          /> */}
    
          {/* <input
            type="text"
            name="offer"
            value={newProduct.offer}
            onChange={handleChange}
            placeholder="Enter offer"
            className="laptops-card-input"
          /> */}
    

          <button onClick={handleAddProduct} className="laptops-add-btn">
            Add
          </button>
          {/* <FaInfoCircle title="Add potrait images for better view " /> */}
        </div>
      </div>


      <div className="offer-ad-container">
      {products && products.length > 0 ? (
    products.map((product, index) => {
      // Check if the first image name starts with 'banner'
      const firstImage = product.image ? product.image.split(",")[0] : '';
      if (firstImage.startsWith('banner')) {
        return null; // Skip rendering this product
      }

      return (
        <div key={product.id} className="single-ad-container">
          {/* Image Wrapper for the Product Image */}
          <div className="image-wrapper" style={{ position: 'relative' }}>
            {/* Product Image */}
            {product.image && product.image.length > 0 ? (
              <div className="product-image-wrapper"> {/* Wrapper for positioning */}
                <p className="brand-name">{product.brand_name}</p>

                <img
                  src={`${ApiUrl}/uploads/offerspage/${firstImage}`} // Displaying the first product image
                  alt="Product"
                  className="offer-ad"
                  style={{ width: '400px', height: '200px' }} // Set size as specified
                />
                {/* Image Actions - Positioned in corners */}
                <div className="image-action" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <span
                    className="edit-iconn"
                    onClick={() => handleEditImage(product, index)}
                    style={{ cursor: 'pointer', color: '#fff' }} // Adjust icon style if needed
                  >
                    ✏️
                  </span>
                  <span
                    className="delete-iconn"
                    onClick={() => handleDeleteImage(product, index)}
                    style={{ cursor: 'pointer', color: '#fff', marginLeft: '10px' }} // Adjust icon style if needed
                  >
                    🗑️
                  </span>
                </div>
              </div>
            ) : (
              <p>No images available</p>
            )}
          </div>
          <button
            onClick={() => handleEditProduct(product)}
            className="laptops-edit-btnn"
          >
            Edit
          </button>
        </div>
      );
    })
  ) : (
    <p style={{ color: 'white' }}>No products available.</p>
  )}


 <div className="banner-container">
  {/* Filter products to only include those with banner images */}
  {products.length > 0 && products.some(product => product.image && product.image.startsWith("banner")) ? ( 
    // Check if there are any products with banner images to display
    products
      .filter(product => product.image && product.image.startsWith("banner")) // Filter for banner images
      .map((product, index) => (
        <div key={index} className="banner-image-display" style={{ position: 'relative', marginBottom: '20px' }}>
          <p style={{marginTop:'30px'}} className="brand-name">{product.brand_name}</p> {/* Display brand name */}

          <img
            src={`${ApiUrl}/uploads/offerspage/${product.image}`} // Construct the image URL for the product
            alt={`Banner for ${product.brand_name}`} // Alt text for accessibility
            className="banner-image" // Class for styling
            style={{width:'875px',marginTop: '28px', height:'275px'  }}
            // style={{ width: '875px', height: '295px', objectFit: 'cover', marginTop: '28px' }} // Make image cover the container
          />
          
          {/* Image action icons */}
          <div className="image-action" style={{ position: 'absolute', top: '30px', right: '10px' }}>
            <span
              className="edit-iconn"
              onClick={() => handleSecondEditIcon(product, index, 'banner_')} // Pass the entire product object
              style={{ cursor: 'pointer', color: '#fff' }} // Adjust icon style if needed
            >
              ✏️
            </span>
            <span
              className="delete-iconn"
              onClick={() => handleDeleteImage(product, index)} // Pass the entire product object
              style={{ cursor: 'pointer', color: '#fff', marginLeft: '10px' }} // Adjust icon style if needed
            >
              🗑️
            </span>
          </div>
          <button
            onClick={() => handleEditProduct(product)}
            className="laptops-edit-btnn"
          >
            Edit
          </button>
        </div>
      ))
  ) : (
    <>
    <h4 className="banner-title">Banner image (2000 x 600)</h4>
    <div className="input-groupp">
      {/* Display input fields when there are no images */}
{/* <p className="banner-title">banner</p> */}
      <input
        type="text"
        name="brand_name"
        value={newProduct.brand_name}
        onChange={handleChange}
        placeholder="Enter brand name"
        className="laptops-cardd-input"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageChange(e, true)} // Pass true to indicate it's a banner image
        className="filee-input" // Unique class for file input
      />
      <button onClick={handleAddProduct} className="laptops-add-btn">
        Add
      </button>
    </div></>
  )}
</div>



     

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
          <h2>Edit Brand Name</h2>
          <button
            onClick={() => setModalIsOpen(false)}
            className="adminmodal-close-btn"
          >
            &times; {/* or use a close icon */}
          </button>
        </div>
        <input
          type="text"
          name="brand_name"
          value={editingProduct.brand_name}
          onChange={(e) =>
            setEditingProduct({ ...editingProduct, brand_name: e.target.value })
          }
          placeholder="Enter brand_name"
          className="adminmodal-input"
        />
        {/* <input
          type="text"
          name="title"
          value={editingProduct.title}
          onChange={(e) =>
            setEditingProduct({ ...editingProduct, title: e.target.value })
          }
          placeholder="Enter title"
          className="adminmodal-input"
        />

        <input
          type="text"
          name="description"
          value={editingProduct.description}
          onChange={(e) =>
            setEditingProduct({
              ...editingProduct,
              description: e.target.value,
            })
          }
          placeholder="Enter description"
          className="adminmodal-input"
        />

        <input
          type="text"
          name="offer"
          value={editingProduct.offer}
          onChange={(e) =>
            setEditingProduct({
              ...editingProduct,
              offer: e.target.value,
            })
          }
          placeholder="Enter offer"
          className="adminmodal-input"
        /> */}

       
        <button
          onClick={handleUpdateProduct}
          className="adminmodal-update-btn"
        >
          Update
        </button>
        <button
          onClick={handleDeleteProduct}
          className="adminmodal-cancel-btn"
        >
          Delete
        </button>
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
          <button
            onClick={() => setModalIsOpen2(false)}
            className="adminmodal-close-btn"
          >
            &times;
          </button>
        </div>

        <input
          type="file"
          onChange={(e) => handleFileChange(e)} // Use the new handler for file change
          className="adminmodal-input"
          accept="image/*" // This allows all image types
        />

        <div className="adminmodal-footer">
          <button
            onClick={handleUpdateImage}
            className="adminmodal-update-btn"
          >
            Update
          </button>
          <button
            onClick={() => setModalIsOpen2(false)}
            className="adminmodal-cancel-btn"
          >
            Cancel
          </button>
        </div>
      </Modal>
    )}
  </div>
);
};

export default MobileAd;
