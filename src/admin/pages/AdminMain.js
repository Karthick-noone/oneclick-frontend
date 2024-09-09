import React,{useEffect} from 'react';
import Slidebar from './Slidebar';
import Topbar from './Topbar';
import { useNavigate } from 'react-router-dom';

const AdminHome = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  return (
    <div className="AdminMain">
      <Slidebar />
      <Topbar />
      <main className="content">
        {children}

        
      </main>
    </div>
  );
};

export default AdminHome;
