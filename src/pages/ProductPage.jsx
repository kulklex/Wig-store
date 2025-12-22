import axios from "../utils/axiosConfig";
import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Accordion,
  ButtonGroup,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { addToCart, closeCartDrawer } from "../redux/cartSlice";
import { fetchRelatedProducts } from "../redux/productSlice";
import AlertModal from "../components/AlertModal";
import CollectionCard from "../components/CollectionCard";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const { relatedProducts, relatedProductsLoading } = useSelector((state) => state.products);

  const [product, setProduct] = useState(null);
  const [selectedTexture, setSelectedTexture] = useState(null);
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedLaceSize, setSelectedLaceSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedLace, setSelectedLace] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedFullDescription, setSelectedFullDescription] = useState("");

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  // Soft option styling to keep UI light
  const optionStyle = (isActive) => ({
    backgroundColor: isActive ? "#fafafa" : "#f9f9f9",
    color: "#111",
    border: isActive ? "2px solid #222" : "1px solid #d9d9d9",
    boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.06)",
    borderRadius: "6px",
    padding: "8px 12px",
    minWidth: "56px",
    fontWeight: isActive ? 600 : 400,
  });
  const [rating, setRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [canReview, setCanReview] = useState(false);
  const alreadyReviewed = reviews.some((r) => r.user === user?.email);

  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axios.get("/api/products/best-sellers");
        setBestSellers(res.data);
      } catch (error) {
        console.error("Failed to load best sellers:", error);
      }
    };

    fetchBestSellers();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setReviews(res.data.reviews || []);
        
        if (res.data.variants && res.data.variants.length > 0) {
          const firstVariant = res.data.variants[0];
          setSelectedTexture(firstVariant.texture);
          setSelectedLength(firstVariant.length);
          setSelectedOrigin(firstVariant.origin);
          setSelectedColor(firstVariant.color || "");
          setSelectedLaceSize(firstVariant.laceSize || "");
          setSelectedVariant(firstVariant);
          setSelectedLace(firstVariant.lace || "");
          setSelectedStyle(firstVariant.style || "");
          setSelectedWeight(firstVariant.weight || "");
          setSelectedFullDescription(firstVariant.fullDescription || "");
          setMainImage(firstVariant.media || "");
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const limit = isMobile ? 4 : 6;
    dispatch(fetchRelatedProducts({ productId: id, limit }));
  }, [dispatch, id, isMobile]);

  useEffect(() => {
    const checkCanReview = async () => {
      if (user) {
        try {
          const res = await axios.get(`/api/products/${id}/eligible-to-review`);
          setCanReview(res.data.canReview);
        } catch (error) {
          console.error("Failed to check review eligibility:", error);
        }
      }
    };

    checkCanReview();
  }, [id, user]);

  const isBestSeller = useMemo(() => {
    if (!product || bestSellers.length === 0) return false;
    return bestSellers.some((p) => p._id === product._id);
  }, [product, bestSellers]);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const reviewDate = new Date(dateString);
    const seconds = Math.floor((now - reviewDate) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="d-flex align-items-center gap-1 my-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-warning" size={20} />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-warning" size={20} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-warning" size={20} />
        ))}
      </div>
    );
  };

  useEffect(() => {
    dispatch(closeCartDrawer());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const textureVariantsMap = useMemo(() => {
    const map = {};
    product?.variants?.forEach((variant) => {
      const key = variant.texture.toLowerCase().replace(/\s+/g, "_");
      if (!map[key]) map[key] = [];
      map[key].push(variant);
    });
    return map;
  }, [product]);

  const displayedRelatedProducts = useMemo(
    () => (isMobile ? relatedProducts.slice(0, 4) : relatedProducts.slice(0, 6)),
    [isMobile, relatedProducts]
  );

  useEffect(() => {
    if (product?.variants?.length) {
      const defaultVariant =
        product.variants.find((v) => v.texture.toLowerCase() === "straight") ||
        product.variants[0];
      const normalized = defaultVariant.texture
        .toLowerCase()
        .replace(/\s+/g, "_");
      setSelectedTexture(normalized);
    }
  }, [product]);

  useEffect(() => {
    if (selectedTexture && textureVariantsMap[selectedTexture]) {
      const defaultVariant = textureVariantsMap[selectedTexture][0];
      setMainImage(defaultVariant.media);
      setSelectedLength(defaultVariant.length);
      setSelectedOrigin(defaultVariant.origin);
      setSelectedColor(defaultVariant.color || "");
      setSelectedLaceSize(defaultVariant.laceSize || "");
      setSelectedVariant(defaultVariant);
      setQuantity(1);

      setSelectedLace(defaultVariant.lace || "");
      setSelectedStyle(defaultVariant.style || "");
      setSelectedWeight(defaultVariant.weight || "");
      setSelectedFullDescription(defaultVariant.fullDescription || "");
    }
  }, [selectedTexture, textureVariantsMap]);

  const scrollToGallery = () => {
    const el = document.getElementById("product-gallery");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLengthClick = (len) => {
    const matched = textureVariantsMap[selectedTexture]?.find(
      (v) => v.length === len
    );
    if (matched) {
      setSelectedLength(len);
      setSelectedOrigin(matched.origin);
      setSelectedColor(matched.color || "");
      setSelectedLaceSize(matched.laceSize || "");
      setSelectedLace(matched.lace || "");
      setSelectedStyle(matched.style || "");
      setSelectedWeight(matched.weight || "");
      setSelectedFullDescription(matched.fullDescription || "");
      setSelectedVariant(matched);
      setMainImage(matched.media);
      setQuantity(1);
    }
  };

  const cartItem = cartItems.find(
    (item) => item.variantId === selectedVariant?._id
  );
  const currentCartQty = cartItem?.cartQty || 0;
  const maxAvailableQty = selectedVariant
    ? selectedVariant.stock - currentCartQty
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    if (quantity > maxAvailableQty) {
      setModalMessage("Cannot add more than available stock.");
      return;
    }

    const newCartItem = {
      variantId: selectedVariant._id,
      productId: product._id,
      title: product.name,
      price:
        selectedVariant.promo?.isActive && selectedVariant.promo?.promoPrice
          ? selectedVariant.promo.promoPrice
          : selectedVariant.price,
      media: selectedVariant.media,
      stock: selectedVariant.stock,
      texture: selectedVariant.texture,
      length: selectedVariant.length || "",
      origin: selectedVariant.origin || "",
      color: selectedVariant.color || selectedColor || "",
      laceSize: selectedVariant.laceSize || selectedLaceSize || "",
      lace: selectedVariant.lace || "",
      style: selectedVariant.style || "",
      weight: selectedVariant.weight || "",
      fullDescription: selectedVariant.fullDescription || "",
      cartQty: quantity,
    };

    dispatch(addToCart(newCartItem));
    setQuantity(1);
  };

  if (loading || !product)
    return <Spinner animation="border" className="d-block mx-auto my-5" />;

  const uniqueTextures = [
    ...new Set(
      product.variants.map((v) => v.texture.toLowerCase().replace(/\s+/g, "_"))
    ),
  ];

  const availableLengths =
    textureVariantsMap[selectedTexture]
      ?.filter(
        (v) =>
          (!selectedColor || v.color === selectedColor) &&
          (!selectedLaceSize || v.laceSize === selectedLaceSize)
      )
      .map((v) => ({
        length: v.length,
        stock: v.stock,
      })) || [];

  const textureVariantImages = [
    ...new Set((textureVariantsMap[selectedTexture] || []).map((v) => v.media)),
  ];

  const allVariantImages = [
    ...new Set(product.variants.map((v) => v.media).filter(Boolean)),
  ];

  const getUniqueAttributeValues = (attribute) => {
    const values = product.variants
      .map((v) => v[attribute])
      .filter((val) => val !== undefined && val !== null && val !== "");
    return [...new Set(values)];
  };

  const findMatchingVariant = (overrides = {}) => {
    const targetLength = overrides.length ?? selectedLength;
    const targetColor = overrides.color ?? selectedColor;
    const targetLaceSize = overrides.laceSize ?? selectedLaceSize;
    const targetLace = overrides.lace ?? selectedLace;
    const targetStyle = overrides.style ?? selectedStyle;
    const targetWeight = overrides.weight ?? selectedWeight;
    const targetFullDescription =
      overrides.fullDescription ?? selectedFullDescription;

    return textureVariantsMap[selectedTexture]?.find(
      (v) =>
        v.length === targetLength &&
        (!targetColor || v.color === targetColor) &&
        (!targetLaceSize || v.laceSize === targetLaceSize) &&
        (!targetLace || v.lace === targetLace) &&
        (!targetStyle || v.style === targetStyle) &&
        (!targetWeight || v.weight === targetWeight) &&
        (!targetFullDescription || v.fullDescription === targetFullDescription)
    );
  };

  const variantThumbs = allVariantImages.slice(0, 8);

  const handleThumbClick = (img) => {
    setMainImage(img);
    const matchedVariant = product.variants.find((v) => v.media === img) || null;
    if (matchedVariant) {
      const normalized = matchedVariant.texture.toLowerCase().replace(/\s+/g, "_");
      setSelectedTexture(normalized);
      setSelectedLength(matchedVariant.length);
      setSelectedOrigin(matchedVariant.origin);
      setSelectedColor(matchedVariant.color || "");
      setSelectedLaceSize(matchedVariant.laceSize || "");
      setSelectedVariant(matchedVariant);
      setSelectedLace(matchedVariant.lace || "");
      setSelectedStyle(matchedVariant.style || "");
      setSelectedWeight(matchedVariant.weight || "");
      setSelectedFullDescription(matchedVariant.fullDescription || "");
      setQuantity(1);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      setModalTitle("Validation Error");
      setModalMessage("Please provide a rating.");
      setShowModal(true);
      return;
    }

    setSubmittingReview(true);

    try {
      const res = await axios.post(`/api/products/${product._id}/reviews`, {
        rating,
        comment: reviewText,
      });

      setReviews((prev) => [...prev, res.data.review]);
      setReviewText("");
      setRating(5);
      setModalTitle("Success");
      setModalMessage("Thank you for your review!");
      setShowModal(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit review.";
      setModalTitle("Review Error");
      setModalMessage(msg);
      setShowModal(true);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <Container className="my-4">
      <Row className="g-4">
        <Col lg={6}>
          <div id="product-gallery" className="h-100">
            <div className="row g-3 flex-column flex-md-row align-items-start">
              {variantThumbs.length > 0 && (
                <div className="col-md-3 d-flex flex-md-column flex-wrap gap-2 order-2 order-md-1">
                  {variantThumbs.map((img, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      type="button"
                      className="p-0 border-0 bg-transparent rounded-3"
                      onClick={() => handleThumbClick(img)}
                      style={{
                        border: mainImage === img ? "2px solid #111" : "1px solid #e6e6e6",
                        boxShadow: "none",
                      }}
                    >
                      <img
                        src={img}
                        alt={`thumb-${idx}`}
                        className="rounded-3"
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className={`col-md-${variantThumbs.length > 0 ? "9" : "12"} order-1 order-md-2`}>
                <div
                  className="ratio ratio-1x1 d-flex align-items-center justify-content-center overflow-hidden"
                  style={{ minHeight: "380px", background: "transparent" }}
                >
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt="Product"
                      className="img-fluid h-100"
                      style={{ objectFit: "cover", boxShadow: "none" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={6} className="">
          <div className="mb-3">
            <h2 className="product-title mb-2 d-flex align-items-center gap-2">
              {product.name}{" "}
              {isBestSeller && (
                <span
                  className="top-0"
                  style={{
                    fontSize: "0.6rem",
                    color: "#ff4500",
                    marginLeft: "5px",
                  }}
                >
                  🔥 Best Seller
                </span>
              )}
            </h2>

            <div className="d-flex align-items-center gap-2 mt-2 mb-4">
              {selectedVariant?.promo?.isActive && selectedVariant?.promo?.promoPrice ? (
                <>
                  <span className="text-muted text-decoration-line-through fs-6 mb-0">
                    £{selectedVariant.price.toFixed(2)}
                  </span>
                  <span className="text-danger fw-bold fs-4 mb-0">
                    £{selectedVariant.promo.promoPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="fw-bold fs-4 text-dark mb-0">
                  £{selectedVariant?.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <h6>LENGTH</h6>
          <div className="d-flex flex-wrap mb-4 gap-2">
            {availableLengths.map(({ length, stock }) => (
              <Button
                key={length}
                variant="light"
                style={optionStyle(selectedLength === length)}
                className="me-1 mb-2 position-relative option-button"
                onClick={() => handleLengthClick(length)}
                disabled={stock === 0}
              >
                {length}
                {stock === 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    Out
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <h6>
            TEXTURE <span className="text-warning">?</span>
          </h6>
          <div className="d-flex flex-wrap mb-3 gap-2">
            {uniqueTextures.map((texture) => (
              <Button
                key={texture}
                variant="light"
                style={optionStyle(selectedTexture === texture)}
                className="me-1 mb-2 option-button"
                onClick={() => {
                  setSelectedTexture(texture);
                  scrollToGallery();
                }}
              >
                {texture.replace(/_/g, " ")}
              </Button>
            ))}
          </div>

          {[
            {
              key: "color",
              label: "COLOR",
              state: selectedColor,
              setter: setSelectedColor,
            },
            {
              key: "laceSize",
              label: "LACE SIZE",
              state: selectedLaceSize,
              setter: setSelectedLaceSize,
            },
            {
              key: "lace",
              label: "LACE",
              state: selectedLace,
              setter: setSelectedLace,
            },
            {
              key: "style",
              label: "STYLE",
              state: selectedStyle,
              setter: setSelectedStyle,
            },
            {
              key: "weight",
              label: "WEIGHT",
              state: selectedWeight,
              setter: setSelectedWeight,
            },
            {
              key: "fullDescription",
              label: "DESCRIPTION",
              state: selectedFullDescription,
              setter: setSelectedFullDescription,
            },
          ].map(({ key, label, state, setter }) => {
            const values = getUniqueAttributeValues(key);
            if (!values.length) return null;

            return (
              <div key={key} className="mb-3">
                <h6 className="text-uppercase">{label}</h6>
                <div className="d-flex flex-wrap gap-2">
                  {values.map((val) => (
                    <Button
                      key={val}
                      variant="light"
                      style={optionStyle(state === val)}
                      className="option-button"
                      onClick={() => {
                        setter(val);
                        const matched = findMatchingVariant({ [key]: val });
                        if (matched) {
                          setSelectedOrigin(matched.origin);
                          setSelectedLength(matched.length);
                          setSelectedColor(matched.color || "");
                          setSelectedLaceSize(matched.laceSize || "");
                          setSelectedLace(matched.lace || "");
                          setSelectedStyle(matched.style || "");
                          setSelectedWeight(matched.weight || "");
                          setSelectedFullDescription(matched.fullDescription || "");
                          setSelectedVariant(matched);
                          setMainImage(matched.media);
                          setQuantity(1);
                        }
                      }}
                    >
                      {val}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}

          <h6>ORIGIN</h6>
          <p className="mb-3">{selectedOrigin}</p>

          <h6>QUANTITY</h6>
          <ButtonGroup className="mb-3">
            <Button
              variant="outline-dark"
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
            >
              −
            </Button>
            <Button variant="light" disabled>
              {quantity}
            </Button>
            <Button
              variant="outline-dark"
              onClick={() =>
                setQuantity((q) => (q < maxAvailableQty ? q + 1 : q))
              }
              disabled={quantity >= maxAvailableQty}
            >
              +
            </Button>
          </ButtonGroup>
          {/* {selectedVariant?.stock > 0 && (
            <small className="text-muted ms-2">
              {maxAvailableQty} left in stock
            </small>
          )} */}

          <Button
            variant="dark"
            size="lg"
            className="w-100 mb-3"
            onClick={handleAddToCart}
            disabled={selectedVariant?.stock === 0 || maxAvailableQty === 0}
          >
            {selectedVariant?.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
          </Button>

          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Description</Accordion.Header>
              <Accordion.Body>{product.description}</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Delivery Info</Accordion.Header>
              <Accordion.Body>
                Express worldwide shipping available. See checkout for rates.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Accordion defaultActiveKey={["0"]} alwaysOpen className="mb-4">
            <Accordion.Item eventKey="2">
              <Accordion.Header>Customer Reviews</Accordion.Header>
              <Accordion.Body>
                {reviews.length === 0 && <p>No reviews yet.</p>}

                {reviews.map((rev, index) => (
                  <div key={index} className="mb-3 border-bottom pb-2">
                    <strong>{rev.user || "User"}</strong>
                    <StarRating rating={rev.rating} />
                    <p className="my-1">{rev.comment}</p>
                    <small className="text-muted">
                      {formatTimeAgo(rev.createdAt)}
                    </small>
                  </div>
                ))}

                {user && canReview && !alreadyReviewed && (
                  <div className="mt-4">
                    <h5>Write a Review</h5>
                    <div className="my-2">
                      <label>Rating: </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="form-select w-auto d-inline ms-2"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} -{" "}
                            {
                              [
                                "Excellent",
                                "Very Good",
                                "Good",
                                "Fair",
                                "Poor",
                              ][5 - r]
                            }
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      className="form-control mb-2"
                      rows={3}
                      placeholder="Write your review..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <Button
                      variant="dark"
                      disabled={submittingReview}
                      onClick={handleSubmitReview}
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                )}

                {user && alreadyReviewed && (
                  <p className="mt-3 text-success">
                    You have reviewed this product.
                  </p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <div className="text-center mb-4">
            <h3 className="fw-bold text-dark mb-2">You Might Also Like</h3>
            <p className="text-muted">Discover more products in this category</p>
          </div>
          
          {relatedProductsLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : displayedRelatedProducts.length > 0 ? (
            <Row>
              {displayedRelatedProducts.map((relatedProduct) => (
                <CollectionCard 
                  key={relatedProduct._id} 
                  data={relatedProduct} 
                  compact={true}
                />
              ))}
            </Row>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No related products found</p>
            </div>
          )}
        </Col>
      </Row>

      <AlertModal
        isOpen={showModal}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        confirmText="OK"
        cancelText=""
      />
    </Container>
  );
};

export default ProductPage;
