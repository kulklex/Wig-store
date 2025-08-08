import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const MissionStatement = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="p-4 shadow-sm border-0">
            <h3 className="fw-semibold mb-4 text-center">Our Mission</h3>
            <p className="text-muted small mb-3">
              At <strong>Karina Beauty Hub</strong>, our mission is to redefine beauty through premium quality hair products that celebrate individuality, confidence, and self-expression. We believe beauty is not one-size-fits-all, it’s deeply personal. That’s why we strive to provide a wide range of authentic, high-grade wigs and hair extensions that cater to diverse textures, tones, and styles, empowering our customers to embrace their unique identity.
            </p>
            <p className="text-muted small mb-3">
              We are passionate about supporting our community by offering more than just products, we provide an experience built on trust, education, and empowerment. Whether you're exploring wigs for fashion, protective styling, or medical reasons, we aim to make your journey seamless, uplifting, and transformative. Every strand we offer reflects our dedication to quality, comfort, and realism.
            </p>
            <p className="text-muted small mb-3">
              Customer satisfaction is the heartbeat of our brand. We are committed to delivering exceptional service from first browse to final purchase, and beyond. We actively listen to your feedback, continuously innovate our offerings, and uphold the highest standards to ensure you feel confident, supported, and proud of your look every single day.
            </p>
            <p className="text-muted small">
              As a brand built on empowerment and excellence, we envision a world where everyone has the freedom to express themselves boldly through hair. Our mission is not just to provide outstanding products, but to help people step into their power, radiate confidence, and redefine what beauty means to them.
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MissionStatement;
