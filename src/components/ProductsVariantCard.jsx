import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductVariantCard = ({ productId, variantId, quantity }) => {
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);

        const matchedVariant = data.variants.find(v => v._id === variantId);
        setVariant(matchedVariant);
      } catch (err) {
        console.error("Error fetching product or variant", err);
      }
    };

    fetchProduct();
  }, [productId, variantId]);

  if (!product || !variant) {
    return (
      <li className="list-group-item d-flex justify-content-between">
        <span>Loading product info...</span>
        <span className="text-muted">Qty: {quantity}</span>
      </li>
    );
  }

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <img
          src={variant.media}
          alt={product.name}
          className="me-3 rounded"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
        <div>
          <div className="fw-semibold">{product.name}</div>
          <small className="text-muted d-block">
            {variant.length}" {variant.texture} - {variant.origin}
          </small>
          <small className="text-muted">£{variant.price.toLocaleString()} {" "} each</small> 
        </div>
      </div>
      <span className="text-muted">Qty: {quantity}</span>
    </li>
  );
};

export default ProductVariantCard;
