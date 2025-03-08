import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Main from "./Main"; // Adjust path as needed
import Computers from "./components/Computers"; // Adjust path as needed
import ComputerAccessories from "./components/ComputerAccessories"; // Adjust path as needed
import MobileAccessories from "./components/MobileAccessories"; // Adjust path as needed
import PrinterAccessories from "./components/PrinterAccessories"; // Adjust path as needed
import CCTVAccessories from "./components/CCTVAccessories"; // Adjust path as needed
import Mobiles from "./components/Mobiles"; // Adjust path as needed
import CCTV from "./components/CCTV"; // Adjust path as needed
import Headphones from "./components/Headphones"; // Adjust path as needed
import TV from "./components/TeleVision"; // Adjust path as needed
import Speaker from "./components/Speaker"; // Adjust path as needed
import Printers from "./components/Printers"; // Adjust path as needed
import Watch from "./components/Watch"; // Adjust path as needed
import Sidebar from "./components/Sidebar"; // Adjust path as needed
import BrandsPage from "./components/BrandsPage"; // Adjust path as needed
import Modal from "./components/Modal"; // Adjust path as needed
import ProductDetail from "./components/ProductDetail"; // Adjust path as needed
import Login from "./components/AdminLogin"; // Adjust path as needed
import Adminregister from "./components/AdminSignup"; // Adjust path as needed
import ClientLogin from "./components/ClientLogin"; // Adjust path as needed
import ClientSignup from "./components/ClientSignup"; // Adjust path as needed
import ForgotPassword from "./components/ForgotPassword"; // Adjust path as needed
import ChangePassword from "./components/ChangePassword"; // Adjust path as needed
import AdminForgotPassword from "./components/AdminForgotPassword"; // Adjust path as needed
import About from "./components/About"; // Adjust path as needed
import Contact from "./components/Contact"; // Adjust path as needed
import HelpCenter from "./components/HelpCenter"; // Adjust path as needed
import ShippingAndReturns from "./components/ShippingAndReturns"; // Adjust path as needed
import TermsAndConditions from "./components/PrivacyPolicy"; // Adjust path as needed
import Terms from "./components/Terms"; // Adjust path as needed
import PaymentSecurity from "./components/PaymentSecurity"; // Adjust path as needed
import CareersForm from "./components/CareersForm"; // Adjust path as needed
import Cart from "./components/Cart"; // Adjust path as needed
import UserAddress from "./components/UserAddress"; // Adjust path as needed
import Checkout from "./components/Checkout"; // Adjust path as needed
import MyAccount from "./components/MyAccount"; // Adjust path as needed
import MyOrders from "./components/MyOrders"; // Adjust path as needed
import ComputerAdBanner from "./components/ComputerAdBanner"; // Adjust path as needed
import MobileAdBanner from "./components/MobileAdBanner"; // Adjust path as needed
import CCTVAdBanner from "./components/CCTVAdBanner"; // Adjust path as needed
import FilterBar from "./components/FilterBar"; // Adjust path as needed
import Secondhandproducts from "./components/Secondhandproducts"; // Adjust path as needed
import AdminMain from "./admin/AdminApp"; // Adjust path as needed
import BuyNow from "./components/BuyNow";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [location]);

  return null;
};


const App = () => {
  return (
    <Router>
      <ScrollToTop /> {/* Ensure scroll to top on navigation */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Computers" element={<Computers />} />
        <Route path="/ComputerAccessories" element={<ComputerAccessories />} />
        <Route path="/Mobiles" element={<Mobiles />} />
        <Route path="/MobileAccessories" element={<MobileAccessories />} />
        <Route path="/PrinterAccessories" element={<PrinterAccessories />} />
        <Route path="/CCTVAccessories" element={<CCTVAccessories />} />
        <Route path="/CCTV" element={<CCTV />} />
        <Route path="/Headphones" element={<Headphones />} />
        <Route path="/TV" element={<TV />} />
        <Route path="/Speakers" element={<Speaker />} />
        <Route path="/Watch" element={<Watch />} />
        <Route path="/Printers" element={<Printers />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/BrandsPage" element={<BrandsPage />} />
        <Route path="/Modal" element={<Modal />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/AdminLogin" element={<Login />} />
        <Route path="/Adminregister" element={<Adminregister />} />
        <Route path="/Login" element={<ClientLogin />} />
        <Route path="/Signup" element={<ClientSignup />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/AdminForgotPassword" element={<AdminForgotPassword />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/HelpCenter" element={<HelpCenter />} />
        <Route path="/ShippingAndReturns" element={<ShippingAndReturns />} />
        <Route path="/Privacypolicy" element={<TermsAndConditions />} />
        <Route path="/Terms" element={<Terms />} />
        <Route path="/PaymentSecurity" element={<PaymentSecurity />} />
        <Route path="/CareersForm" element={<CareersForm />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/UserAddress" element={<UserAddress />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Purchase" element={<BuyNow />} />
        <Route path="/MyAccount" element={<MyAccount />} />
        <Route path="/MyOrders" element={<MyOrders />} />
        <Route path="/ComputerAd" element={<ComputerAdBanner />} />
        <Route path="/CCTVAd" element={<CCTVAdBanner />} />
        <Route path="/MobileAd" element={<MobileAdBanner />} />
        <Route path="/FilterBar" element={<FilterBar />} />
        <Route path="/Secondhandproducts" element={<Secondhandproducts />} />
        <Route path="/Admin/*" element={<AdminMain />} />{" "}
        {/* Ensure correct path */}
      </Routes>
    </Router>
  );
};

export default App;
