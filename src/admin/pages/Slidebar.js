import React, { useState, useEffect, useRef, useCallback } from "react";
import "./css/Slidebar.css";
import { FaBars, FaChevronDown, FaChevronRight } from "react-icons/fa";
import logoImage from "./img/oneclick.png";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo2 from "./img/logo3.png";
import {
  BoxIcon, BriefcaseBusiness, ChartColumnIncreasing, Edit, Gift, Handshake,
  Image, LayoutDashboard, ListCheck, MessageCircleMore, MessageSquareDot, MessageSquareMore, PanelLeft, User, Users, Users2
} from "lucide-react";

const Slidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const userRole = localStorage.getItem("userRole");

  // Helper function to get the correct path based on user role
  const getPath = (adminPath) => {
    if (userRole === "Admin" || userRole === "Staff") {
      return adminPath;
    } else {
      // Convert "/Admin/Speakers" to "/Admin/BranchSpeakers"
      return adminPath.replace("/Admin/", "/Admin/Branch");
    }
  };

  // Submenu configuration with role-based paths
  const submenus = {
    products: {
      title: "Products",
      icon: BoxIcon,
      items: [
        { path: "/Admin/Computers", label: "Computers" },
        { path: "/Admin/Mobiles", label: "Mobiles" },
        { path: "/Admin/CCTV", label: "CCTV" },
        { path: "/Admin/Headphones", label: "Headphones" },
        { path: "/Admin/Speakers", label: "Speakers" },
        { path: "/Admin/TVHomeCinema", label: "T.V & Home Cinema" },
        { path: "/Admin/WearableTech", label: "Wearable Tech" },
        { path: "/Admin/Printers", label: "Printers" },
        { path: "/Admin/ComputerAccessories", label: "Computer Accessories" },
        { path: "/Admin/MobileAccessories", label: "Mobile Accessories" },
        { path: "/Admin/PrinterAccessories", label: "Printer Accessories" },
        { path: "/Admin/CCTVAccessories", label: "CCTV Accessories" },
        { path: "/Admin/secondhandproducts", label: "Second hand Products" }
      ]
    },
    editPages: {
      title: "Edit Pages",
      icon: Edit,
      items: [
        { path: "/Admin/EditHomePage", label: "Edit Home Page Slider" },
        { path: "/Admin/EditDoubleImageAd", label: "Edit Four Images Ad" },
        { path: "/Admin/EditSingleImageAd", label: "Edit Single Image Ad" },
        { path: "/Admin/EditLoginBackgroundImage", label: "Edit Login Page Background Image" },
        { path: "/Admin/CouponManager", label: "Edit Common Coupon Code" }
      ]
    },
    adPages: {
      title: "Ad Pages",
      icon: Image,
      items: [
        { path: "/Admin/ComputersAd", label: "Computer Ad Page" },
        { path: "/Admin/MobileAd", label: "Mobile Ad Page" },
        { path: "/Admin/CCTVAd", label: "CCTV Ad Page" },
        { path: "/Admin/ProductDetailPage", label: "Product Detail Page Ad" }
      ]
    },
    reports: {
      title: "Reports",
      icon: ChartColumnIncreasing,
      items: [
        { path: "/Admin/reports", label: "Order Report" },
        { path: "/Admin/SalesReport", label: "Sales Report" },
        { path: "/Admin/CustomerReports", label: "Customer Reports" }
      ]
    },
    branches: {
      title: "Branch Partners",
      icon: Handshake,
      items: [
        { path: "/Admin/BranchManagement", label: "List Of Branches" },
        { path: "/Admin/BranchDashboard", label: "All Branch Products" },
        { path: "/Admin/BranchOrders", label: "All Branch Orders" },
        { path: "/Admin/MarginSettings", label: "Set Margin" }
      ]
    }
  };

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth <= 768) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on mobile navigation
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check authentication
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  // Active link checker
  const isActive = useCallback((path) => location.pathname === path ? "active" : "", [location.pathname]);

  // Check if any item in submenu is active
  const isSubmenuActive = useCallback((menuItems) => {
    return menuItems.some(item => {
      const actualPath = getPath(item.path);
      return isActive(actualPath);
    });
  }, [isActive, userRole]);

  // Auto-open submenu based on current route
  useEffect(() => {
    for (const [key, menu] of Object.entries(submenus)) {
      if (isSubmenuActive(menu.items)) {
        setOpenSubmenu(key);
        return;
      }
    }
    setOpenSubmenu(null);
  }, [location.pathname, isSubmenuActive]);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const toggleSubmenu = (submenuKey) => {
    setOpenSubmenu(prev => prev === submenuKey ? null : submenuKey);
  };

  const renderSubmenu = (key, menu) => {
    const IconComponent = menu.icon;
    const isSubOpen = openSubmenu === key;
    const isActiveSubmenu = isSubmenuActive(menu.items);

    return (
      <li className={`submenu ${isSubOpen ? "open" : ""}`}>
        <Link
          to="#"
          onClick={() => toggleSubmenu(key)}
          className={isActiveSubmenu ? "active" : ""}
        >
          <IconComponent size={18} className="menu-icon" />
          {isOpen && menu.title}
          {isOpen && (isSubOpen ?
            <FaChevronDown className="submenu-icon" /> :
            <FaChevronRight className="submenu-icon" />
          )}
        </Link>
        {isOpen && isSubOpen && (
          <ul className="submenu-items">
            {menu.items.map((item) => {
              const actualPath = getPath(item.path);
              return (
                <li key={actualPath}>
                  <Link
                    to={actualPath}
                    className={isActive(actualPath)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <FaBars
        style={{ color: "white" }}
        className="hamburger-icon"
        onClick={toggleSidebar}
      />

      <div
        className={`slidebar ${isOpen ? "open" : "collapsed"}`}
        onMouseEnter={() => window.innerWidth > 768 && setIsOpen(true)}
        ref={sidebarRef}
      >
        <div className="slidebar-header">
          <button
            style={{ marginTop: "10px", color: "white" }}
            className="close-button"
            onClick={toggleSidebar}
          >
            {isOpen ? <PanelLeft size={16} /> : ""}
          </button>
          {isOpen ? (
            <img src={logo2} alt="Logo" width={"155px"} />
          ) : (
            <img src={logoImage} alt="Logo" className="logo-img" />
          )}
        </div>

        <ul className="slidebar-menu">
          {/* Dashboard */}
          {userRole !== "Staff" && (
            <li>
              <Link
                to={userRole === "Admin" ? "/Admin/Dashboard" : "/Admin/BranchDashboard"}
                className={isActive(userRole === "Admin" ? "/Admin/Dashboard" : "/Admin/BranchDashboard")}
              >
                <LayoutDashboard size={18} className="menu-icon" />
                {isOpen && "Dashboard"}
              </Link>
            </li>
          )}

          {/* Orders */}
          {userRole !== "Staff" && (
            <li>
              <Link
                to={userRole === "Admin" ? "/Admin/orders" : "/Admin/BranchOrders"}
                className={isActive(userRole === "Admin" ? "/Admin/orders" : "/Admin/BranchOrders")}
              >
                <ListCheck size={18} className="menu-icon" />
                {isOpen && "Orders"}
              </Link>
            </li>
          )}



          {/* Products Submenu */}
          {renderSubmenu("products", submenus.products)}


          {/* {userRole === "branch_admin" && (
            <li>
              <Link to="/Admin/BranchAdminProfile" className={isActive("/Admin/BranchAdminProfile")}>
                <User size={18} className="menu-icon" />
                {isOpen && "Profile"}
              </Link>
            </li>
          )} */}
          {/* Admin Only Menus */}
          {userRole === "Admin" && (
            <>
              {renderSubmenu("editPages", submenus.editPages)}
              {renderSubmenu("adPages", submenus.adPages)}
              {renderSubmenu("reports", submenus.reports)}
              {renderSubmenu("branches", submenus.branches)}

              <li>
                <Link to="/Admin/customers" className={isActive("/Admin/customers")}>
                  <Users2 size={18} className="menu-icon" />
                  {isOpen && "Customers"}
                </Link>
              </li>

              <li>
                <Link to="/Admin/StaffManagement" className={isActive("/Admin/StaffManagement")}>
                  <Users size={18} className="menu-icon" />
                  {isOpen && "Staff Management"}
                </Link>
              </li>

              <li>
                <Link to="/Admin/CareersTable" className={isActive("/Admin/CareersTable")}>
                  <BriefcaseBusiness size={18} className="menu-icon" />
                  {isOpen && "Careers"}
                </Link>
              </li>

              <li>
                <Link to="/Admin/ContactsTable" className={isActive("/Admin/ContactsTable")}>
                  <MessageSquareMore size={18} className="menu-icon" />
                  {isOpen && "Contact"}
                </Link>
              </li>

              <li>
                <Link to="/Admin/AdminScratchRewards" className={isActive("/Admin/AdminScratchRewards")}>
                  <Gift size={18} className="menu-icon" />
                  {isOpen && "Scratch Rewards"}
                </Link>
              </li>


            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Slidebar;