import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ApiUrl } from "../../components/ApiUrl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import './css/AddComputers.css';
import "./css/ComputerAdpage.css";
// import { FaInfoCircle } from "react-icons/fa";
// import offerAd from './img/design.png';

Modal.setAppElement("#root");

const ComputersAd = () => {
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
  const [bannerKeyword, setBannerKeyword] = useState(""); // Define state for bannerKeyword
  const [isBannerEdit, setIsBannerEdit] = useState(false); // Track if the edit is for the banner

  const [potraitImage, setPotraitImage] = useState(null);
  const [potraitImageName, setPotraitImageName] = useState(null);
  const [potraitKeyword, setPotraitKeyword] = useState(""); // Define state for potraitKeyword
  const [isPotraitEdit, setIsPotraitEdit] = useState(false); // Track if the edit is for the banner

  const navigate = useNavigate();

  // Fetch products and the banner image
  useEffect(() => {
    const fetchProducts = async () => {
      console.log("Starting to fetch products...");
      try {
        const response = await axios.get(`${ApiUrl}/fetchcomputersofferspage`);
        console.log("Fetched products:", response.data);
        setProducts(response.data);

        // Extract the banner image name from the fetched products
        const bannerImage = response.data.find(
          (product) => product.image && product.image.startsWith("banner") // Adjust property name if needed
        );
        // Extract the banner image name from the fetched products
        const potraitImage = response.data.find(
          (product) => product.image && product.image.startsWith("portrait") // Adjust property name if needed
        );

        if (bannerImage) {
          console.log("Banner image found:", bannerImage.image);
          setBannerImageName(bannerImage.image);
        } else if (potraitImage) {
          console.log("potrait image found:", potraitImage.image);
          setPotraitImageName(potraitImage.image);
        } else {
          console.log("No images found");
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

  const compressImage = (file, maxSizeKB = 500) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compress = (quality) => {
            return new Promise((resolveInner) => {
              canvas.toBlob(
                (blob) => {
                  if (blob.size / 1024 <= maxSizeKB) {
                    resolveInner(blob);
                  } else {
                    // Retry with lower quality
                    resolveInner(compress(quality - 0.1));
                  }
                },
                "image/jpeg",
                quality
              );
            });
          };

          compress(0.8).then(resolve);
        };
      };
    });
  };

  const handleImageChange = (e, isBanner = false) => {
    const files = Array.from(e.target.files);
    const validFiles = [];

    files.forEach((file) => {
      const fileName = file.name;
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const sanitizedFile = new File([file], sanitizedFileName, {
        type: file.type,
      });

      const validExtensions = ["jpg", "jpeg", "png", "jfif"];
      const fileExtension = sanitizedFile.name.split(".").pop().toLowerCase();

      if (validExtensions.includes(fileExtension)) {
        const reader = new FileReader();
        reader.readAsDataURL(sanitizedFile);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800; // Maintain width
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Compression function
            const compressImage = (minQuality, maxQuality) => {
              return new Promise((resolve) => {
                const tryCompression = (quality) => {
                  canvas.toBlob(
                    (blob) => {
                      if (blob) {
                        const sizeInKB = blob.size / 1024;
                        console.log(
                          `Compressed image at quality ${quality} has size: ${sizeInKB.toFixed(
                            2
                          )} KB`
                        );

                        if (sizeInKB > 500 && quality > minQuality) {
                          tryCompression(quality - 0.05);
                        } else if (sizeInKB < 500 && quality < maxQuality) {
                          tryCompression(quality + 0.02);
                        } else {
                          resolve(blob);
                        }
                      }
                    },
                    "image/jpeg",
                    quality
                  );
                };

                // Start compression attempt only if size is above 500 KB
                if (sanitizedFile.size / 1024 > 500) {
                  tryCompression(maxQuality);
                } else {
                  resolve(sanitizedFile);
                }
              });
            };

            // Compressing with quality range between 0.5 and 0.95
            compressImage(0.5, 0.95).then((compressedBlob) => {
              const finalFileName = isBanner
                ? `banner_${sanitizedFileName}`
                : sanitizedFileName;
              const finalFile = new File([compressedBlob], finalFileName, {
                type: sanitizedFile.type,
              });
              validFiles.push(finalFile);
              setNewProduct((prev) => ({
                ...prev,
                images: [...prev.images, ...validFiles],
              }));
            });
          };
        };
      } else {
        console.error(
          `${sanitizedFileName} is not a valid image format (jpg, jpeg, png, jfif)`
        );
      }
    });
  };

  const handleImageChange2 = (e, isPortrait = false) => {
    const files = Array.from(e.target.files);
    const validFiles = [];

    files.forEach((file) => {
      const fileName = file.name;
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const sanitizedFile = new File([file], sanitizedFileName, {
        type: file.type,
      });

      const validExtensions = ["jpg", "jpeg", "png", "jfif"];
      const fileExtension = sanitizedFile.name.split(".").pop().toLowerCase();

      if (validExtensions.includes(fileExtension)) {
        const reader = new FileReader();
        reader.readAsDataURL(sanitizedFile);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 800; // Maintain width
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Compression function
            const compressImage = (minQuality, maxQuality) => {
              return new Promise((resolve) => {
                const tryCompression = (quality) => {
                  canvas.toBlob(
                    (blob) => {
                      if (blob) {
                        const sizeInKB = blob.size / 1024;
                        console.log(
                          `Compressed image at quality ${quality} has size: ${sizeInKB.toFixed(
                            2
                          )} KB`
                        );

                        if (sizeInKB > 500 && quality > minQuality) {
                          tryCompression(quality - 0.05);
                        } else if (sizeInKB < 500 && quality < maxQuality) {
                          tryCompression(quality + 0.02);
                        } else {
                          resolve(blob);
                        }
                      }
                    },
                    "image/jpeg",
                    quality
                  );
                };

                // Start compression attempt only if size is above 500 KB
                if (sanitizedFile.size / 1024 > 500) {
                  tryCompression(maxQuality);
                } else {
                  resolve(sanitizedFile);
                }
              });
            };

            // Compressing with quality range between 0.5 and 0.95
            compressImage(0.5, 0.95).then((compressedBlob) => {
              const finalFileName = isPortrait
                ? `portrait_${sanitizedFileName}`
                : sanitizedFileName;
              const finalFile = new File([compressedBlob], finalFileName, {
                type: sanitizedFile.type,
              });
              validFiles.push(finalFile);
              setNewProduct((prev) => ({
                ...prev,
                images: [...prev.images, ...validFiles],
              }));
            });
          };
        };
      } else {
        console.error(
          `${sanitizedFileName} is not a valid image format (jpg, jpeg, png, jfif)`
        );
      }
    });
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
      const renamedBannerImage = new File([bannerImage], bannerImageName, {
        type: bannerImage.type,
      });
      formData.append("images", renamedBannerImage);
    } else if (potraitImage) {
      const potraitImageName = `portrait_${potraitImage.name}`; // Prefix the potrait image
      const renamedpotraitImage = new File([potraitImage], potraitImageName, {
        type: potraitImage.type,
      });
      formData.append("images", renamedpotraitImage);
    }

    // Append other images without prefix
    newProduct.images.forEach((image) => {
      const originalImageName = image.name; // Keep the original name
      const imageToUpload = new File([image], originalImageName, {
        type: image.type,
      });
      formData.append("images", imageToUpload);
    });

    try {
      await axios.post(`${ApiUrl}/computersofferspage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "The product has been added successfully!",
      })
        .then(() => {
          return axios.get(`${ApiUrl}/fetchcomputersofferspage`);
        })
        .then((productsResponse) => {
          setProducts(productsResponse.data);
          setNewProduct({
            title: "",
            description: "",
            brand_name: "",
            images: [],
          });
        });

      // Reset file input
      document.querySelector('input[type="file"]').value = "";

      const fileInput = document.querySelector(".filee-input"); // Select the input by its class
      if (fileInput) {
        fileInput.value = ""; // Clear the file input
      }

      const fileInput2 = document.querySelector(".filee-inputt"); // Select the input by its class
      if (fileInput2) {
        fileInput2.value = ""; // Clear the file input
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
    // First, handle the image update
    if (selectedFiles) {
      let imageNamePrefix = "";

      // Check if it's a normal, banner, or portrait image
      if (isBannerEdit) {
        imageNamePrefix = `banner_${selectedFiles.name}`; // Prefix for banner images
      } else if (isPotraitEdit) {
        imageNamePrefix = `portrait_${selectedFiles.name}`; // Prefix for portrait images
      } else {
        imageNamePrefix = selectedFiles.name; // No prefix for normal images
      }

      const imageFormData = new FormData();
      imageFormData.append("image", new File([selectedFiles], imageNamePrefix)); // Create a new File object with the prefixed name

      // Update the image
      await axios.put(
        `${ApiUrl}/updatecomputersofferspageimage/${editingProduct.id}`,
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Image updated successfully!");
    }

    // Proceed with updating the product data
    await axios.put(
      `${ApiUrl}/computersupdateofferspage/${editingProduct.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // If both operations are successful, show the success alert
    Swal.fire({
      icon: "success",
      title: "Product and Image Updated",
      text: "The product and image have been updated successfully!",
    })
      .then(() => {
        return axios.get(`${ApiUrl}/fetchcomputersofferspage`);
      })
      .then((fetchResponse) => {
        console.log("Updated product list:", fetchResponse.data); // Log the updated product list
        setProducts(fetchResponse.data);
        setEditingProduct(null);
        setModalIsOpen(false);
      });
  } catch (error) {
    console.error("Error updating product or image:", error); // Log any errors
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "There was an error updating the product and/or image. Please try again.",
    });
  }
};

  
  
  
  

  const handleEditProduct = (product, isBanner = false, isPotrait = false) => {
    console.log("Editing product:", product); // Log the product being edited
  
    setEditingProduct({
      id: product.id,
      brand_name: product.brand_name,
      images: [], // Reset images, the user has to select new ones if desired
    });
  
    // Set the flags based on whether it's a banner or portrait image
    setIsBannerEdit(isBanner);
    setIsPotraitEdit(isPotrait); // Set the flag for portrait image
  
    setModalIsOpen(true);
  };
  
  
  const handleEditImage = (product, index) => {
    console.log(
      `Editing image for product ID: ${product.id} at index: ${index}`
    );

    setEditingProduct(product);
    setEditingImageIndex(index);
    setModalIsOpen2(true);
  };

  const handleSecondEditIcon = (product, index, bannerKeyword) => {
    console.log(
      `Second editing option for product ID: ${product.id} at index: ${index} with banner keyword: ${bannerKeyword}`
    );

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
            `${ApiUrl}/api/deletecomputersofferspage/${editingProduct.id}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            Swal.fire(
              "Deleted!",
              "Your product has been deleted.",
              "success"
            ).then(() => {
              // Optionally close the modal
              setModalIsOpen(false); // Close modal

              // Refresh the page after a successful deletion
              window.location.reload(); // Refresh the page
            });
          } else {
            Swal.fire("Error", "Failed to delete product", "error");
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire(
            "Error",
            "An error occurred while deleting the product",
            "error"
          );
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
        await axios.put(
          `${ApiUrl}/deletecomputersofferspageimage/${product.id}`,
          {
            images: updatedImages.join(","),
          }
        );

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
        icon: "error",
        title: "No File Selected",
        text: "Please select an image to update.",
      });
      return;
    }

    const formData = new FormData();
    const imageNamePrefix = isBannerEdit
      ? `${bannerKeyword}${selectedFiles.name}`
      : selectedFiles.name; // Use the banner keyword if applicable
    formData.append("image", new File([selectedFiles], imageNamePrefix)); // Create a new File object with the prefixed name

    try {
      const response = await axios.put(
        `${ApiUrl}/updatecomputersofferspageimage/${editingProduct.id}`, // Update the endpoint to only include the product ID
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Image Updated",
        text: "The image has been updated successfully!",
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
      console.error("Error updating image:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the image. Please try again.",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const sanitizedFile = new File([file], sanitizedFileName, {
        type: file.type,
      });

      const validExtensions = ["jpg", "jpeg", "png", "jfif"];
      const fileExtension = sanitizedFile.name.split(".").pop().toLowerCase();

      if (validExtensions.includes(fileExtension)) {
        compressImage(sanitizedFile).then((compressedBlob) => {
          const finalFile = new File([compressedBlob], sanitizedFileName, {
            type: sanitizedFile.type,
          });
          setSelectedFiles(finalFile);
        });
      } else {
        console.error(
          `${sanitizedFileName} is not a valid image format (jpg, jpeg, png, jfif)`
        );
      }
    }
  };

  return (
    <div className="laptops-page">
      <div className="laptops-content">
        <h2 className="laptops-page-title">Edit Computers Offers</h2>
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
              onChange={handleImageChange}
              className="ad-form-input"
              accept="image/jpg, image/png" // This allows all image types
            />

            <input
              type="text"
              name="brand_name"
              value={newProduct.brand_name}
              onChange={handleChange}
              placeholder="Enter brand name"
              className="laptops-card-input"
            />

            <button onClick={handleAddProduct} className="ad-form-btn">
              Add
            </button>

            
          </div>
        </div>

        <div className="offer-ad-container">


        {products && products.length > 0 ? (
  products.map((product, index) => {
    // Check if the first image name starts with 'banner' or 'potrait'
    const firstImage = product.image
      ? product.image.split(",")[0]
      : "";
    if (
      firstImage.startsWith("banner") ||
      firstImage.startsWith("portrait")
    ) {
      return null; // Skip rendering this product
    }

    return (
      <div key={product.id} className="pc-product-container">
        {/* Image Wrapper for the Product Image */}
        <div className="pc-product-image-wrapper">
          {/* Product Image */}
          {product.image && product.image.length > 0 ? (
            <div className="pc-image-card">
              {/* Wrapper for positioning */}
              <p className="pc-product-brand">{product.brand_name}</p>
              <img
                src={`${ApiUrl}/uploads/offerspage/${firstImage}`} // Displaying the first product image
                alt="Product"
                className="pc-product-image"
              />
              {/* Edit Button */}
              <button
                onClick={() => handleEditProduct(product, index)}
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
              </div>
            </>
          </div>

          <div className="images-below-banner" style={{ marginTop: "20px" }}>
  {products.length > 0 &&
  products.some(
    (product) => product.image && product.image.startsWith("banner")
  ) ? (
    // Filter for products with banner images and map to display them
    products
      .filter(
        (product) =>
          product.image && product.image.startsWith("banner")
      ) // Filter for banner images
      .slice(0, 4) // Limit to the first 4 images
      .map((product, index) => (
        <div
          key={index}
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
          </p>{" "}
          {/* Display brand name */}
          <img
            src={`${ApiUrl}/uploads/offerspage/${product.image}`} // Construct the image URL for the product
            alt={`Banner for ${product.brand_name}`} // Alt text for accessibility
            className="banner-image7" // Class for styling
          />
          <button
  onClick={() => handleEditProduct(product, true)} // Pass 'true' for banner images
  className="laptops-edit-btnn"
>
  Edit
</button>

        </div>
      ))
  ) : (
    <p></p> // Fallback message when no banner images are present
  )}
</div>



          <div className="potrait-container">
            <>
              <h4 className="banner-title">Potrait image (4000 x 6000)</h4>
              <div className="input-grouppp">
                {/* Display input fields when there are no images */}
                {/* <p className="banner-title">banner</p> */}
                <input
                  type="text"
                  name="brand_name"
                  value={newProduct.brand_name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="laptops-cardd-input"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange2(e, true)} // Pass true to indicate it's a banner image
                  className="filee-inputt" // Unique class for file input
                />
                <button onClick={handleAddProduct} className="laptops-add-btn">
                  Add
                </button>
              </div>
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
  {products.length > 0 &&
  products.some(
    (product) => product.image && product.image.startsWith("portrait")
  ) ? (
    // Filter for products with portrait images and map to display them
    products
      .filter(
        (product) =>
          product.image && product.image.startsWith("portrait")
      ) // Filter for portrait images
      .map((product, index) => (
        <div
          key={index}
          className="banner-image-display"
          style={{
            position: "relative",
            marginBottom: "20px",
            marginRight: index % 4 === 3 ? "0" : "20px",
          }}
        >
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <span style={{ fontWeight: "bold" }}>
              Potrait Image {index + 1}
            </span>
          </div>
          <p style={{ marginTop: "30px" }} className="pc-product-brand">
            {product.brand_name}
          </p>{" "}

          <img
            src={`${ApiUrl}/uploads/offerspage/${product.image}`} // Construct the image URL for the product
            alt={`Potrait for ${product.brand_name}`} // Alt text for accessibility
            className="potrait-imagee" // Class for styling
          />

          <button
            onClick={() => handleEditProduct(product, false, true)} // Pass 'true' for portrait images
            className="laptops-edit-btnn"
          >
            Edit
          </button>
        </div>
      ))
  ) : (
    <p></p> // Fallback message when no portrait images are present
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
            <h2>Edit Image and Brand Name</h2>
            <button
              onClick={() => setModalIsOpen(false)}
              className="adminmodal-close-btn"
            >
              {/* &times;  */}
            </button>
          </div>

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
              setEditingProduct({
                ...editingProduct,
                brand_name: e.target.value,
              })
            }
            placeholder="Enter brand_name"
            className="adminmodal-input"
          />
         

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

     
    </div>
  );
};

export default ComputersAd;
