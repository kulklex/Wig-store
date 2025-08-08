import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertModal from "../components/AlertModal";
import { useSelector } from "react-redux";

const ReturnForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const predefinedReasons = [
    "Received wrong item",
    "Item is defective or damaged",
    "Quality not as expected",
    "Changed my mind",
    "Item delivered late",
    "Other",
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
        setShowModal(true)
        setModalTitle("Required Field")
      setModalMessage("Please select a reason for return.");
      return;
    }

    const finalReason =
      selectedReason === "Other" && otherReason.trim()
        ? `Other: ${otherReason}`
        : selectedReason;

    setSubmitting(true);

    try {
      await axios.post(
        "/api/orders/returns",
        {
          user: user?.email,
          orderId: state.order._id,
          items: state.selectedItems,
          reason: finalReason,
          orderDetails: state.order,
        },
        { withCredentials: true }
      );

      setShowModal(true);
      setModalTitle("Return Request Submitted");
      setModalMessage(
        "Thank you. You'll receive a confirmation email and we'll respond within 7 working days."
      );

      setTimeout(() => {
        navigate("/my-orders");
      }, 10000);
    } catch (err) {
      setModalTitle("Failed to Submit Return");
      setModalMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <h3 className="mb-3">Return Request Form</h3>
      <p className="text-muted">Order ID: {state.order._id}</p>

      <div className="mb-4">
        <label className="form-label">Reason for Return</label>
        <select
          className="form-select"
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          <option value="">-- Select a reason --</option>
          {predefinedReasons.map((reason, idx) => (
            <option key={idx} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>

      {selectedReason === "Other" && (
        <div className="mb-4">
          <label className="form-label">Please specify</label>
          <textarea
            rows={3}
            className="form-control"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="btn btn-primary"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Return Request"}
      </button>

      <AlertModal
        isOpen={showModal}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        confirmText="OK"
        cancelText=""
      />
    </div>
  );
};

export default ReturnForm;
