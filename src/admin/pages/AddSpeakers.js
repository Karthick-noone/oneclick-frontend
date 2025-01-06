import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/AddComputers.css"; // Ensure this CSS file is created for styling
import { ApiUrl } from "./../../components/ApiUrl";
import { FaEdit, FaTrash, FaEye, FaTimes } from "react-icons/fa"; // Import icons
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick"; // Import Slider from react-slick
import { FaInfoCircle, FaClone } from "react-icons/fa"; // Ensure to import any icons you need
import CouponEditPopup from "./CouponEditPopup";
import EditCouponModal from "./EditCouponModal"; // Import the modal component


import leftarrow from './img/left.png';
import rightarrow from './img/right.png';
// Set up the modal root element
Modal.setAppElement("#root");

const Speakers = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: [],
    features: "",
    price: "",
    label: "",
    subtitle: "",
    deliverycharge: "",
    category: "",
    coupon: "",
    coupon_expiry_date: "",
    actual_price: "", // Add actual price field
  });
  const [editingProduct, setEditingProduct] = useState(null); // To handle the product being edited
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal open/close state
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [currentImage, setCurrentImage] = useState('');
  const [productId, setProductId] = useState(null); // State to hold the product ID
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file
  const [imageIndex, setImageIndex] = useState(null);
  const [newImages, setNewImages] = useState({});
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isViewingCoupons, setIsViewingCoupons] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [isEditingCoupon, setIsEditingCoupon] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [productName, setproductName] = useState(null);
  const [selectedProductPrice, setSelectedProductPrice] = useState(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false); // Renamed state
  const [offerStartTime, setOfferStartTime] = useState("");
  const [offerEndTime, setOfferEndTime] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Handle opening modal and passing productId
  const handleOpenOfferModal = (id) => { // Renamed function
    setProductId(id);
    setIsOfferModalOpen(true);
  };

  const handleCloseOfferModal = () => { // Renamed function
    setIsOfferModalOpen(false);
    setProductId(null); // Clear the productId when closing
  };

  useEffect(() => {
    if (isOfferModalOpen && productId) {
      setIsEditMode(true);
      fetchOfferData(productId);
    } else {
      setIsEditMode(false);
    }
  }, [isOfferModalOpen, productId]);

  const fetchOfferData = async (id) => {
    try {
      const response = await axios.get(`${ApiUrl}/api/products/fetchoffer/${id}`);
      const { offer_start_time, offer_end_time, offer_price } = response.data;
  
      // The dates are already in the correct format from the backend
      setOfferStartTime(offer_start_time || "");
      setOfferEndTime(offer_end_time || "");
      setOfferPrice(offer_price || "");
    } catch (error) {
      console.error("Error fetching offer data", error);
    }
  };
  
  const handleChangePrice = (e) => {
    const value = e.target.value;
  
    // Regex to prevent starting with 0 (except for "0." as a decimal input), and only allow numbers and up to 2 decimal places.
    const regex = /^[1-9][0-9]*$/; // Only digits from 1 to 9 and no leading zeros
  
    // Allow empty string for clearing input
    if (regex.test(value) || value === "") {
      setOfferPrice(value);
    } 
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!offerStartTime || !offerEndTime || !offerPrice) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all fields",
        text: "Ensure all fields are filled out correctly before submitting.",
      });
      return;
    } 
  
    
    const offerData = {
      offer_start_time: offerStartTime,
      offer_end_time: offerEndTime,
      offer_price: offerPrice,
    };
  
    try {
      if (isEditMode) {
        await axios.put(`${ApiUrl}/api/products/updateoffer/${productId}`, offerData);
        Swal.fire('Success!', 'Offer updated successfully!', 'success');
      } else {
        await axios.post(`${ApiUrl}/api/products/addoffer`, { ...offerData, productId });
        Swal.fire('Success!', 'Offer added successfully!', 'success');
      }
      handleCloseOfferModal(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error submitting offer", error);
      Swal.fire('Error!', 'There was an error processing your request. Please try again.', 'error');
    }
  };
  
  // Handle deletion of offer with confirmation
  const handleDelete = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${ApiUrl}/api/products/deleteoffer/${productId}`);
          Swal.fire('Deleted!', 'Offer has been deleted.', 'success');
          handleCloseOfferModal(); // Close the modal after deletion
        } catch (error) {
          console.error("Error deleting offer", error);
          Swal.fire('Error!', 'There was an error deleting the offer. Please try again.', 'error');
        }
      }
    });
  };
  const openPopup = (id, productName, prodPrice) => {
    // Set states
    setSelectedProductId(id);
    setSelectedProductPrice(prodPrice);
    setproductName(productName);
    setIsPopupOpen(true);
  
    // Log the parameters passed
    console.log("Product ID passed:", id);
    console.log("Product Name passed:", productName);
    console.log("Product Price passed:", prodPrice);
  
    // Use a timeout to log updated state after React processes the setState
    setTimeout(() => {
      console.log("Selected Product ID (state):", selectedProductId);
      console.log("Selected Product Price (state):", selectedProductPrice);
      console.log("Product Name (state):", productName);
      console.log("Popup open status (state):", isPopupOpen);
    }, 100);
  };
  

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProductId(null);
  };

  const handlePopupToggle = () => {
    setPopupVisible(!isPopupVisible);
  };

  const fetchCoupons = async (productId, productName, productPrice) => {
    console.log(`Fetching coupons for product ID: ${productId}`); // Log when fetching starts

    try {
      const response = await axios.get(`${ApiUrl}/coupons/${productId}`); // Create this endpoint
      if (response.status === 200) {
        console.log(
          `Successfully fetched coupons for product ID: ${productId}`,
          response.data.coupons
        ); // Log successful response
        setCoupons(response.data.coupons); // Assuming your response has this structure
        setIsViewingCoupons(true); // Set to true to display the coupons
        setproductName(productName);
        setSelectedProductPrice(productPrice); // Set the product price for use
      }
    } catch (error) {
      console.error("Error fetching coupons:", error); // Log any error
    }
  };

  const handleCouponUpdated = () => {
    console.log("Coupon updated successfully!");
  };
 const handleFileChange = (productId, event) => {
  const files = Array.from(event.target.files); // Convert FileList to array
  const resizedFiles = [];

  files.forEach((file) => {
    console.log(`Selected file for product ID ${productId}:`, file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        console.log("Original image dimensions:", img.width, img.height);

        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500; // Define max width
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        console.log("Resizing image to:", canvas.width, canvas.height);

        // Compress and convert to blob
        canvas.toBlob(
          (blob) => {
            console.log("Resized image size (in KB):", (blob.size / 1024).toFixed(2));

            if (blob.size / 1024 < 50) {
              console.log("Image is under 50 KB, ready for upload.");
              resizedFiles.push(blob); // Add resized image to array
            } else {
              console.log("Image still above 50 KB, applying further compression.");
              canvas.toBlob(
                (compressedBlob) => {
                  console.log("Compressed image size (in KB):", (compressedBlob.size / 1024).toFixed(2));
                  resizedFiles.push(compressedBlob);

                  // Update state after all files processed
                  if (resizedFiles.length === files.length) {
                    setNewImages((prev) => ({
                      ...prev,
                      [productId]: resizedFiles,
                    }));
                  }
                },
                'image/jpeg',
                0.7
              );
            }

            // Update state after all files processed
            if (resizedFiles.length === files.length) {
              setNewImages((prev) => ({
                ...prev,
                [productId]: resizedFiles,
              }));
            }
          },
          'image/jpeg',
          0.8
        );
      };
    };
  });
};


  const handleUploadImages = async (productId) => {
    if (!newImages[productId] || newImages[productId].length === 0) {
      // If no new images, show an alert and exit
      Swal.fire({
        icon: "warning",
        title: "No Images Selected",
        text: "Please select images to upload before proceeding.",
        confirmButtonText: "OK",
      });
      return;
    }

    const formData = new FormData();
    newImages[productId].forEach((file) => {
      formData.append("images", file); // Append each image file
    });
    formData.append("productId", productId); // Append the product ID

    console.log(`Uploading images for product ID ${productId}...`); // Log upload attempt

    try {
      const response = await fetch(`${ApiUrl}/uploadspeakersimages`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Images uploaded successfully for product ID:", productId); // Log success
        Swal.fire({
          icon: "success",
          title: "Upload Successful",
          text: "Images uploaded successfully!",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload();
        });
      } else {
        console.error("Error uploading images for product ID:", productId); // Log error
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "Error uploading images. Please try again.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Error",
        text: "An error occurred while uploading images. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const openModal = (productId, imageIndex) => {
    setProductId(productId);
    setImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageIndex(null);
    setProductId(null);
    setSelectedFile(null);
  };

  const settings = {
    dots: false, // Show dots
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Show arrows
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);
  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/adminfetchspeakers`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // // Validation logic
    // if (name === "name" || name === "label") {
    //   // Allow only alphabetic characters and spaces for name and label, or allow empty string
    //   const isValid = value === "" || /^[A-Za-z\s]+$/.test(value);
    //   if (!isValid) {
    //     // Optionally show an error message if the input is invalid
    //     Swal.fire({
    //       icon: "warning",
    //       title: "Validation Error",
    //       text: "Name and Label should only contain letters and spaces.",
    //     });
    //     return; // Prevent updating state if invalid
    //   }
    // }

    if (name === "price" || name === "actual_price" || name === "deliverycharge") {
      // Allow only numeric characters for price and actual_price
      const isNumeric = value === "" || /^[0-9]*\.?[0-9]*$/.test(value);
      if (!isNumeric) {
        // Optionally show an error message if the input is invalid
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Price should only contain numbers.",
        });
        return; // Prevent updating state if invalid
      }
    }

    // If validation passes, update the newProduct state
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected image for upload:", file);
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          console.log("Original image dimensions:", img.width, img.height);
  
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;  // Define max width
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
  
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          console.log("Resizing image to:", canvas.width, canvas.height);
  
          // Compress image
          canvas.toBlob(
            (blob) => {
              console.log("Resized image size (in KB):", (blob.size / 1024).toFixed(2));
              if (blob.size / 1024 < 50) {
                console.log("Image is under 50 KB, ready for upload.");
                setSelectedFile(blob); // Update state with resized image
              } else {
                console.log("Image still above 50 KB, applying further compression.");
                // Further compress if above 50 KB
                canvas.toBlob(
                  (compressedBlob) => {
                    console.log("Compressed image size (in KB):", (compressedBlob.size / 1024).toFixed(2));
                    setSelectedFile(compressedBlob);
                  },
                  'image/jpeg',
                  0.7
                );
              }
            },
            'image/jpeg',
            0.8
          );
        };
      };
    }
  };
  

  // Your existing handleImageUpdate function
  const handleImageUpdate = () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);

      fetch(`${ApiUrl}/updatespeakers/image/${productId}?index=${imageIndex}`, {
        method: "PUT",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            // Use SweetAlert2 to display success message
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: data.message,
              confirmButtonText: "OK",
            }).then(() => {
              window.location.reload();
            });
          }
        })
        .catch((error) => {
          console.error("Error updating image:", error);
          // Optionally display an error alert
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "There was an error updating the image. Please try again.",
            confirmButtonText: "OK",
          });
        });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please select a file to upload.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteImage = (productId, imageIndex) => {
    // Confirm deletion from the user
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Make the DELETE request to the backend API
        fetch(`${ApiUrl}/deletespeakers/image/${productId}?index=${imageIndex}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message) {
              // Show success message
              Swal.fire("Image Deleted!", data.message, "success").then(() => {
                window.location.reload();
              });
              // Refresh the images or update the UI accordingly
              // Optionally, you can trigger a re-fetch of the images or update the state
            }
          })
          .catch((error) => {
            console.error("Error deleting image:", error);
            Swal.fire(
              "Error!",
              "There was an error deleting the image. Please try again.",
              "error"
            );
          });
      }
    });
  };

  // const handleImageChange = (e) => {
  //   setNewProduct({
  //     ...newProduct,
  //     image: e.target.files[0],
  //   });
  // };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const resizedFiles = [];
  
    files.forEach((file) => {
      console.log("Selected image for upload:", file);
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          console.log("Original image dimensions:", img.width, img.height);
  
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;  // Define max width
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
  
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
          console.log("Resizing image to:", canvas.width, canvas.height);
  
          canvas.toBlob(
            (blob) => {
              console.log("Resized image size (in KB):", (blob.size / 1024).toFixed(2));
              if (blob.size / 1024 < 50) {
                console.log("Image is under 50 KB, ready for upload.");
                resizedFiles.push(blob); // Add resized image to the array
              } else {
                console.log("Image still above 50 KB, applying further compression.");
                // Further compress if above 50 KB
                canvas.toBlob(
                  (compressedBlob) => {
                    console.log("Compressed image size (in KB):", (compressedBlob.size / 1024).toFixed(2));
                    resizedFiles.push(compressedBlob);
                    // Update state after processing all files
                    if (resizedFiles.length === files.length) {
                      setNewProduct((prevProduct) => ({
                        ...prevProduct,
                        images: resizedFiles,
                      }));
                    }
                  },
                  'image/jpeg',
                  0.7
                );
              }
  
              // Update state after processing all files
              if (resizedFiles.length === files.length) {
                setNewProduct((prevProduct) => ({
                  ...prevProduct,
                  images: resizedFiles,
                }));
              }
            },
            'image/jpeg',
            0.8
          );
        };
      };
    });
  };
  
  const handleAddProduct = async () => {
    if (newProduct.label && newProduct.label.length > 15) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Label cannot exceed 30 characters.",
      });
      return;
    }

    // Ensure label is not just spaces if provided
    if (newProduct.label && !newProduct.label.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Label cannot be just spaces.",
      });
      return;
    }

    // Basic validation checks
    if (!newProduct.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Product name is required.",
      });
      return;
    }
    if (!newProduct.features.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Product features are required.",
      });
      return;
    }
    // if (!newProduct.category.trim()) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Validation Error",
    //     text: "Product category is required.",
    //   });
    //   return;
    // }
    if (
      !newProduct.price ||
      isNaN(newProduct.price) ||
      Number(newProduct.price) <= 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "A valid product price is required.",
      });
      return;
    }
    if (
      !newProduct.actual_price ||
      isNaN(newProduct.actual_price) ||
      Number(newProduct.actual_price) <= 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "A valid actual price is required.",
      });
      return;
    }
    if (!newProduct.images || newProduct.images.length === 0) {
      // Check for images array length
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "At least one product image is required.",
      });
      return;
    }

    // New validation check: actual_price should be greater than price
    if (Number(newProduct.actual_price) <= Number(newProduct.price)) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Actual price must be greater than the product price.",
      });
      return;
    }

    // Validate coupon code and extract numeric part
    const couponCode = newProduct.coupon; // Fetching the coupon code
    const couponExpiryDate = newProduct.coupon_expiry_date; // Assuming expiry date is stored here

    // Check if either coupon code or coupon expiry date is provided
    // if (
    //   (couponCode && !couponExpiryDate) ||
    //   (!couponCode && couponExpiryDate)
    // ) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Validation Error",
    //     text: "Both coupon code and coupon expiry date must be provided together or clear both.",
    //   });
    //   return;
    // }

    // Check if coupon code is provided and not just spaces
    // if (couponCode && !couponCode.trim()) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Validation Error",
    //     text: "Coupon code cannot be just spaces.",
    //   });
    //   return;
    // }

    // // Extract numeric part from coupon code
    // const couponValueMatch = couponCode.match(/\d+/); // Regex to find the first numeric part in the coupon code
    // const couponValue = couponValueMatch ? Number(couponValueMatch[0]) : 0; // Get the number or default to 0 if not found

    // // Ensure the extracted coupon value is less than the product price
    // if (couponValue >= Number(newProduct.price)) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Validation Error",
    //     text: "Coupon discount must be less than the product price.",
    //   });
    //   return;
    // }

    // // Check if the coupon code contains at least one letter and one digit
    // // const hasLetter = /[a-zA-Z]/.test(couponCode);
    // if (couponCode && couponExpiryDate) {
    //   const hasDigit = /\d/.test(couponCode);

    //   if (!hasDigit) {
    //     Swal.fire({
    //       icon: "warning",
    //       title: "Validation Error",
    //       text: "Coupon code must contain price value like OFFER599.",
    //     });
    //     return;
    //   }
    // }
    // Fetch user role from localStorage
    const userRole = localStorage.getItem("userRole"); // Assuming user role is stored as "admin" or "user"

    // Set product status based on user role
    const productStatus = userRole === "Admin" ? "approved" : "unapproved";

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("features", newProduct.features);
    formData.append("price", newProduct.price);
    formData.append("actual_price", newProduct.actual_price);
    formData.append("label", newProduct.label);
    formData.append("subtitle", newProduct.subtitle);
    formData.append("deliverycharge", newProduct.deliverycharge);
    // formData.append("coupon_expiry_date", newProduct.coupon_expiry_date);
    // formData.append("coupon", newProduct.coupon);
    formData.append("category", newProduct.category); // Add category here
    formData.append("productStatus", productStatus); // Add category here
    
    // Append each image file to the FormData
    newProduct.images.forEach((image) => {
      formData.append("images", image); // Use 'images' for multiple file upload
    });

    try {
      await axios.post(`${ApiUrl}/speakers`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: "The product has been added successfully!",
      });

      // Fetch updated list of products
      const response = await axios.get(`${ApiUrl}/adminfetchspeakers`);
      setProducts(response.data);
      setNewProduct({
        name: "",
        images: [], // Reset images
        features: "",
        price: "",
        actual_price: "",
        label: "",
        subtitle: "",
        deliverycharge: "",
        // coupon_expiry_date: "",
        // coupon: "",
        category: "", // Clear the category here
      });

      document.querySelector('input[type="file"]').value = ""; // Reset file input
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error adding the product. Please try again.",
      });
    }
  };

  const handleEditProduct = (product) => {
    let formattedDate = "";
    if (product.coupon_expiry_date) {
      const expiryDate = new Date(product.coupon_expiry_date);

      if (!isNaN(expiryDate)) {
        // Format the date manually to YYYY-MM-DD without timezone conversion
        const year = expiryDate.getFullYear();
        const month = String(expiryDate.getMonth() + 1).padStart(2, "0"); // Add 1 because months are 0-indexed
        const day = String(expiryDate.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
      }
    }

    setEditingProduct({
      id: product.id,
      name: product.prod_name,
      image: null, // reset image so the user has to select a new one if desired
      features: product.prod_features,
      price: product.prod_price,
      actual_price: product.actual_price,
      label: product.offer_label,
      subtitle: product.subtitle,
      deliverycharge: product.deliverycharge,
      status: product.status,
      // coupon_expiry_date: formattedDate,
      // coupon: product.coupon,
      category: product.category,
      productStatus: product.productStatus,
    });
    setModalIsOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (editingProduct.label && !editingProduct.label.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Label cannot be just spaces.Remove space",
      });
      return;
    }

    // if (editingProduct.label && /\d/.test(editingProduct.label)) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Validation Error",
    //     text: "Label cannot contain numeric values.",
    //   });
    //   return;
    // }

    if (editingProduct.label && editingProduct.label.length > 15) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Label cannot exceed 30 characters.",
      });
      return;
    }

    // Ensure label is not just spaces if provided
    if (editingProduct.label && !editingProduct.label.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Label cannot be just spaces.",
      });
      return;
    }

    if (Number(editingProduct.actual_price) <= Number(editingProduct.price)) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Actual price must be greater than the product price.",
      });
      return;
    }

    // Validation checks
    if (!editingProduct.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Product name is required.",
      });
      return;
    }
    if (!editingProduct.features.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Product features are required.",
      });
      return;
    }
    // if (!editingProduct.category.trim()) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Validation Error",
    //     text: "Product category is required.",
    //   });
    //   return;
    // }
    if (
      !editingProduct.price ||
      isNaN(editingProduct.price) ||
      Number(editingProduct.price) <= 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "A valid product price is required.",
      });
      return;
    }
    if (
      !editingProduct.actual_price ||
      isNaN(editingProduct.actual_price) ||
      Number(editingProduct.actual_price) <= 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "A valid product price is required.",
      });
      return;
    }

    console.log("Editing Product State:", editingProduct);

    // Check if id is set correctly
    if (!editingProduct.id) {
      console.error("Error: Product ID is missing.");
      return;
    }

    // // Validate coupon code and extract numeric part
    // const couponCode = editingProduct.coupon
    //   ? editingProduct.coupon.trim()
    //   : ""; // Trim coupon code to avoid spaces
    // const couponExpiryDate =
    //   editingProduct.coupon_expiry_date &&
    //   editingProduct.coupon_expiry_date !== "0000-00-00"
    //     ? editingProduct.coupon_expiry_date.trim()
    //     : ""; // Treat "0000-00-00" as empty

    // // Check if either coupon code or coupon expiry date is provided
    // if (
    //   (couponCode && !couponExpiryDate) ||
    //   (!couponCode && couponExpiryDate)
    // ) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Validation Error",
    //     text: "Both coupon code and coupon expiry date must be provided together or clear both.",
    //   });
    //   return;
    // }

    // // Check if coupon code is provided and not just spaces
    // if (couponCode && !couponCode.trim()) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Validation Error",
    //     text: "Coupon code cannot be just spaces.",
    //   });
    //   return;
    // }

    // if (couponCode && couponExpiryDate) {
    //   const hasDigit = /\d/.test(couponCode);

    //   if (!hasDigit) {
    //     Swal.fire({
    //       icon: "warning",
    //       title: "Validation Error",
    //       text: "Coupon code must contain price value like OFFER599.",
    //     });
    //     return;
    //   }
    // }

    // // Extract numeric part from coupon code
    // const couponValueMatch = couponCode.match(/\d+/); // Regex to find the first numeric part in the coupon code
    // const couponValue = couponValueMatch ? Number(couponValueMatch[0]) : 0; // Get the number or default to 0 if not found

    // // Ensure the extracted coupon value is less than the product price
    // if (couponValue >= Number(editingProduct.price)) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Validation Error",
    //     text: "Coupon discount must be less than the product price.",
    //   });
    //   return;
    // }

    // Log the product details that will be sent to the backend
    console.log("Updating product with details:", {
      name: editingProduct.name,
      features: editingProduct.features,
      price: editingProduct.price,
      actual_price: editingProduct.actual_price,
      label: editingProduct.label,
      status: editingProduct.status,
      coupon_expiry_date: editingProduct.coupon_expiry_date,
      coupon: editingProduct.coupon,
      image: editingProduct.image ? editingProduct.image.name : "No new image",
    });

    const formData = new FormData();
    formData.append("name", editingProduct.name);
    formData.append("features", editingProduct.features);
    formData.append("price", editingProduct.price);
    formData.append("actual_price", editingProduct.actual_price);
    formData.append("status", editingProduct.status);
    formData.append("label", editingProduct.label);
    formData.append("subtitle", editingProduct.subtitle);
    formData.append("deliverycharge", editingProduct.deliverycharge);
    // formData.append("coupon_expiry_date", editingProduct.coupon_expiry_date);
    // formData.append("coupon", editingProduct.coupon);
    formData.append("category", editingProduct.category);
    formData.append("productStatus", editingProduct.productStatus);
    if (editingProduct.image) {
      formData.append("image", editingProduct.image);
    }

    try {
      // Log the request URL
      console.log(
        "Sending update request to:",
        `${ApiUrl}/updatespeakers/${editingProduct.id}`
      );

      // Send the update request
      const response = await axios.put(
        `${ApiUrl}/updatespeakers/${editingProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Log the response from the server
      console.log("Update response:", response.data);

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Product Updated",
        text: "The product has been updated successfully!",
      });

      // Fetch updated list of products
      const fetchResponse = await axios.get(`${ApiUrl}/adminfetchspeakers`);
      setProducts(fetchResponse.data);

      // Log successful fetch
      console.log("Updated products list:", fetchResponse.data);

      // Close the modal and reset the state
      setEditingProduct(null);
      setModalIsOpen(false);
    } catch (error) {
      // Log any errors that occur
      console.error("Error updating product:", error);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the product. Please try again.",
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    console.log("Attempting to delete product with ID:", id);

    // Show confirmation dialog
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    // Check if the user confirmed the deletion
    if (confirmResult.isConfirmed) {
      try {
        // Log before sending delete request
        console.log("Sending delete request to:", `${ApiUrl}/deletespeakers/${id}`);

        // Perform the delete operation
        const deleteResponse = await axios.delete(`${ApiUrl}/deletespeakers/${id}`);

        // Log response from delete request
        console.log("Delete response:", deleteResponse.data);

        // Fetch updated list of products
        const response = await axios.get(`${ApiUrl}/adminfetchspeakers`);
        setProducts(response.data);

        // Log the updated product list
        console.log("Updated products list after deletion:", response.data);

        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The product has been deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting product:", error);

        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "There was an error deleting the product. Please try again.",
        });
      }
    } else {
      console.log("Product deletion canceled by user.");
    }
  };

  const handleEditExpiry = (couponId) => {
    const couponToEdit = coupons.find(
      (coupon) => coupon.coupon_id === couponId
    );
    setSelectedCoupon(couponToEdit);
    setIsEditingCoupon(true);
    setSelectedProductPrice(selectedProductPrice); // Pass the price from state

  };

  const overlayStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay for emphasis
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: "1000",
  };

  const modalStyle = {
    padding: "30px",
    width: "400px",
    borderRadius: "15px",
    background: "#ffffff",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
    position: "relative",
    top: "25%", // Positioning from the top
    left: "25%", // Positioning from the left
    transform: "translate(-50%, -50%)", // Centering the modal
  };
  const titleStyle = {
    fontSize: "26px",
    marginBottom: "25px",
    color: "#444",
    textAlign: "center",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    border: "2px solid #007bff",
    borderRadius: "5px",
    fontSize: "16px",
  };

  const buttonStyle = {
    padding: "12px 20px",
    backgroundColor: "#28a745",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#218838", // Darker shade on hover
  };

  const handleAddPipe = () => {
    const textarea = document.querySelector(".laptops-card-input1"); // Get the textarea element by class
    const cursorPosition = textarea.selectionStart; // Get the cursor position

    // Insert the pipe at the cursor position
    const updatedFeatures = [
      newProduct.features.slice(0, cursorPosition),
      "|",
      newProduct.features.slice(cursorPosition),
    ].join("");

    // Update the features with the inserted pipe
    setNewProduct({
      ...newProduct,
      features: updatedFeatures,
    });

    // Return focus back to the textarea after insertion
    textarea.focus();
  };

  const handleUpdatePipe = () => {
    const textarea = document.querySelector(".adminmodal-input1"); // Get the textarea element by class
    const cursorPosition = textarea.selectionStart; // Get the cursor position

    // Insert the pipe at the cursor position
    const updatedFeatures = [
      editingProduct.features.slice(0, cursorPosition),
      "|",
      editingProduct.features.slice(cursorPosition),
    ].join("");

    // Update the features with the inserted pipe
    setEditingProduct({
      ...editingProduct,
      features: updatedFeatures,
    });

    // Return focus back to the textarea after insertion
    textarea.focus();
  };

  // Get today's date and format it as YYYY-MM-DD
  const today = new Date();
  const minDate = today.toISOString().split("T")[0]; // Format to YYYY-MM-DD

   // Calculate max date (30 days from today)
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD

  const handleDeleteCoupon = async (couponId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this coupon?"
    );
    if (!confirmation) return;

    try {
      const response = await axios.delete(
        `${ApiUrl}/deletecoupons/${couponId}`
      );
      if (response.status === 200) {
        alert("Coupon deleted successfully");
        setCoupons(coupons.filter((coupon) => coupon.coupon_id !== couponId));
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Failed to delete the coupon");
    }
  };
  const role = localStorage.getItem("userRole"); // Assuming user role is stored as "admin" or "user"


  const handleCopyProduct = async (productId) => {
    try {
      const response = await fetch(`${ApiUrl}/api/copy-product/${productId}`, {
        method: 'POST',
      });
  
      const data = await response.json();
      if (response.ok) {
        // Success alert using SweetAlert
        Swal.fire({
          title: 'Success!',
          text: `Product copied successfully! New product ID: ${data.newProductId}`,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // After the alert closes, call the fetchProducts function
         window.location.reload();
        });
      } else {
        // Error alert using SweetAlert
        Swal.fire({
          title: 'Error!',
          text: data.message,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error copying product:', error);
      // Generic error alert using SweetAlert
      Swal.fire({
        title: 'Oops!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };
  return (
    <div className="laptops-page">
      <div className="laptops-content">
        <h2 className="laptops-page-title">Add Speakers</h2>
        <div className="laptops-card">
          <div className="laptops-card-header">
            <div className="laptops-card-item">Product Name</div>
            <div className="laptops-card-item">Product Image</div>
            <div className="laptops-card-item">M.R.P Price</div>
            <div className="laptops-card-item">Selling Price</div>          
            <div className="laptops-card-item">Label</div>
            <div className="laptops-card-item">Subtitle</div>
            <div className="laptops-card-item">Delivery charge</div>
            {/* <div className="laptops-card-item">Category</div> */}
          </div>

          <div className="laptops-card-row">
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="laptops-card-input"
            />
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="laptops-card-inputt"
              accept="image/*" // This allows all image types
            />

            <input
              type="text"
              name="actual_price"
              value={newProduct.actual_price}
              onChange={handleChange}
              placeholder="Enter M.R.P price"
              className="laptops-card-input"
            />
            <input
              type="text"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
              placeholder="Enter selling price"
              className="laptops-card-input"
            />

<input
              type="text"
              name="label" // New input for product label
              value={newProduct.label} // Ensure to add label to the newProduct state
              onChange={handleChange}
              placeholder="(e.g., Best Price)"
              className="laptops-card-input" // Use the same style class
            />

            <input
              type="text"
              name="subtitle" // New input for product subtitle
              value={newProduct.subtitle} // Ensure to add subtitle to the newProduct state
              onChange={handleChange}
              placeholder="Enter subtitle"
              className="laptops-card-input" // Use the same style class
            />

            <input
              type="text"
              name="deliverycharge" // New input for product deliverycharge
              value={newProduct.deliverycharge} // Ensure to add deliverycharge to the newProduct state
              onChange={handleChange}
              placeholder="Enter Deliverycharge "
              className="laptops-card-input" // Use the same style class
            />

          

             {/* {isPopupVisible && (
              <div className="info-popup">
                <div className="popup-content">
                  <button className="close-button" onClick={handlePopupToggle}>
                    X
                  </button>
                  <p>
                    Enter features in the label field using '|' to separate
                    them. Example:
                    <br />
                    <strong>
                      Processor 13th Generation | Operating System Windows 11 |
                      Graphic Card Xe Graphics | Memory 16 GB (SODIMM) | Storage
                      512 GB
                    </strong>
                    <br />
                    Click the `|` icon to quickly add the '|' character to your
                    features.
                  </p>
                </div>
              </div>
            )}
            {/* <select
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
              <option value="Speakers">Speaker</option>
              <option value="CCTV">CCTV</option>
              <option value="TV">TV</option>
              <option value="Watch">Watch</option>
              <option value="ComputerAccessories">Computer Accessories</option>
              <option value="MobileAccessories">Mobile Accessories</option>
              <option value="PrinterAccessories">Printer Accessories</option>
              <option value="CCTVAccessories">CCTV Accessories</option>
            </select> */}
          </div>

          {/* Separate Features Field */}
          <div className="laptops-card-header">
            {/* <div className="feature-1 laptops-card-item ">Coupon Code</div>
            <div className="feature-1 laptops-card-item ">
              Coupon Expiry date
            </div> */}
            <div className="feature-1 laptops-card-item ">Product Features</div>
          </div>

          <div className="features-input-container">
            {/* <input
              type="text"
              name="coupon"
              value={newProduct.coupon}
              onChange={handleChange}
              placeholder="Enter coupon code"
              className="laptops-card-input2"
            />
            <input
              type="date"
              name="coupon_expiry_date"
              value={newProduct.coupon_expiry_date}
              onChange={handleChange}
              placeholder="Enter expiry date"
              className="laptops-card-input2"
              min={minDate} // Set min date to today
              max={maxDateStr} // Set max date to 30 days from today
            /> */}
            <textarea
              name="features"
              value={newProduct.features}
              onChange={handleChange}
              placeholder="Features"
              className="laptops-card-input1"
              rows="1"
            ></textarea>
           {/* <div className="pipe-icon" onClick={handleAddPipe}>
              <p title="Click here for separate the key value pair(eg.RAM | 8gb)" className="pipe-character">|</p>
            </div>
            <div className="info-icon" onClick={handlePopupToggle}>
              <FaInfoCircle className="info-icon-text" />
            </div> */}
          </div>

          {/* Add Button */}
          <button onClick={handleAddProduct} className="laptops-add-btn">
            Add
          </button>
        </div>

        <div className="laptops-products-list">
          {products.length > 0 &&
            products.map((product, index) => (
              <div className="laptops-product-card">
                {product.offer_label && (
                  <div className="product-label">{product.offer_label}</div>
                )}

                <div className="laptops-product-image">
                  <div className="slider-container">
                    {" "}
                    {/* Wrap the slider in a container for relative positioning */}
                    <Slider
                      {...{
                        ...settings,
                        arrows: product.prod_img.length > 1, // Display arrows only if more than one image
                      }}
                    >
                      {product.prod_img.map((img, imgIndex) => (
                        <div key={imgIndex} className="image-wrapper">
                          <img
                            src={`${ApiUrl}/uploads/speakers/${img}`}
                            alt={product.prod_name}
                            className="laptops-product-image"
                          />
                          <div className="image-actions">
                            <FaEdit
                              onClick={() => openModal(product.id, imgIndex)} // Pass product ID and image index
                              className="action-icon"
                            />
                            {product.prod_img.length > 1 && ( // Display trash icon only if there is more than one image
                              <FaTrash
                                onClick={() =>
                                  handleDeleteImage(product.id, imgIndex)
                                }
                                className="action-icon"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
                <div className="laptops-product-details">
                  <h3 className="laptops-product-name">{product.prod_name} {product.productStatus === 'unapproved' ? <span style={{color:'red'}}>({product.productStatus})</span> : null}</h3>                  <h3 className="laptops-product-subtitle">{product.subtitle}</h3>
                  <p className="laptops-product-features">
                  <span>{product.prod_features}</span>

                  {/* <ul className="product-feature-list">
  {product.prod_features
    .split("|")
    .reduce((acc, feature, index, array) => {
      if (index % 2 === 0) {
        acc.push([feature.trim(), array[index + 1]?.trim() || ""]);
      }
      return acc;
    }, [])
    .map((pair, index) => (
      <li key={index}>
        <span className="feature-key">{pair[0]}</span>
        <span className="feature-value">{pair[1]}</span>
      </li>
    ))}
</ul> */}

                  </p>
                  <p className="laptops-product-actual-price">
                    M.R.P Price:{" "}
                    <span className="actual-price">
                      ₹{product.actual_price}
                    </span>
                  </p>
                  <p className="laptops-product-pricee">
                    Selling Price: ₹{product.prod_price}
                  </p>
                  <p className="laptops-product-deliverycharge">
                   Delivery charge: ₹{product.deliverycharge}
                  </p>

                  <p className="laptops-product-coupon">
                    Coupon Code:
                    <span
  onClick={() => openPopup(product.prod_id, product.prod_name, product.prod_price)}
  style={{ cursor: "pointer" }}
                    >
                      <FaEdit className="faedit" title="Edit Coupon" />
                    </span>
                    <span
                                             onClick={() => fetchCoupons(product.prod_id, product.prod_name, product.prod_price)}

                      style={{ cursor: "pointer" }}
                    >
                      <FaEye className="faedit" title="View Coupon" />
                    </span>
                  </p>

                  <CouponEditPopup
  isOpen={isPopupOpen}
  onClose={closePopup}
  productId={selectedProductId}   // Correctly passed from state
  prodPrice={selectedProductPrice} // Correctly passed from state
  onCouponUpdated={handleCouponUpdated}
/>

                  {isViewingCoupons && (
                    <div className="pop-overlay">
                      <div className="pop-content">
                        <button
                          onClick={() => setIsViewingCoupons(false)}
                          className="fatimes"
                        >
                          <FaTimes color="black" size={20} />
                        </button>
                        <h4 className="coupon-title">
                          Coupons for {productName}
                        </h4>
                        {coupons.length > 0 ? (
                          <ul className="coupons-list">
                            {coupons.map((coupon, index) => (
                              <li
                                key={coupon.coupon_id}
                                className="coupon-item"
                              >
                                <span className="serial-number">
                                  {index + 1}.{" "}
                                </span>{" "}
                                {/* Serial number */}
                               <span className="coupon-code">
                                  {coupon.coupon_code}
                                </span>{" "}
                                - 

                                <span className="coupon-code">
                                  {coupon.discount_value}
                                </span>{" "}

                                -
                                <span className="expiry-date">
                                  Expires on:{" "}
                                  {new Date(
                                    coupon.expiry_date
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                <FaEdit
                                    className="edit-icon"
                                    title="Edit Expiry Date"
                                    onClick={() =>
                                      handleEditExpiry(coupon.coupon_id)
                                    }
                                  />
                                  <FaTrash
                                    className="delete-icon"
                                    title="Delete Coupon"
                                    onClick={() =>
                                      handleDeleteCoupon(coupon.coupon_id)
                                    }
                                    style={{
                                      marginLeft: "10px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No coupons available for this product.</p>
                        )}
                      </div>
                    </div>
                  )}

<div className="frequently-buy" style={{marginBottom:'10px'}}>
                  <span className="frequently-buy-label">
                   Make a copy of this product
                  </span>
                  <FaClone  
                 onClick={() => handleCopyProduct(product.id)}
                className="frequently-buy-icon"
                /> 
                </div>

                  <EditCouponModal
                    isOpen={isEditingCoupon}
                    onClose={() => setIsEditingCoupon(false)}
                    coupon={selectedCoupon}
                    productId={selectedProductId}
                    productPrice={selectedProductPrice}    // Selected product price
                    onCouponUpdated={() => {
                      // Refresh coupon list or update state as necessary
                      // e.g., fetchCoupons();
                    }}
                  />
                </div>
                {/* <div>
                Label: {product.label}
                </div> */}
                
<div
  onClick={() => handleOpenOfferModal(product.id)} // Pass the productId as needed
  className="offer-edit-btn"
>
  <span className="offer-edit-text">Edit Price Offer</span>
  <FaEdit className="offer-edit-icon" />

</div>

{/* Modal rendering */}
{isOfferModalOpen && (
  <div className="offer-modal-overlay">
    <div className="offer-modal-content">
      <button onClick={handleCloseOfferModal} className="offer-close-btn">
        &times; {/* Use the "×" symbol for close */}
      </button>
      <h3 className="offer-modal-title">{isEditMode ? "Edit Price Offer" : "Add Price Offer"}</h3>
      <form onSubmit={handleSubmit} className="offer-form">
        <label className="offer-label">Offer Start Time</label>
        <input
          type="datetime-local"
          value={offerStartTime}
          onChange={(e) => setOfferStartTime(e.target.value)}
          required
          min={minDate}
          className="offer-input"
        />
        <label className="offer-label">Offer End Time</label>
        <input
          type="datetime-local"
          value={offerEndTime}
          onChange={(e) => setOfferEndTime(e.target.value)}
          required
          min={minDate}
          className="offer-input"
        />
        <label className="offer-label">Offer Price</label>
        <input
          type="number"
          value={offerPrice}
          onChange={handleChangePrice} // Custom handler for price
          required
          className="offer-input"
        />
        <button type="submit" className="offer-submit-btn">
          {isEditMode ? "Update Offer" : "Add Offer"}
        </button>
      </form>

      {isEditMode && (
        <button onClick={handleDelete} className="offer-delete-btn">
          Delete Offer
        </button>
      )}
    </div>
  </div>
)}


                <div className="upload-container">
                  Upload more images
                  <input
                    style={{ marginTop: "10px" }}
                    className="file-input"
                    multiple
                    type="file"
                    onChange={(e) => handleFileChange(product.id, e)}
                  />
                  <button
                    className="upload-button"
                    onClick={() => handleUploadImages(product.id)}
                  >
                    Upload Images
                  </button>
                </div>
                <div className="laptops-product-actions">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="laptops-action-btn"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="laptops-action-btn"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* Modal for Image Upload */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{ overlay: overlayStyle, content: modalStyle }} // Apply inline styles
      >
        <h2 style={titleStyle}>Update this image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload} // Keep this function for handling file selection
          style={inputStyle}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => handleImageUpdate(productId)} // Use the product ID here
            style={buttonStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                buttonHoverStyle.backgroundColor)
            } // Hover effect
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                buttonStyle.backgroundColor)
            } // Reset color
          >
            Update
          </button>

          <button
            onClick={closeModal}
            style={buttonStyle}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                buttonHoverStyle.backgroundColor)
            } // Hover effect
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                buttonStyle.backgroundColor)
            } // Reset color
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Modal for editing a product */}
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
            <h2>Edit Product</h2>
            <button
              onClick={() => setModalIsOpen(false)}
              className="adminmodal-close-btn"
            >
              &times; {/* or use a close icon */}
            </button>
          </div>
          <div className="feature-item">

<label className="feature-label">Product Name</label>
          <input
            type="text"
            name="name"
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            placeholder="Enter product name"
            className="adminmodal-input"
          />
</div>
          <div className="feature-item">
          {/* Features Textarea with Icons */}
          <div className="features-input-container">

<label className="feature-label">Description</label>
            <textarea
              name="features"
              value={editingProduct.features}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  features: e.target.value,
                })
              }
              placeholder="Enter product features"
              className="adminmodal-input1"
              rows="4" // Adjust as needed
            ></textarea>
            
            {/* <div className="icons-container">
              <div className="pipe-icon" onClick={handleUpdatePipe}>
                <p className="pipe-character">|</p>
              </div>
              <div className="info-icon" onClick={handlePopupToggle}>
                <FaInfoCircle className="info-icon-text" />
              </div>
            </div> */}
          </div>
          </div>
          <div className="feature-item">

<label className="feature-label">M.R.P Price</label>
          <input
            type="text"
            name="actual_price"
            value={editingProduct.actual_price}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                actual_price: e.target.value,
              })
            }
            placeholder="Enter actual price"
            className="adminmodal-input"
          />
          </div>
<div className="feature-item">

<label className="feature-label">Selling Price</label>
          <input
            type="text"
            name="price"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, price: e.target.value })
            }
            placeholder="Enter product price"
            className="adminmodal-input"
          />
          </div>
<div className="feature-item">

<label className="feature-label">Offer Label</label>
          <input
            type="text"
            name="label"
            value={editingProduct.label}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                label: e.target.value,
              })
            }
            placeholder="Enter label"
            className="adminmodal-input"
          />
          </div>
<div className="feature-item">

<label className="feature-label">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={editingProduct.subtitle}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                subtitle: e.target.value,
              })
            }
            placeholder="Enter subtitle"
            className="adminmodal-input"
          />
          </div>
<div className="feature-item">

<label className="feature-label">Delivery Charge</label>
          <input
            type="text"
            name="deliverycharge"
            value={editingProduct.deliverycharge}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                deliverycharge: e.target.value,
              })
            }
            placeholder="Enter deliverycharge"
            className="adminmodal-input"
          />
          </div>
          {/* <input
            type="text"
            name="coupon"
            value={editingProduct.coupon}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                coupon: e.target.value,
              })
            }
            placeholder="Enter coupon code"
            className="adminmodal-input"
          />
          <input
            type="date"
            name="coupon_expiry_date"
            value={editingProduct.coupon_expiry_date}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                coupon_expiry_date: e.target.value,
              })
            }
            placeholder="Enter expiry date"
            className="adminmodal-input"
            min={minDate} 
        max={maxDateStr}
          /> */}
<div className="feature-item">

<label className="feature-label">In Stock or Out Of Stock</label>
          <select
            name="status"
            value={editingProduct.status}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, status: e.target.value })
            }
            className="adminmodal-input"
          >
            <option value="available">In Stock</option>
            <option value="unavailable">Out Of Stock</option>
          </select>
</div>
          <div className="feature-item">

<label className="feature-label">Approve or Unapprove</label>


<select
           disabled={role === 'Staff'}

    name="productStatus"
    value={editingProduct.productStatus}
    onChange={(e) =>
      setEditingProduct({ ...editingProduct, productStatus: e.target.value })
    }
    className="adminmodal-input"
  >
    <option value="approved">Approve</option>
    <option value="unapproved">UnApprove</option>
  </select>

</div>

          <button
            onClick={handleUpdateProduct}
            className="adminmodal-update-btn"
          >
            Update
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="adminmodal-cancel-btn"
          >
            Cancel
          </button>
        </Modal>
      )}
    </div>
  );
};

// Custom next arrow component
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        right: "10px",
        zIndex: 10,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)", // Add box shadow
        borderRadius: "50%", // Round shape
        width: "30px", // Width for clickable area
        height: "30px", // Height for clickable area
        cursor: "pointer", // Cursor pointer
      }}
      onClick={onClick}
    >
      <img src={rightarrow} alt="Next" width="15px" height="15px" />
    </div>
  );
};
const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      style={{
        ...style,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        left: "10px",
        zIndex: 10,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // Box shadow applied here
        backgroundColor: "white",
        borderRadius: "50%", // Round shape
        width: "30px", // Width for clickable area
        height: "30px", // Height for clickable area
        cursor: "pointer", // Cursor pointer
      }}
      onClick={onClick}
    >
      <img src={leftarrow} alt="Previous" width="15px" height="15px" />
    </div>
  );
};


export default Speakers;
