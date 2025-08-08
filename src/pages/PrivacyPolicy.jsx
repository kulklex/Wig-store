import React from "react";
import { Container } from "react-bootstrap";

const PrivacyPolicy = () => {
  return (
    <Container className="py-5">
      <h3 className="fw-semibold mb-4">Privacy Policy</h3>

      <p className="text-muted small">
        Your privacy is very important to us. We do not store credit card details nor do we share customer details with any 3rd parties. Accordingly, we have developed this Policy in order for you to understand how we collect, use, store, transfer and disclose your information.
      </p>

      <p className="text-muted small">
        The personal information we collect allows us to keep you posted on our latest product announcements and upcoming events. It also helps us to improve our services, content, and advertising. If you don’t want to be on our mailing list, you can opt out anytime by sending an email to hello@karinabeautyhub.co.uk.
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

      <ul className="text-muted small">
        <li>Remember what is in your shopping basket</li>
        <li>Remember where you are in the order process</li>
        <li>Allow you to share pages with social networks such as Facebook (if available)</li>
        <li>Allow you to share pages via Add This (if available)</li>
      </ul>

      <p className="text-muted small">
        Our website will not share any personal information with third parties.
      </p>

      <h5 className="fw-semibold mt-4">Customer Data Sharing</h5>
      <p className="text-muted small">
        In order to be able to offer you Klarna’s payment options, we will pass to Klarna certain of your personal information, such as contact and order details, in order for Klarna to assess whether you qualify for their payment options and to tailor the payment options for you. 
      </p>

      <p className="text-muted small">
        General information on Klarna you can find on their website. Your personal data is handled in accordance with applicable data protection law and in accordance with the information in Klarna’s privacy policy.
      </p>

      <h5 className="fw-semibold mt-4">Access</h5>
      <p className="text-muted small">
        Access to the Site is permitted on a temporary basis, and we reserve the right to withdraw or amend the service we provide on the Site without notice. From time to time, we may restrict access to some parts of the Site, or the entire Site, to users who have registered with us.
      </p>

      <p className="text-muted small">
        If you choose, or you are provided with, a user identification code, password or any other piece of information as part of our security procedures, you must treat such information as confidential, and you must not disclose it to any third party.
      </p>

      <p className="text-muted small">
        We have the right to disable any user identification code or password at any time if in our opinion you have failed to comply with any of the provisions of these terms of use.
      </p>

      <h5 className="fw-semibold mt-4">Disclaimer</h5>
      <p className="text-muted small">
        The Site and its contents are for general information only and are provided “as is”. We make no warranties or guarantees about the accuracy or completeness of the Site's content. We strongly recommend checking for viruses before downloading anything from the Site.
      </p>

      <h5 className="fw-semibold mt-4">Copyright</h5>
      <p className="text-muted small">
        The content of the Site (including, but not limited to all text and artwork) is protected by copyright. You may view any part of the Site for private purposes, but you are not permitted, without our permission, to store, reproduce, copy or transmit any part of it for other purposes or in any other medium.
      </p>

      <h5 className="fw-semibold mt-4">Data Usage</h5>
      <p className="text-muted small">
        We share your order tracking number, courier name, and transaction number associated with your orders with a service provider called Proveway Uptrack. This provider synchronizes and verifies shipping details to the payment gateways. No personal information like email or name is used.
      </p>

      <p className="text-muted small">
        For more information, please review <a href="https://www.proveway.com/blog/privacy-policy" target="_blank" rel="noopener noreferrer">Proveway's privacy policy</a>.
      </p>
    </Container>
  );
};

export default PrivacyPolicy;
