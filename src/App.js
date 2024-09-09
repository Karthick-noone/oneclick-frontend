import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './Main'; // Adjust path as needed
import Computers from './components/Computers'; // Adjust path as needed
import ComputerAccessories from './components/ComputerAccessories'; // Adjust path as needed
import MobileAccessories from './components/MobileAccessories'; // Adjust path as needed
import Mobiles from './components/Mobiles'; // Adjust path as needed
import CCTV from './components/CCTV'; // Adjust path as needed
import Headphones from './components/Headphones'; // Adjust path as needed
import TV from './components/TeleVision'; // Adjust path as needed
import Speaker from './components/Speaker'; // Adjust path as needed
import Printers from './components/Printers'; // Adjust path as needed
import Watch from './components/Watch'; // Adjust path as needed
import Sidebar from './components/Sidebar'; // Adjust path as needed
import BrandsPage from './components/BrandsPage'; // Adjust path as needed
import Modal from './components/Modal'; // Adjust path as needed
import Login from './components/AdminLogin'; // Adjust path as needed
import Adminregister from './components/AdminSignup'; // Adjust path as needed
import ClientLogin from './components/ClientLogin'; // Adjust path as needed
import ClientSignup from './components/ClientSignup'; // Adjust path as needed
import ForgotPassword from './components/ForgotPassword'; // Adjust path as needed
import AdminForgotPassword from './components/AdminForgotPassword'; // Adjust path as needed
import About from './components/About'; // Adjust path as needed
import Contact from './components/Contact'; // Adjust path as needed
import HelpCenter from './components/HelpCenter'; // Adjust path as needed
import ShippingAndReturns from './components/ShippingAndReturns'; // Adjust path as needed
import TermsAndConditions from './components/TermsAndConditions'; // Adjust path as needed
import CareersForm from './components/CareersForm'; // Adjust path as needed
import Cart from './components/Cart'; // Adjust path as needed
import UserAddress from './components/UserAddress'; // Adjust path as needed
import Checkout from './components/Checkout'; // Adjust path as needed
import AdminMain from './admin/AdminApp'; // Adjust path as needed

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/Computers" element={<Computers />} />
                <Route path="/ComputerAccessories" element={<ComputerAccessories />} />
                <Route path="/Mobiles" element={<Mobiles />} />
                <Route path="/MobileAccessories" element={<MobileAccessories />} />
                <Route path="/CCTV" element={<CCTV />} />
                <Route path="/Headphones" element={<Headphones />} />
                <Route path="/TeleVision" element={<TV />} />
                <Route path="/Speaker" element={<Speaker />} />
                <Route path="/Watch" element={<Watch />} />
                <Route path="/Printers" element={<Printers />} />
                <Route path="/Sidebar" element={<Sidebar />} />
                <Route path="/BrandsPage" element={<BrandsPage />} />
                <Route path="/Modal" element={<Modal />} />
                <Route path="/AdminLogin" element={<Login />} />
                <Route path="/Adminregister" element={<Adminregister />} />
                <Route path="/Login" element={<ClientLogin />} />
                <Route path="/Signup" element={<ClientSignup />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/AdminForgotPassword" element={<AdminForgotPassword />} />
                <Route path="/About" element={<About />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/HelpCenter" element={<HelpCenter />} />
                <Route path="/ShippingAndReturns" element={<ShippingAndReturns />} />
                <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
                <Route path="/CareersForm" element={<CareersForm />} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/UserAddress" element={<UserAddress />} />
                <Route path="/Checkout" element={<Checkout />} />
                <Route path="/Admin/*" element={<AdminMain />} /> {/* Ensure correct path */}
            </Routes>
        </Router>
    );
};

export default App;
