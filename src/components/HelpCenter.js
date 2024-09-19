import React, { useState } from 'react';
// import Header1 from './Header1';
import Header2 from './Header2';
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
      {/* <Header1 /> */}
      <Header2 />
      {/* <Header3 /> */}
      <div style={styles.container}>
        <h2 style={styles.title}>TechShed Help Center</h2>

    <h4 style={{textAlign: 'center',fontSize: '1.3em',marginBottom:'30px'}}>Frequently asked questions</h4>
        <div style={styles.headerContainer}>
          <h3 
            style={activeSection === 'general' ? styles.activeHeader : styles.header}
            onClick={() => toggleSection('general')}
          >
            General
          </h3>
          <h3 
            style={activeSection === 'setup' ? styles.activeHeader : styles.header}
            onClick={() => toggleSection('setup')}
          >
            Setting up FAQs
          </h3>
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
    question: 'What is an FAQ section?',
    answer: 'An FAQ section can be used to quickly answer common questions about your business like "Where do you ship to?", "What are your opening hours?", or "How can I book a service?".'
  },
  {
    question: 'Why do FAQs matter?',
    answer: 'FAQs are a great way to help site visitors find quick answers to common questions about your business and create a better navigation experience.'
  },
  {
    question: 'Where can I add my FAQs?',
    answer: 'FAQs can be added to any page on your site or to your mobile app, giving access to members on the go.'
  },
  // {
  //   question: 'What is the return policy?',
  //   answer: 'Our return policy allows you to return items within 30 days of receipt. Please check our Returns & Exchanges page for more details.'
  // },
  // {
  //   question: 'How can I track my order?',
  //   answer: 'You can track your order by logging into your account and visiting the "Order History" section. You will also receive tracking updates via email.'
  // },
  // // {
  // //   question: 'Do you offer international shipping?',
  // //   answer: 'Yes, we offer international shipping to most countries. Shipping rates and delivery times vary based on the destination.'
  // // },
  // {
  //   question: 'How do I contact customer support?',
  //   answer: 'You can contact our customer support team via email at enquiryoneclick@gmail.com or through our contact form on the website.'
  // },
  // {
  //   question: 'Are there any ongoing promotions?',
  //   answer: 'Please visit our Promotions page to see the latest offers and discounts available on our site.'
  // }
];

// Setup FAQs
const faqSetup = [
  {
    question: 'How do I add a new question & answer?',
    answer: 'To add a new FAQ follow these steps: \n\n1. Manage FAQs from your site dashboard or in the Editor \n\n2. Add a new question & answer \n\n3. Assign your FAQ to a category \n\n4. Save and publish.\n\nYou can always come back and edit your FAQs.'
  },
  {
    question: 'Can I insert an image, video, or GIF in my FAQ?',
    answer: 'Yes. To add media follow these steps: \n\n1. Manage FAQs from your site dashboard or in the Editor \n\n2. Create a new FAQ or edit an existing one \n\n3. From the answer text box click on the video, image or GIF icon \n\n4. Add media from your library and save.'
  },
  {
    question: 'How do I edit or remove the "Frequently Asked Questions" title?',
    answer: 'You can edit the title from the FAQ "Settings" tab in the Editor. \nTo remove the title from your mobile app go to the "Site & App" tab in your Owner\'s app and customize.'
  },
  {
    question: 'Can I change the layout of the FAQ section?',
    answer: 'Yes, you can customize the layout and appearance of the FAQ section through the design settings in your site editor.'
  },
  {
    question: 'How do I add or remove categories for FAQs?',
    answer: 'Categories can be managed through the FAQ settings in the site editor. You can add new categories or remove existing ones as needed.'
  }
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
  },
  activeHeader: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#ff6600',
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