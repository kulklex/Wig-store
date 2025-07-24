import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div className="container py-5 text-center">
      <div className="p-4 border rounded bg-light">
        <h2 className="fw-bold text-success mb-3">Thank You for Your Order!</h2>

        {orderId ? (
          <>
            <p className="lead">Your order has been placed successfully.</p>
            <p>
              <strong>Order ID:</strong> <code>{orderId}</code>
            </p>
            <p className="text-muted">You’ll receive a confirmation email shortly.</p>
          </>
        ) : (
          <p className="text-danger">No order information available.</p>
        )}

        <button className="btn btn-dark mt-4" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
