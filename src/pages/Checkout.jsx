import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { loadStripe } from "@stripe/stripe-js";
import { sanitizeEmail, sanitizePhone, sanitizeText } from "../utils/sanitize";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

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
        amount: 4.99,
      },
      { id: "next_day", label: "Next Day Delivery", amount: 9.99 },
    ],
    [],
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
    deliveryInstructions: "",
  });

  const [selectedDelivery, setSelectedDelivery] = useState(
    baseDeliveryOptions[0],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Promo code state ───────────────────────────────────────────────────────
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discount, message }
  const [promoError, setPromoError] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);

  // ── Delivery options ───────────────────────────────────────────────────────
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

  // Keep selection valid; auto-select free when eligible
  useEffect(() => {
    const stillValid = deliveryOptions.find(
      (o) => o.id === selectedDelivery?.id,
    );
    if (!stillValid) {
      setSelectedDelivery(deliveryOptions[0]);
      return;
    }
    const hasFree = deliveryOptions[0]?.auto;
    if (hasFree && selectedDelivery.id !== deliveryOptions[0].id) {
      setSelectedDelivery(deliveryOptions[0]);
    }
  }, [totalAmount, deliveryOptions, selectedDelivery]);

  // ── Totals ─────────────────────────────────────────────────────────────────
  const deliveryFee = selectedDelivery?.amount ?? 0;
  const discount = appliedPromo?.discount ?? 0;
  const grandTotal = totalAmount + deliveryFee - discount;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    setAppliedPromo(null);

    try {
      const res = await axios.post("/api/promo/validate", {
        code: promoInput.trim(),
        orderTotal: totalAmount,
      });
      setAppliedPromo(res.data);
    } catch (err) {
      setPromoError(err.response?.data?.error || "Invalid promo code.");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError(null);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanForm = {
      name: sanitizeText(form.name, { maxLength: 120 }),
      email: sanitizeEmail(form.email),
      address: sanitizeText(form.address, { maxLength: 200 }),
      city: sanitizeText(form.city, { maxLength: 120 }),
      zip: sanitizeText(form.zip, { maxLength: 20 }),
      phone: sanitizePhone(form.phone),
      deliveryInstructions: sanitizeText(form.deliveryInstructions, {
        maxLength: 500,
        allowNewlines: true,
      }),
    };

    try {
      const res = await axios.post("/api/create-checkout-session", {
        email: user ? user.email : cleanForm.email,
        user: user ? user.email : cleanForm.email,
        shippingInfo: {
          name: cleanForm.name,
          address: cleanForm.address,
          city: cleanForm.city,
          zip: cleanForm.zip,
          phone: cleanForm.phone,
          deliveryInstructions: cleanForm.deliveryInstructions,
          deliveryOption: selectedDelivery,
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.cartQty,
          color: item.color || "",
          laceSize: item.laceSize || "",
        })),
        total: grandTotal, // final amount after discount + delivery
        promoCode: appliedPromo?.code || null,
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
    <div className="container py-5 px-2">
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
        <>
          <div className="row g-4">
            {/* ── Order Summary ── */}
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
                            src={
                              item.media ||
                              "https://via.placeholder.com/72?text=Item"
                            }
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
                                    .map((a) => `${a.label}: ${a.value}`)
                                    .join(" • ")}
                                </div>
                                {attributes.length > 3 && (
                                  <div className="small text-muted">
                                    {attributes
                                      .slice(3)
                                      .map((a) => `${a.label}: ${a.value}`)
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

                {/* ── Totals panel ── */}
                <div className="rounded-4 p-3 bg-dark text-white d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <span className="text-white-50 small">Subtotal</span>
                    <span className="fw-semibold">
                      £{totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <span className="text-white-50 small">Delivery</span>
                    <span className="fw-semibold">
                      {selectedDelivery?.label} — £{deliveryFee.toFixed(2)}
                    </span>
                  </div>

                  {/* Discount row — only shown when a promo is applied */}
                  {appliedPromo && (
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                      <span className="text-white-50 small">
                        Discount{" "}
                        <span className="text-success">
                          ({appliedPromo.code})
                        </span>
                      </span>
                      <span className="fw-semibold text-success">
                        −£{discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2 border-top border-white-25">
                    <div>
                      <span className="text-white-50 small d-block">Total</span>
                      <span className="fw-bold fs-4">
                        £{grandTotal.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-white-50 small text-end">
                      VAT included where applicable
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Delivery options ── */}
            <div className="my-3">
              <div className="list-group">
                {deliveryOptions.map((opt) => {
                  const fee = opt.amount ?? 0;
                  const isFree = fee === 0;
                  const disabled = opt.auto && totalAmount < FREE_THRESHOLD;
                  const selected = selectedDelivery.id === opt.id;

                  return (
                    <label
                      key={opt.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      style={{
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.6 : 1,
                        backgroundColor: selected ? "#111" : "#fff",
                        color: selected ? "#fff" : "#212529",
                        borderColor: "#111",
                      }}
                    >
                      <div>
                        <div className="fw-semibold">{opt.label}</div>
                        <small
                          className={selected ? "text-light" : "text-muted"}
                        >
                          {isFree ? "Free" : `£${fee.toFixed(2)}`}
                        </small>
                      </div>
                      <input
                        type="radio"
                        name="delivery"
                        checked={selected}
                        onChange={() => !disabled && setSelectedDelivery(opt)}
                        disabled={disabled}
                        style={{ accentColor: "#111" }}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ── Shipping form ── */}
            <div className="col-lg-7 order-2 order-lg-2">
              {!user && (
                <div className="mb-4 p-3 border rounded bg-light">
                  <p className="mb-2 fw-semibold">
                    You're checking out as a guest.
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
                    />
                  </div>
                </div>

                {/* ── Promo Code ── */}
                <div className="mb-3">
                  <label className="form-label">
                    Promo Code <span className="text-muted">(Optional)</span>
                  </label>

                  {appliedPromo ? (
                    // Applied state
                    <div className="d-flex align-items-center gap-2 p-2 border border-success rounded bg-success-subtle">
                      <span className="fw-semibold text-success flex-grow-1 small">
                        ✓ {appliedPromo.code} — {appliedPromo.message} (−£
                        {discount.toFixed(2)})
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleRemovePromo}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    // Input state
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control text-uppercase"
                        placeholder="Enter promo code"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoError(null); // clear error on new input
                        }}
                        disabled={promoLoading}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoInput.trim()}
                      >
                        {promoLoading ? "Checking..." : "Apply"}
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <div className="text-danger small mt-1">{promoError}</div>
                  )}
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button
                  type="submit"
                  className="btn btn-dark w-100 mt-3"
                  disabled={loading}
                >
                  {loading
                    ? "Placing Order..."
                    : `Place Order — £${grandTotal.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
