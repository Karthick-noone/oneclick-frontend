import React from "react";
// import Header1 from "./Header1";
import Header2 from "./Header2";
// import Header3 from "./Header3";
import Footer from "./footer";

const TermsAndConditions = () => {
  return (
    <div style={styles.pageContainer}>
      {/* <Header1 /> */}
      {/* <Header2 /> */}
      {/* <Header3 /> */}
      <div style={styles.container}>
        <div style={styles.textContainer}>
       
          {/* <h2 style={styles.title}>PRIVACY POLICY</h2> */}
          {/* <p style={{fontSize:'14px'}}>Disclaimer: <i > In case of any discrepancy or difference, the English version will take precedence over the translation</i>

</p> */}
          <h4 style={styles.title}>Safe and Secure Shopping</h4>
          <h4 style={styles.subtitle}>Is making online payment secure on Oneclick?</h4>
         
          <p style={styles.paragraph}>
          Yes, making the online payment is secure on Oneclick.
          </p>
          <h4 style={styles.subtitle}>Does Oneclick store my credit/debit card infomation?</h4>
          <p style={styles.paragraph}>
          No. Oneclick only stores the last 4 digits of your card number for the purpose of card identification.
          </p>
           
          <h4 style={styles.subtitle}>What credit/debit cards are accepted on Oneclick?</h4>
          <p style={styles.paragraph}>
          We accept VISA, MasterCard, Maestro, Rupay, American Express, Diner's Club and Discover credit/debit cards.
          </p>
           
          <h4 style={styles.subtitle}>Do you accept payment made by credit/debit cards issued in other countries?</h4>
          <p style={styles.paragraph}>
          Yes! We accept VISA, MasterCard, Maestro, American Express credit/debit cards issued by banks in India and in the following countries: Australia, Austria, Belgium, Canada, Cyprus, Denmark, Finland, France, Germany, Ireland, Italy, Luxembourg, the Netherlands, New Zealand, Norway, Portugal, Singapore, Spain, Sweden, the UK and the US. Please note that we do not accept internationally issued credit/debit cards for eGV payments/top-ups.
          </p>
          <h4 style={styles.subtitle}>What other payment options are available on Oneclick?</h4>
          <p style={styles.paragraph}>
          Apart from Credit and Debit Cards, we accept payments via Internet Banking (covering 44 banks), Cash on Delivery, Equated Monthly Installments (EMI), E-Gift Vouchers, Oneclick Pay Later, UPI, Wallet, and Paytm Postpaid.
          </p>
          <h4 style={styles.subtitle}>Privacy Policy</h4>
          <p style={styles.paragraph}>
          https://oneclickteck.com respects your privacy and is committed to protecting it. For more details, please see our <a href="/Privacypolicy">Privacy Policy.</a> 
          </p>
          <h4 style={styles.subtitle}>Contact Us</h4>
          <p style={styles.paragraph}>
          Couldn't find the information you need? Please <a href="/Contact">Contact Us</a>
          </p>
           
        </div>
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
    // letterSpacing: "1.0px",
    
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