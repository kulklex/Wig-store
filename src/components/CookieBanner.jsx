import React, { useState, useEffect } from "react";
import { Button, Form, Toast, ToastContainer } from "react-bootstrap";
import { getCookieConsent, setCookieConsent } from "../utils/cookieManager";

const CookieBanner = () => {
  const [show, setShow] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(true);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent("accepted", rememberChoice);
    setShow(false);
    // Enable analytics/marketing/etc here
  };

  const handleDecline = () => {
    setCookieConsent("declined", rememberChoice);
    setShow(false);
  };

  return (
    <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast show={show} bg="light" onClose={() => setShow(false)}>
        <Toast.Header closeButton={false}>
          <strong className="me-auto">We Use Cookies</strong>
        </Toast.Header>
        <Toast.Body className="small text-dark">
          This website uses cookies to ensure you get the best experience on our site. Some cookies are strictly necessary, while others help us improve your experience.

          <Form.Check
            type="checkbox"
            className="mt-2"
            label="Remember my choice for future visits"
            checked={rememberChoice}
            onChange={(e) => setRememberChoice(e.target.checked)}
          />

          <div className="mt-3 d-flex gap-2">
            <Button variant="dark" size="sm" onClick={handleAccept}>
              Accept All
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={handleDecline}>
              Decline
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CookieBanner;
