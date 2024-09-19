import React from 'react';
import './css/PaymentMethod.css'; // Create a new CSS file for this page

// Importing payment card images
import visa from './img/cards/visa.png';
import mastercard from './img/cards/business.png';
import paypal from './img/cards/paypal.png';
import amex from './img/cards/american-express.png';
import discover from './img/cards/card.png';
import maestro from './img/cards/jcb.png';
import rupay from './img/cards/unionpay.png';
import upi from './img/cards/discover.png';

const PaymentMethods = () => {
    return (
        <div className="payment-methods-page">
            <h2>We accept the following payment methods</h2>
            <div className="payment-images">
                <img src={visa} alt="Visa" />
                <img src={mastercard} alt="MasterCard" />
                <img src={paypal} alt="PayPal" />
                <img src={amex} alt="American Express" />
                <img src={discover} alt="Discover" />
                <img src={maestro} alt="Maestro" />
                <img src={rupay} alt="RuPay" />
                <img src={upi} alt="UPI" />
            </div>
            <div className="copyright">
                <p>&copy; {new Date().getFullYear()} by One Click. All rights reserved.</p>
            </div>
        </div>
    );
};

export default PaymentMethods;
