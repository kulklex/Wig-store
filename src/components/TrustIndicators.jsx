import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiTruck, FiShield, FiRefreshCw, FiCheckCircle } from "react-icons/fi";

const TrustIndicators = () => {
  const trustStats = [
    {
      icon: FiTruck,
      number: "10K+",
      label: "Happy Customers",
    },
    {
      icon: FiShield,
      number: "50+",
      label: "Countries Served",
    },
    {
      icon: FiRefreshCw,
      number: "98%",
      label: "Satisfaction Rate",
    },
    {
      icon: FiCheckCircle,
      number: "24/7",
      label: "Customer Support",
    },
  ];

  return (
    <section className="py-5 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold text-dark mb-3">Why Choose Karina Beauty Hub?</h2>
          <p className="lead text-muted">Trusted by thousands of customers worldwide</p>
        </div>
        
        <Row className="g-4">
          {trustStats.map((stat, index) => (
            <Col key={index} className="text-center">
              <div className="bg-white rounded-3 p-4 shadow-sm h-100 trust-indicator">
                <div className="bg-dark bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 icon-wrapper" 
                     style={{ width: '60px', height: '60px' }}>
                  <stat.icon size={28} className="text-dark" />
                </div>
                <h3 className="fw-bold text-dark mb-2">{stat.number}</h3>
                <p className="text-muted mb-0">{stat.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TrustIndicators;
