import React, { useState } from "react";
// import Header1 from "./Header1";
import Header2 from "./Header2";
// import Header3 from "./Header3";
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
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      // Validate number input
      // Accept only digits and limit to 10 characters
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      // Ensure the number starts with 6-9
      if (
        sanitizedValue.length > 0 &&
        !(sanitizedValue[0] >= "6" && sanitizedValue[0] <= "9")
      ) {
        // If the first character is not 6-9, remove it
        setFormData({ ...formData, [name]: sanitizedValue.slice(1) });
      } else {
        setFormData({ ...formData, [name]: sanitizedValue });
      }
    } else if (name === "name") {
      // Validate name input
      // Reject input containing numbers and special characters
      const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
      // Update state only if the input is valid
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      // For other fields, update state directly
      setFormData({ ...formData, [name]: value });
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (validateForm()) {
        // Form is valid, handle form submission here
        console.log("Form data:", formData);
      }

    // Check if the number field has exactly 10 digits
    if (formData.number && formData.number.length !== 10) {
      // Show an error message if the number field doesn't have 10 digits
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Number field must have exactly 10 digits.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Recipient email address is required.",
      });
      setIsSubmitting(false);
      return;
    }

    fetch(`${ ApiUrl }/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          setFormData({
            name: "",
            number: "",
            email: "",
            subject: "",
            message: "",
          });
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Message sent successfully!",
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
  };


  return (
    <div>
      {/* <Header1 /> */}
      <Header2 />
      {/* <Header3 /> */}
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
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.inputLine}
                />
                {errors.name && <span style={styles.error}>{errors.name}</span>}
              </div>
              <div style={styles.inputWrapper}>
                <input
                  type="tel"
                  name="number"
                  id="number"
                  placeholder="Number"
                  value={formData.number}
                  onChange={handleChange}
                  style={styles.inputLine}
                />
                {errors.number && (
                  <span style={styles.error}>{errors.number}</span>
                )}
              </div>
            </div>
            <div style={styles.formGroup}>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.inputLine}
                />
                {errors.email && (
                  <span style={styles.error}>{errors.email}</span>
                )}
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
                {errors.subject && (
                  <span style={styles.error}>{errors.subject}</span>
                )}
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
                {errors.message && (
                  <span style={styles.error}>{errors.message}</span>
                )}
              </div>
            </div>
            <button type="submit" style={styles.button}>
              {" "}
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
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
    textAlign: "justify",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  inputWrapper: {
    flex: "1",
    position: "relative",
    marginRight: "10px",
  },
  inputLine: {
    width: "100%",
    padding: "10px 5px",
    border: "none",
    borderBottom: "2px solid #ccc",
    fontSize: "1em",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderBottom: "2px solid #ccc",
    fontSize: "1em",
    height: "100px",
    resize: "none",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#ff6600",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1.2em",
    alignSelf: "flex-start",
  },
  error: {
    color: "red",
    fontSize: "0.875em",
    position: "absolute",
    bottom: "-20px",
    left: "0",
  },
};

export default Contact;
