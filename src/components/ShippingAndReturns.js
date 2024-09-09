import React from "react";
// import Header1 from "./Header1";
import Header2 from "./Header2";
// import Header3 from "./Header3";
import Footer from "./footer";
// import aboutImage from './img/about.jpg'; // Replace with your image path

const ShippingAndReturns = () => {
  return (
    <div style={styles.pageContainer}>
      {/* <Header1 /> */}
      <Header2 />
      {/* <Header3 /> */}
      <div style={styles.container}>
        <div style={styles.textContainer}>
          <h2 style={styles.title}>Shipping And Returns</h2>
          <h4 style={styles.subtitle}>Shipping Policy</h4>
          <p style={styles.paragraph}>
            Shipping & Returns Shipping Policy I’m a Shipping Policy section.
            I’m a great place to update your customers about your shipping
            methods, packaging, and costs. Use plain, straightforward language to
            build trust and make sure that your customers stay loyal! I'm the
            second paragraph in your Shipping Policy section. Click here to add
            your own text and edit me. It’s easy. Just click “Edit Text” or
            double click me to add details about your policy and make changes to
            the font. I’m a great place for you to tell a story and let your
            users know a little more about you.
          </p>
          <h4 style={styles.subtitle}>Return & Exchange Policy</h4>
          <p style={styles.paragraph}>
            I’m a return policy section. I’m a great place to let your customers
            know what to do in case they’ve changed their mind about their
            purchase, or if they’re dissatisfied with a product. Having a
            straightforward refund or exchange policy is a great way to build
            trust and reassure your customers that they can buy with confidence.
            I'm the second paragraph in your Return & Exchange policy. Click
            here to add your own text and edit me. It’s easy. Just click “Edit
            Text” or double click me to add details about your policy and make
            changes to the font. I’m a great place for you to tell a story and
            let your users know a little more about you.
          </p>
        </div>
        {/* Optional: Add an image here if needed */}
        {/* <img src={aboutImage} alt="About" style={styles.image} /> */}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  pageContainer: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    margin: 0,
    padding: 0,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  textContainer: {
    width: "100%",
    maxWidth: "800px",
    textAlign: "left",
  },
  title: {
    fontSize: "2em",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: "1.6px",
  },
  subtitle: {
    fontSize: "1.5em",
    fontWeight: "bold",
    margin: "20px 0 10px",
    color: "#555",
  },
  paragraph: {
    fontSize: "1em",
    lineHeight: "1.6",
    color: "#555",
    textAlign: "justify",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "15px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease",
  },
};

// Hover effect for the image
styles.image[':hover'] = {
  transform: "scale(1.05)",
};

export default ShippingAndReturns;