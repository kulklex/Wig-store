import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from "../redux/wishlistSlice";

const CollectionCard = ({ data, compact = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id, name, description = "", variants = [] } = data;
  const user = useSelector((state) => state.user.user);

  const [bestSellerIds, setBestSellerIds] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

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

  useEffect(() => {
    if (user && _id) {
      const checkStatus = async () => {
        try {
          const result = await dispatch(checkWishlistStatus(_id)).unwrap();
          setIsInWishlist(result.isInWishlist);
        } catch (error) {
          console.error("Error checking wishlist status:", error);
        }
      };
      checkStatus();
    }
  }, [user, _id, dispatch]);


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
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="text-danger fw-bold fs-6">
          £{promoPrice.toFixed(2)}
        </span>
        <span className="text-muted text-decoration-line-through" style={{ fontSize: "0.875rem" }}>
          £{originalPrice.toFixed(2)}
        </span>
        <span className="badge bg-danger text-white" style={{ fontSize: "0.625rem" }}>
          -{discount}%
        </span>
      </div>
    );
  } else {
    displayPrice = variantToShow?.price ? (
      <div className="fw-bold fs-6 mb-2 text-dark">
        £{Number(variantToShow.price).toFixed(2)}
      </div>
    ) : null;
  }

  const image =
    variantToShow?.media ||
    variants[0]?.media ||
    "https://via.placeholder.com/300x300?text=No+Image";

  const isBestSeller = bestSellerIds.includes(_id);

  const cardClass = compact 
    ? "col-6 col-md-4 col-lg-3 col-xl-2 mb-3" 
    : "col-6 col-md-4 col-lg-3 mb-4";

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/sign-in');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(_id)).unwrap();
        setIsInWishlist(false);
      } else {
        await dispatch(addToWishlist(_id)).unwrap();
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className={cardClass} data-aos="fade-up">
      <div 
        className="card h-100 border-0 shadow-sm position-relative overflow-hidden"
        style={{ 
          cursor: "pointer",
          transition: "all 0.3s ease",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/product/${_id}`)}
      >
        {isBestSeller && (
          <div className="position-absolute top-0 start-0 z-1">
            <span className="badge bg-warning text-dark rounded-0 rounded-end" style={{ fontSize: "0.625rem" }}>
              🔥 Best Seller
            </span>
          </div>
        )}

        <div className="position-relative overflow-hidden" style={{ aspectRatio: "1" }}>
          <img
            src={image}
            alt={name}
            className="w-100 h-100"
            style={{
              objectFit: "cover",
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)"
            }}
          />
          
          {user && (
            <div className="position-absolute top-0 end-0 p-2">
              <button 
                className={`btn btn-sm rounded-circle shadow-sm border-0 ${
                  isInWishlist ? 'btn-danger' : 'btn-light'
                }`}
                style={{ width: "32px", height: "32px" }}
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
              >
                <FiHeart size={14} fill={isInWishlist ? "white" : "none"} />
              </button>
            </div>
          )}
        </div>

        <div className="card-body p-3">
          <h6 
            className="card-title fw-semibold text-dark mb-1"
            style={{ 
              fontSize: compact ? "0.875rem" : "1rem",
              lineHeight: "1.3",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
            title={name}
          >
            {name}
          </h6>

          {displayPrice}

          {!compact && description && (
            <p 
              className="text-muted mb-3"
              style={{ 
                fontSize: "0.75rem",
                lineHeight: "1.4",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {description}
            </p>
          )}

          <button
            className="btn btn-dark btn-sm w-100 text-uppercase fw-medium"
            style={{ fontSize: "0.75rem" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${_id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
