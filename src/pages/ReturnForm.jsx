import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertModal from "../components/AlertModal";
import { useSelector } from "react-redux";
import imageCompression from "browser-image-compression";

const ReturnForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [images, setImages] = useState([null, null, null]);

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

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      setImages((prev) => {
        const newImages = [...prev];
        newImages[index] = compressedFile;
        return newImages;
      });
    } catch (error) {
      setShowModal(true);
      setModalTitle("Image Compression Error");
      setModalMessage("Failed to compress image. Please try a different image.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      setShowModal(true);
      setModalTitle("Required Field");
      setModalMessage("Please select a reason for return.");
      return;
    }

    if (selectedReason === "Other" && !otherReason.trim()) {
      setShowModal(true);
      setModalTitle("Required Field");
      setModalMessage("Please specify a reason for return.");
      return;
    }

    if (images.every((img) => img === null)) {
      setShowModal(true);
      setModalTitle("No Image Selected");
      setModalMessage(
        "Please upload at least one image to support your return request."
      );
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("user", user?.email);
      formData.append("orderId", state.order._id);
      formData.append("items", JSON.stringify(state.selectedItems));
      formData.append(
        "reason",
        selectedReason === "Other" && otherReason.trim()
          ? `Other: ${otherReason}`
          : selectedReason
      );

      images.forEach((file) => {
        if (file !== null) {
          formData.append("images", file);
        }
      });

      await axios.post("/api/orders/returns", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

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
            required
            onChange={(e) => setOtherReason(e.target.value)}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="form-label">
          Upload images to support your claim (up to 3 images)
        </label>
        <div className="d-flex gap-3">
          {[0, 1, 2].map((index) => (
            <div key={index} style={{ flex: 1 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
                className="form-control"
              />
              {images[index] && (
                <div
                  style={{ marginTop: "8px", position: "relative", cursor: "pointer" }}
                >
                  <img
                    src={URL.createObjectURL(images[index])}
                    alt={`Preview ${index + 1}`}
                    style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImages((prev) => {
                        const newImages = [...prev];
                        newImages[index] = null;
                        return newImages;
                      });
                    }}
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      cursor: "pointer",
                    }}
                    aria-label={`Remove image ${index + 1}`}
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <small className="text-muted">
          Please upload at least one image, maximum of 3 images.
        </small>
      </div>

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
