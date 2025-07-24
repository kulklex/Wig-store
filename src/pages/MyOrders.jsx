import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MyOrders = () => {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return; // if not logged in, skip fetching

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/orders/my-orders', { withCredentials: true });
        setOrders(response.data.orders || []);
        setError(null);
      } catch (err) {
        setError('Failed to load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="container py-5">
        <h3>Please log in to view your orders.</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Orders</h2>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading your orders...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="alert alert-info">
          You have no orders yet.
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="text-truncate" style={{ maxWidth: '150px' }}>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === 'Completed' ? 'bg-success' :
                        order.status === 'Cancelled' ? 'bg-danger' :
                        'bg-warning text-dark'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => alert(`View details for order ${order._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
