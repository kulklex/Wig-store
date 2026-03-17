import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

const AdminPromoCodeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await axios.get(`/api/promo/admin/${id}`);
        setCode(res.data);
      } catch {
        setError("Failed to load promo code.");
      } finally {
        setLoading(false);
      }
    };
    fetchCode();
  }, [id]);

  if (loading)
    return (
      <div className="container py-5 text-center text-muted small">
        Loading...
      </div>
    );

  if (error || !code)
    return (
      <div className="container py-5 text-center text-danger small">
        {error || "Promo code not found."}
      </div>
    );

  const now = new Date();
  const isExpired = code.expiresAt && new Date(code.expiresAt) <= now;
  const isExhausted =
    code.maxUses !== null && (code.redeemedBy?.length ?? 0) >= code.maxUses;

  const getStatus = () => {
    if (!code.isActive)
      return { label: "Inactive", bg: "#f1f5f9", color: "#64748b" };
    if (isExpired) return { label: "Expired", bg: "#fef3c7", color: "#b45309" };
    if (isExhausted)
      return { label: "Exhausted", bg: "#fee2e2", color: "#b91c1c" };
    return { label: "Active", bg: "#dcfce7", color: "#15803d" };
  };

  const status = getStatus();

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      {/* ── Header ── */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div>
          <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <code style={{ fontSize: "1.1rem" }}>{code.code}</code>
            <span
              className="badge rounded-pill px-2 py-1"
              style={{
                background: status.bg,
                color: status.color,
                fontSize: 11,
              }}
            >
              {status.label}
            </span>
            {code.isFeatured && (
              <span
                className="badge rounded-pill px-2 py-1"
                style={{
                  background: "#fef9c3",
                  color: "#a16207",
                  fontSize: 11,
                }}
              >
                ★ Featured
              </span>
            )}
          </h4>
          <p className="text-muted small mb-0">
            Created {formatDate(code.createdAt)}
          </p>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Discount",
            value: `${code.value}%`,
            sub: "Percentage off",
            color: "#6366f1",
          },
          {
            label: "Min order",
            value: code.minOrderAmount > 0 ? `£${code.minOrderAmount}` : "None",
            sub: "Minimum cart value",
            color: "#0891b2",
          },
          {
            label: "Total uses",
            value: code.usedCount,
            sub: code.maxUses !== null ? `of ${code.maxUses} max` : "Unlimited",
            color: "#16a34a",
          },
          {
            label: "Expires",
            value: code.expiresAt
              ? new Date(code.expiresAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Never",
            sub: isExpired
              ? "Already expired"
              : code.expiresAt
                ? "Upcoming"
                : "No expiry set",
            color: isExpired ? "#b91c1c" : "#64748b",
          },
        ].map((s) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className="border rounded-3 p-3 bg-white text-center h-100">
              <div className="fw-bold fs-4" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="fw-semibold small text-dark">{s.label}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>
                {s.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Featured message ── */}
      {code.featuredMessage && (
        <div
          className="mb-4 p-3 rounded-3 border"
          style={{ backgroundColor: "#fafaf7", borderColor: "#e5e3dc" }}
        >
          <div className="text-muted small mb-1">Homepage message</div>
          <div className="fw-semibold">"{code.featuredMessage}"</div>
        </div>
      )}

      {/* ── Redemptions table ── */}
      <div className="border rounded-3 bg-white overflow-hidden">
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <div>
            <h6 className="fw-bold mb-0">Redemptions</h6>
            <p className="text-muted small mb-0">
              Every customer who has successfully used this code
            </p>
          </div>
          <span
            className="badge rounded-pill px-3 py-1"
            style={{ background: "#f1f5f9", color: "#475569", fontSize: 12 }}
          >
            {code.redeemedBy?.length ?? 0} user
            {code.redeemedBy?.length !== 1 ? "s" : ""}
          </span>
        </div>

        {!code.redeemedBy?.length ? (
          <div className="p-4 text-center text-muted small">
            No redemptions yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Redeemed on</th>
                </tr>
              </thead>
              <tbody>
                {code.redeemedBy.map((r, i) => (
                  <tr key={i}>
                    <td className="align-middle text-muted">{i + 1}</td>
                    <td className="align-middle fw-semibold">{r.email}</td>
                    <td className="align-middle text-muted">
                      {formatDate(r.redeemedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPromoCodeDetails;
