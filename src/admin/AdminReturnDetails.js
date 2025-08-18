import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AlertModal from "../components/AlertModal";

const AdminReturnDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [returnData, setReturnData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const fetchReturn = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/orders/returns/${id}`, {
        withCredentials: true,
      });
      setReturnData(data);
    } catch (err) {
      setShowModal(true);
      setModalTitle("Error");
      setModalMessage("Error fetching return details, contact help");
      setTimeout(() => {
        navigate("/admin/returns");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await axios.patch(
        `/api/orders/returns/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchReturn();
    } catch (error) {
      setShowModal(true);
      setModalTitle("Error");
      setModalMessage("Error Updating Status, try again later or contact help");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!returnData) return <p>Loading...</p>;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center text-md-start">Manage Return</h2>
      <p>
        <strong>User:</strong> {returnData.user}
      </p>
      <p>
        <strong>Order ID:</strong> {returnData.orderId}
      </p>
      <p>
        <strong>Status:</strong> {returnData.status}
      </p>
      <p>
        <strong>Reason:</strong> {returnData.reason}
      </p>

      <h4>Returned Items</h4>
      <ul className="list-group">
        {returnData.items.map((item) => (
          <div key={item.variantId} className="card mb-3 p-3">
            <h5>{item.productName}</h5>
            {item.variant && (
              <>
                <p>
                  {item.variant.texture} - {item.variant.length}" -{" "}
                  {item.variant.origin}
                </p>
                <p>Price: ${item.variant.price}</p>
                {item.variant.media && (
                  <img src={item.variant.media} alt="" style={{ width: 100 }} />
                )}
              </>
            )}
            <p>Quantity Returned: {item.quantity}</p>
          </div>
        ))}
      </ul>

      <h4 className="mt-5 mb-2">Images supporting claims</h4>
      <div className="d-flex flex-wrap gap-3 py-5">
        {returnData.images && returnData.images.length > 0 ? (
          returnData.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Return proof ${index + 1}`}
              style={{ width: "150px", height: "auto", objectFit: "cover" }}
            />
          ))
        ) : (
          <p>No supporting images provided.</p>
        )}
      </div>

      {returnData.status === "pending" && (
        <>
          <button
            onClick={() => updateStatus("approved")}
            className="btn btn-success me-2"
            disabled={loading}
          >
            Approve
          </button>
          <button
            onClick={() => updateStatus("rejected")}
            className="btn btn-danger"
            disabled={loading}
          >
            Decline
          </button>
        </>
      )}
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

export default AdminReturnDetails;
