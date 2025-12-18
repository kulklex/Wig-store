import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { Button, Form, Badge, Alert, Spinner } from "react-bootstrap";
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
  const [shippingLoading, setShippingLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [retryWeight, setRetryWeight] = useState("1.0");

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


  // Download DPD shipping label
  const handleDownloadLabel = async () => {
    setShippingLoading(true);
    try {
      const response = await axios.get(`/api/orders/${id}/label`, {
        responseType: "blob",
        withCredentials: true,
      });

      // Create downloadable link for PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `dpd-label-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download label:", error);
      alert("Failed to download shipping label. " + 
        (error.response?.data?.message || "Please try again."));
    } finally {
      setShippingLoading(false);
    }
  };

  // Retry DPD shipment creation
  const handleRetryShipping = async () => {
    if (!window.confirm("Retry creating DPD shipment for this order?")) return;

    setShippingLoading(true);
    try {
      const response = await axios.post(
        `/api/orders/${id}/retry-shipping`,
        {
          parcelDetails: {
            weight: parseFloat(retryWeight),
            length: 30,
            width: 25,
            height: 15,
          },
        },
        { withCredentials: true }
      );

      alert("DPD Shipment created successfully!\n" + 
        `Tracking: ${response.data.shipping.trackingNumbers[0]}`);
      
      // Refresh order data
      const orderRes = await axios.get(`/api/orders/${id}`, {
        withCredentials: true,
      });
      setOrder(orderRes.data);
    } catch (error) {
      console.error("Failed to retry shipping:", error);
      alert("Failed to create shipping:\n" + 
        (error.response?.data?.message || error.message));
    } finally {
      setShippingLoading(false);
    }
  };

  // Track DPD shipment
  const handleTrackShipment = async () => {
    setTrackingLoading(true);
    try {
      const response = await axios.get(`/api/orders/${id}/track`, {
        withCredentials: true,
      });
      setTrackingInfo(response.data.tracking);
      
      // Update order status if it changed
      if (response.data.order.status !== order.status) {
        setOrder({ ...order, status: response.data.order.status });
      }
    } catch (error) {
      console.error("Failed to track shipment:", error);
      alert("Failed to get tracking information");
    } finally {
      setTrackingLoading(false);
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

    {/* 🆕 NEW: DPD Shipping Management Card */}
      <div className="col-12 mb-4">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title">
              <i className="bi bi-truck"></i> DPD Shipping Management
            </h5>

            {/* Show shipping info if exists */}
            {order.shipping && order.shipping.shipmentId ? (
              <div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Carrier:</strong> {order.shipping.carrier}
                    </p>
                    <p className="mb-1">
                      <strong>Service:</strong>{" "}
                      {order.shipping.service || "Standard Next Day"}
                    </p>
                    <p className="mb-1">
                      <strong>Consignment #:</strong>{" "}
                      <code>{order.shipping.consignmentNumber}</code>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Tracking Number:</strong>
                    </p>
                    {order.shipping.trackingNumbers?.map((trackingNum, idx) => (
                      <p key={idx} className="mb-1">
                        <code>{trackingNum}</code>
                      </p>
                    ))}
                    <p className="mb-1 text-muted small">
                      Created: {new Date(order.shipping.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-2 flex-wrap">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadLabel}
                    disabled={shippingLoading || !order.shipping.labelGenerated}
                  >
                    {shippingLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <i className="bi bi-download"></i> Download Label
                      </>
                    )}
                  </Button>

                  <Button
                    variant="info"
                    size="sm"
                    onClick={handleTrackShipment}
                    disabled={trackingLoading}
                  >
                    {trackingLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <i className="bi bi-geo-alt"></i> Track Shipment
                      </>
                    )}
                  </Button>
                </div>

                {/* Show tracking info if available */}
                {trackingInfo && (
                  <Alert variant="info" className="mt-3">
                    <h6 className="alert-heading">Live Tracking</h6>
                    <p className="mb-1">
                      <strong>Status:</strong> {trackingInfo.status}
                    </p>
                    {trackingInfo.location && (
                      <p className="mb-1">
                        <strong>Location:</strong> {trackingInfo.location}
                      </p>
                    )}
                    {trackingInfo.timestamp && (
                      <p className="mb-1">
                        <strong>Last Update:</strong>{" "}
                        {new Date(trackingInfo.timestamp).toLocaleString()}
                      </p>
                    )}
                    {trackingInfo.estimatedDelivery && (
                      <p className="mb-0">
                        <strong>Est. Delivery:</strong>{" "}
                        {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </Alert>
                )}
              </div>
            ) : order.shipping && order.shipping.error ? (
              // Show retry option if shipping failed
              <div>
                <Alert variant="warning">
                  <i className="bi bi-exclamation-triangle"></i> Shipping
                  creation failed: {order.shipping.error}
                </Alert>

                <div className="mb-3">
                  <Form.Label>Parcel Weight (KG)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={retryWeight}
                    onChange={(e) => setRetryWeight(e.target.value)}
                    style={{ maxWidth: "150px" }}
                  />
                  <Form.Text className="text-muted">
                    Adjust weight based on actual parcel
                  </Form.Text>
                </div>

                <Button
                  variant="warning"
                  onClick={handleRetryShipping}
                  disabled={shippingLoading}
                >
                  {shippingLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <i className="bi bi-arrow-repeat"></i> Retry DPD Shipment
                    </>
                  )}
                </Button>
              </div>
            ) : (
              // No shipping info at all
              <div>
                <Alert variant="info">
                  No DPD shipment created yet for this order.
                </Alert>

                <div className="mb-3">
                  <Form.Label>Parcel Weight (KG)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={retryWeight}
                    onChange={(e) => setRetryWeight(e.target.value)}
                    style={{ maxWidth: "150px" }}
                  />
                </div>

                <Button
                  variant="success"
                  onClick={handleRetryShipping}
                  disabled={shippingLoading}
                >
                  {shippingLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <i className="bi bi-plus-circle"></i> Create DPD Shipment
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row gy-4">
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
