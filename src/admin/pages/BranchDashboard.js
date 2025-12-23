import React, { useEffect, useState } from "react";
import "./css/Dashboard.css";

import {

  // FaHeadphones,
  // FaVolumeUp,
  // FaTv,
  // FaPrint,
  // FaClock,
  // FaTools,
  // FaCogs,
  FaTags,
  FaStore
} from "react-icons/fa";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import { ApiUrl } from "../../components/ApiUrl";
import { Link } from "react-router-dom";
import PrinterAccessoriesImage from './img/printer-accessories.png'
import ComputerAccessoriesImage from './img/computer-accessories.png'
import ComputerImage from './img/computer.png'
import CCTVAccessoriesImage from './img/cctvcamera.png'
import MobileAccessoriesImage from './img/charger.png'
import WatchImage from './img/smartwatch.png'
import TVImage from './img/tv.png'
import speakerImage from './img/speaker1.png'
import printerImage from './img/printer1.png'
import headphoneImage from './img/headphones.png'
import MobileImage from './img/mobile.png'
import CCTVImage from './img/cctv.png'
import Electronics from './img/electronics.png'
import Order from './img/order.png'
import Staff from './img/staff.png'
import Customers from './img/customers.png'
import Payment from './img/payment.png'
import Profit from './img/profit.png'
import Refurbish from './img/recycling.png'
import ElectronicDevices from './img/electronic-devices.png'


ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement
);

const BranchDashboard = () => {
  const [, setOrderData] = useState([]);
  const [, setSalesData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [, setTotalCategories] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);
  const [branches, setBranches] = useState([]);

  const [totalProducts, setTotalProducts] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [staffCount, setStaffCounts] = useState(0);


  // load default selected branch from localstorage
  const savedBranch = localStorage.getItem("current_branch") || "all";
  const [selectedBranch, setSelectedBranch] = useState(savedBranch);
  const userRole = localStorage.getItem("userRole");

  //  Fetch all branches
  const fetchBranches = async () => {
    try {
      const res = await fetch(`${ApiUrl}/api/branch/get-all`);
      const data = await res.json();
      console.log("branches", data.branches)

      if (res.ok) {
        setBranches(data.branches || []);
      } else {
        // toast
        console.error(data.message || "Failed to fetch branches");
      }
    } catch (err) {
      // console.error(err);
      console.error("Network error. Could not fetch branches", err);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (branches.length === 0) return;

    // always read latest
    const userRole = localStorage.getItem("userRole");
    const selected = selectedBranch === "all" ? "" : selectedBranch;

    const queryParams = new URLSearchParams({
      branch_id: selected,
      userRole
    }).toString();

    fetch(`${ApiUrl}/branch/total-products?${queryParams}`)
      .then(res => res.json())
      .then(data => setTotalProducts(data.total_products));

    // fetch(`${ApiUrl}/branch/total-staff?${queryParams}`)
    //   .then(res => res.json())
    //   .then(data => setStaffCounts(data.staffCount));

    fetch(`${ApiUrl}/branch/product-count-by-category?${queryParams}`)
      .then(res => res.json())
      .then(data => setCategoryCounts(data));

  }, [selectedBranch, branches.length]);

  // Fetch pending payments from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/branch/fetchcategories`);

        const totalCategories = response.data.length; //  Get the total number of categories

        console.log(totalCategories)

        setTotalCategories(totalCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const currentBranch = localStorage.getItem("current_branch");
        const userRole = localStorage.getItem("userRole");

        const response = await axios.get(`${ApiUrl}/branch/pending-payment`);
        let payments = response.data;

        console.log("Raw Pending Payments:", payments);

        // ⭐ ADMIN - ALL BRANCHES
        if (userRole === "Admin" && currentBranch === "all") {
          payments = payments.filter(p => p.branch_id !== null);
        }
        // ⭐ ADMIN - SPECIFIC BRANCH
        else if (userRole === "Admin" && currentBranch !== "all") {
          payments = payments.filter(
            p => p.branch_id !== null && p.branch_id == currentBranch
          );
        }
        // ⭐ BRANCH ADMIN
        else if (userRole === "branch_admin") {
          payments = payments.filter(
            p => p.branch_id !== null && p.branch_id == currentBranch
          );
        }

        console.log("Filtered Pending Payments:", payments);

        const totalPendingAmount = payments.reduce(
          (sum, payment) => sum + (payment.total_amount || 0),
          0
        );

        console.log("Total Pending Payments Amount:", totalPendingAmount);

        setPendingPayments(
          new Intl.NumberFormat("en-IN").format(totalPendingAmount)
        );

      } catch (error) {
        console.error("Error fetching pending payments:", error);
      }
    };

    fetchPendingPayments();
  }, [selectedBranch]);


  // Helper function to get last 6 months
  const getLast6Months = () => {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date.toLocaleString("default", { month: "long" }));
    }
    return months;
  };

  const fetchSalesReport = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/branch/api/users`);

      const totalCustomers = response.data.length; //  Assign to variable first
      setTotalCustomers(totalCustomers); //  Then update state
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, []);

  // Fetch order status from the backend
  const fetchOrderStatus = async (orderId) => {
    try {
      const response = await fetch(
        `${ApiUrl}/api/get-order-status?orderId=${orderId}`
      );
      const data = await response.json();
      return data.delivery_status; // Return delivery status from the response
    } catch (error) {
      console.error("Error fetching delivery status:", error);
      return "Unknown"; // Fallback value if there's an error
    }
  };


  useEffect(() => {
    const loadDashboardOrders = async () => {
      try {
        console.log("📌 Dashboard: Fetching orders with branch logic...");

        const currentBranch = localStorage.getItem("current_branch");
        const userRole = localStorage.getItem("userRole");

        // Call your already filtered API
        const response = await axios.get(`${ApiUrl}/fetchorders`);
        const orders = response.data.reverse();

        console.log("📌 Raw orders from API:", orders.length);

        // Calculate delivery status just like new page
        const ordersWithStatus = await Promise.all(
          orders.map(async (order) => {
            const deliveryStatus = await fetchOrderStatus(order.unique_id);
            return {
              ...order,
              delivery_status: deliveryStatus,
              products: order.products || [],
            };
          })
        );

        // BRANCH FILTERING (same as your new code)
        let finalOrders = ordersWithStatus;

        if (userRole === "Admin" && selectedBranch === "all") {
          finalOrders = finalOrders.filter(o => o.branch_id !== null);
        }
        else if (userRole === "Admin" && selectedBranch !== "all") {
          finalOrders = finalOrders.filter(
            o => o.branch_id !== null && o.branch_id == selectedBranch
          );
        }
        else if (userRole === "branch_admin") {
          finalOrders = finalOrders.filter(
            o => o.branch_id !== null && o.branch_id == currentBranch
          );
        }

        console.log("✅ Filtered Orders (Final):", finalOrders.length);

        // -----------------------------
        // DASHBOARD CALCULATIONS BELOW
        // -----------------------------

        // TOTAL ORDERS
        const totalOrders = finalOrders.length;
        setTotalOrders(totalOrders);
        console.log("📊 TOTAL ORDERS:", totalOrders);

        // TOTAL SALES
        const totalSales = finalOrders.reduce(
          (acc, order) => acc + (order.total_amount || 0),
          0
        );
        setTotalSales(new Intl.NumberFormat("en-IN").format(totalSales));
        console.log("💰 TOTAL SALES:", totalSales);

        // MONTHLY SALES
        const monthlySales = getLast6Months().map(month => {
          const totalForMonth = finalOrders
            .filter(order => {
              const date = new Date(order.order_date);
              return date.toLocaleString("default", { month: "long" }) === month;
            })
            .reduce((acc, order) => acc + (order.total_amount || 0), 0);

          return totalForMonth;
        });

        setMonthlySales(monthlySales);
        console.log("📅 MONTHLY SALES:", monthlySales);

      } catch (error) {
        console.error("❌ Dashboard: Failed loading orders", error);
      }
    };

    loadDashboardOrders();
  }, [selectedBranch]);



  const categoryIcons = {
    Computers: <img src={ComputerImage} alt="Computer" style={{ width: "35px", height: "35px" }} />,
    Mobiles: <img src={MobileImage} alt="Mobile" style={{ width: "35px", height: "35px" }} />,
    CCTV: <img src={CCTVImage} alt="CCTV" style={{ width: "35px", height: "35px" }} />,
    Headphones: <img src={headphoneImage} alt="Headphone" style={{ width: "35px", height: "35px" }} />,
    Speakers: <img src={speakerImage} alt="Speaker" style={{ width: "35px", height: "35px" }} />,
    TV: <img src={TVImage} alt="TV" style={{ width: "35px", height: "35px" }} />,
    Printers: <img src={printerImage} alt="Printer" style={{ width: "35px", height: "35px" }} />,
    Watch: <img src={WatchImage} alt="Watch" style={{ width: "35px", height: "35px" }} />,
    ComputerAccessories: <img src={ComputerAccessoriesImage} alt="Computer Accessories" style={{ width: "35px", height: "35px" }} />,
    MobileAccessories: <img src={MobileAccessoriesImage} alt="Mobile Accessories" style={{ width: "35px", height: "35px" }} />,
    CCTVAccessories: <img src={CCTVAccessoriesImage} alt="CCTV Accessories" style={{ width: "35px", height: "35px" }} />,
    PrinterAccessories: <img src={PrinterAccessoriesImage} alt="Printer Accessories" style={{ width: "35px", height: "35px" }} />,
    secondhandproducts: <img src={Refurbish} alt="Refurbish" style={{ width: "35px", height: "35px" }} />
  };

  const categoryLabels = {
    secondhandproducts: "Refurbished Products",
    CCTVAccessories: "CCTV Accessories",
    ComputerAccessories: "Computer Accessories",
    MobileAccessories: "Mobile Accessories",
    PrinterAccessories: "Printer Accessories"
  };

  const categoryOrder = [
    "Computers",
    "Mobiles",
    "CCTV",
    "Headphones",
    "Speakers",
    "TV",
    "Printers",
    "Watch",
    "ComputerAccessories",
    "MobileAccessories",
    "CCTVAccessories",
    "PrinterAccessories",
    "secondhandproducts"
  ];


  const allCategories = [
    "Computers",
    "Mobiles",
    "CCTV",
    "Headphones",
    "Speakers",
    "TV",
    "Printers",
    "Watch",
    "ComputerAccessories",
    "MobileAccessories",
    "CCTVAccessories",
    "PrinterAccessories",
    "secondhandproducts",
  ];


  return (
    <div className="dashboard">

      {userRole === "Admin" && (
        <div className="dashboard-header">
          <h2>Branches Dashboard</h2>

          <div className="dashboard-filter">
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                localStorage.setItem("current_branch", e.target.value);
              }}
              className="branch-select"
            >
              <option value="all">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.company}
                </option>
              ))}
            </select>
          </div>
        </div>

      )}

      <div className="dashboard-content">
        <h3>Product Summary</h3>

        <div className="dashboard-summary">
          <div className="product-summary-card1">
            <img className="summary-icon" src={Electronics} alt="Electronics" style={{ width: "45px", height: "45px" }} />
            {/* <FaBox /> */}
            <div className="summary-info">
              <h3>Total Products</h3>
              <p>{totalProducts}</p>
            </div>


          </div>
          {/* <div className="product-summary-card1">
            <img src={ElectronicDevices} alt="Product Categories" style={{ width: "35px", height: "35px" }} />            <div className="summary-info">
              <h3>Product Categories</h3>
              <p>13</p>
            </div>
          </div> */}
          {allCategories
            .map((cat) => {
              const item = categoryCounts.find(c => c.category.toLowerCase() === cat.toLowerCase());
              const count = item?.total_products || 0;
              const unApprovedCount = item?.unapproved_products || 0;

              return { cat, count, unApprovedCount };   // ✅ FIX: include unApprovedCount
            })
            .sort((a, b) => b.count - a.count)
            .map(({ cat, count, unApprovedCount }, index) => {
              const label = categoryLabels[cat] || cat;
              const icon = categoryIcons[cat] || <FaTags />;

              return (
                <Link
                  to={`/Admin/Branch${cat === "TV"
                    ? "TVHomeCinema"
                    : cat === "Watch"
                      ? "WearableTech"
                      : cat
                    }`}
                  key={index}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="product-summary-card">
                    <div className="summary-icon">{icon}</div>
                    <div className="summary-info">
                      <h3>{label}</h3>
                      <p style={{
                        color: count === 0 ? "#dc2626" : "#1f2937",
                        fontSize: "14px",
                        fontWeight: "600",
                        padding: "6px 12px 6px 8px",
                        borderRadius: "20px",
                        background: count === 0 ? "#fef2f2" : "#f0f9ff",
                        border: count === 0 ? "1px solid #fecaca" : "1px solid #bae6fd",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        margin: 0,
                        position: "relative"
                      }}>
                        <span style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: count === 0 ? "#dc2626" : unApprovedCount > 0 ? "#f59e0b" : "#10b981",
                          marginRight: "4px"
                        }}></span>
                        {count}
                        {unApprovedCount > 0 && (
                          <> (<span style={{
                            color: "#dc2626",
                            fontWeight: "700",
                            fontSize: "13px"
                          }}>{unApprovedCount}</span> pending)</>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}





        </div>

        <h3>Other Reports</h3>

        <div className="dashboard-summary">
          <Link
            to={"/Admin/BranchOrders"}
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={() => {
              console.log("Saving current branch:", selectedBranch);
              localStorage.setItem("current_branch", selectedBranch);
            }}
          >
            <div className="summary-card">
              <img className="summary-icon" src={Order} alt="Order" style={{ width: "45px", height: "45px" }} />
              <div className="summary-info">
                <h3>Total Orders</h3>
                <p>{totalOrders}</p>
              </div>
            </div>
          </Link>


          <div className="summary-card">
            <img className="summary-icon" src={Profit} alt="Profit" style={{ width: "45px", height: "45px" }} />
            <div className="summary-info">
              <h3>Sales Revenue</h3>
              <p>₹{totalSales}</p>
            </div>
          </div>


          <div className="summary-card">
            <img className="summary-icon" src={Payment} alt="Payment" style={{ width: "45px", height: "45px" }} />
            <div className="summary-info">
              <h3>Pending Payments</h3>
              <p>₹{pendingPayments}</p>
            </div>
          </div>
          {/* <Link to={"/Admin/customers"}
            style={{ textDecoration: "none", color: "inherit" }}

          >
            <div className="summary-card">
              <img className="summary-icon" src={Customers} alt="Customers" style={{ width: "45px", height: "45px" }} />
              <div className="summary-info">
                <h3>Total Customers</h3>
                <p>{totalCustomers}</p>
              </div>
            </div>
          </Link> */}

          {/* <Link to={"/Admin/StaffManagement"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="summary-card">
              <img className="summary-icon" src={Staff} alt="Staff" style={{ width: "45px", height: "45px" }} />
              <div className="summary-info">
                <h3>Total Staffs</h3>
                <p>{staffCount}</p>
              </div>
            </div>
          </Link> */}
        </div>


        {/* <div className="dashboard-charts">
          <div className="chart small-chart">
            <h2>Sales Overview (Last 6 Months)</h2>
            <Line
              data={{
                labels: getLast6Months(),
                datasets: [
                  {
                    label: "Sales Overview",
                    data: monthlySales,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    beginAtZero: true,
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>

          <div className="chart small-chart pie-chart-container">
            <h2>Category Distribution</h2>
            {pieData ? (
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  layout: {
                    padding: 20, // Add padding around the chart
                  },
                  plugins: {
                    legend: {
                      position: "bottom", // Position the legend below the chart
                      labels: {
                        padding: 20, // Add space between the legend and the chart
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="chart-placeholder">Loading...</div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BranchDashboard;

