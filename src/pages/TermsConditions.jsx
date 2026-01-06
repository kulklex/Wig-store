import React from "react";
import { Container } from "react-bootstrap";

const TermsAndConditions = () => {
  return (
    <Container className="py-5 px-2 info-body">
      <h3 className="fw-semibold mb-4">Terms & Conditions</h3>

      <p className="text-muted small">
        These terms and conditions govern your use of this website. By accessing or using this site, you agree to comply with and be bound by the terms outlined below. Please read them carefully.
      </p>

      <h5 className="fw-semibold mt-4">1. Definitions</h5>
      <p className="text-muted small">
        In these terms:
        <br /><strong>"We", "us", "our"</strong> refers to Karina Hair Luxury.
        <br /><strong>"You", "user"</strong> refers to any individual or entity accessing this website.
        <br /><strong>"Website"</strong> means <a href="https://www.karinaluxehairco.com/">www.KarinaHairLuxe.co.uk</a> and any sub-domains of this site.
      </p>

      <h5 className="fw-semibold mt-4">2. Use of the Website</h5>
      <p className="text-muted small">
        You must use this website only for lawful purposes and in a way that does not infringe on the rights of others or restrict their use of the site. We reserve the right to suspend or block access to the website if any misuse is detected.
      </p>

      <h5 className="fw-semibold mt-4">3. Products & Orders</h5>
      <p className="text-muted small">
        All items are subject to availability. We reserve the right to change product offerings and pricing without notice. Once an order is placed, changes cannot be made. Please double-check order details before submitting.
      </p>

      <h5 className="fw-semibold mt-4">4. Payment</h5>
      <p className="text-muted small">
        We accept major debit and credit cards, PayPal, and other listed payment options. All payments are processed securely. We do not store card details on our servers.
      </p>

      <h5 className="fw-semibold mt-4">5. Shipping</h5>
      <p className="text-muted small">
        Shipping times vary depending on the delivery method selected. Please refer to our <a href="/shipping">Shipping & Delivery</a> page for full details. We are not responsible for delays caused by couriers or incorrect address information.
      </p>

      <h5 className="fw-semibold mt-4">6. Returns & Exchanges</h5>
      <p className="text-muted small">
        We do not accept returns on our hair products unless faulty. You may have the option to exchange for another product. Contact Us via <a href="/contact">Contact Us</a> to find out. If you receive a defective item, contact us within 7 days of delivery. Exchanges are subject to inspection and approval.
      </p>

      <h5 className="fw-semibold mt-4">7. Cancellation</h5>
      <p className="text-muted small">
        We do not offer refunds for any cancellation. Contact Us via <a href="/contact">Contact Us</a> for best solution.
      </p>

      <h5 className="fw-semibold mt-4">8. Privacy</h5>
      <p className="text-muted small">
        Your privacy is important to us. Please refer to our <a href="/privacy-policy">Privacy Policy</a> to understand how we collect, use, and protect your personal information.
      </p>

      <h5 className="fw-semibold mt-4">9. Intellectual Property</h5>
      <p className="text-muted small">
        All content on this website — including images, text, logos, and graphics — is owned by Karina Hair Luxury or its licensors. Unauthorized use is strictly prohibited.
      </p>

      <h5 className="fw-semibold mt-4">10. Limitation of Liability</h5>
      <p className="text-muted small">
        We shall not be held liable for any indirect, incidental, or consequential damages resulting from your use of this website or products purchased, except as required by law.
      </p>

      <h5 className="fw-semibold mt-4">11. Changes to Terms</h5>
      <p className="text-muted small">
        We may revise these terms from time to time. Continued use of the website after changes are posted constitutes your agreement to the updated terms.
      </p>

       <h5 className="fw-semibold mt-4">12. Governing Law</h5>
       <p className="text-muted small">
         These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the English courts.
       </p>
     </Container>
  );
};

export default TermsAndConditions;
