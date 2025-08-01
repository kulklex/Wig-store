import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// const colors = [
//   "#8884d8",
//   "#82ca9d",
//   "#ffc658",
//   "#ff7f50",
//   "#00C49F",
//   "#FFBB28",
// ];

const AdminAnalytics = () => {
  const [overview, setOverview] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [dailyOrders, setDailyOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };

      const [overviewRes, monthlyRes, dailyRes, topRes, userRes] =
        await Promise.all([
          axios.get("/api/admin/analytics/overview", config),
          axios.get("/api/admin/analytics/monthly-revenue", config),
          axios.get("/api/admin/analytics/daily-orders", config),
          axios.get("/api/admin/analytics/top-products", config),
          axios.get("/api/admin/analytics/user-growth", config),
        ]);

      setOverview(overviewRes.data);
      setMonthlyRevenue(monthlyRes.data);
      setDailyOrders(dailyRes.data);
      setTopProducts(topRes.data);
      setUserGrowth(userRes.data);
    };

    fetchStats();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">📊 Admin Analytics</h2>

      <div className="row mb-4">
        {[
          { label: "Total Orders", value: overview.totalOrders },
          { label: "Total Users", value: overview.totalUsers },
          {
            label: "Total Revenue",
            value: `£${overview.totalRevenue?.toLocaleString()}`,
          },
        ].map((stat, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <div className="card shadow-sm p-3 text-center h-100">
              <h6 className="text-muted">{stat.label}</h6>
              <h4>{stat.value ?? "..."}</h4>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-5">
        <h5>💰 Monthly Revenue (Last 6 Months)</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-5">
        <h5>📦 Orders per Day (Last 30 Days)</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dailyOrders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Bar dataKey="orders" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-5">
        <h5>🏆 Top Selling Products</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSold" fill="#ff7f50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-5">
        <h5>👥 New Users (Last 6 Months)</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#00C49F" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAnalytics;
