import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header2 from "./components/Header2"; // Add this line
import Header3 from "./components/Header3"; // Add this line
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
import ComputerFilter from "./components/ComputerFilter";
import BrandsPage from "./components/BrandsPage";
// import Modal from "./components/Modal";
import ProductDetail from "./components/ProductDetail";
// import AdminLogin from "./components/AdminLogin";
// import Adminregister from "./components/AdminSignup";
import ClientLogin from "./components/ClientLogin";
import ClientSignup from "./components/ClientSignup";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
// import AdminForgotPassword from "./components/AdminForgotPassword";
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
import ScrollToTopButton from "./components/ScrollToTopButton"; // Adjust path as needed
import UserLogin from "./components/UserLogin"; // Adjust path as needed
import Login from "./components/Login"; // Adjust path as needed
import ResetPassword from "./components/ResetPassword"; // Adjust path as needed
import BranchRegistration from "./components/BranchRegistration"; // Adjust path as needed
import BranchLogin from "./components/BranchLogin"; // Adjust path as needed



const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const AppWrapper = ({ children }) => {
  const header2Ref = useRef(null);
  const [header2Height, setHeader2Height] = useState(0);

  useEffect(() => {
    if (header2Ref.current) {
      const height = header2Ref.current.offsetHeight;
      // console.log(`[AppWrapper] Initial Header2 height: ${height}px`);
      setHeader2Height(height);
    }

    const handleResize = () => {
      if (header2Ref.current) {
        const height = header2Ref.current.offsetHeight;
        // console.log(`[AppWrapper] Header2 height on resize: ${height}px`);
        setHeader2Height(height);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

const location = useLocation();
let path = location.pathname.toLowerCase();

// Remove trailing slash if present
if (path.endsWith("/")) path = path.slice(0, -1);

const isExcluded =
  path.startsWith("/admin") ||
  path === "/login" ||
  path === "/admin-login" ||
  path === "/forgotpassword" ||
  path === "/reset" ||
  path === "/branch-register" ||
  path === "/branch-login";

return (
  <>
    {!isExcluded && <Header2 header2Ref={header2Ref} />}
    {/* {!isExcluded && <Header3 topOffset={header2Height} />} */}
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
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/login" element={<UserLogin />} />
            {/* <Route path="/admin-login" element={<Login />} /> */}
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
            <Route path="/ComputerFilter" element={<ComputerFilter />} />
            <Route path="/BrandsPage" element={<BrandsPage />} />
            {/* <Route path="/Modal" element={<Modal />} /> */}
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/Adminlogin" element={<Login />} />
            {/* <Route path="/Adminregister" element={<Adminregister />} /> */}
            {/* <Route path="/user-login" element={<ClientLogin />} /> */}
            {/* <Route path="/Signup" element={<ClientSignup />} /> */}
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            {/* <Route path="/AdminForgotPassword" element={<AdminForgotPassword />} /> */}
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
            <Route path="/branch-register" element={<BranchRegistration />} />
            <Route path="/branch-login" element={<BranchLogin />} />
            <Route path="/Admin/*" element={<AdminMain />} />
          </Routes>
        </AppWrapper>
        <ScrollToTopButton />
      </NetworkStatus>
    </Router>
  );
};

export default App;


////Maintenance//////////////
// import React, { useEffect, useState, useRef } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   useLocation,
// } from "react-router-dom";
// import Header2 from "./components/Header2";
// import Header3 from "./components/Header3";
// import Main from "./Main";
// import Computers from "./components/Computers";
// import ComputerAccessories from "./components/ComputerAccessories";
// import MobileAccessories from "./components/MobileAccessories";
// import PrinterAccessories from "./components/PrinterAccessories";
// import CCTVAccessories from "./components/CCTVAccessories";
// import Mobiles from "./components/Mobiles";
// import CCTV from "./components/CCTV";
// import Headphones from "./components/Headphones";
// import TV from "./components/TeleVision";
// import Speaker from "./components/Speaker";
// import Printers from "./components/Printers";
// import Watch from "./components/Watch";
// import Sidebar from "./components/Sidebar";
// import ComputerFilter from "./components/ComputerFilter";
// import BrandsPage from "./components/BrandsPage";
// import ProductDetail from "./components/ProductDetail";
// import ClientLogin from "./components/ClientLogin";
// import ClientSignup from "./components/ClientSignup";
// import ForgotPassword from "./components/ForgotPassword";
// import ChangePassword from "./components/ChangePassword";
// import About from "./components/About";
// import Contact from "./components/Contact";
// import HelpCenter from "./components/HelpCenter";
// import ShippingAndReturns from "./components/ShippingAndReturns";
// import TermsAndConditions from "./components/PrivacyPolicy";
// import Terms from "./components/Terms";
// import PaymentSecurity from "./components/PaymentSecurity";
// import CareersForm from "./components/CareersForm";
// import Cart from "./components/Cart";
// import UserAddress from "./components/UserAddress";
// import Checkout from "./components/Checkout";
// import MyAccount from "./components/MyAccount";
// import MyOrders from "./components/MyOrders";
// import ComputerAdBanner from "./components/ComputerAdBanner";
// import MobileAdBanner from "./components/MobileAdBanner";
// import CCTVAdBanner from "./components/CCTVAdBanner";
// import FilterBar from "./components/FilterBar";
// import Secondhandproducts from "./components/Secondhandproducts";
// import AdminMain from "./admin/AdminApp";
// import BuyNow from "./components/BuyNow";
// import NetworkStatus from "./components/NetworkStatus";
// import ScrollToTopButton from "./components/ScrollToTopButton";
// import UserLogin from "./components/UserLogin";
// import Login from "./components/Login";
// import ResetPassword from "./components/ResetPassword";
// import MaintenancePage from "./components/MaintenancePage";

// const ScrollToTop = () => {
//   const location = useLocation();
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location]);
//   return null;
// };

// const AppWrapper = ({ children, isUnderMaintenance }) => {
//   const header2Ref = useRef(null);
//   const [header2Height, setHeader2Height] = useState(0);

//   useEffect(() => {
//     if (header2Ref.current) {
//       setHeader2Height(header2Ref.current.offsetHeight);
//     }
//     const handleResize = () => {
//       if (header2Ref.current) {
//         setHeader2Height(header2Ref.current.offsetHeight);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const location = useLocation();
//   const path = location.pathname.toLowerCase();

//   const isExcluded =
//     path.startsWith("/admin") ||
//     path === "/login" ||
//     path === "/admin-login" ||
//     path === "/forgotpassword" ||
//     path === "/reset";

//   return (
//     <>
//       {/* Hide headers during maintenance */}
//       {!isUnderMaintenance && !isExcluded && <Header2 header2Ref={header2Ref} />}
//       {!isUnderMaintenance && !isExcluded && <Header3 topOffset={header2Height} />}
//       {children}
//     </>
//   );
// };

// // Toggle this flag when needed
// const isUnderMaintenance = true;

// const App = () => {
//   return (
//     <Router>
//       <ScrollToTop />
//       <NetworkStatus>
//         <AppWrapper isUnderMaintenance={isUnderMaintenance}>
//           <Routes>
//             {isUnderMaintenance ? (
//               <>
//                 {/* Maintenance mode */}
//                 <Route path="/" element={<MaintenancePage />} />
//                 <Route path="/admin/*" element={<AdminMain />} />
//                 <Route path="*" element={<MaintenancePage />} />
//                 <Route path="/Adminlogin" element={<Login />} />

//               </>
//             ) : (
//               <>
//                 {/* Normal app routes */}
//                 <Route path="/" element={<Main />} />
//                 <Route path="/reset" element={<ResetPassword />} />
//                 <Route path="/login" element={<UserLogin />} />
//                 <Route path="/Computers" element={<Computers />} />
//                 <Route path="/ComputerAccessories" element={<ComputerAccessories />} />
//                 <Route path="/Mobiles" element={<Mobiles />} />
//                 <Route path="/MobileAccessories" element={<MobileAccessories />} />
//                 <Route path="/PrinterAccessories" element={<PrinterAccessories />} />
//                 <Route path="/CCTVAccessories" element={<CCTVAccessories />} />
//                 <Route path="/CCTV" element={<CCTV />} />
//                 <Route path="/Headphones" element={<Headphones />} />
//                 <Route path="/TV" element={<TV />} />
//                 <Route path="/Speakers" element={<Speaker />} />
//                 <Route path="/Watch" element={<Watch />} />
//                 <Route path="/Printers" element={<Printers />} />
//                 <Route path="/Sidebar" element={<Sidebar />} />
//                 <Route path="/ComputerFilter" element={<ComputerFilter />} />
//                 <Route path="/BrandsPage" element={<BrandsPage />} />
//                 <Route path="/shop/:id" element={<ProductDetail />} />
//                 <Route path="/ForgotPassword" element={<ForgotPassword />} />
//                 <Route path="/ChangePassword" element={<ChangePassword />} />
//                 <Route path="/About" element={<About />} />
//                 <Route path="/Contact" element={<Contact />} />
//                 <Route path="/HelpCenter" element={<HelpCenter />} />
//                 <Route path="/ShippingAndReturns" element={<ShippingAndReturns />} />
//                 <Route path="/Privacypolicy" element={<TermsAndConditions />} />
//                 <Route path="/Terms" element={<Terms />} />
//                 <Route path="/PaymentSecurity" element={<PaymentSecurity />} />
//                 <Route path="/CareersForm" element={<CareersForm />} />
//                 <Route path="/Cart" element={<Cart />} />
//                 <Route path="/UserAddress" element={<UserAddress />} />
//                 <Route path="/Checkout" element={<Checkout />} />
//                 <Route path="/Purchase" element={<BuyNow />} />
//                 <Route path="/MyAccount" element={<MyAccount />} />
//                 <Route path="/MyOrders" element={<MyOrders />} />
//                 <Route path="/ComputerAd" element={<ComputerAdBanner />} />
//                 <Route path="/CCTVAd" element={<CCTVAdBanner />} />
//                 <Route path="/MobileAd" element={<MobileAdBanner />} />
//                 <Route path="/FilterBar" element={<FilterBar />} />
//                 <Route path="/Secondhandproducts" element={<Secondhandproducts />} />
//                 <Route path="/Admin/*" element={<AdminMain />} />
//               </>
//             )}
//           </Routes>
//         </AppWrapper>
//         {!isUnderMaintenance && <ScrollToTopButton />}
//       </NetworkStatus>
//     </Router>
//   );
// };

// export default App;
