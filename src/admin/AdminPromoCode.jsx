import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";

const AdminPromoCode = () => {
  const [codes, setCodes]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(null);
  const [copied, setCopied]       = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [form, setForm] = useState({
    value: "",
    minOrderAmount: "",
    maxUses: "",
    expiresAt: "",
  });

  const now = new Date();
  const stats = {
    total:   codes.length,
    active:  codes.filter((c) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > now)).length,
    expired: codes.filter((c) => c.expiresAt && new Date(c.expiresAt) <= now).length,
    used:    codes.reduce((sum, c) => sum + (c.usedCount || 0), 0),
  };

  const getStatus = (code) => {
    if (!code.isActive) return "inactive";
    if (code.expiresAt && new Date(code.expiresAt) <= now) return "expired";
    if (code.maxUses !== null && code.usedCount >= code.maxUses) return "exhausted";
    return "active";
  };

  const statusStyle = {
    active:    { bg: "#dcfce7", color: "#15803d", label: "Active"     },
    inactive:  { bg: "#f1f5f9", color: "#64748b", label: "Inactive"   },
    expired:   { bg: "#fef3c7", color: "#b45309", label: "Expired"    },
    exhausted: { bg: "#fee2e2", color: "#b91c1c", label: "Exhausted"  },
  };

  const fetchCodes = async () => {
    try {
      const res = await axios.get("/api/promo/admin/list");
      setCodes(res.data);
    } catch {
      setError("Failed to load promo codes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCodes(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post("/api/promo/admin/create", {
        value:          Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        maxUses:        form.maxUses        ? Number(form.maxUses)        : null,
        expiresAt:      form.expiresAt      || null,
      });

      setCodes((prev) => [res.data, ...prev]);
      setSuccess(`Code ${res.data.code} created successfully.`);
      setForm({ value: "", minOrderAmount: "", maxUses: "", expiresAt: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create code.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.patch(`/api/promo/admin/${id}/toggle`);
      setCodes((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    } catch {
      setError("Failed to toggle code.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/promo/admin/${id}`);
      setCodes((prev) => prev.filter((c) => c._id !== id));
      setConfirmDelete(null);
    } catch {
      setError("Failed to delete code.");
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-1">Promo Codes</h4>
      <p className="text-muted small mb-4">
        Auto-generated percentage-off codes. All codes are validated server-side at checkout.
      </p>

      {/* ── Stats bar ── */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total codes",  value: stats.total,   color: "#6366f1" },
          { label: "Active",       value: stats.active,  color: "#16a34a" },
          { label: "Expired",      value: stats.expired, color: "#b45309" },
          { label: "Total uses",   value: stats.used,    color: "#0891b2" },
        ].map((s) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className="border rounded-3 p-3 bg-white text-center">
              <div className="fw-bold fs-4" style={{ color: s.color }}>{s.value}</div>
              <div className="text-muted small">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Create form ── */}
      <div className="border rounded-3 p-4 bg-white mb-4">
        <h6 className="fw-bold mb-3">Generate new code</h6>
        <form onSubmit={handleCreate}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small">Discount % <span className="text-danger">*</span></label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 10"
                  min="1"
                  max="100"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  required
                />
                <span className="input-group-text">%</span>
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label small">Min order (optional)</label>
              <div className="input-group">
                <span className="input-group-text">£</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 50"
                  min="0"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                />
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label small">Max uses (optional)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Leave blank = once"
                min="1"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label small">Expires on (optional)</label>
              <input
                type="date"
                className="form-control"
                min={new Date().toISOString().split("T")[0]}
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
            </div>
          </div>

          {error   && <div className="alert alert-danger  mt-3 py-2 small">{error}</div>}
          {success && <div className="alert alert-success mt-3 py-2 small">{success}</div>}

          <button
            type="submit"
            className="btn btn-dark mt-3"
            disabled={submitting}
          >
            {submitting ? "Generating..." : "Generate code"}
          </button>
        </form>
      </div>

      {/* ── Codes table ── */}
      <div className="border rounded-3 bg-white overflow-hidden">
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <h6 className="fw-bold mb-0">All codes</h6>
          <span className="text-muted small">{codes.length} total</span>
        </div>

        {loading ? (
          <div className="p-4 text-center text-muted small">Loading...</div>
        ) : codes.length === 0 ? (
          <div className="p-4 text-center text-muted small">No codes yet. Generate one above.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min order</th>
                  <th>Uses</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => {
                  const status = getStatus(code);
                  const style  = statusStyle[status];
                  const usagePercent = code.maxUses
                    ? Math.round((code.usedCount / code.maxUses) * 100)
                    : null;

                  return (
                    <tr key={code._id}>
                      {/* Code + copy */}
                      <td className="align-middle">
                        <div className="d-flex align-items-center gap-2">
                          <code className="fw-bold text-dark">{code.code}</code>
                          <button
                            className="btn btn-sm p-0 text-muted"
                            title="Copy code"
                            onClick={() => handleCopy(code.code)}
                            style={{ lineHeight: 1 }}
                          >
                            {copied === code.code ? "✓" : "⧉"}
                          </button>
                        </div>
                      </td>

                      {/* Discount */}
                      <td className="align-middle fw-semibold">{code.value}%</td>

                      {/* Min order */}
                      <td className="align-middle text-muted">
                        {code.minOrderAmount > 0 ? `£${code.minOrderAmount}` : "—"}
                      </td>

                      {/* Uses + progress bar */}
                      <td className="align-middle" style={{ minWidth: 100 }}>
                        <div>
                          {code.usedCount}
                          {code.maxUses !== null && (
                            <span className="text-muted"> / {code.maxUses}</span>
                          )}
                        </div>
                        {usagePercent !== null && (
                          <div
                            className="mt-1 rounded"
                            style={{ height: 4, background: "#e5e7eb" }}
                          >
                            <div
                              className="rounded"
                              style={{
                                height: 4,
                                width: `${Math.min(usagePercent, 100)}%`,
                                background: usagePercent >= 100 ? "#ef4444" : "#111",
                                transition: "width 0.3s",
                              }}
                            />
                          </div>
                        )}
                      </td>

                      {/* Expiry */}
                      <td className="align-middle text-muted">
                        {code.expiresAt
                          ? new Date(code.expiresAt).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : "Never"}
                      </td>

                      {/* Status badge */}
                      <td className="align-middle">
                        <span
                          className="badge rounded-pill px-2 py-1"
                          style={{ background: style.bg, color: style.color, fontSize: 11 }}
                        >
                          {style.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="align-middle">
                        <div className="d-flex gap-2">
                          <button
                            className={`btn btn-sm ${code.isActive ? "btn-outline-secondary" : "btn-outline-success"}`}
                            onClick={() => handleToggle(code._id)}
                            title={code.isActive ? "Deactivate" : "Activate"}
                          >
                            {code.isActive ? "Pause" : "Activate"}
                          </button>

                          {/* Delete — two-step confirm */}
                          {confirmDelete === code._id ? (
                            <>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(code._id)}
                              >
                                Confirm
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setConfirmDelete(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => setConfirmDelete(code._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPromoCode;