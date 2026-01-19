import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { Link } from "react-router-dom";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    processing: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders", { withCredentials: true });
        setOrders(res.data);

        const stats = res.data.reduce(
          (acc, order) => {
            acc.totalOrders += 1;
            acc.totalRevenue += Number(order.total) || 0;

            const status = (order.status || "").toLowerCase();
            if (status === "processing") acc.processing += 1;
            else if (status === "delivered") acc.delivered += 1;
            else if (status === "cancelled") acc.cancelled += 1;
            else acc.inTransit += 1; // shipped, out for delivery, exchanged, etc.

            return acc;
          },
          { totalOrders: 0, processing: 0, inTransit: 0, delivered: 0, cancelled: 0, totalRevenue: 0 }
        );
        setMetrics(stats);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (value) => `£${Number(value || 0).toFixed(2)}`;

  if (loading) {
    return <div className="text-center my-5">Loading orders...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-md-start">Manage Orders</h2>
      <div className="mb-4 d-flex flex-wrap gap-3">
        <div
          className="card shadow-sm"
          style={{ minWidth: "110px", flex: "1 1 calc(20% - 12px)", maxWidth: "200px" }}
        >
          <div className="card-body">
            <h6 className="text-muted text-uppercase mb-1">Total Orders</h6>
            <h4 className="mb-0">{metrics.totalOrders}</h4>
          </div>
        </div>
        <div
          className="card shadow-sm"
          style={{ minWidth: "110px", flex: "1 1 calc(20% - 12px)", maxWidth: "200px" }}
        >
          <div className="card-body">
            <h6 className="text-muted text-uppercase mb-1">Processing</h6>
            <h4 className="mb-0">{metrics.processing}</h4>
          </div>
        </div>
        <div
          className="card shadow-sm"
          style={{ minWidth: "110px", flex: "1 1 calc(20% - 12px)", maxWidth: "200px" }}
        >
          <div className="card-body">
            <h6 className="text-muted text-uppercase mb-1">In Transit</h6>
            <h4 className="mb-0">{metrics.inTransit}</h4>
          </div>
        </div>
        <div
          className="card shadow-sm"
          style={{ minWidth: "110px", flex: "1 1 calc(20% - 12px)", maxWidth: "200px" }}
        >
          <div className="card-body">
            <h6 className="text-muted text-uppercase mb-1">Delivered</h6>
            <h4 className="mb-0">{metrics.delivered}</h4>
          </div>
        </div>
        <div
          className="card shadow-sm"
          style={{ minWidth: "110px", flex: "1 1 calc(20% - 12px)", maxWidth: "200px" }}
        >
          <div className="card-body">
            <h6 className="text-muted text-uppercase mb-1">Cancelled</h6>
            <h4 className="mb-0">{metrics.cancelled}</h4>
          </div>
        </div>
        <div
          className="card shadow-sm"
          style={{ minWidth: "110px", flex: "1 1 calc(20% - 12px)", maxWidth: "220px" }}
        >
          <div className="card-body">
            <h6 className="text-muted text-uppercase mb-1">Total Revenue</h6>
            <h4 className="mb-0">{formatCurrency(metrics.totalRevenue)}</h4>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle text-nowrap">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => {
              // const itemCount = order.items.reduce(
              //   (acc, item) => acc + item.quantity,
              //   0
              // );
              return (
                <tr key={order._id}>
                  <td>{order._id.slice(0, 5)}...</td>
                  <td>
                    <span
                      className={`badge text-bg-${
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Processing"
                          ? "secondary"
                          : order.status === "Cancelled"
                          ? "danger"
                          : order.status === "exchanged"
                          ? "danger"
                          : "warning"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Update Status
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center text-muted mt-4">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
