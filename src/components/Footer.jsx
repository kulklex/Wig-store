import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaSnapchatGhost,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-top pt-5">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-4 col-lg-3">
            <h6 className="text-uppercase fw-bold mb-3">More About Us</h6>
            <ul className="list-unstyled small text-muted">
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Charity donations
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Mission Statement
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Terms and conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-4 col-lg-3">
            <h6 className="text-uppercase fw-bold mb-3">Extra Help</h6>
            <ul className="list-unstyled small text-muted">
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Help Quiz
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Loyalty Programme / Referrals
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Shipping + Delivery
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Wholesale
                </Link>
              </li>
              <li>
                <Link to="#" className="text-decoration-none text-reset">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-4 col-lg-6">
            <h6 className="text-uppercase fw-bold mb-3">Delivery Options</h6>
            <p className="mb-1 small fw-semibold">
              UK: Non Custom Made Orders:
            </p>
            <ul className="list-unstyled small text-muted">
              <li>
                Standard delivery (3–5 working days) -{" "}
                <strong>FREE above £150.00 / £5.00 below</strong>
              </li>
              <li>
                Next Day Delivery (before 4pm Mon–Thurs) -{" "}
                <strong>£11.00</strong>
              </li>
              <li>
                Saturday Delivery (before 4pm Fri) - <strong>£20.00</strong>
              </li>
              <li>
                Sat 10am Delivery (before 4pm Fri) - <strong>£30.00</strong>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        {/* Payment Icons + Social Icons */}
        <div className="row align-items-center justify-content-between">
          <div className="col-12 col-md-4 mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start gap-3 fs-5">
            <FaInstagram />
            <FaFacebookF />
            <FaSnapchatGhost />
            <FaTiktok />
          </div>

          <div className="col-12 col-md-8 d-flex justify-content-center justify-content-md-end gap-2 flex-wrap">
            <img src="https://img.icons8.com/color/36/amex.png" alt="Amex" />
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

        <div className="text-center py-4 small text-muted mt-4 border-top">
          &copy; 2025 KarinaBeautyHub
        </div>
      </div>
    </footer>
  );
};

export default Footer;
