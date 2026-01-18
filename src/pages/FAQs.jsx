// src/pages/FAQs.jsx
import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

const FAQs = () => (
  <Container className="py-4 px-2 info-body">
    <h1 className="mb-4 text-center">Frequently Asked Questions</h1>
    <Accordion defaultActiveKey="0" className="info-body">
      <Accordion.Item eventKey="0">
        <Accordion.Header>What types of hair do you sell?</Accordion.Header>
        <Accordion.Body>
          We offer 100% virgin human hair, including Brazilian, Peruvian,
          Malaysian, and more.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>How long does shipping take?</Accordion.Header>
        <Accordion.Body>
          Standard UK shipping takes 2–5 business days. International orders
          may vary.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Do you accept returns?</Accordion.Header>
        <Accordion.Body>
          No, we do not. Only exchanges are accepted. Please see our <a href='/returns-and-exchanges'>Returns/Exchange</a> page for eligibility and process details.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </Container>
);

export default FAQs;