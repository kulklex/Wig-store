import React, { useState } from "react";
import axios from "axios";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setFeedback(null);

    try {
      const res = await axios.post("/api/orders/contact", form);
      setFeedback({ success: true, message: res.data.message });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setFeedback({ success: false, message: err.response?.data?.error || "Failed to send" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-md-6">
          <h3 className="mb-3 fw-semibold">Contact Us</h3>
          <p className="mb-4 fs-6 text-muted">
            Have questions about our wigs, an order, or our services? We’re here to help.
          </p>

          <div className="card p-4 shadow-sm border-0 fs-6">
            <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label small mb-1">Your Name</label>
            <input type="text" className="form-control form-control-sm" id="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label small mb-1">Email Address</label>
            <input type="email" className="form-control form-control-sm" id="email" value={form.email} onChange={handleChange} required />
          </div>

           <div className="mb-3">
            <label htmlFor="subject" className="form-label small mb-1">Phone</label>
            <input type="number" className="form-control form-control-sm" id="phone" placeholder="Add country code if outside UK" value={form.phone} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="subject" className="form-label small mb-1">Subject</label>
            <input type="text" className="form-control form-control-sm" id="subject" value={form.subject} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label small mb-1">Message</label>
            <textarea
              className="form-control form-control-sm"
              id="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-dark w-100 text-uppercase fw-semibold btn-sm" disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>

          {feedback && (
            <div className={`alert mt-3 ${feedback.success ? "alert-success" : "alert-danger"}`}>
              {feedback.message}
            </div>
          )}
        </form>
          </div>
        </div>

        <div className="col-md-6 mt-5 mt-md-0 fs-6">
          <h3 className="fw-semibold mb-3">Business Info</h3>
          <p className="text-muted small mb-1">Karina Beauty Hub</p>
          <p className="small mb-1">Unit 11, The Orchard Shopping Center</p>
          <p className="small mb-1">Dartford, DA1 1DN, UK</p>
          <p className="small mb-1">
            Email: <a href="mailto:hello@karinabeautyhub.co.uk">karinabeautyhubb@gmail.com</a>
          </p>
          <p className="small mb-4">
            Phone: <a href="tel:07984165342">07984 165342</a>
          </p>

          {/* <h6 className="fw-semibold mb-2">Store Hours</h6>
          <ul className="list-unstyled text-muted small mb-4">
            <li>Mon - Fri: 9:00am - 6:00pm</li>
            <li>Saturday: 10:00am - 5:00pm</li>
            <li>Sunday: Closed</li>
          </ul> */}

          <div>
            <h6 className="fw-semibold mb-2">Find Us</h6>
            <iframe
              title="Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2493.733985836558!2d0.21595261557939446!3d51.44444317962569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a723739e36c5%3A0x9aa6b7b8fa45d8e3!2sThe%20Orchard%20Shopping%20Centre%2C%20Dartford%20DA1%201DN%2C%20UK!5e0!3m2!1sen!2suk!4v1690456745165!5m2!1sen!2suk"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
