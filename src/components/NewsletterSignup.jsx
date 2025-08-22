import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { FiMail } from "react-icons/fi";

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterSubmitted(true);
      setEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }
  };

  return (
    <section className="py-5 bg-dark text-white">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <h2 className="display-6 fw-bold mb-3">Stay Updated</h2>
            <p className="lead mb-4">
              Get the latest hair extension tips, styling tutorials, and exclusive offers delivered to your inbox
            </p>
            
            {newsletterSubmitted ? (
              <Alert variant="success" className="d-inline-block">
                <FiMail className="me-2" />
                Thank you for subscribing! You'll receive our updates soon.
              </Alert>
            ) : (
              <Form onSubmit={handleNewsletterSubmit} className="d-flex gap-3 justify-content-center newsletter-form">
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control-lg"
                  style={{ maxWidth: '400px' }}
                  required
                />
                <Button type="submit" variant="light" size="lg" className="fw-bold px-4">
                  <FiMail className="me-2" />
                  Subscribe
                </Button>
              </Form>
            )}
            
            <p className="text-muted mt-3 mb-0">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default NewsletterSignup;
