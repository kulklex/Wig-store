import axios from "../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
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
        const res = await axios.get("/api/products/best-sellers");
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


  const sortedVariants = [...variants].sort((a, b) => {
    const aNum = parseFloat(a.length);
    const bNum = parseFloat(b.length);
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aNum !== bNum) {
      return aNum - bNum;
    }
    return String(a.length).localeCompare(String(b.length));
  });

  const variantToShow = sortedVariants[0];

  let displayPrice;
  if (
    variantToShow?.promo?.isActive &&
    Number(variantToShow.promo.discountPercent) > 0
  ) {
    const originalPrice = Number(variantToShow.price) || 0;
    const discount = Number(variantToShow.promo.discountPercent) || 0;
    const promoPrice = Math.max(0, originalPrice * (1 - discount / 100));

    displayPrice = (<>
       <div className="d-flex align-items-center gap-2 mb-2">
        <span className="text-danger fw-bold fs-6">
          £{promoPrice.toFixed(2)}
        </span>
        
        <span className="badge bg-danger text-white" style={{ fontSize: "0.625rem" }}>
          -{discount}%
        </span>
      </div>
      <div>
          <span className="text-muted text-decoration-line-through" style={{ fontSize: "0.875rem" }}>
          £{originalPrice.toFixed(2)}
        </span>
      </div>
   </> );
  } else {
    displayPrice = variantToShow?.price ? (
      <div className="fw-bold fs-6 mb-1 text-dark">
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
    : "col-6 col-md-4 col-lg-3 mb-3";

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
      className="card h-100 border-0 shadow-sm position-relative"
      style={{ 
        cursor: "pointer",
        transition: "transform 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${_id}`)}
    >
    {isBestSeller && (
      <div className="position-absolute top-0 end-0 z-1">
        <span className="badge text-dark rounded-0 rounded-end text-xl">
          🔥
        </span>
      </div>
    )}

    <div className="ratio ratio-1x1 bg-light">
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

    <div className="card-body d-flex flex-column p-3">
      <h6 
        className="card-title fw-semibold text-dark flex-grow-0"
        style={{ 
          fontSize: compact ? "0.875rem" : "1rem",
          lineHeight: "1.3",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: compact ? "2.2rem" : "2.6rem"
        }}
        title={name}
      >
        {name}
      </h6>
      <div className="mb-2">{displayPrice}</div>

      {!compact && description && (
        <p 
          className="text-muted small flex-grow-0 mb-3"
          style={{ 
            fontSize: "0.75rem",
            lineHeight: "1.4",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.2rem"
          }}
        >
          {description}
        </p>
      )}

      <div className="mt-auto">
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
</div>

  );
};

export default CollectionCard;
