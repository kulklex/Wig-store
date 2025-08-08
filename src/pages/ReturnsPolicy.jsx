import React from "react";
import { Container } from "react-bootstrap";

const ReturnsPolicy = () => {
  return (
    <Container className="my-5">
      <h1 className="mb-4 text-center">Return/Refund Policy</h1>

      <p>
        We exercise a strict quality process to ensure that you receive the best
        quality items. There are no refunds on items which have not been
        returned to our specified returns address (different from our mailing
        address) and not without an initial assessment.
      </p>

      <ul>
        <li>Items must be returned within 14 days of delivery</li>
        <li>Unauthorised returns will be refused or disposed of</li>
        <li>Custom/pre-order items are non-refundable</li>
        <li>
          Item(s) must be unused in pristine condition with the curl pattern
          undisturbed / distressed. Ties/clips must not be untied or cut
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
          All orders must be received first before a return can be processed.
          Returns may take 7–10 working days including warehouse review and
          refund processing
        </li>
      </ul>

      <h4 className="mt-4">Order Cancellations</h4>
      <p>
        Orders are processed immediately to ensure quick delivery. For this
        reason, orders cannot be cancelled or modified once placed.
      </p>
      <p>
        Unauthorised returns or international return-to-sender actions will be
        refused or subject to a return fee of 15% plus the original shipping
        cost.
      </p>

      <h4 className="mt-4">Refunds</h4>
      <p>
        Refunds are processed back to your original payment method, minus a
        non-refundable payment processing fee of 4%–15% (as these are not
        returned to us by the payment processor). Postage fees will also be
        deducted before issuing a refund.
      </p>
      <p>
        On the rare occasion you are unhappy with your order, please reach out
        via email and we will do our best to provide a fast and fair resolution.
      </p>

      <h4 className="mt-4">How to Return</h4>
      <p>
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
