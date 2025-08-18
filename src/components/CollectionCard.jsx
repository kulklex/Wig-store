import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import axios from "axios";

const CollectionCard = ({ data }) => {
  const navigate = useNavigate();
  const { _id, name, description = "", reviews = [], variants = [] } = data;

  const [bestSellerIds, setBestSellerIds] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axios.get("/api/products/best-sellers?limit=3");
        setBestSellerIds((res.data || []).map((p) => p._id));
      } catch (err) {
        console.error("Error fetching best sellers:", err);
      }
    };
    fetchBestSellers();
  }, []);

  const getAverageRating = (list) => {
    const nums = (Array.isArray(list) ? list : [])
      .map((r) => Number(r?.rating))
      .filter((n) => Number.isFinite(n) && n >= 0 && n <= 5);
    if (nums.length === 0) return 0;
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return avg;
  };

  const StarRating = ({ value, count }) => {
    const rounded = Math.round((Number(value) || 0) * 2) / 2;
    const full = Math.floor(rounded);
    const hasHalf = rounded - full === 0.5;
    const empty = Math.max(0, 5 - full - (hasHalf ? 1 : 0));

    return (
      <div className="d-flex align-items-center gap-1 text-warning small">
        {[...Array(full)].map((_, i) => (
          <FaStar key={`full-${i}`} />
        ))}
        {hasHalf && <FaStarHalfAlt />}
        {[...Array(empty)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} />
        ))}
        <span className="text-dark ms-1">
          {rounded.toFixed(1)}
          {typeof count === "number" ? ` (${count})` : ""}
        </span>
      </div>
    );
  };

  const averageRating = getAverageRating(reviews);
  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;

  // Pick variant to show pricing from — prioritize Straight, fallback first
  const variantToShow =
    variants.find((v) => v.texture?.toLowerCase() === "straight") ||
    variants[0];

  let displayPrice;
  if (
    variantToShow?.promo?.isActive &&
    Number(variantToShow.promo.discountPercent) > 0
  ) {
    const originalPrice = Number(variantToShow.price) || 0;
    const discount = Number(variantToShow.promo.discountPercent) || 0;
    const promoPrice = Math.max(0, originalPrice * (1 - discount / 100));

    displayPrice = (
      <div className="mb-3">
        <span
          className="text-muted text-decoration-line-through me-2"
          style={{ fontSize: "0.9rem" }}
        >
          £{originalPrice.toFixed(2)}
        </span>
        <span
          className="fw-bold text-danger"
          style={{ fontSize: "0.9rem" }}
          aria-label={`Discounted price ${promoPrice.toFixed(2)} pounds`}
        >
          £{promoPrice.toFixed(2)}
        </span>
      </div>
    );
  } else {
    displayPrice = variantToShow?.price ? (
      <div className="mb-3 fw-semibold" style={{ fontSize: "1.0rem" }}>
        £{Number(variantToShow.price).toFixed(2)}
      </div>
    ) : null;
  }

  const image =
    variantToShow?.media ||
    variants[0]?.media ||
    "https://via.placeholder.com/300x300?text=No+Image";

  const isBestSeller = bestSellerIds.includes(_id);

  return (
    <div
      className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
      data-aos="fade-up"
      style={{ cursor: "pointer" }}
    >
      <div className="card h-100 border-0 shadow-sm hover-shadow transition-3">
        <figure className="overflow-hidden rounded-top m-0">
          <img
            src={image}
            alt={name}
            className="card-img-top img-fluid"
            style={{
              maxHeight: "300px",
              objectFit: "cover",
              transition: "transform 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </figure>

        <div className="card-body d-flex flex-column justify-content-between px-3 py-3">
          <h5
            className="card-title text-dark fw-semibold text-truncate d-flex align-items-center"
            title={name}
          >
            {name}
            {isBestSeller && (
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "#ff4500",
                  marginLeft: "6px",
                }}
              >
                🔥 Best Seller
              </span>
            )}
          </h5>

          {displayPrice}

          {reviewCount > 0 && (
            <div className="mb-2">
              <StarRating value={averageRating} count={reviewCount} />
            </div>
          )}

          <p className="card-text text-muted small mb-3">
            {description.length > 60
              ? `${description.slice(0, 60)}...`
              : description}
          </p>

          <button
            className="btn btn-dark w-80 mt-auto text-uppercase fw-medium"
            onClick={() => navigate(`/product/${_id}`)}
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
