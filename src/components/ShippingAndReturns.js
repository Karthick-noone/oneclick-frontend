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
          <h2 style={styles.title}>Shipping</h2>
          <h4 style={styles.subtitle}>What are the delivery charges?</h4>
          <p style={styles.paragraph}>
          Delivery charge varies with each Seller.
          </p>
          <p style={styles.paragraph}>
          Sellers incur relatively higher shipping costs on low value items. In such cases, charging a nominal delivery charge helps them offset logistics costs. Please check your order summary to understand the delivery charges for individual products.          </p>
          <p style={styles.paragraph}>
          For Products listed as Oneclick Plus, a Rs 40 charge for delivery per item may be applied if the order value is less than Rs 500. While, orders of Rs 500 or above are delivered free.          </p>
          <h4 style={styles.subtitle}>Why does the delivery date not correspond to the delivery timeline of X-Y business days?</h4>
          <p style={styles.paragraph}>
          It is possible that the Seller or our courier partners have a holiday between the day you placed your order and the date of delivery, which is based on the timelines shown on the product page. In this case, we add a day to the estimated date. Some courier partners and Sellers do not work on Sundays and this is factored in to the delivery dates.
          </p>
          <h4 style={styles.subtitle}>What is the estimated delivery time?</h4>
          <p style={styles.paragraph}>
          Sellers generally procure and ship the items within the time specified on the product page. Business days exclude public holidays and Sundays.
          </p>
          <h4 style={styles.subtitle}>Estimated delivery time depends on the following factors:</h4>
          <p style={styles.paragraph}>
          The Seller offering the product
          </p>
          <p style={styles.paragraph}>
          Product's availability with the Seller
          </p>
          <p style={styles.paragraph}>
          The destination to which you want the order shipped to and location of the Seller.
          </p>
          <h4 style={styles.subtitle}>Are there any hidden costs (sales tax, octroi etc) on items sold by Sellers on Oneclick?</h4>
          <p style={styles.paragraph}>
          There are NO hidden charges when you make a purchase on Oneclick. List prices are final and all-inclusive. The price you see on the product page is exactly what you would pay.          </p>
          <p style={styles.paragraph}>
          Delivery charges are not hidden charges and are charged (if at all) extra depending on the Seller's shipping policy.</p>
          <h4 style={styles.subtitle}>Why does the estimated delivery time vary for each seller?</h4>
          <p style={styles.paragraph}>
          You have probably noticed varying estimated delivery times for sellers of the product you are interested in. Delivery times are influenced by product availability, geographic location of the Seller, your shipping destination and the courier partner's time-to-deliver in your location.</p>
          <p style={styles.paragraph}>
          Please enter your default pin code on the product page (you don't have to enter it every single time) to know more accurate delivery times on the product page itself.</p>
          <h4 style={styles.subtitle}>Why is the CoD option not offered in my location?</h4>
          <p style={styles.paragraph}>
          Availability of CoD depends on the ability of our courier partner servicing your location to accept cash as payment at the time of delivery.</p>
          <p style={styles.paragraph}>
          Our courier partners have limits on the cash amount payable on delivery depending on the destination and your order value might have exceeded this limit. Please enter your pin code on the product page to check if CoD is available in your location.</p>
          <h4 style={styles.subtitle}>I need to return an item, how do I arrange for a pick-up?</h4>
          <p style={styles.paragraph}>
          Returns are easy. Contact Us to initiate a return. You will receive a call explaining the process, once you have initiated a return.</p>
          <p style={styles.paragraph}>
          Wherever possible Ekart Logistics will facilitate the pick-up of the item. In case, the pick-up cannot be arranged through Ekart, you can return the item through a third-party courier service. Return fees are borne by the Seller.</p>
          <h4 style={styles.subtitle}>I did not receive my order but got a delivery confirmation SMS/Email.</h4>
          <p style={styles.paragraph}>
          In case the product was not delivered and you received a delivery confirmation email/SMS, report the issue within 7 days from the date of delivery confirmation for the seller to investigate.</p>
          <p style={styles.paragraph}>
          Wherever possible Ekart Logistics will facilitate the pick-up of the item. In case, the pick-up cannot be arranged through Ekart, you can return the item through a third-party courier service. Return fees are borne by the Seller.</p>
          <h4 style={styles.subtitle}>What do the different tags like "In Stock", "Available" mean?</h4>
          <h4 style={styles.subtitle}>In Stock</h4>
          <p style={styles.paragraph}>
          For items listed as "In Stock", Sellers will mention the delivery time based on your location pincode (usually 2-3 business days, 4-5 business days or 4-6 business days in areas where standard courier service is available). For other areas, orders will be sent by Registered Post through the Indian Postal Service which may take 1-2 weeks depending on the location.</p>
          <h4 style={styles.subtitle}>'Available'</h4>
          <p style={styles.paragraph}>
          The Seller might not have the item in stock but can procure it when an order is placed for the item. The delivery time will depend on the estimated procurement time and the estimated shipping time to your location.</p>
          <h4 style={styles.subtitle}>'Preorder' or 'Forthcoming'</h4>
          <p style={styles.paragraph}>
          Such items are expected to be released soon and can be pre-booked for you. The item will be shipped to you on the day of it's official release launch and will reach you in 2 to 6 business days. The Preorder duration varies from item to item. Once known, release time and date is mentioned. (Eg. 5th May, August 3rd week)</p>
          <h4 style={styles.subtitle}>'Out of Stock'</h4>
          <p style={styles.paragraph}>
          Currently, the item is not available for sale. Use the 'Notify Me' feature to know once it is available for purchase.</p>
          <h4 style={styles.subtitle}>'Imported'</h4>
          <p style={styles.paragraph}>
          Sometimes, items have to be sourced by Sellers from outside India. These items are mentioned as 'Imported' on the product page and can take at least 10 days or more to be delivered to you.</p>
          <h4 style={styles.subtitle}>'Back In Stock Soon'</h4>
          <p style={styles.paragraph}>
          The item is popular and is sold out. You can however 'book' an order for the product and it will be shipped according to the timelines mentioned by the Seller.</p>
          <h4 style={styles.subtitle}>'Temporarily Unavailable'</h4>
          <p style={styles.paragraph}>
          The product is currently out of stock and is not available for purchase. The product could be in stock soon. Use the 'Notify Me' feature to know when it is available for purchase.</p>
          <h4 style={styles.subtitle}>'Permanently Discontinued'</h4>
          <p style={styles.paragraph}>
          This product is no longer available because it is obsolete and/or its production has been discontinued.</p>
          <h4 style={styles.subtitle}>'Out of Print'</h4>
          <p style={styles.paragraph}>
          This product is not available because it is no longer being published and has been permanently discontinued.</p>
          <h4 style={styles.subtitle}>Does Oneclick deliver internationally?</h4>
          <p style={styles.paragraph}>
          As of now, Oneclick doesn't deliver items internationally.</p>
          <p style={styles.paragraph}>
          You will be able to make your purchases on our site from anywhere in the world with credit/debit cards issued in India and 21 other countries, but please ensure the delivery address is in India.</p>
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
    // fontFamily: "poppins",
    backgroundColor: "lightgrey",
    margin: 0,
    padding: 0,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 10px",
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor:"white",
    marginBottom:'10px',
    marginTop:'10px'
  },
  textContainer: {
    width: "100%",
    maxWidth: "800px",
    textAlign: "left",
  },
  title: {
    fontSize: "1.5em",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
    textTransform: "uppercase",
    textAlign:"left"
    // letterSpacing: "1.6px",
  },
  subtitle: {
    fontSize: "1.0em",
    fontWeight: "bold",
    margin: "20px 0 10px",
    color: "#555",
  },
  paragraph: {
    fontSize: ".9em",
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