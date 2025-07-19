import React, { useState, useEffect, useRef, useCallback  } from "react";
import "./css/Slidebar.css"; // Ensure you create this CSS file
import {
  FaHome,
  FaBriefcase,
  FaBox,
  // FaTags,
  FaUsers,
  FaBars,
  FaChartLine,
  // FaCog,
  FaEnvelope,
  FaChevronDown,
  FaChevronRight,
  FaEdit,
  FaTag,
  FaProductHunt,
} from "react-icons/fa";
import logoImage from "./img/oneclick.png"; // Replace with the path to your image
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo2 from "./img/logo3.png";

const Slidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isEditPageOpen, setIsEditPageOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isOfferPageOpen, setIsOfferPageOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);


  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      window.innerWidth <= 768 // Apply only for mobile/tablet views
    ) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

// Collapse sidebar on navigation in mobile view
useEffect(() => {
  if (window.innerWidth <= 768) {
    setIsOpen(false);
  }
}, [location.pathname]); // Trigger on every route change

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/AdminLogin");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleProducts = () => {
    setIsProductsOpen((prev) => {
      if (!prev) {
        setIsEditPageOpen(false); // Close Edit Pages submenu
        setIsOfferPageOpen(false); // Close Offer Pages submenu
        setIsReportOpen(false); // Close Reports submenu
      }
      return !prev;
    });
  };

  const toggleEditPage = () => {
    setIsEditPageOpen((prev) => {
      if (!prev) {
        setIsProductsOpen(false); // Close Products submenu
        setIsOfferPageOpen(false); // Close Offer Pages submenu
        setIsReportOpen(false); // Close Reports submenu
      }
      return !prev;
    });
  };

  const toggleOfferPage = () => {
    setIsOfferPageOpen((prev) => {
      if (!prev) {
        setIsProductsOpen(false); // Close Products submenu
        setIsEditPageOpen(false); // Close Edit Pages submenu
        setIsReportOpen(false); // Close Reports submenu
      }
      return !prev;
    });
  };

  const toggleReports = () => {
    setIsReportOpen((prev) => {
      if (!prev) {
        setIsProductsOpen(false); // Close Products submenu
        setIsEditPageOpen(false); // Close Edit Pages submenu
        setIsOfferPageOpen(false); // Close Offer Pages submenu
      }
      return !prev;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768); // Open or close sidebar based on window width
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 //  Memoize isActive so it doesn't re-create on every render
const isActive = useCallback(
  (path) => (location.pathname === path ? "active" : ""),
  [location.pathname] //  dependency
);

//  Now these are clean
const isProductActive = useCallback(() => {
  return (
    isActive("/Admin/Computers") ||
    isActive("/Admin/Mobiles") ||
    isActive("/Admin/CCTV") ||
    isActive("/Admin/Headphones") ||
    isActive("/Admin/Speakers") ||
    isActive("/Admin/TVHomeCinema") ||
    isActive("/Admin/WearableTech") ||
    isActive("/Admin/Printers") ||
    isActive("/Admin/ComputerAccessories") ||
    isActive("/Admin/MobileAccessories") ||
    isActive("/Admin/PrinterAccessories") ||
    isActive("/Admin/CCTVAccessories") ||
    isActive("/Admin/secondhandproducts")
  );
}, [isActive]);

const isEditPageActive = useCallback(() => {
  return (
    isActive("/Admin/EditHomePage") ||
    isActive("/Admin/EditDoubleImageAd") ||
    isActive("/Admin/EditLoginBackgroundImage") ||
    isActive("/Admin/EditSingleImageAd") ||
    isActive("/Admin/CouponManager")
  );
}, [isActive]);

const isOfferPageActive = useCallback(() => {
  return (
    isActive("/Admin/ComputersAd") ||
    isActive("/Admin/MobileAd") ||
    isActive("/Admin/CCTVAd") ||
    isActive("/Admin/ProductDetailPage")
  );
}, [isActive]);

const isReportActive = useCallback(() => {
  return (
    isActive("/Admin/reports") ||
    isActive("/Admin/SalesReport") ||
    isActive("/Admin/CustomerReports")
  );
}, [isActive]);


useEffect(() => {
  if (isProductActive()) {
    setIsProductsOpen(true);
    setIsEditPageOpen(false);
    setIsOfferPageOpen(false);
    setIsReportOpen(false);
  } else if (isEditPageActive()) {
    setIsEditPageOpen(true);
    setIsProductsOpen(false);
    setIsOfferPageOpen(false);
    setIsReportOpen(false);
  } else if (isOfferPageActive()) {
    setIsOfferPageOpen(true);
    setIsProductsOpen(false);
    setIsEditPageOpen(false);
    setIsReportOpen(false);
  } else if (isReportActive()) {
    setIsReportOpen(true);
    setIsProductsOpen(false);
    setIsEditPageOpen(false);
    setIsOfferPageOpen(false);
  }
}, [isProductActive, isEditPageActive, isOfferPageActive, isReportActive]); //  Added dependencies


  const userRole = localStorage.getItem("userRole"); // Assuming "Staff" or "admin"

  return (
    <>
      <FaBars
        style={{ color: "white" }}
        className="hamburger-icon"
        onClick={toggleSidebar}
      />

      <div
        className={`slidebar ${isOpen ? "open" : "collapsed"}`}
        onMouseEnter={() => setIsOpen(true)}
          ref={sidebarRef}

      >
        <div className="slidebar-header">
          <button
            style={{ marginTop: "10px", color: "white" }}
            className="close-button"
            onClick={toggleSidebar}
          >
            {isOpen ? "◁" : ""}
          </button>
          {isOpen ? (
            <img src={logo2} alt="Logo" width={"175px"} />
          ) : (
            <img src={logoImage} alt="Logo" className="logo-img" />
          )}
        </div>
        <ul className="slidebar-menu">
          {userRole !== "Staff" && (
            <>
              <li>
                <Link
                  to="/Admin/Dashboard"
                  className={isActive("/Admin/Dashboard")}
                >
                  <FaHome className="menu-icon" /> {isOpen && "Dashboard"}
                </Link>
              </li>
            </>
          )}
          {userRole !== "Staff" && (
            <>
              <li>
                <Link to="/Admin/orders" className={isActive("/Admin/orders")}>
                  <FaBox className="menu-icon" /> {isOpen && "Orders"}
                </Link>
              </li>
            </>
          )}

          {/* {userRole !== 'Staff' && ( */}
          <li className={`submenu ${isProductsOpen ? "open" : ""}`}>
            <Link
              to="#"
              onClick={toggleProducts}
              className={isProductActive() ? "active" : ""}
            >
              <FaProductHunt className="menu-icon" /> {isOpen && "Products"}
              {isOpen &&
                (isProductsOpen ? (
                  <FaChevronDown className="submenu-icon" />
                ) : (
                  <FaChevronRight className="submenu-icon" />
                ))}
            </Link>
            {isOpen && isProductsOpen && (
              <ul className="submenu-items">
                <li>
                  <Link
                    to="/Admin/Computers"
                    className={isActive("/Admin/Computers")}
                  >
                    Computers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/Mobiles"
                    className={isActive("/Admin/Mobiles")}
                  >
                    Mobiles
                  </Link>
                </li>
                <li>
                  <Link to="/Admin/CCTV" className={isActive("/Admin/CCTV")}>
                    CCTV
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/Headphones"
                    className={isActive("/Admin/Headphones")}
                  >
                    Headphones
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/Speakers"
                    className={isActive("/Admin/Speakers")}
                  >
                    Speakers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/TVHomeCinema"
                    className={isActive("/Admin/TVHomeCinema")}
                  >
                    T.V & Home Cinema
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/WearableTech"
                    className={isActive("/Admin/WearableTech")}
                  >
                    Wearable Tech
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/Printers"
                    className={isActive("/Admin/Printers")}
                  >
                    Printers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/ComputerAccessories"
                    className={isActive("/Admin/ComputerAccessories")}
                  >
                    Computer Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/MobileAccessories"
                    className={isActive("/Admin/MobileAccessories")}
                  >
                    Mobile Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/PrinterAccessories"
                    className={isActive("/Admin/PrinterAccessories")}
                  >
                    Printer Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/CCTVAccessories"
                    className={isActive("/Admin/CCTVAccessories")}
                  >
                    CCTV Accessories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Admin/secondhandproducts"
                    className={isActive("/Admin/secondhandproducts")}
                  >
                    {" "}
                    <span>Second hand Products</span>{" "}
                  </Link>
                </li>
              </ul>
            )}
          </li>
          {/* )} */}
          {userRole !== "Staff" && (
            <>
              <li className={`submenu ${isEditPageOpen ? "open" : ""}`}>
                <Link
                  to="#"
                  onClick={toggleEditPage}
                  className={isEditPageActive() ? "active" : ""}
                >
                  <FaEdit className="menu-icon" /> {isOpen && "Edit Pages"}
                  {isOpen &&
                    (isEditPageOpen ? (
                      <FaChevronDown className="submenu-icon" />
                    ) : (
                      <FaChevronRight className="submenu-icon" />
                    ))}
                </Link>
                {isOpen && isEditPageOpen && (
                  <ul className="submenu-items">
                    <li>
                      <Link
                        to="/Admin/EditHomePage"
                        className={isActive("/Admin/EditHomePage")}
                      >
                        Edit Home Page Slider
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/EditDoubleImageAd"
                        className={isActive("/Admin/EditDoubleImageAd")}
                      >
                        Edit Four Images Ad
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/EditSingleImageAd"
                        className={isActive("/Admin/EditSingleImageAd")}
                      >
                        Edit Single Image Ad
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/EditLoginBackgroundImage"
                        className={isActive("/Admin/EditLoginBackgroundImage")}
                      >
                        Edit Login Page Background Image
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/CouponManager"
                        className={isActive("/Admin/CouponManager")}
                      >
                        Edit Common Coupon Code
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`submenu ${isOfferPageOpen ? "open" : ""}`}>
                <Link
                  to="#"
                  onClick={toggleOfferPage}
                  className={isOfferPageActive() ? "active" : ""}
                >
                  <FaTag className="menu-icon" /> {isOpen && "Ad Pages"}
                  {isOpen &&
                    (isOfferPageOpen ? (
                      <FaChevronDown className="submenu-icon" />
                    ) : (
                      <FaChevronRight className="submenu-icon" />
                    ))}
                </Link>
                {isOpen && isOfferPageOpen && (
                  <ul className="submenu-items">
                    <li>
                      <Link
                        to="/Admin/ComputersAd"
                        className={isActive("/Admin/ComputersAd")}
                      >
                        Computer Ad Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/MobileAd"
                        className={isActive("/Admin/MobileAd")}
                      >
                        Mobile Ad Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/CCTVAd"
                        className={isActive("/Admin/CCTVAd")}
                      >
                        CCTV Ad Page
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/ProductDetailPage"
                        className={isActive("/Admin/ProductDetailPage")}
                      >
                        Product Detail Page Ad
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* <li>
            <Link to="/Admin/reports" className={isActive('/Admin/reports')}>
              <FaChartLine className="menu-icon" /> {isOpen && 'Reports'}
            </Link>
          </li> */}

              <li className={`submenu ${isReportOpen ? "open" : ""}`}>
                <Link
                  to="#"
                  onClick={toggleReports}
                  className={isReportActive() ? "active" : ""}
                >
                  <FaChartLine className="menu-icon" /> {isOpen && "Reports"}
                  {isOpen &&
                    (isReportOpen ? (
                      <FaChevronDown className="submenu-icon" />
                    ) : (
                      <FaChevronRight className="submenu-icon" />
                    ))}
                </Link>
                {isOpen && isReportOpen && (
                  <ul className="submenu-items">
                    <li>
                      <Link
                        to="/Admin/reports"
                        className={isActive("/Admin/reports")}
                      >
                        Order Report
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/SalesReport"
                        className={isActive("/Admin/SalesReport")}
                      >
                        Sales Report
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/Admin/CustomerReports"
                        className={isActive("/Admin/CustomerReports")}
                      >
                        Customer Reports
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <Link
                  to="/Admin/customers"
                  className={isActive("/Admin/customers")}
                >
                  <FaUsers className="menu-icon" /> {isOpen && "Customers"}
                </Link>
              </li>

              <li>
                <Link
                  to="/Admin/StaffManagement"
                  className={isActive("/Admin/StaffManagement")}
                >
                  <FaUsers className="menu-icon" />{" "}
                  {isOpen && "Staff Management"}
                </Link>
              </li>
              <li>
                <Link
                  to="/Admin/CareersTable"
                  className={isActive("/Admin/CareersTable")}
                >
                  <FaBriefcase className="menu-icon" /> {isOpen && "Careers"}
                </Link>
              </li>
              {/* <li>
            <Link to="/Admin/Settings" className={isActive('/Admin/Settings')}>
              <FaCog className="menu-icon" /> {isOpen && 'Settings'}
            </Link>
          </li> */}
              <li>
                <Link
                  to="/Admin/ContactsTable"
                  className={isActive("/Admin/ContactsTable")}
                >
                  <FaEnvelope className="menu-icon" /> {isOpen && "Contact"}
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
