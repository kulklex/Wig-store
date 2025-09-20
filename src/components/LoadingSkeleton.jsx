import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const LoadingSkeleton = ({ type = "product", count = 4 }) => {
  const renderProductSkeleton = () => (
    <div className="card border-0 shadow-sm h-100">
      <div className="skeleton-image" style={{ aspectRatio: "1" }}></div>
      <div className="card-body p-3">
        <div className="skeleton-title mb-2"></div>
        <div className="skeleton-price mb-2"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );

  const renderCategorySkeleton = () => (
    <div className="category-card position-relative overflow-hidden rounded-3 shadow-sm h-100">
      <div className="skeleton-image" style={{ aspectRatio: "1" }}></div>
      <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white"
           style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
        <div className="skeleton-title-white mb-2"></div>
        <div className="skeleton-text-white mb-3"></div>
        <div className="skeleton-button-white"></div>
      </div>
    </div>
  );

  const renderTrustIndicatorSkeleton = () => (
    <div className="bg-white rounded-3 p-4 shadow-sm h-100 text-center">
      <div className="skeleton-icon mb-3"></div>
      <div className="skeleton-number mb-2"></div>
      <div className="skeleton-text"></div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case "category":
        return renderCategorySkeleton();
      case "trust":
        return renderTrustIndicatorSkeleton();
      default:
        return renderProductSkeleton();
    }
  };

  return (
    <Container>
      <Row className="g-4">
        {Array.from({ length: count }).map((_, index) => (
          <Col key={index} lg={3} md={6}>
            {renderSkeleton()}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LoadingSkeleton;
