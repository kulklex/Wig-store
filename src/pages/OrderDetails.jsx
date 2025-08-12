import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [variantData, setVariantData] = useState({});
  const [hasBeenReturned, setHasBeenReturned] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`, {
          withCredentials: true,
        });
        setOrder(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

   useEffect(() => {
    const fetchReturnCheck = async () => {
      try {
        const res = await axios.get(`/api/orders/returns/check/${id}`, {
          withCredentials: true,
        });
        setHasBeenReturned(res.data.hasBeenReturned);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch return check details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReturnCheck();
  }, [id]);

  useEffect(() => {
    const fetchVariants = async () => {
      if (!order?.items) return;

      const variantMap = {};
      await Promise.all(
        order.items.map(async (item) => {
          if (item.productId && item.variantId) {
            try {
              const res = await axios.get(`/api/products/${item.productId}`);
              const product = res.data;
              const variant = product.variants.find(
                (v) => v._id === item.variantId
              );
              if (variant) {
                variantMap[item.variantId] = {
                  ...variant,
                  productName: product.name,
                };
              }
            } catch (err) {
              console.error(
                `Failed to fetch variant for ${item.productId}`,
                err
              );
            }
          }
        })
      );

      setVariantData(variantMap);
    };

    fetchVariants();
  }, [order]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <h3>Order #{order._id}</h3>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header fw-bold">Shipping Information</div>
            <div className="card-body">
              <p>
                <strong>Name:</strong> {order.shippingAddress.name}
              </p>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address}
              </p>
              <p>
                <strong>City:</strong> {order.shippingAddress.city}
              </p>
              <p>
                <strong>Postal Code:</strong> {order.shippingAddress.postalCode}
              </p>
              <p>
                <strong>Country:</strong> {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-header fw-bold">Order Status</div>
            <div className="card-body">
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              {order.eta && (
                <p>
                  <strong>ETA:</strong> {order.eta}
                </p>
              )}
              {order.trackingUrl && (
                <p>
                  <strong>Tracking:</strong>{" "}
                  <a href={order.trackingUrl} target="_blank" rel="noreferrer">
                    Track Shipment
                  </a>
                </p>
              )}
              <p>
                <strong>Placed On:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card my-4">
        <div className="d-flex justify-content-between align-items-center m-2">
          <div className="fw-bold">Items</div>
         {order.status === "Delivered" && !hasBeenReturned && <button className="btn text-danger btn-sm mt-2" onClick={() => navigate(`/order/${order._id}/return`)}>
            Return An Item
          </button> }
        </div>
        <ul className="list-group list-group-flush">
          {order.items.map((item, idx) => {
            const variant = variantData[item.variantId];
            return (
              <li
                key={idx}
                className="list-group-item d-flex justify-content-between align-items-center"
                onClick={() => navigate(`/product/${item.productId}`)}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={variant?.media}
                    alt={variant?.productName || "Product"}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                    className="me-3"
                  />
                  <div>
                    <strong>{variant?.productName || "Product"}</strong>
                    <div className="text-muted small">
                      {variant?.length}" {variant?.texture} - {variant?.origin}
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  {item.quantity} × £{variant?.price?.toLocaleString() || 0}{" "}
                  <br />
                  <strong>
                    £{(item.quantity * (variant?.price || 0)).toLocaleString()}
                  </strong>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
