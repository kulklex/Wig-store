import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AlertModal from "../components/AlertModal";

const ReturnSelectItems = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [variantDetails, setVariantDetails] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`, {
          withCredentials: true,
        });
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    const fetchProductAndVariantDetails = async () => {
      if (!order) return;
      const variantMap = {};

      await Promise.all(
        order.items.map(async (item) => {
          try {
            const res = await axios.get(`/api/products/${item.productId}`);
            const product = res.data;
            const variant = product.variants.find(
              (v) => v._id === item.variantId
            );

            if (variant) {
              variantMap[item.variantId] = {
                productName: product.name,
                media: variant.media || product.media || "",
                texture: variant.texture,
                length: variant.length,
                origin: variant.origin,
                price: variant.price,
              };
            }
          } catch (err) {
            console.error(
              `Failed to fetch variant details for ${item.productId}`,
              err
            );
          }
        })
      );

      setVariantDetails(variantMap);
    };

    fetchProductAndVariantDetails();
  }, [order]);

  const handleQuantityChange = (variantId, quantity, maxQty) => {
    const qty = Math.min(Math.max(Number(quantity), 0), maxQty);
    setSelectedItems((prev) => ({
      ...prev,
      [variantId]: qty > 0 ? qty : undefined,
    }));
  };

  const proceed = () => {
    const filteredItems = Object.entries(selectedItems)
      .filter(([_, qty]) => qty && qty > 0)
      .map(([variantId, quantity]) => {
        const orderItem = order.items.find((i) => i.variantId === variantId);
        return {
          productId: orderItem.productId,
          variantId,
          quantity,
        };
      });

    if (filteredItems.length === 0) {
      setShowModal(true);
      setModalTitle("Selection Error");
      setModalMessage("Please select at least one item to return.");
      return;
    }

    navigate(`/order/${id}/return/form`, {
      state: { selectedItems: filteredItems, order },
    });
  };

  return (
    <div className="container py-5">
      <div className="pt-1 pb-5 d-flex justify-content-center align-items-center text-center">
        <small>
          Make sure you read our{" "}
          <Link to="/returns-and-refunds">Return Policy</Link> before you
          proceed.
        </small>
      </div>
      <h3 className="mb-4 d-flex justify-content-center align-items-center text-center">
        Select Items to Return
      </h3>
      {order?.items.map((item, index) => {
        const details = variantDetails[item.variantId];

        return (
          <div key={index} className="card mb-3 p-3">
            <div className="d-flex align-items-center">
              <img
                src={details?.media}
                alt="Product"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                className="me-3 rounded"
              />
              <div className="flex-grow-1">
                <h5 className="mb-1">
                  {details?.productName || "Product Name"}
                </h5>
                <p className="mb-0 text-muted small">
                  {details?.length ? `${details.length}"` : ""}{" "}
                  {details?.texture} - {details?.origin}
                </p>
                <p className="mb-1">
                  <strong>Ordered:</strong> {item.quantity}
                </p>
              </div>
            </div>
            <label className="my-2">
              <strong>Quantity to Return:</strong>
              <input
                type="number"
                min={1}
                max={item.quantity}
                value={selectedItems[item.variantId] || 0}
                onChange={(e) =>
                  handleQuantityChange(
                    item.variantId,
                    e.target.value,
                    item.quantity
                  )
                }
                className="form-control w-auto"
              />
            </label>
          </div>
        );
      })}

      <AlertModal
        isOpen={showModal}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        confirmText="OK"
        cancelText=""
      />
      <button
        onClick={proceed}
        className="btn btn-dark mt-4 d-flex justify-content-center align-items-center text-center"
      >
        Continue to Return Form
      </button>
    </div>
  );
};

export default ReturnSelectItems;
