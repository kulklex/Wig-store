import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { clearCookieConsent } from "../utils/cookieManager";

const Footer = () => {
  const handleResetConsent = () => {
    clearCookieConsent();
    window.location.reload();
  };

  return (
    <footer className="bg-white border-top pt-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-lg-6">
            <div className="d-flex flex row gy-3 w-100">
              <div className="col-12 col-md-6">
                <h6 className="text-uppercase fw-bold mb-1" style={{ fontSize: "13px", letterSpacing: "0.5px", fontWeight: "400" }}>More About Us</h6>
                <ul className="list-unstyled small text-muted" style={{ fontSize: "13px" }}>
                  <li>
                    <Link
                      to="mission-statement"
                      className="text-decoration-none text-reset"
                    >
                      Mission Statement
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy-policy"
                      className="text-decoration-none text-reset"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms-and-conditions"
                      className="text-decoration-none text-reset"
                    >
                      Terms and conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-decoration-none text-reset"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-12 col-md-6">
                <h6 className="text-uppercase fw-bold mb-1" style={{ fontSize: "13px", letterSpacing: "0.5px", fontWeight: "400" }}>Extra Help</h6>
                <ul className="list-unstyled small text-muted" style={{ fontSize: "13px" }}>
                  <li>
                    <Link
                      to="/returns-and-exchanges"
                      className="text-decoration-none text-reset"
                    >
                      Returns/Exchange
                    </Link>
                  </li>
                  <li>
                    <Link to="/faqs" className="text-decoration-none text-reset">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shipping"
                      className="text-decoration-none text-reset"
                    >
                      Shipping + Delivery
                    </Link>
                  </li>
                  <li
                    className="cookie cursor-pointer"
                    onClick={handleResetConsent}
                  >
                    Change Cookie Preferences
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right block: delivery options */}
          <div className="col-12 col-lg-6">
            <h6 className="text-uppercase fw-bold mb-1" style={{ fontSize: "13px", letterSpacing: "0.5px", fontWeight: "400" }}>Delivery Options (FREE from £1000)</h6>
            <ul className="list-unstyled small text-muted" style={{ fontSize: "13px" }}>
              <li>
                Standard delivery (3–5 working days) -{" "}
                <strong>£5.99</strong>
              </li>
              <li>
                Next Day Delivery -{" "}
                <strong>£10.99</strong>
              </li>
              <li>
                Saturday Delivery - <strong>£12.99</strong>
              </li>
              <li>
                Sat 10am Delivery - <strong>£14.99</strong>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center justify-content-between">
          <div className="col-12 col-md-4 mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start gap-3 fs-5">
            <Link to="https://www.instagram.com/karina_beautyhub_uk/" className="text-dark" style={{textDecoration: "none",}} target="__blank">
              <FaInstagram />
            </Link>
            <Link to="https://www.tiktok.com/@KarinaHairLuxe.uk" className="text-dark" style={{textDecoration: "none",}} target="__blank">
              <FaTiktok />
            </Link>
          </div>

          <div className="col-12 col-md-8 d-flex justify-content-center justify-content-md-end gap-2 flex-wrap">
            <img
              src="https://img.icons8.com/color/36/apple-pay.png"
              alt="Apple Pay"
            />
            <img src="https://img.icons8.com/color/36/visa.png" alt="Visa" />
            <img
              src="https://img.icons8.com/color/36/mastercard.png"
              alt="Mastercard"
            />
            <img
              src="https://img.icons8.com/color/36/paypal.png"
              alt="PayPal"
            />
          </div>
        </div>

        <div className="text-center py-4 small text-muted mt-4 border-top" style={{ fontSize: "13px" }}>
          &copy; 2026 KarinaHairLuxe
        </div>
      </div>
    </footer>
  );
};

export default Footer;
