import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/authSlice';

const MyOrders = () => {
  const user = useSelector((state) => state.user.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

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

  const handleLogout = async () => {
    try {
      dispatch(clearUser());
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (user === null) {
    return (
      <div className="container py-5">
        <h3>Please log in to view your orders.</h3>
      </div>
    );
  }

  return (
    <div className="container py-5 position-relative">
      {user?.role === "admin" && <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-dark btn-sm" onClick={handleLogout}>
          Log Out
        </button>
      </div>}

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
        <div className="alert alert-info">You have no orders yet.</div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="table-responsive px-2">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="clickable-row"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  <td className="text-truncate" style={{ maxWidth: '150px' }}>
                    {order._id.slice(0, 5)}...
                  </td>
                  <td>
                     <span
                      className={`badge text-bg-${
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Processing"
                          ? "secondary"
                          : order.status === "Cancelled"
                          ? "danger"
                          : "primary"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>£{order.total.toFixed(2)}</td>
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
