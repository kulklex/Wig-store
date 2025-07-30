import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (sessionId) {
      dispatch(clearCart());
      localStorage.removeItem("cartState");
    }
  }, [sessionId, dispatch]);

  return (
    <div className="container py-5 text-center">
      <div className="p-4 border rounded bg-light">
        <h2 className="fw-bold text-success mb-3">Thank You for Your Order!</h2>

        <>
          <p className="lead">Your order has been placed successfully.</p>
          <p className="text-muted">
            You’ll receive a confirmation email shortly.
          </p>
        </>

        <button className="btn btn-dark mt-4" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
