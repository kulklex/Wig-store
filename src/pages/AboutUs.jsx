import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AboutUs = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col md={8} className="mx-auto">
          <h1 className="text-center mb-4">About Us</h1>
          <p className="lead">
            Welcome to Karina Beauty Hub — your go-to destination for premium quality wigs
            that embody style, beauty, and individuality. As a leading online store
            dedicated to providing top-tier wigs for women of all hair types and
            preferences, our goal is to empower you with confidence and convenience.
          </p>

          <p>
            Karina Beauty Hub is proudly owned and managed by Karina, a seasoned beauty
            professional whose passion for hair and aesthetics has blossomed over
            years of experience in the beauty industry. With a background in hair
            design, makeup artistry, and trend-led styling, Karina has cultivated a
            loyal customer base through her attention to detail, commitment to quality,
            and natural flair for creating beautiful transformations.
          </p>

          <p>
            Although Karina began her career in hands-on beauty services, she recognized
            a growing demand for premium, salon-grade wigs accessible online. With that
            vision in mind, Karina Beauty Hub transitioned into an e-commerce platform,
            allowing customers across the UK and beyond to enjoy beautifully crafted wigs
            without needing an appointment or salon visit.
          </p>

          <p>
            Our wigs are carefully selected and crafted to reflect current trends and
            timeless beauty alike. From natural textures like straight, wavy, and curly,
            to custom-made lace fronts and luxury closures, we offer a wide variety
            to meet every styling need. Each product is thoroughly reviewed and curated
            to ensure durability, comfort, and elegance.
          </p>

          <p>
            Whether you're seeking a new everyday look, something bold for a special
            occasion, or a protective style that looks as natural as your own hair,
            Karina Beauty Hub is here to help you feel your best.
          </p>

          <p>
            Join hundreds of happy customers who have trusted our brand to deliver
            premium wigs, fast and reliably. We offer seamless ordering, reliable
            delivery, and top-notch customer service with every purchase.
          </p>

          <p>
            Thank you for choosing Karina Beauty Hub. We’re excited to be a part of
            your beauty journey.
          </p>

          <p className="fw-bold mt-4">
            – The Karina Beauty Hub Team
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
