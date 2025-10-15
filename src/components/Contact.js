import React, { useState, useEffect, useCallback } from "react";
// import Header2 from "./Header2";
import Footer from "./footer";
import { ApiUrl } from "./ApiUrl";
import Swal from "sweetalert2";
import "./css/PreviousEnquiries.css";
import axios from "axios";
import BlackTick from './img/check.png'
import BlueTick from './img/double-check.png'
import EnquiryIcon from './img/conversation.png'

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
    number: ""  // Added for number input
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
    number: ""  // Added for number input
  });

  const [showModal, setShowModal] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  const userNumber = localStorage.getItem("contact_number");
  const userName = localStorage.getItem("username");


  const fetchEnquiries = useCallback(async () => {
    try {
      console.log("[fetchEnquiries] Fetching enquiries for:", userNumber);
      setLoading(true);

      const response = await axios.get(`${ApiUrl}/api/enquiries/${userNumber}`);
      const fetchedEnquiries = response.data.enquiries || [];

      console.log("[fetchEnquiries] Fetched enquiries:", fetchedEnquiries);
      setEnquiries(fetchedEnquiries); // Just set data
    } catch (err) {
      console.error("[fetchEnquiries] Error fetching enquiries:", err);
    } finally {
      setLoading(false);
    }
  }, [userNumber]); //  Add dependencies


  const handleEnquiryIconClick = () => {
    console.log("[handleEnquiryIconClick] Opening modal...");
    setShowModal(true);
  };

  useEffect(() => {
    const cached = localStorage.getItem("userEnquiries");
    if (cached) {
      setEnquiries(JSON.parse(cached));
      console.log("[Cache Load] Enquiries loaded from cache");
    }

    // Fetch fresh data anyway
    if (userNumber) {
      console.log("[Page Load] Fetching fresh enquiries for:", userNumber);
      fetchEnquiries();
    }
  }, [userNumber, fetchEnquiries]); //  Added fetchEnquiries



  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      // Validate number input
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      if (sanitizedValue.length > 0 && !(sanitizedValue[0] >= "6" && sanitizedValue[0] <= "9")) {
        setFormData({ ...formData, [name]: sanitizedValue.slice(1) });
      } else {
        setFormData({ ...formData, [name]: sanitizedValue });
      }
    } else if (name === "firstName" || name === "lastName") {
      // Validate name input (allow only alphabetic characters and spaces)
      const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData({ ...formData, [name]: sanitizedValue });

      // Error handling if the name is empty
      if (!sanitizedValue) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${name === "firstName" ? "First" : "Last"} Name is required`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    } else if (!formData.email.endsWith('.com')) {
      newErrors.email = "Enter a valid email address ending with .com.";
      isValid = false;
    }

    // Subject validation
    if (!formData.subject) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    // Message validation
    if (!formData.message) {
      newErrors.message = "Message is required";
      isValid = false;
    }

    // Contact number validation
    if (!userNumber) {
      newErrors.number = "Contact Number is required";
      isValid = false;
    }

    if (formData.number && formData.number.length !== 10) {
      newErrors.number = "Number field must have exactly 10 digits.";
      isValid = false;
    }

    // Set errors and apply timeout to clear them
    setErrors(newErrors);

    // Timeout for error messages to clear after 3 seconds
    setTimeout(() => {
      setErrors({});
    }, 3000); // Clear errors after 3 seconds

    return isValid;
  };



  const handleSubmit = (e) => {
    e.preventDefault();


    // //  Check if contact number exists
    // if (!userNumber) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Contact Number Missing",
    //     text: "You must have a contact number saved to send a message.",
    //   });
    //   return;
    // }

    //  Check send count in localStorage
    const messageData = JSON.parse(localStorage.getItem("messageData")) || {};
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const userMessageKey = `${userNumber}_${today}`;

    // Get current count
    const currentCount = messageData[userMessageKey] || 0;

    if (currentCount >= 2) {
      Swal.fire({
        icon: "warning",
        title: "Limit Reached",
        text: "You can only send 2 messages per day.",
      });
      return; //  Stop form submission
    }

    //  Form validation
    const isValid = validateForm();
    if (!isValid) {
      return; // Stop submission if validation fails
    }

    setIsSubmitting(true);

    // Combine firstName and lastName into a single name field
    const { firstName, lastName, email, subject, message } = formData;
    const formDataToSend = {
      name: `${firstName} ${lastName}`, // Combine names
      email: email,
      subject: subject,
      message: message,
      number: userNumber,
    };

    fetch(`${ApiUrl}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataToSend), // Send correct data
    })
      .then((response) => {
        if (response.ok) {
          //  Update count in localStorage
          messageData[userMessageKey] = currentCount + 1;
          localStorage.setItem("messageData", JSON.stringify(messageData));

          //  Reset form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            message: "",
            number: "",
          });

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Message sent successfully! We will get back to you soon.",
          });
        } else {
          return response.text().then((text) => {
            if (response.status === 429) {
              Swal.fire({
                icon: "error",
                title: "Limit Reached",
                text: "You can only send 2 messages per day.",
              });
            }
            else {
              throw new Error(
                `Failed to send message. Status: ${response.status}, Message: ${text}`
              );
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to send message. Please try again later.",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };



  return (
    <div>
      {/* <Header2 /> */}
      <div style={styles.container}>
        <div style={styles.imageContainer}>
          <h2 style={styles.title}>Get in Touch</h2>
          <p style={styles.paragraph}>
            <strong>Opening Hours:</strong>
            <br />
            Mon - Sat: 10 am - 9 pm
            <br />
            <br />
            <strong>Email:</strong>
            <br />
            enquiryoneclick@gmail.com
            <br />
            <br />
            <strong>Store Location:</strong>
            <br />
            MARKET ROAD, MARTHANDAM,
            <br />
            KANYAKUMARI - 629165
          </p>
          <div style={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.0045738569324!2d77.2232186!3d8.3023422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04554d46344113%3A0xbda68de23a7d7261!2sONE%20CLICK%20TECHNOLOGIES!5e0!3m2!1sen!2sin!4v1730793178125!5m2!1sen!2sin"
              style={styles.mapIframe}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps location of One Click Technologies"

            ></iframe>
            <iframe 
             style={styles.mapIframe}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps location of One Click Technologies"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d823.7860709161048!2d77.22245466948718!3d8.302361126533542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04554d46344113%3A0xbda68de23a7d7261!2sOne%20Click%20Technologies!5e1!3m2!1sen!2sin!4v1753952009476!5m2!1sen!2sin" width="400" height="300" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>

        <div style={styles.textContainer}>
          <h3 style={styles.subtitle}>We're here to help!<span style={{ marginLeft: "20px", color: userNumber ? "#04bb04" : "#ff6b6b" }}>{userNumber ? `Welcome ${userName}!` : "(Please log in to send your message)"}</span></h3>
          {enquiries && enquiries.length > 0 && (

            <p className="enquiry-title">
              Previous Enquiries{" "}
              <span
                style={{ cursor: "pointer", color: "#007bff" }}
                onClick={handleEnquiryIconClick}
                title="View Previous Enquiries"
              >
                <img src={EnquiryIcon} width={'30px'} style={{ marginLeft: '8px' }} alt="Enquiry"/>
              </span>
            </p>
          )}

          <p style={styles.paragraph}>
            Fill out the form with any query on your mind, and we'll get back to
            you as soon as possible.
          </p>
          {showModal && (
            <div className="enquiry-modal-overlay">
              <div className="enquiry-modal-content">
                <h3>Previous Enquiries</h3>
                <button className="close-button" onClick={() => setShowModal(false)}>
                  ✖
                </button>
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : enquiries.length > 0 ? (
                  <ul className="enquiry-list">
                    {enquiries.map((item, index) => (
                      <li key={index} className="enquiry-item">
                        <div className="enquiry-header">
                          <p className="enquiry-number">{index + 1}</p>
                          <strong className="enquiry-subject">{item.subject}</strong>
                          <span className="enquiry-date">{formatDate(item.created_at)}</span>
                        </div>

                        <div className="enquiry-body">
                          <p className="enquiry-message">{item.message}</p>
                          <div className="enquiry-footer">
                            {item.isRead ? (
                              <img
                                src={BlueTick}
                                className="read-icon"
                                title="Seen"
                                width="18px"
                                alt="Seen"
                              />
                            ) : (
                              <img
                                src={BlackTick}
                                className="read-icon"
                                title="Unseen"
                                width="18px"
                                alt="Unseen"
                              />
                            )}
                          </div>
                        </div>
                      </li>

                    ))}
                  </ul>
                ) : (
                  <p className="no-enquiries">No previous enquiries found.</p>
                )}
              </div>
            </div>
          )}
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={styles.inputLine}
                  className="staff-input"

                />
                {errors.firstName && <span style={styles.error}>{errors.firstName}</span>}
              </div>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={styles.inputLine}
                  className="staff-input"

                />
                {errors.lastName && <span style={styles.error}>{errors.lastName}</span>}
              </div>
            </div>
            <div style={styles.formGroup}>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.inputLine}
                  className="staff-input"

                />
                {errors.email && <span style={styles.error}>{errors.email}</span>}
              </div>
              <div style={styles.inputWrapper}>
                <input
                  type="tel"
                  name="number"
                  placeholder="Number (10 digits)"
                  value={userNumber}
                  onChange={handleChange}
                  style={styles.inputLine}
                  className="staff-input"
                  disabled

                />
                {errors.number && <span style={styles.error}>{errors.number}</span>}
              </div>

            </div>
            <div style={styles.formGroup}>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={styles.inputLine}
                  className="staff-input"

                />
                {errors.subject && <span style={styles.error}>{errors.subject}</span>}
              </div>
            </div>
            <div style={styles.formGroup}>
              <div style={styles.inputWrapper}>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  style={styles.textarea}
                  className="staff-input"
                  disabled={!userNumber}

                ></textarea>
                {errors.message && <span style={styles.error}>{errors.message}</span>}
              </div>
            </div>
            <center>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  fontSize: !userName && hovered ? "0.9rem" : "1rem", // Change font size
                  cursor: !userName ? "not-allowed" : "pointer", // Show not-allowed cursor
                  opacity: !userName ? 0.7 : 1, // Slightly faded if no user
                }}
                title={userNumber ? "Submit the form" : "Please log in to send your message."}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={(e) => {
                  if (!userName) {
                    e.preventDefault(); // Block form submission
                    e.stopPropagation(); // Prevent further propagation
                    console.log("Please login first!");
                    return false;
                  }
                }}
              >
                {isSubmitting
                  ? "Submitting..."
                  : !userName && hovered
                    ? "Please login"
                    : "Submit"}
              </button>


            </center>


          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
// const modalStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   backgroundColor: "rgba(0,0,0,0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const modalContentStyle = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "8px",
//   width: "400px",
//   maxHeight: "80vh",
//   overflowY: "auto",
//   position: "relative",
// };

// const closeButtonStyle = {
//   position: "absolute",
//   top: "10px",
//   right: "10px",
//   border: "none",
//   background: "transparent",
//   fontSize: "18px",
//   cursor: "pointer",
// };

const styles = {

  mapContainer: {
    position: 'relative',
    paddingBottom: '57.95%', // Aspect ratio 16:9
    width: '100%',
    maxWidth: '500px', // Limits max width for larger screens
    height: 0,
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    margin: '0 auto', // Center alignment
  },
  mapIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "40px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    flexWrap: "wrap",
  },
  imageContainer: {
    flex: "1",
    marginRight: "30px",
    marginBottom: "20px",
  },
  textContainer: {
    flex: "1.5",
    textAlign: "left",
  },
  title: {
    fontSize: "2em",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    textAlign: "left",

  },
  subtitle: {
    fontSize: "1.5em",
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "10px",
    color: "#555",

  },
  paragraph: {
    fontSize: "1em",
    lineHeight: "1.6",
    color: "#555",
    textAlign: "left",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    fontFamily: 'calibri'

  },
  formGroup: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "15px",
  },
  inputWrapper: {
    flex: "1",
    marginRight: "15px",
  },
  inputLine: {
    width: "100%",
    padding: "10px",
    fontSize: "1em",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    marginBottom: "10px",
    fontFamily: 'calibri'

  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "10px",
    fontSize: "1em",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    marginBottom: "10px",
    resize: "vertical",
    fontFamily: 'calibri'

  },
  button: {
    padding: '12px 30px',
    border: 'none',
    borderRadius: '50px',
    backgroundColor: '#007BFF', // Blue background
    color: '#fff',
    cursor: "pointer",
    fontSize: '1.1em',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s, transform 0.2s', // Smooth transitions
    marginTop: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
    outline: 'none',
    width: '200px',
  },
  buttonHover: {
    backgroundColor: '#0056b3', // Darker blue on hover
    transform: 'scale(1.05)', // Slightly enlarge on hover
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  error: {
    color: "red",
    fontSize: "0.875em",
  },
};

export default Contact;