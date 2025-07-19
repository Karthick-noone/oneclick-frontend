import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../components/ApiUrl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./css/EditDoubleAdpage.css";
import { FaInfoCircle } from "react-icons/fa";

Modal.setAppElement("#root");

const EditSingleImageAd = () => {
  const [products, setProducts] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState(""); // Add a new state to track the selected category
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
        const response = await axios.get(`${ApiUrl}/fetchsingleadpage`);
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // const compressImage = (file, maxSizeKB = 450) => {
  //   // Set maxSizeKB to 450
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     reader.onload = (event) => {
  //       const img = new Image();
  //       img.src = event.target.result;

  //       img.onload = () => {
  //         const canvas = document.createElement("canvas");
  //         const MAX_WIDTH = 500; // Set maximum width for the image
  //         const scaleSize = MAX_WIDTH / img.width;
  //         canvas.width = MAX_WIDTH;
  //         canvas.height = img.height * scaleSize;

  //         const ctx = canvas.getContext("2d");
  //         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  //         // Compression function with adjustable quality
  //         const compress = (quality) => {
  //           return new Promise((resolveInner) => {
  //             canvas.toBlob(
  //               (blob) => {
  //                 if (blob.size / 1024 <= maxSizeKB || quality < 0.3) {
  //                   resolveInner(blob); // Return if under size limit or at minimum quality
  //                 } else {
  //                   resolveInner(compress(quality - 0.1)); // Retry with lower quality
  //                 }
  //               },
  //               "image/jpeg",
  //               quality
  //             );
  //           });
  //         };

  //         // Start compressing with initial quality of 0.8
  //         compress(0.8).then(resolve);
  //       };
  //     };
  //   });
  // };

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
        setNewImage(file); // Directly set the original file
      };
    };
  }
};


 const handleAddProduct = async () => {
    if (!newImage || !category) {
      Swal.fire({
        icon: "error",
        title: "Missing Data",
        text: "Please select both an image and a category.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", newImage);
    formData.append("category", category);

    setIsUploading(true); // Start loader

    try {
      await axios.post(`${ApiUrl}/singleadpage`, formData, {
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
        // return axios.get(`${ApiUrl}/fetchsingleadpage`);
      });

      const res = await axios.get(`${ApiUrl}/fetchsingleadpage`);
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
        await axios.delete(`${ApiUrl}/deletesingleadpageimage/${product.id}`);

        Swal.fire({
          icon: "success",
          title: "Image Deleted",
          text: "The image has been deleted successfully!",
          timer:3000
        }).then(() => {
          window.location.reload();
        });

        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== product.id)
        );
      } catch (error) {
        console.error("Error deleting image:", error);
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: "There was an error deleting the image. Please try again.",
        });
      }
    }
  };

const handleUpdateImage = async () => {
  if (!selectedFile && !editingProduct.category) {
    Swal.fire({
      icon: "error",
      title: "No Changes Detected",
      text: "Please select an image or a category to update.",
    });
    return;
  }

  const formData = new FormData();
  if (selectedFile) formData.append("image", selectedFile);
  if (editingProduct.category) formData.append("category", editingProduct.category);

  try {
    setIsUpdating(true);

    const response = await axios.put(
      `${ApiUrl}/updatesingleadpageimage/${editingProduct.id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUpdateProgress(percentCompleted);
        }
      }
    );

    Swal.fire({
      icon: "success",
      title: "Product Updated",
      text: "The product has been updated successfully!",
    });

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              image: selectedFile ? response.data.updatedImage : product.image,
              category: editingProduct.category !== product.category
                ? editingProduct.category
                : product.category,
            }
          : product
      )
    );
    setModalIsOpen(false);
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

const handleImageSelection = (e) => {
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
        setSelectedFile(file); // Directly set the original file
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
            <div className="laptops-card-item">Image(2000 X 600) 
              <FaInfoCircle
              style={{ cursor: "pointer", fontSize: "16px", marginLeft: '5px', marginTop: '2px' }}
              title="Add banner size image for better view (2000 x 600)"
            />
            </div>
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

            <select
              name="category"
              // value={editingProduct.category}
              value={category} // Bind the state to the select value
              onChange={handleCategoryChange} // Update category on change
              // onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              className="ad-form-input"
            >
              <option value="">Select Category</option>
              <option value="Computers">Computer</option>
              <option value="Mobiles">Mobile</option>
              <option value="Printers">Printers</option>
              <option value="Headphones">Headphone</option>
              <option value="Speakers">Speaker</option>
              <option value="CCTV">CCTV</option>
              <option value="TV">TV</option>
              <option value="Watch">Watch</option>
              <option value="ComputerAccessories">Computer Accessories</option>
              <option value="MobileAccessories">Mobile Accessories</option>
              <option value="PrinterAccessories">Printer Accessories</option>
              <option value="CCTVAccessories">CCTV Accessories</option>
            </select>

              <div className="action-row">
              <button onClick={handleAddProduct} className="add-btn" disabled={isUploading}>
                Add
              </button>

              {isUploading && (
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
              )}
            </div>

           
          </div>
        </div>

        <div className="ad-cards-container">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="ad-cardd">
                <div className="ad-image-container">
                  {product.image ? (
                    <>
                    <img
                      src={`${ApiUrl}/uploads/singleadpage/${product.image}`}
                      alt="Ad"
                      className="ad-image3"
                    />
                    <button
                    onClick={() => handleEditProduct(product)} // Pass 'true' for portrait images
                    className="laptops-edit-btnn"
                  >
                    Edit
                  </button></>
                  ) : (
                    <p>
                      No image available.Please add one image for advertisement.
                    </p>
                  )}
              
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
    {/* Overlay progress inside Modal */}
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

    {/* Modal content */}
    <div className="adminmodal-header">
      <h2>Edit Image and Category</h2>
      <button onClick={() => setModalIsOpen(false)} className="adminmodal-close-btn">
        &times;
      </button>
    </div>

    <input
      type="file"
      onChange={handleImageSelection}
      className="adminmodal-input"
      accept="image/jpeg, image/png, image/webp"
    />

    <select
      name="category"
      value={editingProduct.category || ""}
      onChange={(e) =>
        setEditingProduct({ ...editingProduct, category: e.target.value })
      }
      className="adminmodal-input"
    >
      <option value="">Select Category</option>
      <option value="Computers">Computer</option>
      <option value="Mobiles">Mobile</option>
      <option value="Printers">Printers</option>
      <option value="Headphones">Headphone</option>
      <option value="Speakers">Speaker</option>
      <option value="CCTV">CCTV</option>
      <option value="TV">TV</option>
      <option value="Watch">Watch</option>
      <option value="ComputerAccessories">Computer Accessories</option>
      <option value="MobileAccessories">Mobile Accessories</option>
      <option value="PrinterAccessories">Printer Accessories</option>
      <option value="CCTVAccessories">CCTV Accessories</option>
    </select>

    <button onClick={handleUpdateImage} className="adminmodal-update-btn">
      Update
    </button>
    <button onClick={() => handleDeleteImage(editingProduct)} className="adminmodal-cancel-btn">
      Delete
    </button>
  </Modal>
)}
    </div>
  );
};

export default EditSingleImageAd;
