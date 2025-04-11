import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header2 from "./components/Header2"; // Add this line
import Main from "./Main";
import Computers from "./components/Computers";
import ComputerAccessories from "./components/ComputerAccessories";
import MobileAccessories from "./components/MobileAccessories";
import PrinterAccessories from "./components/PrinterAccessories";
import CCTVAccessories from "./components/CCTVAccessories";
import Mobiles from "./components/Mobiles";
import CCTV from "./components/CCTV";
import Headphones from "./components/Headphones";
import TV from "./components/TeleVision";
import Speaker from "./components/Speaker";
import Printers from "./components/Printers";
import Watch from "./components/Watch";
import Sidebar from "./components/Sidebar";
import BrandsPage from "./components/BrandsPage";
import Modal from "./components/Modal";
import ProductDetail from "./components/ProductDetail";
import Login from "./components/AdminLogin";
import Adminregister from "./components/AdminSignup";
import ClientLogin from "./components/ClientLogin";
import ClientSignup from "./components/ClientSignup";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
import AdminForgotPassword from "./components/AdminForgotPassword";
import About from "./components/About";
import Contact from "./components/Contact";
import HelpCenter from "./components/HelpCenter";
import ShippingAndReturns from "./components/ShippingAndReturns";
import TermsAndConditions from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import PaymentSecurity from "./components/PaymentSecurity";
import CareersForm from "./components/CareersForm";
import Cart from "./components/Cart";
import UserAddress from "./components/UserAddress";
import Checkout from "./components/Checkout";
import MyAccount from "./components/MyAccount";
import MyOrders from "./components/MyOrders";
import ComputerAdBanner from "./components/ComputerAdBanner";
import MobileAdBanner from "./components/MobileAdBanner";
import CCTVAdBanner from "./components/CCTVAdBanner";
import FilterBar from "./components/FilterBar";
import Secondhandproducts from "./components/Secondhandproducts";
import AdminMain from "./admin/AdminApp";
import BuyNow from "./components/BuyNow";
import NetworkStatus from "./components/NetworkStatus"; // Import the component

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const AppWrapper = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.toLowerCase(); // Convert to lowercase

  const isExcluded =
    path.startsWith("/admin") || path === "/login"|| path === "/signup"|| path === "/forgotpassword";

  return (
    <>
      {!isExcluded && <Header2 />}
      {children}
    </>
  );
};


const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <NetworkStatus>  {/* Include NetworkStatus at the root level */}
      <AppWrapper>
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
          <Route path="/shop/:id" element={<ProductDetail />} />
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
          <Route path="/Admin/*" element={<AdminMain />} />
        </Routes>
      </AppWrapper>
      </NetworkStatus>
    </Router>
  );
};

export default App;
