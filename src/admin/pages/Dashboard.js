import React, { useEffect, useState } from 'react';
import './css/Dashboard.css';
import { FaBox, FaChartLine, FaUsers, FaTag, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, ArcElement } from 'chart.js';
import { ApiUrl } from "../../components/ApiUrl";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, ArcElement);

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

  // Helper function to get last 6 months
  const getLast6Months = () => {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date.toLocaleString('default', { month: 'long' }));
    }
    return months;
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const ordersResponse = await axios.get(`${ApiUrl}/fetchorders`);
        const ordersData = ordersResponse.data;
        setOrderData(ordersData);

        const totalOrders = ordersData.length;
        const totalSales = ordersData.reduce((acc, order) => acc + order.total_amount, 0);
        const totalCustomers = new Set(ordersData.map(order => order.user_id)).size;
        const totalCategories = new Set(ordersData.map(order => order.shipping_address)).size;

        setTotalOrders(totalOrders);
        setTotalSales(totalSales);
        setTotalCustomers(totalCustomers);
        setTotalCategories(totalCategories);

        // Calculate monthly sales for the last 6 months
        const monthlySales = getLast6Months().map(month => {
          const salesForMonth = ordersData.filter(order => {
            const orderDate = new Date(order.order_date); // Ensure you have an 'order_date' field in your orders
            return orderDate.toLocaleString('default', { month: 'long' }) === month;
          }).reduce((acc, order) => acc + order.total_amount, 0);
          return salesForMonth;
        });
        setMonthlySales(monthlySales);

        const categorySales = ordersData.reduce((acc, order) => {
          acc[order.shipping_address] = (acc[order.shipping_address] || 0) + order.total_amount;
          return acc;
        }, {});

        setSalesData({
          labels: Object.keys(categorySales),
          datasets: [
            {
              label: 'Sales by Category',
              data: Object.values(categorySales),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        const categoriesResponse = await axios.get(`${ApiUrl}/fetchcategories`);
        const categoriesData = categoriesResponse.data;

        const pieData = {
          labels: categoriesData.map(cat => cat.category),
          datasets: [
            {
              label: 'Category Distribution',
              data: categoriesData.map(cat => cat.total_amount),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        };

        setPieData(pieData);

      } catch (error) {
        console.error('Error fetching data:', error);
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
              <p>${totalSales.toFixed(2)}</p>
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
              <p>{totalCategories}</p>
            </div>
          </div>
          <div className="summary-card">
            <FaMoneyBillWave className="summary-icon" />
            <div className="summary-info">
              <h3>Pending Payments</h3>
              <p>${pendingPayments.toFixed(2)}</p>
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
                    label: 'Sales Overview',
                    data: monthlySales,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
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
          <div className="chart small-chart">
            <h2>Orders by Category</h2>
            {salesData ? (
              <Bar
                data={salesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            ) : (
              <div className="chart-placeholder">Loading...</div>
            )}
          </div>
          <div className="chart small-chart">
            <h2>Category Distribution</h2>
            {pieData ? (
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
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