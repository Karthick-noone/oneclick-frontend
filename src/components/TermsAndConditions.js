import React from "react";
// import Header1 from "./Header1";
import Header2 from "./Header2";
// import Header3 from "./Header3";
import Footer from "./footer";

const TermsAndConditions = () => {
  return (
    <div style={styles.pageContainer}>
      {/* <Header1 /> */}
      <Header2 />
      {/* <Header3 /> */}
      <div style={styles.container}>
        <div style={styles.textContainer}>
          <h2 style={styles.title}>Terms And Conditions</h2>
          <h4 style={styles.subtitle}>Customer Care</h4>
          <p style={styles.paragraph}>
            I’m a Customer Care section. I’m a great place to write a long text
            about your company and your services, and, most importantly, how to
            contact your store with queries. Writing a detailed Customer Care
            policy is a great way to build trust and reassure your customers
            that they can buy with confidence. I'm the second paragraph in your
            Customer Care section. Click here to add your own text and edit me.
            It’s easy. Just click “Edit Text” or double click me to add details
            about your policy and make changes to the font. I’m a great place
            for you to tell a story and let your users know a little more about
            you.
          </p>
          <h4 style={styles.subtitle}>Privacy & Safety</h4>
          <p style={styles.paragraph}>
            I’m a Privacy & Safety policy section. I’m a great place to inform
            your customers about how you use, store, and protect their personal
            information. Add details such as how you use third-party banking to
            verify payment, the way you collect data, or when you will contact
            users after their purchase was completed successfully. Your user’s
            privacy is of the highest importance to your business, so take the
            time to write an accurate and detailed policy. Use straightforward
            language to gain their trust and make sure they keep coming back to
            your site!
          </p>
          <h4 style={styles.subtitle}>Wholesale Inquiries</h4>
          <p style={styles.paragraph}>
            I’m a wholesale inquiries section. I’m a great place to inform other
            retailers about how they can sell your stunning products. Use plain
            language and give as much information as possible to promote your
            business and take it to the next level! I'm the second paragraph in
            your Wholesale Inquiries section. Click here to add your own text
            and edit me. It’s easy. Just click “Edit Text” or double click me
            to add details about your policy and make changes to the font. I’m a
            great place for you to tell a story and let your users know a little
            more about you.
          </p>
          <h4 style={styles.subtitle}>Payment Methods</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}>- Credit / Debit Cards</li>
            <li style={styles.listItem}>- PAYPAL</li>
            <li style={styles.listItem}>- Offline Payments</li>
          </ul>
        </div>
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
    marginBottom: "20px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    fontSize: "1em",
    lineHeight: "1.6",
    color: "#555",
    marginBottom: "10px",
  },
};

export default TermsAndConditions;