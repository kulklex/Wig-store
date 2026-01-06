import React from "react";
import { Container } from "react-bootstrap";

const PrivacyPolicy = () => {
  return (
    <Container className="py-5 px-2 info-body">
      <h3 className="fw-semibold mb-4">Privacy Policy</h3>

      <p className="text-muted small">
        Your privacy is very important to us. We do not store credit card details nor do we share customer details with any 3rd parties. Accordingly, we have developed this Policy in order for you to understand how we collect, use, store, transfer and disclose your information.
      </p>

      <p className="text-muted small">
        The personal information we collect allows us to keep you posted on our latest product announcements and upcoming events. It also helps us to improve our services, content, and advertising. If you don’t want to be on our mailing list, you can opt out anytime by sending an email to Karinabeautyhubb@gmail.com.
      </p>

      <p className="text-muted small">
        From time to time, we may use your personal information to send important notices, such as communications about purchases and changes to our terms, conditions, and policies. Because this information is important to your interaction with us, you may not opt out of receiving these communications.
      </p>

      <p className="text-muted small">
        We may also use personal information for internal purposes such as auditing, data analysis, and research to improve our products, services, and customer communications.
      </p>

      <h5 className="fw-semibold mt-4">Cookies</h5>
      <p className="text-muted small">
        Cookies are very small text files that are stored on your computer when you visit some websites. We use cookies to help identify your computer so we can tailor your user experience, track shopping basket contents and remember where you are in the order process. 
      </p>

      <ol type="i" className="text-muted small">
        <li>Remember what is in your shopping basket</li>
        <li>Remember where you are in the order process</li>
        <li>Allow you to share pages with social networks such as Facebook (if available)</li>
        <li>Allow you to share pages via Add This (if available)</li>
      </ol>

      <p className="text-muted small">
        Our website will not share any personal information with third parties.
      </p>


      <h5 className="fw-semibold mt-4">Access</h5>
      <p className="text-muted small">
        Access to the Site is permitted on a temporary basis, and we reserve the right to withdraw or amend the service we provide on the Site without notice. From time to time, we may restrict access to some parts of the Site, or the entire Site, to users who have registered with us.
      </p>

      <h5 className="fw-semibold mt-4">Copyright</h5>
      <p className="text-muted small">
        The content of the Site (including, but not limited to all text and artwork) is protected by copyright. You may view any part of the Site for private purposes, but you are not permitted, without our permission, to store, reproduce, copy or transmit any part of it for other purposes or in any other medium.
      </p>
    </Container>
  );
};

export default PrivacyPolicy;
