import React from 'react';
import { Routes, Route, Navigate  } from 'react-router-dom';
import AdminMain from './pages/AdminMain'; // Path to your AdminMain component
import Computers from './pages/AddComputers'; // Example page
import Mobiles from './pages/AddMobiles'; // Example page
import CCTV from './pages/AddCCTV'; // Example page
import Headphones from './pages/AddHeadphones'; // Example page
import Speakers from './pages/AddSpeakers'; // Example page
import Tv from './pages/AddTV'; // Example page
import Watch from './pages/AddWatch'; // Example page
import Printers from './pages/AddPrinters'; // Example page
import ComputerAccessories from './pages/AddComputerAccessories'; // Example page
import MobileAccessories from './pages/AddMobileAccessories'; // Example page
import CCTVAccessories from './pages/AddCCTVAccessories'; // Example page
import PrinterAccessories from './pages/AddPrinterAccessories'; // Example page
import Orders from './pages/Orders'; // Example page
import Customers from './pages/Customers'; // Example page
import Reports from './pages/Reports'; // Example page
import SalesReport from './pages/SalesReport'; // Example page
import CustomerReports from './pages/CustomerReports'; // Example page
import ChangePassword from './pages/ChangePassword'; // Example page
import EditHomePage from './pages/EditHomePage'; // Example page
import EditDoubleImageAd from './pages/EditDoubleImageAd'; // Example page
import EditSingleImageAd from './pages/EditSingleAdPage'; // Example page
import EditLoginpageBG from './pages/EditLoginPageBG'; // Example page
import Dashboard from './pages/Dashboard'; // Example page
import ContactsTable from './pages/ContactsTable'; // Example page
import CareersTable from './pages/CareersTable'; // Example page
import ComputersAd from './pages/ComputersAd'; // Example page
import MobileAd from './pages/MobileAd'; // Example page
import ProductDetailPage from './pages/ProductDetailPage'; // Example page
import CCTVAd from './pages/CCTVAd'; // Example page
import Tracking from './pages/Tracking'; // Example page
import CouponManager from './pages/CouponManager'; // Example page
import StaffManagement from './pages/StaffManagement'; // Example page
import Secondhandproducts from './pages/AddSecondhandproducts'; // Example page
import NewProduct from './pages/NewProduct'; // Example page
import { ThemeProvider } from './ThemeContext'; // Import ThemeProvider

function App() {
  // Inline style for body background
  const bodyStyle = {
    backgroundColor: '#f4f4f4', // Replace with your preferred background color
    minHeight: '100vh',
    margin: 0,
    fontFamily: 'calibri, sans-serif'
  };

  React.useEffect(() => {
    document.body.style.backgroundColor = bodyStyle.backgroundColor;
    document.body.style.minHeight = bodyStyle.minHeight;
    document.body.style.margin = bodyStyle.margin;
    document.body.style.fontFamily = bodyStyle.fontFamily;
  }, []);


  const userRole = localStorage.getItem('userRole'); // Get the role from localStorage

  const ProtectedRoute = ({ element, restrictedRoles }) => {
    // If the user role is restricted, redirect to the dashboard or home
    if (restrictedRoles.includes(userRole)) {
      return <Navigate to="/Admin/Dashboard" />; // You can change the redirect route as needed
    }
    return element; // Return the original element if not restricted
  };

  
  return (
    <ThemeProvider>
      <AdminMain>
        <Routes>
          <Route path="/Computers" element={<Computers />} />
          <Route path="/Mobiles" element={<Mobiles />} />
          <Route path="/CCTV" element={<CCTV />} />
          <Route path="/Headphones" element={<Headphones />} />
          <Route path="/Speakers" element={<Speakers />} />
          <Route path="/TVHomeCinema" element={<Tv />} />
          <Route path="/WearableTech" element={<Watch />} />
          <Route path="/Printers" element={<Printers />} />
          <Route path="/ComputerAccessories" element={<ComputerAccessories />} />
          <Route path="/MobileAccessories" element={<MobileAccessories />} />
          <Route path="/PrinterAccessories" element={<PrinterAccessories />} />
          <Route path="/CCTVAccessories" element={<CCTVAccessories />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Secondhandproducts" element={<Secondhandproducts />} />
          <Route path="/NewProduct" element={<NewProduct />} />

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
          <Route path="/Tracking" element={<ProtectedRoute element={<Tracking />} restrictedRoles={['Staff']} />} />
          <Route path="/CouponManager" element={<ProtectedRoute element={<CouponManager />} restrictedRoles={['Staff']} />} />
          <Route path="/StaffManagement" element={<ProtectedRoute element={<StaffManagement />} restrictedRoles={['Staff']} />} />
          
        </Routes>
      </AdminMain>
    </ThemeProvider>
  );
}

export default App;
