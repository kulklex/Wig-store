import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51KVF4VDXLQnXLH3ZAEXYAaaGjmt9pokCaUleoc1msPk3v7dtjNjyH8EmIznpDf4WNoh2JoXcRhsHKuzjGIJZIfmq00DerQTkK5"
);

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const FREE_THRESHOLD = 1000;

  const baseDeliveryOptions = useMemo(
    () => [
      {
        id: "standard",
        label: "Standard delivery (3–5 working days)",
        amount: 5.99,
      },
      {
        id: "next_day",
        label: "Next Day Delivery",
        amount: 10.99,
      },
      {
        id: "saturday",
        label: "Saturday Delivery",
        amount: 12.99,
      },
      {
        id: "sat_10am",
        label: "Sat 10am Delivery",
        amount: 14.99,
      },
    ],
    []
  );

  const [form, setForm] = useState({
    name: "",
    user: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
    deliveryInstructions: "",
  });

  const [selectedDelivery, setSelectedDelivery] = useState(baseDeliveryOptions[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Build delivery options; inject free-auto only when threshold met
  const deliveryOptions = useMemo(() => {
    return totalAmount >= FREE_THRESHOLD
      ? [
          {
            id: "free_auto",
            label: `Free Delivery (orders £${FREE_THRESHOLD}+)`,
            amount: 0,
            auto: true,
          },
          ...baseDeliveryOptions,
        ]
      : baseDeliveryOptions;
  }, [totalAmount, baseDeliveryOptions]);

  // Keep selection valid and auto-select free when eligible
  useEffect(() => {
    const stillValid = deliveryOptions.find((o) => o.id === selectedDelivery?.id);
    if (!stillValid) {
      setSelectedDelivery(deliveryOptions[0]);
      return;
    }
    const hasFree = deliveryOptions[0]?.auto;
    if (hasFree && selectedDelivery.id !== deliveryOptions[0].id) {
      setSelectedDelivery(deliveryOptions[0]);
    }
  }, [totalAmount, deliveryOptions, selectedDelivery]);

  const getDeliveryFee = (option) => {
    if (!option) return 0;
    return option.amount || 0;
  };

  const deliveryFee = getDeliveryFee(selectedDelivery);
  const grandTotal = totalAmount + deliveryFee;

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
        user: user ? user.email : form.email,
        shippingInfo: {
          name: form.name,
          address: form.address,
          city: form.city,
          zip: form.zip,
          phone: form.phone,
          deliveryInstructions: form.deliveryInstructions,
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.cartQty,
          color: item.color || "",
          laceSize: item.laceSize || "",
        })),
        total: grandTotal,
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
      ) : (<>
        <div className="row g-4">
          <div className="col-lg-5 order-1 order-lg-1">
            <div className="border rounded-4 p-4 shadow-sm bg-white h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 className="fw-bold mb-1">Order Summary</h5>
                  <p className="text-muted small mb-0">
                    Review items before placing your order.
                  </p>
                </div>
                <span className="badge bg-secondary-subtle text-dark border">
                  {items.length} item{items.length !== 1 && "s"}
                </span>
              </div>

              <ul className="list-group list-group-flush mb-4">
                {items.map((item) => {
                  const price = item.finalPrice ?? item.price ?? 0;
                  const attributes = [
                    { label: "Texture", value: item.texture },
                    { label: "Length", value: item.length },
                    { label: "Origin", value: item.origin },
                    { label: "Color", value: item.color },
                    { label: "Lace Size", value: item.laceSize },
                    { label: "Lace", value: item.lace },
                    { label: "Style", value: item.style },
                    { label: "Weight", value: item.weight },
                    { label: "Notes", value: item.fullDescription },
                  ].filter((a) => a.value);

                  return (
                    <li
                      key={item._id + item.variantId}
                      className="list-group-item px-0 py-3 border-0 border-bottom"
                    >
                      <div className="d-flex align-items-start gap-3 flex-wrap">
                        <img
                          src={item.media || "https://via.placeholder.com/72?text=Item"}
                          alt={item.title}
                          width={72}
                          height={72}
                          className="rounded border object-fit-cover"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="me-3">
                              <h6 className="mb-1 text-wrap">{item.title}</h6>
                              <div className="small text-muted">
                                {attributes
                                  .slice(0, 3)
                                  .map((attr) => `${attr.label}: ${attr.value}`)
                                  .join(" • ")}
                              </div>
                              {attributes.length > 3 && (
                                <div className="small text-muted">
                                  {attributes
                                    .slice(3)
                                    .map((attr) => `${attr.label}: ${attr.value}`)
                                    .join(" • ")}
                                </div>
                              )}
                              <div className="d-flex flex-wrap gap-2 mt-2">
                                <span className="badge text-bg-light border">
                                  Qty: {item.cartQty}
                                </span>
                              </div>
                            </div>
                            <span className="fw-semibold text-dark">
                              £{price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="rounded-4 p-3 bg-dark text-white d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <span className="text-white-50 small me-2">Subtotal</span>
                  <span className="fw-semibold">£{totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <span className="text-white-50 small me-2">Delivery</span>
                  <span className="fw-semibold">
                    {selectedDelivery?.label} — £{deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2 border-top border-white-25">
                  <div>
                    <span className="text-white-50 small d-block">Total</span>
                    <span className="fw-bold fs-4">£{grandTotal.toFixed(2)}</span>
                  </div>
                  <span className="text-white-50 small text-end">
                    VAT included where applicable
                  </span>
                </div>
              </div>
            </div>
          </div>


        <div className="my-3">
                <div className="list-group">
                  {deliveryOptions.map((opt) => {
                    const fee = getDeliveryFee(opt);
                    const isFree = fee === 0;
                    const disabled = opt.auto && totalAmount < FREE_THRESHOLD;

                    return (
                      <label
                        key={opt.id}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        style={{
                          cursor: disabled ? "not-allowed" : "pointer",
                          opacity: disabled ? 0.6 : 1,
                          backgroundColor: selectedDelivery.id === opt.id ? "#111" : "#fff",
                          color: selectedDelivery.id === opt.id ? "#fff" : "#212529",
                          borderColor: "#111",
                        }}
                      >
                        <div>
                          <div className="fw-semibold">{opt.label}</div>
                          <small className={selectedDelivery.id === opt.id ? "text-light" : "text-muted"}>
                            {isFree ? "Free" : `£${fee.toFixed(2)}`}
                          </small>
                        </div>
                        <input
                          type="radio"
                          name="delivery"
                          checked={selectedDelivery.id === opt.id}
                          onChange={() => !disabled && setSelectedDelivery(opt)}
                          disabled={disabled}
                          style={{ accentColor: "#111" }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

          <div className="col-lg-7 order-2 order-lg-2">
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
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Delivery Instructions{" "}
                    <span className="text-muted">(Optional)</span>
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    value={form.deliveryInstructions}
                    onChange={handleChange}
                    className="form-control"
                    rows="2"
                    placeholder=""
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
        </div>
      </>)}
    </div>
  );
};

export default Checkout;
