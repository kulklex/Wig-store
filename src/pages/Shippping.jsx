import React from "react";
import { Container, Table } from "react-bootstrap";

const ShippingDelivery = () => {
  return (
    <Container className="py-5">
      <h3 className="fw-semibold mb-4">Shipping & Delivery</h3>

      <p className="text-muted small">
        We dispatch orders Monday to Saturday. Public holidays are not included in dispatch or delivery timelines. Once your order has been processed, your selected delivery option will be used. Processing time is usually 1–2 business days for standard items.
      </p>

      <h5 className="fw-semibold mt-4">Pre-order Deliveries</h5>
      <p className="text-muted small">
        For custom or pre-order items, delivery estimates will be stated per product. These usually take between <strong>3–12 working days</strong> as they are made to order. Your selected shipping option will apply once your item is ready for dispatch.
      </p>

      <h5 className="fw-semibold mt-4">UK Standard & Non Pre-Order Deliveries</h5>
      <Table striped bordered responsive className="small mt-3">
        <thead>
          <tr>
            <th>Delivery Option</th>
            <th>Delivery Time</th>
            <th>Cut-Off Time</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Standard Delivery</td>
            <td>2–4 working days (DPD Tracked)</td>
            <td>11:59 PM</td>
            <td>£5.00 <br /><em>Free over £150</em></td>
          </tr>
          <tr>
            <td>Next Working Day Delivery</td>
            <td>Next working day (DPD Next Day)</td>
            <td>4 PM (Weekdays) / 10 AM (Saturday)</td>
            <td>£11.00 <br /><em>Free over £500</em></td>
          </tr>
          <tr>
            <td>Next Day by 10:30 AM</td>
            <td>Next working day by 10:30 AM (DPD Express)</td>
            <td>4 PM (Weekdays) / 10 AM (Saturday)</td>
            <td>£30.00</td>
          </tr>
          <tr>
            <td>Saturday Delivery</td>
            <td>Saturday by 6 PM</td>
            <td>4 PM Friday</td>
            <td>£20.00</td>
          </tr>
          <tr>
            <td>Sunday Delivery</td>
            <td>Sunday by 6 PM</td>
            <td>10 AM Saturday</td>
            <td>£20.00</td>
          </tr>
        </tbody>
      </Table>

      <h5 className="fw-semibold mt-5">International Deliveries</h5>
      <Table striped bordered responsive className="small mt-3">
        <thead>
          <tr>
            <th>Delivery Option</th>
            <th>Delivery Time</th>
            <th>Cut-Off Time</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Express International</td>
            <td>1–2 working days</td>
            <td>4 PM</td>
            <td>From £20.00</td>
          </tr>
          <tr>
            <td>Standard International</td>
            <td>3–7 working days</td>
            <td>11:59 PM</td>
            <td>From £15.00</td>
          </tr>
        </tbody>
      </Table>

      <h5 className="fw-semibold mt-5">Hair Extensions – Next Day Delivery</h5>
      <p className="text-muted small">
        We offer Next Working Day Delivery for hair extensions within the UK. Orders must be placed before the cut-off times below.
      </p>
      <Table striped bordered responsive className="small mt-3">
        <thead>
          <tr>
            <th>Delivery Option</th>
            <th>Delivery Time</th>
            <th>Cut-Off Time</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Next Working Day Delivery</td>
            <td>Next working day</td>
            <td>4 PM (Weekdays) / 10 AM (Saturday)</td>
            <td>£11.00 <br /><em>Free over £500</em></td>
          </tr>
          <tr>
            <td>Next Working Day by 10:30 AM</td>
            <td>Next day by 10:30 AM</td>
            <td>4 PM (Weekdays) / 10 AM (Saturday)</td>
            <td>£30.00</td>
          </tr>
          <tr>
            <td>Saturday Delivery</td>
            <td>Saturday by 6 PM</td>
            <td>4 PM Friday</td>
            <td>£20.00</td>
          </tr>
          <tr>
            <td>Sunday Delivery</td>
            <td>Sunday by 6 PM</td>
            <td>10 AM Saturday</td>
            <td>£20.00</td>
          </tr>
        </tbody>
      </Table>

      <h5 className="fw-semibold mt-5">Extra Delivery Information</h5>
      <p className="text-muted small">
        We ship via <strong>DPD</strong>. Orders are processed within 1–2 business days. Once processed, tracking details will be sent via email.
        <br /><br />
        Once an order is placed, it cannot be changed. Address updates require order cancellation and reordering. Karina Beauty Hub is not liable for incorrect shipping details provided by customers.
        <br /><br />
        International customers are responsible for any import duties, customs fees, or local taxes. We recommend placing orders at least 1 week in advance to avoid unexpected delays.
      </p>

      <p className="text-muted small mt-4">
        For further details, refer to our <a href="/terms-and-conditions">Terms & Conditions</a>.
      </p>
    </Container>
  );
};

export default ShippingDelivery;
