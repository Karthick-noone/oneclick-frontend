import React, { useEffect, useState } from "react";
import "./css/Dashboard.css";
import {
  FaBox,
  FaChartLine,
  FaUsers,
  FaTag,
  FaMoneyBillWave,
} from "react-icons/fa";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
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
  const [orderData, setOrderData] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);

  // Fetch pending payments from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/fetchcategories`);

        const totalCategories = response.data.length; // ✅ Get the total number of categories

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

      const totalCustomers = response.data.length; // ✅ Assign to variable first
      setTotalCustomers(totalCustomers); // ✅ Then update state
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  useEffect(() => {
    fetchSalesReport();
  }, []);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const ordersResponse = await axios.get(`${ApiUrl}/fetchorders`);
        const ordersData = ordersResponse.data;
        setOrderData(ordersData);

        const totalOrders = ordersData.length;
        const totalSales = ordersData.reduce(
          (acc, order) => acc + order.total_amount,
          0
        );
        // const totalCustomers = new Set(ordersData.map(order => order.user_id)).size;
        // const totalCategories = new Set(
        //   ordersData.map((order) => order.shipping_address)
        // ).size;

        setTotalOrders(totalOrders);
        setTotalSales(new Intl.NumberFormat("en-IN").format(totalSales)); // Format with commasc
        // setTotalCustomers(totalCustomers);
        // setTotalCategories(totalCategories);

        // Calculate monthly sales for the last 6 months
        const monthlySales = getLast6Months().map((month) => {
          const salesForMonth = ordersData
            .filter((order) => {
              const orderDate = new Date(order.order_date); // Ensure you have an 'order_date' field in your orders
              return (
                orderDate.toLocaleString("default", { month: "long" }) === month
              );
            })
            .reduce((acc, order) => acc + order.total_amount, 0);
          return salesForMonth;
        });
        setMonthlySales(monthlySales);

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
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });

        const categoriesResponse = await axios.get(
          `${ApiUrl}/fetchproductcategories`
        );

        const categoriesData = categoriesResponse.data;
        console.log(categoriesData)

        const filteredCategories = categoriesData.filter(
          (cat) => cat.category && cat.category.trim().toLowerCase() !== "null"
        );

        const pieData = {
          labels: filteredCategories.map((cat) => cat.category),
          datasets: [
            {
              label: "Category Distribution",
              data: categoriesData.map((cat) => cat.total_amount),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)", // Red
                "rgba(54, 162, 235, 0.2)", // Blue
                "rgba(255, 206, 86, 0.2)", // Yellow
                "rgba(75, 192, 192, 0.2)", // Teal
                "rgba(153, 102, 255, 0.2)", // Purple
                "rgba(255, 159, 64, 0.2)", // Orange
                "rgba(199, 199, 199, 0.2)", // Grey
                "rgba(144, 238, 144, 0.2)", // Light Green
                "rgba(240, 128, 128, 0.2)", // Light Coral
                "rgba(135, 206, 250, 0.2)", // Light Sky Blue
                "rgba(221, 160, 221, 0.2)", // Plum
                "rgba(189, 183, 107, 0.2)", // Dark Khaki
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)", // Red
                "rgba(54, 162, 235, 1)", // Blue
                "rgba(255, 206, 86, 1)", // Yellow
                "rgba(75, 192, 192, 1)", // Teal
                "rgba(153, 102, 255, 1)", // Purple
                "rgba(255, 159, 64, 1)", // Orange
                "rgba(199, 199, 199, 1)", // Grey
                "rgba(144, 238, 144, 1)", // Light Green
                "rgba(240, 128, 128, 1)", // Light Coral
                "rgba(135, 206, 250, 1)", // Light Sky Blue
                "rgba(221, 160, 221, 1)", // Plum
                "rgba(189, 183, 107, 1)", // Dark Khaki
              ],
              borderWidth: 1,
            },
          ],
        };

        setPieData(pieData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrderData();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-summary">
          <div className="summary-card">
            <FaBox className="summary-icon" />
            <div className="summary-info">
              <h3>Total Orders</h3>
              <p>{totalOrders}</p>
            </div>
          </div>
          <div className="summary-card">
            <FaChartLine className="summary-icon" />
            <div className="summary-info">
              <h3>Sales Revenue</h3>
              <p>₹{totalSales}</p>
            </div>
          </div>
          <div className="summary-card">
            <FaUsers className="summary-icon" />
            <div className="summary-info">
              <h3>Total Customers</h3>
              <p>{totalCustomers}</p>
            </div>
          </div>
          <div className="summary-card">
            <FaTag className="summary-icon" />
            <div className="summary-info">
              <h3>Product Categories</h3>
              {/* <p>{totalCategories}</p> */}
              <p>13</p>
            </div>
          </div>
          <div className="summary-card">
            <FaMoneyBillWave className="summary-icon" />
            <div className="summary-info">
              <h3>Pending Payments</h3>
              <p>₹{pendingPayments}</p>
            </div>
          </div>
        </div>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
