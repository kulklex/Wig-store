import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51KVF4VDXLQnXLH3ZAEXYAaaGjmt9pokCaUleoc1msPk3v7dtjNjyH8EmIznpDf4WNoh2JoXcRhsHKuzjGIJZIfmq00DerQTkK5"
);

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

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

    try {
      const res = await axios.post("/api/create-checkout-session", {
        email: user ? user.email : form.email,
        shippingInfo: {
          name: form.name,
          address: form.address,
          city: form.city,
          zip: form.zip,
          phone: form.phone,
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.cartQty,
        })),
        total: totalAmount,
      });

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (err) {
      console.error("Stripe redirect error:", err);
      setError("Failed to redirect to payment.");
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
              className="text-dark"
              role="button"
              onClick={() => navigate("/")}
            >
              Start shopping
            </span>
            .
          </p>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-7">
            {!user && (
              <div className="mb-4 p-3 border rounded bg-light">
                <p className="mb-2 fw-semibold">
                  You’re checking out as a guest.
                </p>
                <p className="text-muted mb-3">
                  You can continue as guest or{" "}
                  <span
                    className="text-dark"
                    role="button"
                    onClick={() => navigate("/sign-in")}
                  >
                    login with Google
                  </span>{" "}
                  for faster checkout and order history.
                </p>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() => navigate("/sign-in")}
                  >
                    Continue with Google
                  </button>
                </div>
              </div>
            )}

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

              {!user && (
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
              )}

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="number"
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
                    <span className="text-dark fw-bold">£{item.finalPrice}</span>
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
