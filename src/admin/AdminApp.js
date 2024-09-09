import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import Orders from './pages/Orders'; // Example page
import Customers from './pages/Customers'; // Example page
import Reports from './pages/Reports'; // Example page
import ChangePassword from './pages/ChangePassword'; // Example page
import EditHomePage from './pages/EditHomePage'; // Example page
import EditDoubleImageAd from './pages/EditDoubleImageAd'; // Example page
import EditSingleImageAd from './pages/EditSingleAdPage'; // Example page
import Dashboard from './pages/Dashboard'; // Example page
import { ThemeProvider } from './ThemeContext'; // Import ThemeProvider

function App() {
  // Inline style for body background
  const bodyStyle = {
    backgroundColor: '#f4f4f4', // Replace with your preferred background color
    minHeight: '100vh',
    margin: 0,
    fontFamily: 'Poppins, sans-serif'
  };

  React.useEffect(() => {
    document.body.style.backgroundColor = bodyStyle.backgroundColor;
    document.body.style.minHeight = bodyStyle.minHeight;
    document.body.style.margin = bodyStyle.margin;
    document.body.style.fontFamily = bodyStyle.fontFamily;
  }, []);

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
          <Route path="/Orders" element={<Orders />} />
          <Route path="/Customers" element={<Customers />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/EditHomePage" element={<EditHomePage />} />
          <Route path="/EditDoubleImageAd" element={<EditDoubleImageAd />} />
          <Route path="/EditSingleImageAd" element={<EditSingleImageAd />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </AdminMain>
    </ThemeProvider>
  );
}

export default App;
