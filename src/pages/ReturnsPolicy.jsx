import React from "react";
import { Container } from "react-bootstrap";

const ReturnsPolicy = () => {
  return (
    <Container className="my-5 mx-2 info-body">
      <h1 className="mb-2">Return/Exchange Policy</h1>

       <p style={{ fontSize: "13px" }}>
        We do not offer refunds. Returns are accepted for exchange only and must be sent to our designated returns address (different from our mailing address). All returned items are subject to a thorough quality inspection, and exchanges will only be approved if the item meets our return standards.
      </p>

      <ol type="i" className="text-muted small">
        <li>Items must be returned within 7 days of delivery</li>
        <li>Unauthorised returns will be refused or disposed of</li>
        <li>
          Item(s) must be unused in pristine condition.
        </li>
        <li>
          All returns shipping and handling costs will be the customer’s
          responsibility; we suggest using a courier that provides full tracking
          and delivery confirmation
        </li>
        <li>
          If returning from outside of the UK, classify your parcel as a
          <strong> "return"</strong> to avoid import fees – we are not liable
          for any customs charges
        </li>
        <li>
          All orders must be received first before a return/exchange can be processed.
          Returns may take 7–10 working days including warehouse review and
          exchange processing
        </li>
      </ol>

       <h4 className="mt-4">Order Cancellations</h4>
      <p style={{ fontSize: "13px" }}>
        Orders are processed immediately to ensure quick delivery. For this
        reason, orders cannot be cancelled or modified once placed.
      </p>
      <p style={{ fontSize: "13px" }}>
        Unauthorised returns or international return-to-sender actions will be
        refused or subject to a return fee of 15% plus the original shipping
        cost.
      </p>
      <p style={{ fontSize: "13px" }}>
        On the rare occasion you are unhappy with your order, please reach out
        via email and we will do our best to provide a fast and fair resolution.
      </p>

       <h4 className="mt-4">How to Return</h4>
      <p style={{ fontSize: "13px" }}>
        Please use our streamlined returns portal to submit your return request.
        We’ll review and approve your return as quickly as possible.
      </p>

      <p className="">
        <strong>
          <a
            href="/my-orders"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click HERE to submit a return request
          </a>
        </strong>
      </p>
     </Container>
  );
};

export default ReturnsPolicy;
