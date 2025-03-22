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

const ProductDetailPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    brand_name: "",
    description: "",
    offer: "",
    category: "",
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


  const [portraitImage, setportraitImage] = useState(null);
  const [portraitImageName, setportraitImageName] = useState(null);
  const [portraitKeyword, setportraitKeyword] = useState(''); // Define state for portraitKeyword
  const [isportraitEdit, setIsportraitEdit] = useState(false); // Track if the edit is for the banner


  
  const navigate = useNavigate();

 // Fetch products and the banner image
 useEffect(() => {
  const fetchProducts = async () => {
    console.log("Starting to fetch products...");
    try {
      const response = await axios.get(`${ApiUrl}/fetchproductdetailsofferspage`);
      console.log("Fetched products:", response.data);
      setProducts(response.data);

      // Extract the banner image name from the fetched products
      const bannerImage = response.data.find(product => 
        product.image && product.image.startsWith('product_banner') // Adjust property name if needed
      );
    

      if (bannerImage) {
        console.log("Banner image found:", bannerImage.image);
        setBannerImageName(bannerImage.image);
      } else{
          console.log("No images found")
        }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, []);


const handleCategoryChange = (e) => {
  setNewProduct((prevProduct) => ({
    ...prevProduct,
    category: e.target.value, // Ensure category is updated inside newProduct
  }));
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const compressImage = (file, maxSizeKB = 500) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          const compress = (quality) => {
            return new Promise((resolveInner) => {
              canvas.toBlob((blob) => {
                if (blob.size / 1024 <= maxSizeKB) {
                  resolveInner(blob);
                } else {
                  // Retry with lower quality
                  resolveInner(compress(quality - 0.1));
                }
              }, 'image/jpeg', quality);
            });
          };
  
          compress(0.8).then(resolve);
        };
      };
    });
  };
  
  const handleImageChange = (e, isBanner = false) => {
    const files = Array.from(e.target.files);
    const validExtensions = ["jpg", "jpeg", "png", "jfif"];
    let processedFiles = [];
  
    files.forEach((file) => {
      const fileName = file.name;
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const sanitizedFile = new File([file], sanitizedFileName, {
        type: file.type,
      });
  
      const fileExtension = sanitizedFile.name.split(".").pop().toLowerCase();
  
      if (!validExtensions.includes(fileExtension)) {
        console.error(`${sanitizedFileName} is not a valid image format.`);
        return;
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(sanitizedFile);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          const compressImage = (minQuality, maxQuality) => {
            return new Promise((resolve) => {
              canvas.toBlob(
                (blob) => resolve(blob || sanitizedFile),
                "image/jpeg",
                0.8
              );
            });
          };
  
          compressImage(0.5, 0.95).then((compressedBlob) => {
            const finalFileName = isBanner
              ? `product_banner_${sanitizedFileName}`
              : sanitizedFileName;
            const finalFile = new File([compressedBlob], finalFileName, {
              type: sanitizedFile.type,
            });
  
            processedFiles.push(finalFile);
  
            if (processedFiles.length === files.length) {
              setNewProduct((prev) => ({
                ...prev,
                images: [...prev.images, ...processedFiles],
                title: isBanner ? "product_banner" : prev.title, // ✅ Set title if it's a banner
              }));
            }
          });
        };
      };
    });
  };
  
  const handleImageChange2 = (e, isportrait = false) => {
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
        if (isportrait) {
          const portraitFileName = `portrait_${sanitizedFileName}`;
          const portraitFile = new File([sanitizedFile], portraitFileName, { type: sanitizedFile.type });
          validFiles.push(portraitFile); // Push the renamed portrait file
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
  
    if (!newProduct.category) {
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
    formData.append("category", newProduct.category);
    formData.append("brand_name", newProduct.brand_name);
  
    // Add banner image with prefix if it exists
    if (bannerImage) {
      const bannerImageName = `product_banner_${bannerImage.name}`; // Prefix the banner image
      const renamedBannerImage = new File([bannerImage], bannerImageName, { type: bannerImage.type });
      formData.append("images", renamedBannerImage);
    }
  
   else if (portraitImage) {
      const portraitImageName = `portrait_${portraitImage.name}`; // Prefix the portrait image
      const renamedportraitImage = new File([portraitImage], portraitImageName, { type: portraitImage.type });
      formData.append("images", renamedportraitImage);
    }
  
    // Append other images without prefix
    newProduct.images.forEach((image) => {
      const originalImageName = image.name; // Keep the original name
      const imageToUpload = new File([image], originalImageName, { type: image.type });
      formData.append("images", imageToUpload);
    });
  
    try {
      await axios.post(`${ApiUrl}/add-productdetails-offerspage-banner`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "The product has been added successfully!",
      }).then(() => {
        return axios.get(`${ApiUrl}/fetchproductdetailsofferspage`);
      }).then((productsResponse) => {
        setProducts(productsResponse.data);
        setNewProduct({
          title: "",
          description: "",
          brand_name: "",
          category: "",
          images: [],
        });
      });
  
      // Reset file input
      document.querySelector('input[type="file"]').value = '';

      const fileInput = document.querySelector('.filee-input'); // Select the input by its class
    if (fileInput) {
      fileInput.value = ''; // Clear the file input
    }
  

      const fileInput2 = document.querySelector('.filee-inputt'); // Select the input by its class
    if (fileInput2) {
      fileInput2.value = ''; // Clear the file input
    }
  
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error adding the product. Please try again.",
      });
    }
  };
  
  

  const handleEditProduct = (product, index = null, isBanner = false, bannerKeyword = "") => {
    console.log("Editing product:", product);
  
    setEditingProduct({
      id: product.id,
      brand_name: product.brand_name,
      category: product.category,
      images: [],
    });
  
    setEditingImageIndex(index);
    setIsBannerEdit(isBanner);
    setBannerKeyword(bannerKeyword);
  
    setModalIsOpen(true);
  };
  
  const handleUpdateProduct = async () => {
    console.log("Updating product:", editingProduct);
  
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
  
  
    if (!editingProduct.category) {
      console.warn("Warning: Category is missing.");
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("brand_name", editingProduct.brand_name);
    formData.append("category", editingProduct.category);
  
    if (selectedFiles) {
      // Add "product_banner_" prefix to the file name
      const prefixedImageName = `product_banner_${selectedFiles.name}`;
      formData.append("image", new File([selectedFiles], prefixedImageName));
    }
  
    try {
      console.log("Sending update request for product ID:", editingProduct.id);
      await axios.put(`${ApiUrl}/mobileupdateofferspage/${editingProduct.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      Swal.fire({
        icon: "success",
        title: "Product Updated",
        text: "The product has been updated successfully!",
      }).then(() => axios.get(`${ApiUrl}/fetchproductdetailsofferspage`))
        .then((fetchResponse) => {
          console.log("Updated product list:", fetchResponse.data);
          setProducts(fetchResponse.data);
          setEditingProduct(null);
          setModalIsOpen(false);
        });
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the product. Please try again.",
      });
    }
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
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '_');
      const sanitizedFile = new File([file], sanitizedFileName, { type: file.type });
  
      const validExtensions = ['jpg', 'jpeg', 'png', 'jfif'];
      const fileExtension = sanitizedFile.name.split('.').pop().toLowerCase();
  
      if (validExtensions.includes(fileExtension)) {
        compressImage(sanitizedFile).then((compressedBlob) => {
          const finalFile = new File([compressedBlob], sanitizedFileName, { type: sanitizedFile.type });
          setSelectedFiles(finalFile);
        });
      } else {
        console.error(`${sanitizedFileName} is not a valid image format (jpg, jpeg, png, jfif)`);
      }
    }
  };
return (
  <div className="laptops-page">
    <div className="laptops-content">
      <h2 className="laptops-page-title">Edit Product Detail Page Banner Image</h2>
    

      <div className="offer-ad-container">
    

 <div className="banner-container">

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
      <select
      name="category"
      // value={editingProduct.category}
      value={newProduct.category}  // Bind the state to the select value
      onChange={handleCategoryChange}  // Update category on change
      // onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
      className="ad-form-input"
    >
      <option value="">Select Category</option>
      <option value="computers">Computer</option>
      <option value="mobiles">Mobile</option>
      <option value="printers">Printers</option>
      <option value="headphones">Headphone</option>
      <option value="speaker">Speaker</option>
      <option value="cctv">CCTV</option>
      <option value="tv">TV</option>
      <option value="watch">Watch</option>
      <option value="computeraccessories">Computer Accessories</option>
      <option value="mobileaccessories">Mobile Accessories</option>
      <option value="printeraccessories">Printer Accessories</option>
              <option value="cctvaccessories">CCTV Accessories</option>
    </select>
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={(e) => handleImageChange(e, true)} // Pass true to indicate it's a banner image
        className="filee-input" // Unique class for file input
      />
      <button onClick={handleAddProduct} className="laptops-add-btn">
        Add
      </button>
    </div></>
</div>


<div className="images-below-banner" style={{ marginTop: '20px' }}>
  
  {products.length > 0 && products.some(product => product.image && product.image.startsWith("product_banner")) ? (
    // Filter for products with banner images and map to display them
    products
      .filter(product => product.image && product.image.startsWith("product_banner")) // Filter for banner images
      .slice(0, 4) // Limit to the first 4 images
      .map((product, index) => (
        <div key={index} className="banner-image-display" style={{ position: 'relative', marginBottom: '20px' }}>
         <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Banner Image {index + 1}</span>
          </div>
          <p style={{ marginTop: '30px' }} className="pc-product-brand">{product.brand_name}</p> {/* Display brand name */}

          <img
            src={`${ApiUrl}/uploads/offerspage/${product.image}`} // Construct the image URL for the product
            alt={`Banner for ${product.brand_name}`} // Alt text for accessibility
            className="pc-product-image" // Class for styling
            style={{ width: '875px', marginTop: '10px', height: 'auto' }} // Styling for the image
          />
          
          <button
            onClick={() => handleEditProduct(product)}
            className="laptops-edit-btnn"
          >
            Edit
          </button>
          
          {/* Displaying the label for the banner image */}
          
        </div>
      ))
  ) : (
    <p>No banner images available.</p> // Fallback message when no banner images are present
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
          <h2>Edit Image and Brand Name</h2>
        
        </div>
        <button className="close-button" onClick={() => setModalIsOpen(false)}>
            &times;
          </button>

        <input
          type="file"
          onChange={(e) => handleFileChange(e)} // Use the new handler for file change
          className="adminmodal-input"
          accept="image/jpeg, image/png" // This allows all image types
        />

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

<select
      name="category"
      // value={editingProduct.category}
      value={editingProduct.category}
          onChange={(e) =>
            setEditingProduct({ ...editingProduct, category: e.target.value })
          }
      // onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
      className="adminmodal-input"
      style={{marginRight:' 10px'}}
    >
      <option value="">Select Category</option>
      <option value="computers">Computer</option>
      <option value="mobiles">Mobile</option>
      <option value="printers">Printers</option>
      <option value="headphones">Headphone</option>
      <option value="speaker">Speaker</option>
      <option value="cctv">CCTV</option>
      <option value="tv">TV</option>
      <option value="watch">Watch</option>
      <option value="computeraccessories">Computer Accessories</option>
      <option value="mobileaccessories">Mobile Accessories</option>
      <option value="printeraccessories">Printer Accessories</option>
              <option value="cctvaccessories">CCTV Accessories</option>
    </select>

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

export default ProductDetailPage;
