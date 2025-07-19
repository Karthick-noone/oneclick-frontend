import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../components/ApiUrl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import './css/Addmobile.css';
import "./css/ComputerAdpage.css";
// import { FaInfoCircle } from "react-icons/fa";
// import offerAd from './img/design.png';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

Modal.setAppElement("#root");

const MobileAd = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    medium: { brand_name: "" },
    banner: { brand_name: "" },
    portrait: { brand_name: "" },
    description: "",
    offer: "",
    images: [],
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [modalIsOpen2, setModalIsOpen2] = useState(false);
  // const [editingImageIndex, setEditingImageIndex] = useState(null); // To track which image is being edited
  const [selectedFiles, setSelectedFiles] = useState(null);
  // const [bannerImage, setBannerImage] = useState(null);
  const [, setBannerImageName] = useState(null);
  // const [bannerKeyword, setBannerKeyword] = useState(""); // Define state for bannerKeyword
  const [isBannerEdit, setIsBannerEdit] = useState(false); // Track if the edit is for the banner

  // const [portraitImage, setportraitImage] = useState(null);
  const [, setportraitImageName] = useState(null);
  // const [portraitKeyword, setportraitKeyword] = useState(""); // Define state for portraitKeyword
  const [isportraitEdit, setIsportraitEdit] = useState(false); // Track if the edit is for the banner
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  const [uploadStatus, setUploadStatus] = useState({
    medium: { isUploading: false, progress: 0 },
    banner: { isUploading: false, progress: 0 },
    portrait: { isUploading: false, progress: 0 },
  }); 
  // const [uploadProgress, setUploadProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0); // optional if needed

  const handleImageClick = (index, imageList) => {
    setPhotoIndex(index);
    setLightboxImages(imageList);
    setIsOpen(true);
  };

  // const navigate = useNavigate();

  // Fetch products and the banner image
  useEffect(() => {
    const fetchProducts = async () => {
      console.log("Starting to fetch products...");
      try {
        const response = await axios.get(`${ApiUrl}/fetchmobileofferspage`);
        console.log("Fetched products:", response.data);
        setProducts(response.data);

        // Extract the banner image name from the fetched products
        const bannerImage = response.data.find(
          (product) => product.image && product.image.startsWith("banner") // Adjust property name if needed
        );
        // Extract the banner image name from the fetched products
        const portraitImage = response.data.find(
          (product) => product.image && product.image.startsWith("portrait") // Adjust property name if needed
        );

        if (bannerImage) {
          console.log("Banner image found:", bannerImage.image);
          setBannerImageName(bannerImage.image);
        } else if (portraitImage) {
          console.log("portrait image found:", portraitImage.image);
          setportraitImageName(portraitImage.image);
        } else {
          console.log("No images found");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e, type) => {
    const { name, value } = e.target;

    setNewProduct((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: value,
      },
    }));
  };



  const handleImageChange = (e, type = "") => {
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
      reader.onload = () => {
        let finalFileName;

        if (type === "banner") {
          finalFileName = `banner_${sanitizedFileName}`;
        } else if (type === "portrait") {
          finalFileName = `portrait_${sanitizedFileName}`;
        } else {
          finalFileName = sanitizedFileName;
        }

        const finalFile = new File([sanitizedFile], finalFileName, {
          type: sanitizedFile.type,
        });

        processedFiles.push(finalFile);

        if (processedFiles.length === files.length) {
          setNewProduct((prev) => ({
            ...prev,
            [type]: {
              ...prev[type],
              images: [...(prev[type]?.images || []), ...processedFiles],
              title: type, // optional: only if your backend expects this
            },
          }));
        }
      };
    });
  };




  const handleAddProduct = async (type) => {
    const product = newProduct[type];

    if (!product.brand_name || product.images.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields and upload at least one image.",
        timer: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", product.title || type);
    formData.append("description", product.description || "");
    formData.append("offer", product.offer || "");
    formData.append("brand_name", product.brand_name);
    product.images.forEach((image) => {
      formData.append("images", image);
    });

    // ✅ Start progress for only this type
    setUploadStatus((prev) => ({
      ...prev,
      [type]: { isUploading: true, progress: 0 },
    }));

    try {
      await axios.post(`${ApiUrl}/mobileofferspage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadStatus((prev) => ({
            ...prev,
            [type]: { ...prev[type], progress: percent },
          }));
        },
      });

      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "The product has been added successfully!",
        timer: 3000,
      });

      const productsResponse = await axios.get(`${ApiUrl}/fetchmobileofferspage`);
      setProducts(productsResponse.data);

      setNewProduct((prev) => ({
        ...prev,
        [type]: {
          title: "",
          description: "",
          offer: "",
          brand_name: "",
          images: [],
        },
      }));

      document.querySelectorAll(`input[type="file"]`).forEach((input) => {
        input.value = "";
      });

    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error adding the product. Please try again.",
        timer: 3000,
      });
    } finally {
      setUploadStatus((prev) => ({
        ...prev,
        [type]: { isUploading: false, progress: 0 },
      }));
    }
  };




  const handleEditProduct = (product, isBanner = false, isportrait = false) => {
    console.log("Editing product:", product);

    setEditingProduct({
      id: product.id,
      brand_name: product.brand_name,
      images: [],
    });

    setIsBannerEdit(isBanner);
    setIsportraitEdit(isportrait);
    setModalIsOpen(true);
  };


  const handleUpdateProduct = async () => {
    console.log("Updating product:", editingProduct);

    if (!editingProduct.id) {
      console.error("Error: Product ID is missing.");
      return;
    }

    if (!editingProduct.brand_name) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
        timer: 3000,
      });
      return;
    }

    let imageTitle = "medium";
    if (isBannerEdit) imageTitle = "banner";
    else if (isportraitEdit) imageTitle = "portrait";

    const formData = new FormData();
    formData.append("brand_name", editingProduct.brand_name);
    formData.append("title", imageTitle);

    editingProduct.images.forEach((image) => {
      formData.append("images", image);
    });

    setIsUpdating(true); //  Start loader
    setUpdateProgress(0); //  Reset progress

    try {
      //  Upload new image if selected
      if (selectedFiles) {
        const imageFormData = new FormData();
        const prefixedName = `${imageTitle}_${selectedFiles.name}`;
        const renamedFile = new File([selectedFiles], prefixedName, {
          type: selectedFiles.type,
        });

        imageFormData.append("image", renamedFile);
        imageFormData.append("title", imageTitle);

        await axios.put(
          `${ApiUrl}/updatemobileofferspageimage/${editingProduct.id}`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUpdateProgress(percentCompleted);
            },
          }
        );
      }

      //  Update other product details
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
        title: "Product and Image Updated",
        text: "The product and image have been updated successfully!",
        timer: 3000,
      });

      //  Refresh product list
      const fetchResponse = await axios.get(`${ApiUrl}/fetchmobileofferspage`);
      setProducts(fetchResponse.data);
      setEditingProduct(null);
      setModalIsOpen(false);

    } catch (error) {
      console.error("Error updating product or image:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the product and/or image. Please try again.",
        timer: 3000,
      });
    } finally {
      setIsUpdating(false); //  Always stop loader
      setUpdateProgress(0);
    }
  };





  const handleDeleteProduct = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${ApiUrl}/api/deletemobileofferspage/${editingProduct.id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            Swal.fire({
              title: "Deleted!",
              text: "Your product has been deleted.",
              icon: "success",
              timer: 3000,
              timerProgressBar: true,
            });

            // Close modal
            setModalIsOpen(false);

            // Fetch updated products
            const updatedResponse = await axios.get(`${ApiUrl}/fetchmobileofferspage`);
            setProducts(updatedResponse.data);

            // Optionally re-extract banner and portrait images
            const bannerImage = updatedResponse.data.find(p => p.image?.startsWith("banner"));
            const portraitImage = updatedResponse.data.find(p => p.image?.startsWith("portrait"));

            setBannerImageName(bannerImage?.image || "");
            setportraitImageName(portraitImage?.image || "");

          } else {
            Swal.fire("Error", "Failed to delete product", "error");
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire("Error", "An error occurred while deleting the product", "error");
        }
      }
    });
  };




  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const validExtensions = ["jpg", "jpeg", "png", "jfif"];
      const fileExtension = sanitizedFileName.split(".").pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        console.error(`${sanitizedFileName} is not a valid image format.`);
        return;
      }

      const sanitizedFile = new File([file], sanitizedFileName, {
        type: file.type,
      });

      // Determine title based on filename
      let title = "";
      if (sanitizedFileName.startsWith("banner")) {
        title = "banner";
      } else if (sanitizedFileName.startsWith("portrait")) {
        title = "portrait";
      }

      setSelectedFiles(sanitizedFile);

      setEditingProduct((prev) => ({
        ...prev,
        title: title, // update title
      }));
    }
  };


  return (
    <div className="laptops-page">
      <div className="laptops-content">
        <h2 className="laptops-page-title">Edit Mobile Offers</h2>
        <div className="laptops-card">
          <div className="laptops-card-header">
            {/* <div className="laptops-card-item">Title</div> */}
            <div className="laptops-card-item">Image(6912 x 3456)</div>
            {/* <div className="laptops-card-item">Description</div> */}
            {/* <div className="laptops-card-item">Offer</div> */}
          </div>

          <div className="ad-product-form">
            <input
              type="file"
              multiple
              name="images"
              onChange={(e) => handleImageChange(e, "medium")} // explicitly pass empty string
              className="ad-form-input"
              accept="image/jpeg, image/png, image/webp" // This allows all image types
            />

            <input
              type="text"
              name="brand_name"
              value={newProduct.medium.brand_name}
              onChange={(e) => handleChange(e, "medium")}
              placeholder="Enter brand name"
              className="laptops-card-input"
            />

            {/* <button onClick={() => handleAddProduct("medium")} className="ad-form-btn">Add</button> */}

            <div className="action-row">
              <button onClick={() => handleAddProduct("medium")} className="add-btn" disabled={uploadStatus.medium.isUploading}>
                Add
              </button>

              {uploadStatus.medium.isUploading && (
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
                        strokeDasharray={`${uploadStatus.medium.progress}, 100`}
                        d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </g>
                    <text x="18" y="20.35" className="percentage-text">
                      {uploadStatus.medium.progress}%
                    </text>
                  </svg>
                </div>
              )}
            </div>


          </div>
        </div>

        <div className="offer-ad-container">


          {products && products.length > 0 ? (
            products.map((product, index) => {
              const firstImage = product.image
                ? product.image.split(",")[0]
                : "";

              //  Only show products with title = 'medium'
              if (product.title !== "medium") {
                return null;
              }

              return (
                <div key={product.id} className="pc-product-container">
                  <div className="pc-product-image-wrapper">
                    {product.image && product.image.length > 0 ? (
                      <div className="pc-image-card">
                        <p className="pc-product-brand">{product.brand_name}</p>
                        <img
                          src={`${ApiUrl}/uploads/offerspage/${firstImage}`}
                          alt="Product"
                          className="pc-product-image"
                          onClick={() => handleImageClick(index, products.map(p => `${ApiUrl}/uploads/offerspage/${p.image}`))}

                        />
                        <button
                          onClick={() => handleEditProduct(product, false, false)}
                          className="pc-edit-image-btn"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <p>No images available</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: "white" }}>No products available.</p>
          )}



          <div className="banner-container">
            <>
              <h4 className="banner-title">Banner image (2000 x 600)</h4>
              <div className="input-groupp">
                {/* Display input fields when there are no images */}
                {/* <p className="banner-title">banner</p> */}
                <input
                  type="text"
                  name="brand_name"
                  value={newProduct.banner.brand_name}
                  onChange={(e) => handleChange(e, "banner")}
                  placeholder="Enter brand name"
                  className="laptops-cardd-input"
                />
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"

                  onChange={(e) => handleImageChange(e, "banner")} // Pass true to indicate it's a banner image
                  className="filee-input" // Unique class for file input
                />
                <div className="action-row">
                  <button onClick={() => handleAddProduct("banner")} className="add-btn" disabled={uploadStatus.banner.isUploading}>
                    Add
                  </button>

                  {uploadStatus.banner.isUploading && (
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
                            strokeDasharray={`${uploadStatus.banner.progress}, 100`}
                            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </g>
                        <text x="18" y="20.35" className="percentage-text">
                          {uploadStatus.banner.progress}%
                        </text>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </>
          </div>

          <div className="images-below-banner" style={{ marginTop: "20px" }}>
            {products.length > 0 && products.some(p => p.title === "banner") ? (
              products
                .filter(p => p.title === "banner")   // ← use title, not filename
                .slice(0, 4)
                .map((product, index) => (
                  <div
                    key={product.id}
                    className="banner-image-display"
                    style={{ position: "relative", marginBottom: "20px" }}
                  >
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      <span style={{ fontWeight: "bold" }}>
                        Banner Image {index + 1}
                      </span>
                    </div>
                    <p style={{ marginTop: "30px" }} className="pc-product-brand">
                      {product.brand_name}
                    </p>
                    <img
                      src={`${ApiUrl}/uploads/offerspage/${product.image}`}
                      alt={`Banner for ${product.brand_name}`}
                      className="banner-image7"
                      onClick={() => handleImageClick(index, products.map(p => `${ApiUrl}/uploads/offerspage/${p.image}`))}

                    />
                    <button
                      onClick={() => handleEditProduct(product, true, false)}
                      className="laptops-edit-btnn"
                    >
                      Edit
                    </button>
                  </div>
                ))
            ) : (
              <p></p>
            )}
          </div>




          <div className="portrait-container">
            <>
              <h4 className="banner-title">Portrait image (4000 x 6000)</h4>
              <div className="input-grouppp">
                {/* Display input fields when there are no images */}
                {/* <p className="banner-title">banner</p> */}
                <input
                  type="text"
                  name="brand_name"
                  value={newProduct.portrait.brand_name}
                  onChange={(e) => handleChange(e, "portrait")}
                  placeholder="Enter product name"
                  className="laptops-cardd-input"
                />
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"

                  onChange={(e) => handleImageChange(e, "portrait")} // Pass true to indicate it's a banner image
                  className="filee-inputt" // Unique class for file input
                />
                {/* <div className="action-row"> */}
                <button onClick={() => handleAddProduct("portrait")} className="laptops-add-button" disabled={uploadStatus.portrait.isUploading}>
                  Add
                </button>

                {uploadStatus.portrait.isUploading && (

                  <div className="circular-progress-wrapper" >
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
                          strokeDasharray={`${uploadStatus.portrait.progress}, 100`}
                          d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </g>
                      <text x="18" y="20.35" className="percentage-text">
                        {uploadStatus.portrait.progress}%
                      </text>
                    </svg>
                  </div>

                )}
              </div>
              {/* </div> */}
            </>
          </div>
        </div>


        <div
          className="images-below-banner"
          style={{
            marginTop: "20px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            marginLeft: "50px",
          }}
        >
          {products.length > 0 && products.some(p => p.title === "portrait") ? (
            products
              .filter(p => p.title === "portrait")  // ← filter by title
              .map((product, index) => (
                <div
                  key={product.id}
                  className="banner-image-display"
                  style={{
                    position: "relative",
                    marginBottom: "20px",
                    marginRight: index % 4 === 3 ? "0" : "20px",
                  }}
                >
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <span style={{ fontWeight: "bold" }}>
                      Portrait Image {index + 1}
                    </span>
                  </div>
                  <p style={{ marginTop: "30px" }} className="pc-product-brand">
                    {product.brand_name}
                  </p>
                  <img
                    src={`${ApiUrl}/uploads/offerspage/${product.image}`}
                    alt={`Portrait for ${product.brand_name}`}
                    className="portrait-imagee"
                    onClick={() => handleImageClick(index, products.map(p => `${ApiUrl}/uploads/offerspage/${p.image}`))}

                  />
                  <button
                    onClick={() => handleEditProduct(product, false, true)}
                    className="laptops-edit-btnn"
                  >
                    Edit
                  </button>
                </div>
              ))
          ) : (
            <p></p>
          )}
        </div>



      </div>

      {isOpen && (
        // Sample usage
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={lightboxImages.map((src) => ({ src }))}
          index={photoIndex}
          on={{ view: ({ index }) => setPhotoIndex(index) }}
          carousel={{ finite: true }}
        />
      )}

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
            onChange={(e) => handleFileChange(e)}
            className="adminmodal-input"
            accept="image/jpeg, image/png, image/webp"
          />

          <input
            type="text"
            name="brand_name"
            value={editingProduct.brand_name}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                brand_name: e.target.value,
              })
            }
            placeholder="Enter brand name"
            className="adminmodal-input"
          />

          <button onClick={handleUpdateProduct} className="adminmodal-update-btn">
            Update
          </button>
          <button onClick={handleDeleteProduct} className="adminmodal-cancel-btn">
            Delete
          </button>
        </Modal>
      )}


    </div>
  );
};

export default MobileAd;
