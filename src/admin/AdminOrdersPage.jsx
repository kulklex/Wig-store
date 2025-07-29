import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders", { withCredentials: true });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center my-5">Loading orders...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-md-start">Manage Orders</h2>

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
            {orders.map((order) => {
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
