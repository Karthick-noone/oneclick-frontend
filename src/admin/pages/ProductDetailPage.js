import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { ApiUrl } from "../../components/ApiUrl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./css/ComputerAdpage.css";



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
  // const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [, setEditingImageIndex] = useState(null); // To track which image is being edited
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [, setBannerImageName] = useState(null);
  const [, setBannerKeyword] = useState(''); // Define state for bannerKeyword
  const [, setIsBannerEdit] = useState(false); // Track if the edit is for the banner
  
  const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateProgress, setUpdateProgress] = useState(0); // optional if needed


  // Fetch products and the banner image
  useEffect(() => {
    const fetchProducts = async () => {
      console.log("Starting to fetch products...");
      try {
        const response = await axios.get(`${ApiUrl}/fetch-banner-products`);
        const data = Array.isArray(response.data) ? response.data : []; // fallback if not array
      setProducts(data);

        // Extract the banner image name from the fetched products
        const bannerImage = response.data.find(product =>
          product.image && product.image.startsWith('product_banner') // Adjust property name if needed
        );


        if (bannerImage) {
          console.log("Banner image found:", bannerImage.image);
          setBannerImageName(bannerImage.image);
        } else {
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



  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validExtensions = ["jpg", "jpeg", "png", "jfif"];
    let processedFiles = [];

    files.forEach((file) => {
      const fileName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const ext = fileName.split(".").pop().toLowerCase();

      if (!validExtensions.includes(ext)) {
        console.error(`${fileName} is not a valid image format.`);
        return;
      }

      const prefixedName = `product_banner_${fileName}`;
      const finalFile = new File([file], prefixedName, { type: file.type });

      processedFiles.push(finalFile);
    });

    setNewProduct((prev) => ({
      ...prev,
      title: "product_banner",
      images: [...prev.images, ...processedFiles],
    }));
  };

const handleAddProduct = async () => {
  if (!newProduct.brand_name || !newProduct.category) {
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

  newProduct.images.forEach((image) => {
    const originalImageName = image.name;
    const imageToUpload = new File([image], originalImageName, { type: image.type });
    formData.append("images", imageToUpload);
  });

  try {
    setIsUploading(true);
    setUploadProgress(0);

    await axios.post(`${ApiUrl}/add-banner-products`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      }
    });

    Swal.fire({
      icon: "success",
      title: "Product Added",
      text: "The product has been added successfully!",
    });

    const productsResponse = await axios.get(`${ApiUrl}/fetch-banner-products`);
    setProducts(productsResponse.data);

    setNewProduct({
      title: "",
      description: "",
      brand_name: "",
      category: "",
      images: [],
    });

    // Clear file inputs
    document.querySelectorAll('input[type="file"]').forEach((input) => input.value = '');

  } catch (error) {
    console.error("Error adding product:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "There was an error adding the product. Please try again.",
    });
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
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

  if (!editingProduct.brand_name || !editingProduct.category) {
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
    const prefixedImageName = `product_banner_${selectedFiles.name}`;
    const renamedFile = new File([selectedFiles], prefixedImageName);
    formData.append("image", renamedFile);
    formData.append("title", "product_banner");
  }

  try {
    setIsUpdating(true); // Start loading
    setUpdateProgress(0); // Reset progress

    await axios.put(`${ApiUrl}/update-banner-product/${editingProduct.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUpdateProgress(percent); // Update state
      },
    });

    Swal.fire({
      icon: "success",
      title: "Product Updated",
      text: "The product has been updated successfully!",
    }).then(() => axios.get(`${ApiUrl}/fetch-banner-products`))
      .then((fetchResponse) => {
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
  } finally {
    setIsUpdating(false);
    setUpdateProgress(0);
  }
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
          const response = await fetch(`${ApiUrl}/delete-banner-product/${editingProduct.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success').then(async () => {
              setModalIsOpen(false); //  Close modal

              //  Fetch updated product list instead of reloading
              const fetchResponse = await fetch(`${ApiUrl}/fetch-banner-products`);
              const updatedProducts = await fetchResponse.json();
              setProducts(updatedProducts); //  Update product state
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




  // const handleUpdateImage = async () => {
  //   if (!selectedFiles) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'No File Selected',
  //       text: 'Please select an image to update.',
  //     });
  //     return;
  //   }

  //   const formData = new FormData();
  //   const imageNamePrefix = isBannerEdit ? `${bannerKeyword}${selectedFiles.name}` : selectedFiles.name; // Use the banner keyword if applicable
  //   formData.append('image', new File([selectedFiles], imageNamePrefix)); // Create a new File object with the prefixed name

  //   try {
  //     const response = await axios.put(
  //       `${ApiUrl}/update-banner-product-image/${editingProduct.id}`, // Update the endpoint to only include the product ID
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Image Updated',
  //       text: 'The image has been updated successfully!',
  //     });

  //     // Update the product images after a successful update
  //     setProducts((prevProducts) =>
  //       prevProducts.map((product) =>
  //         product.id === editingProduct.id
  //           ? { ...product, image: response.data.updatedImages } // Adjust how you set the image data
  //           : product
  //       )
  //     );

  //     // Optionally, reset the state
  //     setSelectedFiles(null);
  //     setEditingProduct(null);
  //     // Close the modal if you have one
  //   } catch (error) {
  //     console.error('Error updating image:', error);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Update Failed',
  //       text: 'There was an error updating the image. Please try again.',
  //     });
  //   }
  // };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const prefixedName = `product_banner_${sanitizedName}`;
      const finalFile = new File([file], prefixedName, { type: file.type });
      setSelectedFiles(finalFile);
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
                  <option value="Speakers">Speaker</option>
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
                  accept="image/jpeg, image/png, image/webp"
                  onChange={(e) => handleImageChange(e, true)} // Pass true to indicate it's a banner image
                  className="filee-input" // Unique class for file input
                />
                
            {!isUploading ? (
  <button onClick={handleAddProduct} className="laptops-add-btn">
    Add
  </button>
) : (
  <div className="circular-progress-wrapper">
    <svg className="circular-progress" viewBox="0 0 36 36">
      <g transform="rotate(-0 18 18)">
        <path
          className="circle-bg"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="circle"
          strokeDasharray={`${uploadProgress}, 100`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </g>
      <text x="18" y="20.35" className="percentage-text">
        {uploadProgress}%
      </text>
    </svg>
  </div>
)}


              </div></>
          </div>


          <div className="images-below-banner" style={{ marginTop: '20px' }}>
            {products.length > 0 && products.some(product => product.title === "product_banner") ? (
              products
                .filter(product => product.title === "product_banner")
                .slice(0, 4)
                .map((product, index) => (
                  <div
                    key={index}
                    className="banner-image-display"
                    style={{ position: 'relative', marginBottom: '20px' }}
                  >
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      <span style={{ fontWeight: 'bold' }}>Banner Image {index + 1}</span>
                    </div>
                    <p style={{ marginTop: '30px' }} className="pc-product-brand">
                      {product.brand_name}
                    </p>

                    <img
                      src={`${ApiUrl}/uploads/offerspage/${product.image}`}
                      alt={`Banner for ${product.brand_name}`}
                      className="pc-product-image"
                      style={{ width: '875px', marginTop: '10px', height: 'auto' }}
                    />

                    <button
                      onClick={() => handleEditProduct(product)}
                      className="laptops-edit-btnn"
                    >
                      Edit
                    </button>
                  </div>
                ))
            ) : (
              <p>No banner images available.</p>
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

          {isUpdating && (
      <div className="modal-upload-overlay">
        <div className="circular-progress-wrapper">
          <svg className="circular-progress" viewBox="0 0 36 36">
            <g transform="rotate(-90 18 18)">
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
            <h2>Edit Image and Brand Name</h2>

          </div>
          <button className="close-button" onClick={() => setModalIsOpen(false)}>
            &times;
          </button>

          <input
            type="file"
            onChange={(e) => handleFileChange(e)} // Use the new handler for file change
            className="adminmodal-input"
            accept="image/jpeg, image/png, image/webp" // This allows all image types
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
            style={{ marginRight: ' 10px' }}
          >
            <option value="">Select Category</option>
            <option value="computers">Computer</option>
            <option value="mobiles">Mobile</option>
            <option value="printers">Printers</option>
            <option value="headphones">Headphone</option>
            <option value="Speakers">Speaker</option>
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

      {/* {editingProduct && (
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
      )} */}
    </div>
  );
};

export default ProductDetailPage;
