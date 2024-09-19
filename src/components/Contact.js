import React, { useState } from "react";
import Header2 from "./Header2";
import Footer from "./footer";
import { ApiUrl } from "./ApiUrl";
import Swal from "sweetalert2";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update form data
    if (name === "number") {
      // Validate number input
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      if (
        sanitizedValue.length > 0 &&
        !(sanitizedValue[0] >= "6" && sanitizedValue[0] <= "9")
      ) {
        setFormData({ ...formData, [name]: sanitizedValue.slice(1) });
      } else {
        setFormData({ ...formData, [name]: sanitizedValue });
      }
    } else if (name === "name") {
      // Validate name input
      const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  
    // Clear error message for the specific field if there's a value
    if (value) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ""
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.subject) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    if (!formData.message) {
      newErrors.message = "Message is required";
      isValid = false;
    }
    if (!formData.number) {
      newErrors.number = "Contact Number is required";
      isValid = false;
    }

    if (formData.number && formData.number.length !== 10) {
      newErrors.number = "Number field must have exactly 10 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

      // Validate the form
  const isValid = validateForm();
  if (!isValid) {
    return; // Stop submission if validation fails
  }

    setIsSubmitting(true);
  
    if (validateForm()) {
      // Combine firstName and lastName into a single name field
      const { firstName, lastName, ...rest } = formData;
      const formDataWithRecipient = {
        ...rest,
        name: `${firstName} ${lastName}`, // Combine names
        recipientEmail: "karthicknoone@gmail.com", // Hardcoded recipient email
      };
  
      fetch(`${ApiUrl}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithRecipient),
      })
        .then((response) => {
          if (response.ok) {
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              subject: "",
              message: "",
              number: "", // Reset number field
            });
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Message sent successfully! We will get back to you soon",
            });
          } else {
            response.text().then((text) => {
              throw new Error(
                `Failed to send message. Status: ${response.status}, Message: ${text}`
              );
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
    }
  };
  

  return (
    <div>
      <Header2 />
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
            <br />
          </p>
        </div>
        <div style={styles.textContainer}>
          <h3 style={styles.subtitle}>We're here to help!</h3>
          <p style={styles.paragraph}>
            Fill out the form with any query on your mind, and we'll get back to
            you as soon as possible.
          </p>
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
                />
                {errors.email && <span style={styles.error}>{errors.email}</span>}
              </div>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={styles.inputLine}
                />
                {errors.subject && <span style={styles.error}>{errors.subject}</span>}
              </div>
            </div>
            <div style={styles.formGroup}>
              <div style={styles.inputWrapper}>
                <input
                  type="tel"
                  name="number"
                  placeholder="Number (10 digits)"
                  value={formData.number}
                  onChange={handleChange}
                  style={styles.inputLine}
                />
                {errors.number && <span style={styles.error}>{errors.number}</span>}
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
                ></textarea>
                {errors.message && <span style={styles.error}>{errors.message}</span>}
              </div>
            </div>
            <center><button type="submit" style={styles.button}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button></center>
     

          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "40px 20px",
    maxWidth: "1200px",
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
    fontFamily:'Poppins'

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
    fontFamily:'Poppins'

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
    fontFamily:'Poppins'

  },
  button: {
    padding: '12px 30px',
    border: 'none',
    borderRadius: '50px',
    backgroundColor: '#007BFF', // Blue background
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s, transform 0.2s', // Smooth transitions
    marginTop: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
    outline: 'none',
    width:'200px',
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