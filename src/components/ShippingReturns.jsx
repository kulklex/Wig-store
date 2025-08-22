import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiTruck, FiShield, FiRefreshCw, FiCheckCircle } from "react-icons/fi";

const ShippingReturns = () => {
  const services = [
    {
      icon: FiTruck,
      title: "Free Worldwide Shipping",
      description: "Free shipping on all orders over £1000. Fast delivery to your doorstep."
    },
    {
      icon: FiShield,
      title: "Premium Quality Guarantee",
      description: "All our hair extensions are 100% virgin hair with quality assurance."
    },
    {
      icon: FiRefreshCw,
      title: "7-Day Returns",
      description: "Not satisfied? Return within 7 days for a full refund or exchange."
    },
    {
      icon: FiCheckCircle,
      title: "24/7 Support",
      description: "Our customer service team is always here to help you."
    }
  ];

  return (
    <section className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold text-dark mb-3">Our Promise to You</h2>
          <p className="lead text-muted">Quality service and support you can count on</p>
        </div>
        
        <Row className="g-4">
          {services.map((service, index) => (
            <Col lg={3} md={6} className="text-center">
              <div className="bg-dark bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 icon-wrapper" 
                   style={{ width: '80px', height: '80px' }}>
                <service.icon size={32} className="text-dark" />
              </div>
              <h5 className="fw-bold mb-2">{service.title}</h5>
              <p className="text-muted mb-0">{service.description}</p>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ShippingReturns;
