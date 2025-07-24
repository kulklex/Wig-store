import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../redux/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const orderItems = items.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.cartQty,
    }));

    const payload = {
      email: form.email,
      shippingInfo: {
        name: form.name,
        address: form.address,
        city: form.city,
        zip: form.zip,
        phone: form.phone,
      },
      items: orderItems,
      total: totalAmount,
    };

    try {
      const res = await axios.post("/api/orders", payload);

      if (res.status === 201) {
        dispatch(clearCart());
        navigate("/order-confirmation", {
          state: { orderId: res.data.order._id },
        });
      } else {
        throw new Error(res.data.message || "Unknown error");
      }
    } catch (err) {
      console.error("Order error:", err);
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">Checkout</h2>

      {items.length === 0 ? (
        <div className="text-center">
          <p>
            Your cart is empty.{" "}
            <span
              className="text-primary"
              role="button"
              onClick={() => navigate("/")}
            >
              Go shopping
            </span>
            .
          </p>
        </div>
      ) : (
        <div className="row">
          {/* Billing Form */}
          <div className="col-md-7">
            <form onSubmit={handlePlaceOrder}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button
                type="submit"
                className="btn btn-dark w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="col-md-5 mt-4 mt-md-0">
            <div className="border rounded p-4 bg-light">
              <h5 className="fw-bold mb-3">Order Summary</h5>
              <ul className="list-group mb-3">
                {items.map((item) => (
                  <li
                    key={item._id + item.variantId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="my-0">{item.title}</h6>
                      <small className="text-muted">Qty: {item.cartQty}</small>
                    </div>
                    <span className="text-muted">
                      £{(item.price * item.cartQty).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold">£{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
