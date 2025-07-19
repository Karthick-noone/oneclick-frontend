import React, { useState } from 'react';
// import Header1 from './Header1';
// import Header2 from './Header2';
// import Header3 from './Header3';
import Footer from './footer';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

const HelpCenter = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [activeQuestion, setActiveQuestion] = useState({ general: null, setup: null });

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const toggleQuestion = (index, section) => {
    setActiveQuestion({
      ...activeQuestion,
      [section]: activeQuestion[section] === index ? null : index,
    });
  };

  return (
    <div>

      <div style={styles.container}>
        <h2 style={styles.title}>TechShed Help Center</h2>

        <h4 style={{ textAlign: 'center', fontSize: '1.3em', marginBottom: '30px' }}>Frequently asked questions</h4>
        <div style={styles.headerContainer}>
          <button
            style={activeSection === 'general' ? styles.activeHeader : styles.header}
            onClick={() => toggleSection('general')}
            disabled={activeSection === 'general'}
          >
            General
          </button>
          <button
            style={activeSection === 'setup' ? styles.activeHeader : styles.header}
            onClick={() => toggleSection('setup')}
            disabled={activeSection === 'setup'}
          >
            Account Setup
          </button>
        </div>
        <div style={styles.faqContainer}>
          {activeSection === 'general' && faqGeneral.map((faq, index) => (
            <div key={index}>
              <div
                style={styles.questionContainer}
                onClick={() => toggleQuestion(index, 'general')}
              >

                <h3 style={styles.question}>{faq.question}</h3>
                {activeQuestion.general === index ? (
                  <FaChevronDown style={styles.icon} />
                ) : (
                  <FaChevronRight style={styles.icon} />
                )}
              </div>
              {activeQuestion.general === index && (
                <div style={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              )}
              {index < faqGeneral.length - 1 && <hr style={styles.line} />}
            </div>
          ))}
          {activeSection === 'setup' && faqSetup.map((faq, index) => (
            <div key={index}>
              <div
                style={styles.questionContainer}
                onClick={() => toggleQuestion(index, 'setup')}
              >

                <h3 style={styles.question}>{faq.question}</h3>
                {activeQuestion.setup === index ? (
                  <FaChevronDown style={styles.icon} />
                ) : (
                  <FaChevronRight style={styles.icon} />
                )}
              </div>
              {activeQuestion.setup === index && (
                <div style={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              )}
              {index < faqSetup.length - 1 && <hr style={styles.line} />}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

// General FAQs
const faqGeneral = [
  {
    question: 'How do I track my order?',
    answer: 'Go to “My Orders” in your account dashboard to view the live status of your order.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept credit/debit cards, UPI, NetBanking, and major digital wallets.'
  },
  {
    question: 'What are your customer support hours?',
    answer: 'Our support team is available 24/7 via chat and email, and from 9 AM to 9 PM on calls.'
  },
  {
    question: 'How can I contact customer service?',
    answer: 'You can contact us via email, phone, or by using the contact form on our website.'
  },
  {
    question: 'Can I pick up my order from the store?',
    answer: 'Yes, you can pick up your order from the store. During checkout, select the “Pick Up From Store” option.'
  },
  {
    question: 'How can I get coupons?',
    answer: 'You can get coupons by logging in. Our team will send coupons to your WhatsApp number.'
  },
];
const faqSetup = [
  {
    question: 'How do I set up my account?',
    answer: 'Click “Log In” at the top right, fill in your details, and get started.'
  },
  {
    question: 'How can I manage my saved addresses?',
    answer: 'Go to “Saved Addresses” in your account to add, edit, or remove delivery addresses.'
  },
  {
    question: 'How do I apply a coupon or promo code?',
    answer: 'Enter your coupon code during checkout in the “Apply Coupon” field.'
  },
  {
    question: 'Can I reset my account password?',
    answer: 'Yes, you can reset your password by clicking “Log In > Forgot Password.”'
  },
];



const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '2.3em',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  header: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#555',
    border:"none",
    backgroundColor:'white'
    
  },
  activeHeader: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#ff4800ff',
    border:"none",
    backgroundColor:'white'

  },
  faqContainer: {
    marginTop: '20px',
  },
  questionContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '15px 10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    marginBottom: '10px',
    transition: 'background-color 0.3s ease',
  },
  icon: {
    fontSize: '1.0em',
    marginRight: '15px',
    transition: 'transform 0.3s ease',
  },
  question: {
    flex: '1',
    fontSize: '1.0em',
    fontWeight: 'bold',
    color: '#555',
  },
  answer: {
    marginTop: '10px',
    marginLeft: '25px',
    padding: '10px 15px',
    borderLeft: '3px solid #ff6600',
    backgroundColor: '#fff',
    borderRadius: '5px',
    color: '#666',
    fontSize: '0.9em',

  },
  line: {
    border: 'none',
    borderBottom: '1px solid #ddd',
    margin: '20px 0',
  },
};

export default HelpCenter;