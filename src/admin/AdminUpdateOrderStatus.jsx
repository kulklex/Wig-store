import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { Button, Form, Badge } from "react-bootstrap";
import ProductVariantCard from "../components/ProductsVariantCard";

const statusOptions = [
  "Processing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
  "Refunded",
];

const AdminUpdateOrderStatus = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`, { withCredentials: true });
        setOrder(res.data);
        setSelectedStatus(res.data.status);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async () => {
    if (selectedStatus === order.status) return;

    try {
      const res = await axios.put(`/api/orders/admin/${id}/status`, {
        status: selectedStatus,
        eta,
        trackingUrl,
      });
      setOrder(res.data);
      navigate("/admin/orders")
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Processing":
        return "secondary";
      case "Shipped":
        return "info";
      case "Out for delivery":
        return "warning";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "danger";
      case "Refunded":
        return "dark";
      default:
        return "light";
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
if (!order || !order._id) {
  return (
    <div className="text-center my-5 text-danger">Order not found or data incomplete</div>
  );
}

  return (
    <div className="container my-5">
      <div className="mb-4">
        <h3 className="mb-0">Order #{order?._id}</h3>
        <p className="text-muted">
          Placed on {format(new Date(order.createdAt), "dd MMM yyyy")}
        </p>
        <Badge bg={getStatusVariant(order.status)} className="px-3 py-2 fs-6">
          {order.status}
        </Badge>
      </div>

      <div className="row gy-4">
        {/* Customer Info */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Customer Info</h5>
              <p>
                <strong>Name:</strong> {order.user?.name || order.user}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Shipping Address</h5>
              <p className="mb-0">{order.shippingAddress.name}</p>
              <p className="mb-0">{order.shippingAddress.address}</p>
              <p className="mb-0">
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
              <p>{order.shippingAddress.postalCode}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Items</h5>
              <ul className="list-group list-group-flush">
                {order.items.map((item, idx) => (
                  <ProductVariantCard
                    key={idx}
                    productId={item.productId}
                    variantId={item.variantId}
                    quantity={item.quantity}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Payment Info</h5>
              {/* <p><strong>Method:</strong> {order.paymentInfo?.method}</p> */}
              <p>
                <strong>Total:</strong> £{order.total?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Update Status */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Update Order Status</h5>
              <Form.Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mb-3"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
              <Form.Group className="mb-3">
                <Form.Label>Delivery ETA (optional)</Form.Label>
                <Form.Control
                  type="date"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tracking URL (optional)</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://tracking.example.com/xyz"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                />
              </Form.Group>

              <Button
                variant="primary"
                onClick={handleStatusChange}
                disabled={selectedStatus === order.status && !eta && !trackingUrl}
              >
                Save Status
              </Button>
            </div>
          </div>
        </div>

        {/* Status History */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Status History</h5>
              <ul className="list-group list-group-flush">
                {order.statusHistory?.map((entry, idx) => (
                  <li
                    key={idx}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{entry.status}</span>
                    <span className="text-muted">
                      {format(new Date(entry.updatedAt), "dd MMM yyyy HH:mm")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateOrderStatus;
