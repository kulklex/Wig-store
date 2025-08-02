import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const CollectionCard = ({ data }) => {
  const navigate = useNavigate();
  const { _id, name, description = "", reviews, variants = [] } = data;

  const StarRating = ({ rating }) => {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const empty = 5 - full - (hasHalf ? 1 : 0);

    return (
      <div className="d-flex align-items-center gap-1 text-warning small">
        {[...Array(full)].map((_, i) => (
          <FaStar key={`full-${i}`} />
        ))}
        {hasHalf && <FaStarHalfAlt />}
        {[...Array(empty)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} />
        ))}
        <span className="text-dark ms-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const straightVariant = variants.find(
    (variant) => variant.texture?.toLowerCase() === "straight"
  );

  const image =
    straightVariant?.media ||
    variants[0]?.media ||
    "https://via.placeholder.com/300x300?text=No+Image";

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
            className="card-title text-dark fw-semibold text-truncate"
            title={name}
          >
            {name}
          </h5>

          {reviews?.length > 0 && (
            <div className="mb-2">
              <StarRating
                rating={
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                }
              />
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
