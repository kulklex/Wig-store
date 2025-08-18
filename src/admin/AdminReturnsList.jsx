import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertModal from "../components/AlertModal";

const AdminReturnsList = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/orders/returns", {
        withCredentials: true,
      });
      setReturns(data);
    } catch (err) {
      setShowModal(true);
      setModalTitle("Error");
      setModalMessage(
        "Error fetching Returns, try again later or contact help"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    fetchReturns();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center text-md-start">Return Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : returns.length === 0 ? (
        <p>No return requests found.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              {!isMobile && <th>Order ID</th>}
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {returns.map((req) => (
              <tr
                key={req._id}
                style={{cursor: "pointer"}}
                onClick={() => navigate(`/admin/returns/${req._id}`)}
              >
                <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                <td>{req.user}</td>
                {!isMobile && <td> {req.orderId} </td>}
                <td>
                  <span
                    className={`badge ${
                      req.status === "pending"
                        ? "bg-warning"
                        : req.status === "approved"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default AdminReturnsList;
