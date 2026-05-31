import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields!");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h2>📞 Contact Us</h2>
        <p>We'd love to hear from you!</p>
      </div>

      <div className="contact-layout">
        {/* INFO */}
        <div className="contact-info">
          <h3>Get In Touch</h3>
          <p>Have a question or feedback? We're here to help!</p>

          <div className="info-items">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <div className="info-label">Address</div>
                <div className="info-value">123 Pizza Street, Chennai, Tamil Nadu 600001</div>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <div className="info-label">Phone</div>
                <div className="info-value">+91 98765 43210</div>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📧</span>
              <div>
                <div className="info-label">Email</div>
                <div className="info-value">hello@pizzapalace.in</div>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🕒</span>
              <div>
                <div className="info-label">Hours</div>
                <div className="info-value">Mon–Sun: 10:00 AM – 11:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="contact-form-wrap">
          {submitted ? (
            <div className="contact-success">
              <div className="success-icon">🎉</div>
              <h3>Message Sent!</h3>
              <p>We'll get back to you within 24 hours.</p>
              <button
                className="contact-btn"
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <div className="contact-form">
              <h3>Send a Message</h3>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
              <button className="contact-btn" onClick={handleSubmit}>
                Send Message 🍕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;