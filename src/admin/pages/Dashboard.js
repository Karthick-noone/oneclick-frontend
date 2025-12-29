import React, { useEffect, useState } from "react";
import "./css/Dashboard.css";
import {
  FaBox,
  FaChartLine,
  FaUsers,
  FaTag,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  FaDesktop,
  FaMobileAlt,
  FaVideo,
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

const Dashboard = () => {
  const [, setOrderData] = useState([]);
  const [, setSalesData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [, setTotalCategories] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);

  const [totalProducts, setTotalProducts] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [staffCount, setStaffCounts] = useState(0);

  useEffect(() => {
    // Fetch total products
    fetch(`${ApiUrl}/total-products`)
      .then(res => res.json())
      .then(data => setTotalProducts(data.total_products))
      .catch(err => console.error("Error fetching total products", err));

    // Fetch total staff
    fetch(`${ApiUrl}/total-staff`)
      .then(res => res.json())
      .then(data => setStaffCounts(data.staffCount))
      .catch(err => console.error("Error fetching total staff", err));

    // Fetch product counts by category
    fetch(`${ApiUrl}/product-count-by-category`)
      .then(res => res.json())
      .then(data => setCategoryCounts(data))
      .catch(err => console.error("Error fetching category counts", err));
  }, []);


  // Fetch pending payments from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchcategories`);

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
        const response = await axios.get(`${ApiUrl}/pending-payment`);
        const payments = response.data;

        // Sum the total amount of pending payments
        const totalPendingAmount = payments.reduce(
          (sum, payment) => sum + payment.total_amount, 0
        );

        setPendingPayments(
          new Intl.NumberFormat("en-IN").format(totalPendingAmount) // Format the amount
        );
      } catch (error) {
        console.error("Error fetching pending payments:", error);
      }
    };

    fetchPendingPayments();
  }, []);



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
      const response = await axios.get(`${ApiUrl}/api/users`);

      const totalCustomers = response.data.length; //  Assign to variable first
      setTotalCustomers(totalCustomers); //  Then update state
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, []);

  // Enhanced chart configurations
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const ordersResponse = await axios.get(`${ApiUrl}/fetchorders`);
        const ordersData = ordersResponse.data;
        setOrderData(ordersData);
        console.log("ordersData", ordersData)

        const totalOrders = ordersData.length;
        const totalSales = ordersData.reduce(
          (acc, order) => acc + order.total_amount,
          0
        );

        setTotalOrders(totalOrders);
        setTotalSales(new Intl.NumberFormat("en-IN").format(totalSales));

        // Enhanced monthly sales calculation with gradient colors
        const monthlySales = getLast6Months().map((month) => {
          const salesForMonth = ordersData
            .filter((order) => {
              const orderDate = new Date(order.order_date);
              return (
                orderDate.toLocaleString("default", { month: "long" }) === month
              );
            })
            .reduce((acc, order) => acc + order.total_amount, 0);
          return salesForMonth;
        });
        setMonthlySales(monthlySales);

        // Enhanced sales data with better colors
        const categorySales = ordersData.reduce((acc, order) => {
          acc[order.shipping_address] =
            (acc[order.shipping_address] || 0) + order.total_amount;
          return acc;
        }, {});

        setSalesData({
          labels: Object.keys(categorySales),
          datasets: [
            {
              label: "Sales by Category",
              data: Object.values(categorySales),
              backgroundColor: "rgba(74, 107, 255, 0.6)",
              borderColor: "rgba(74, 107, 255, 1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "rgba(74, 107, 255, 1)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        });

        const categoriesResponse = await axios.get(
          `${ApiUrl}/fetchproductcategories`
        );

        const categoriesData = categoriesResponse.data;
        console.log("categoriesData", categoriesData)

        const filteredCategories = categoriesData.filter(
          (cat) => cat.category && cat.category.trim().toLowerCase() !== "null"
        );

        // Enhanced pie chart colors and styling
        // Enhanced pie chart colors and styling
        const pieData = {
          labels: filteredCategories.map(cat => cat.category),
          datasets: [
            {
              label: "Category Distribution",
              data: filteredCategories.map(cat => Number(cat.total_amount) || 0), // ✅ FIXED
              backgroundColor: [
                "rgba(74, 107, 255, 0.8)",
                "rgba(46, 196, 182, 0.8)",
                "rgba(255, 94, 110, 0.8)",
                "rgba(255, 177, 66, 0.8)",
                "rgba(170, 103, 255, 0.8)",
                "rgba(72, 219, 111, 0.8)",
                "rgba(255, 138, 76, 0.8)",
                "rgba(59, 178, 208, 0.8)",
                "rgba(238, 103, 154, 0.8)",
                "rgba(174, 138, 190, 0.8)",
                "rgba(123, 201, 111, 0.8)",
                "rgba(255, 159, 67, 0.8)",
              ],
              borderColor: [
                "rgba(74, 107, 255, 1)",
                "rgba(46, 196, 182, 1)",
                "rgba(255, 94, 110, 1)",
                "rgba(255, 177, 66, 1)",
                "rgba(170, 103, 255, 1)",
                "rgba(72, 219, 111, 1)",
                "rgba(255, 138, 76, 1)",
                "rgba(59, 178, 208, 1)",
                "rgba(238, 103, 154, 1)",
                "rgba(174, 138, 190, 1)",
                "rgba(123, 201, 111, 1)",
                "rgba(255, 159, 67, 1)",
              ],
              borderWidth: 2,
              hoverOffset: 15,
              borderRadius: 6,
              spacing: 2,
            },
          ],
        };


        setPieData(pieData);
        console.log("Pie data", pieData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrderData();
  }, []);


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
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
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
          <div className="product-summary-card1">
            <img src={ElectronicDevices} alt="Product Categories" style={{ width: "35px", height: "35px" }} />
            <div className="summary-info">
              <h3>Product Categories</h3>
              <p>13</p>
            </div>
          </div>

          {allCategories
            .map((cat) => {
              const item = categoryCounts.find(c => c.category === cat);
              const count =
                item?.total_products || item?.total_category || item?.total_amount || 0;

              return { cat, count, item };
            })
            .sort((a, b) => b.count - a.count) //  highest to lowest
            // .sort((a, b) => a.count - b.count) //  lowest to highest (if you prefer)
            .map(({ cat, count }, index) => {
              const label = categoryLabels[cat] || cat;
              const icon = categoryIcons[cat] || <FaTags />;

              return (
                <Link
                  to={`/Admin/${cat === "TV"
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
                      <p style={{ color: count === 0 ? "red" : "inherit" }}>
                        {count === 0 ? "No Items" : count}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}




        </div>

        <h3>Other Reports</h3>

        <div className="dashboard-summary">
          <Link to={"/Admin/orders"}
            style={{ textDecoration: "none", color: "inherit" }}

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
          <Link to={"/Admin/customers"}
            style={{ textDecoration: "none", color: "inherit" }}

          >
            <div className="summary-card">
              <img className="summary-icon" src={Customers} alt="Customers" style={{ width: "45px", height: "45px" }} />
              <div className="summary-info">
                <h3>Total Customers</h3>
                <p>{totalCustomers}</p>
              </div>
            </div>
          </Link>

          <Link to={"/Admin/StaffManagement"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="summary-card">
              <img className="summary-icon" src={Staff} alt="Staff" style={{ width: "45px", height: "45px" }} />
              <div className="summary-info">
                <h3>Total Staffs</h3>
                <p>{staffCount}</p>
              </div>
            </div>
          </Link>
        </div>


        {/* // Enhanced JSX with improved chart options */}
        <div className="dashboard-charts">
          <div className="chart small-chart">
            <h2>Sales Overview (Last 6 Months)</h2>
            <Line
              data={{
                labels: getLast6Months(),
                datasets: [
                  {
                    label: "Sales Overview",
                    data: monthlySales,
                    backgroundColor: "rgba(74, 107, 255, 0.1)",
                    borderColor: "rgba(74, 107, 255, 1)",
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "rgba(74, 107, 255, 1)",
                    pointBorderColor: "#ffffff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointHoverBackgroundColor: "rgba(74, 107, 255, 1)",
                    pointHoverBorderColor: "#ffffff",
                    pointHoverBorderWidth: 3,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(226, 232, 240, 0.6)',
                      drawBorder: false,
                    },
                    ticks: {
                      color: '#64748b',
                      font: {
                        size: 12,
                        weight: '500',
                      },
                    },
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(226, 232, 240, 0.6)',
                      drawBorder: false,
                    },
                    ticks: {
                      color: '#64748b',
                      font: {
                        size: 12,
                        weight: '500',
                      },
                      callback: function (value) {
                        return '₹' + value.toLocaleString('en-IN');
                      },
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: {
                      color: '#1e293b',
                      font: {
                        size: 13,
                        weight: '600',
                      },
                      padding: 20,
                      usePointStyle: true,
                      pointStyle: 'circle',
                    },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#f8fafc',
                    bodyColor: '#f8fafc',
                    borderColor: 'rgba(74, 107, 255, 0.5)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                      label: function (context) {
                        return `Sales: ₹${context.parsed.y.toLocaleString('en-IN')}`;
                      },
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                },
              }}
            />
          </div>

          {/* <div className="chart small-chart pie-chart-container">
            <h2>Items Sold by Category</h2>
            {pieData ? (
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '45%',
                  layout: {
                    padding: {
                      top: 20,
                      bottom: 20,
                      left: 20,
                      right: 20,
                    },
                  },
                  interaction: {
                    intersect: true,
                    mode: 'point',
                  },
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 20,
                        color: '#1e293b',
                        font: {
                          size: 12,
                          weight: '500',
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        boxHeight: 8,
                      },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      titleColor: '#f8fafc',
                      bodyColor: '#f8fafc',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 1,
                      cornerRadius: 8,
                      displayColors: true,
                      callbacks: {
                        label: function (context) {
                          const label = context.label || '';
                          const value = context.parsed;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} items (${percentage}%)`; // Changed from ₹ to items
                        },
                      },
                    },
                  },
                  elements: {
                    arc: {
                      borderWidth: 2,
                      borderJoinStyle: 'round',
                    },
                  },
                }}
              />
            ) : (
              <div className="chart-placeholder">
                <div className="loading-spinner"></div>
                Loading chart data...
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
