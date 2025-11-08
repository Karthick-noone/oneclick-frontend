import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminMain from './pages/AdminMain';
import Computers from './pages/AddComputers';
import BranchComputers from './pages/BranchComputers';
import Mobiles from './pages/AddMobiles';
import BranchMobiles from './pages/BranchMobiles';
import CCTV from './pages/AddCCTV';
import BranchCCTV from './pages/BranchCCTV';
import Headphones from './pages/AddHeadphones';
import BranchHeadphones from './pages/BranchHeadphones';
import Speakers from './pages/AddSpeakers';
import BranchSpeakers from './pages/BranchSpeakers';
import Tv from './pages/AddTV';
import BranchTv from './pages/BranchTV';
import Watch from './pages/AddWatch';
import BranchWatch from './pages/BranchWatch';
import Printers from './pages/AddPrinters';
import BranchPrinters from './pages/BranchPrinters';
import ComputerAccessories from './pages/AddComputerAccessories';
import BranchComputerAccessories from './pages/BranchComputerAccessories';
import MobileAccessories from './pages/AddMobileAccessories';
import BranchMobileAccessories from './pages/BranchMobileAccessories';
import CCTVAccessories from './pages/AddCCTVAccessories';
import BranchCCTVAccessories from './pages/BranchCCTVAccessories';
import PrinterAccessories from './pages/AddPrinterAccessories';
import BranchPrinterAccessories from './pages/BranchPrinterAccessories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import SalesReport from './pages/SalesReport';
import CustomerReports from './pages/CustomerReports';
import ChangePassword from './pages/ChangePassword';
import EditHomePage from './pages/EditHomePage';
import EditDoubleImageAd from './pages/EditDoubleImageAd';
import EditSingleImageAd from './pages/EditSingleAdPage';
import EditLoginpageBG from './pages/EditLoginPageBG';
import Dashboard from './pages/Dashboard';
import BranchDashboard from './pages/BranchDashboard';
import ContactsTable from './pages/ContactsTable';
import CareersTable from './pages/CareersTable';
import ComputersAd from './pages/ComputersAd';
import MobileAd from './pages/MobileAd';
import ProductDetailPage from './pages/ProductDetailPage';
import CCTVAd from './pages/CCTVAd';
import CouponManager from './pages/CouponManager';
import StaffManagement from './pages/StaffManagement';
import Secondhandproducts from './pages/AddSecondhandproducts';
import BranchSecondhandproducts from './pages/BranchSecondhandProducts';
import BranchAdminProfile from './pages/BranchAdminProfile';
import BranchManagement from './pages/BranchManagement';
import { ThemeProvider } from './ThemeContext';
import NetworkStatus from '../components/NetworkStatus';
import { ToastContainer } from "react-toastify";
import AdminNotFound from './pages/AdminNotFound';

import CryptoJS from "crypto-js"; // 🔒 Import CryptoJS for encryption

// 🌟 Encryption key
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || 'your-strong-fallback-key';

// 🔒 Override localStorage globally
const originalSetItem = localStorage.setItem;
const originalGetItem = localStorage.getItem;
const originalRemoveItem = localStorage.removeItem;

// Secure setItem
localStorage.setItem = (key, value) => {
  try {
    const stringValue = JSON.stringify(value);
    const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
    originalSetItem.call(localStorage, key, encrypted);
  } catch (e) {
    console.error(`[localStorage.setItem] Encryption failed for ${key}:`, e);
  }
};

// Secure getItem
localStorage.getItem = (key) => {
  const encrypted = originalGetItem.call(localStorage, key);
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    console.warn(`[localStorage.getItem] Decryption failed for ${key}:`, e);
    return null; // fallback if decryption fails
  }
};

// Secure removeItem
localStorage.removeItem = (key) => {
  originalRemoveItem.call(localStorage, key);
};

function App() {
  const bodyStyle = {
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    margin: 0,
    fontFamily: 'calibri, sans-serif'
  };

  React.useEffect(() => {
    document.body.style.backgroundColor = bodyStyle.backgroundColor;
    document.body.style.minHeight = bodyStyle.minHeight;
    document.body.style.margin = bodyStyle.margin;
    document.body.style.fontFamily = bodyStyle.fontFamily;

    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.minHeight = null;
      document.body.style.margin = null;
      document.body.style.fontFamily = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔐 Get encrypted user role
  const userRole = localStorage.getItem('userRole');

  const ProtectedRoute = ({ element, restrictedRoles }) => {
    if (restrictedRoles.includes(userRole)) {
      return <Navigate to="/Admin/Computers" />;
    }
    return element;
  };

  return (
    <ThemeProvider>
      <ToastContainer />
      <NetworkStatus>
        <AdminMain>
          <Routes>
            <Route path="/Computers" element={<Computers />} />
            <Route path="/BranchComputers" element={<BranchComputers />} />
            <Route path="/Mobiles" element={<Mobiles />} />
            <Route path="/BranchMobiles" element={<BranchMobiles />} />
            <Route path="/CCTV" element={<CCTV />} />
            <Route path="/BranchCCTV" element={<BranchCCTV />} />
            <Route path="/Headphones" element={<Headphones />} />
            <Route path="/BranchHeadphones" element={<BranchHeadphones />} />
            <Route path="/Speakers" element={<Speakers />} />
            <Route path="/BranchSpeakers" element={<BranchSpeakers />} />
            <Route path="/TVHomeCinema" element={<Tv />} />
            <Route path="/BranchTVHomeCinema" element={<BranchTv />} />
            <Route path="/WearableTech" element={<Watch />} />
            <Route path="/BranchWearableTech" element={<BranchWatch />} />
            <Route path="/Printers" element={<Printers />} />
            <Route path="/BranchPrinters" element={<BranchPrinters />} />
            <Route path="/ComputerAccessories" element={<ComputerAccessories />} />
            <Route path="/BranchComputerAccessories" element={<BranchComputerAccessories />} />
            <Route path="/MobileAccessories" element={<MobileAccessories />} />
            <Route path="/BranchMobileAccessories" element={<BranchMobileAccessories />} />
            <Route path="/PrinterAccessories" element={<PrinterAccessories />} />
            <Route path="/BranchPrinterAccessories" element={<BranchPrinterAccessories />} />
            <Route path="/CCTVAccessories" element={<CCTVAccessories />} />
            <Route path="/BranchCCTVAccessories" element={<BranchCCTVAccessories />} />
            <Route path="/Secondhandproducts" element={<Secondhandproducts />} />
            <Route path="/BranchSecondhandproducts" element={<BranchSecondhandproducts />} />
            <Route path="/BranchAdminProfile" element={<BranchAdminProfile />} />

            {/* 🔒 Protected Routes */}
            <Route path="/Dashboard" element={<ProtectedRoute element={<Dashboard />} restrictedRoles={['Staff']} />} />
            <Route path="/BranchDashboard" element={<ProtectedRoute element={<BranchDashboard />} restrictedRoles={['Staff']} />} />
            <Route path="/Orders" element={<ProtectedRoute element={<Orders />} restrictedRoles={['Staff']} />} />
            <Route path="/Customers" element={<ProtectedRoute element={<Customers />} restrictedRoles={['Staff']} />} />
            <Route path="/Reports" element={<ProtectedRoute element={<Reports />} restrictedRoles={['Staff']} />} />
            <Route path="/SalesReport" element={<ProtectedRoute element={<SalesReport />} restrictedRoles={['Staff']} />} />
            <Route path="/CustomerReports" element={<ProtectedRoute element={<CustomerReports />} restrictedRoles={['Staff']} />} />
            <Route path="/ChangePassword" element={<ProtectedRoute element={<ChangePassword />} restrictedRoles={['Staff']} />} />
            <Route path="/EditHomePage" element={<ProtectedRoute element={<EditHomePage />} restrictedRoles={['Staff']} />} />
            <Route path="/EditDoubleImageAd" element={<ProtectedRoute element={<EditDoubleImageAd />} restrictedRoles={['Staff']} />} />
            <Route path="/EditSingleImageAd" element={<ProtectedRoute element={<EditSingleImageAd />} restrictedRoles={['Staff']} />} />
            <Route path="/EditLoginBackgroundImage" element={<ProtectedRoute element={<EditLoginpageBG />} restrictedRoles={['Staff']} />} />
            <Route path="/CareersTable" element={<ProtectedRoute element={<CareersTable />} restrictedRoles={['Staff']} />} />
            <Route path="/ContactsTable" element={<ProtectedRoute element={<ContactsTable />} restrictedRoles={['Staff']} />} />
            <Route path="/ComputersAd" element={<ProtectedRoute element={<ComputersAd />} restrictedRoles={['Staff']} />} />
            <Route path="/MobileAd" element={<ProtectedRoute element={<MobileAd />} restrictedRoles={['Staff']} />} />
            <Route path="/ProductDetailPage" element={<ProtectedRoute element={<ProductDetailPage />} restrictedRoles={['Staff']} />} />
            <Route path="/CCTVAd" element={<ProtectedRoute element={<CCTVAd />} restrictedRoles={['Staff']} />} />
            <Route path="/CouponManager" element={<ProtectedRoute element={<CouponManager />} restrictedRoles={['Staff']} />} />
            <Route path="/StaffManagement" element={<ProtectedRoute element={<StaffManagement />} restrictedRoles={['Staff']} />} />
            <Route path="/BranchManagement" element={<ProtectedRoute element={<BranchManagement />} restrictedRoles={['Staff']} />} />
            <Route path="*" element={<AdminNotFound />} />
          </Routes>
        </AdminMain>
      </NetworkStatus>
    </ThemeProvider>
  );
}

export default App;
