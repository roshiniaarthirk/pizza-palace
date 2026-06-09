import { useState } from "react";
import "./Contact.css";

const TIME_SLOTS = [
  "10 AM – 12 PM", "12 PM – 2 PM", "2 PM – 4 PM",
  "4 PM – 6 PM",  "6 PM – 8 PM",  "8 PM – 10 PM",
];

function Contact() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    address: "", pincode: "", landmark: "",
    slot: "", message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only digits for phone and pincode
    if (name === "phone" && !/^\d*$/.test(value)) return;
    if (name === "pincode" && !/^\d*$/.test(value)) return;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" }); // clear error on type
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())          newErrors.name    = "Name is required.";
    if (form.phone.length !== 10)   newErrors.phone   = "Enter a valid 10-digit number.";
    if (!form.email.trim())         newErrors.email   = "Email is required.";
    if (!form.address.trim())       newErrors.address = "Delivery address is required.";
    if (form.pincode.length !== 6)  newErrors.pincode = "Enter a valid 6-digit pincode.";
    if (!form.slot)                 newErrors.slot    = "Please select a delivery time slot.";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ name:"", phone:"", email:"", address:"", pincode:"", landmark:"", slot:"", message:"" });
    setErrors({});
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
              <p>Delivery slot: <strong>{form.slot}</strong></p>
              <p>We'll get back to you within 24 hours.</p>
              <button className="contact-btn" onClick={handleReset}>
                Send Another
              </button>
            </div>
          ) : (
            <div className="contact-form">
              <h3>Send a Message</h3>

              {/* Name + Phone */}
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text" name="name"
                    placeholder="Enter your name"
                    value={form.name} onChange={handleChange}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel" name="phone"
                    placeholder="98765 43210"
                    maxLength={10}
                    value={form.phone} onChange={handleChange}
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email" name="email"
                  placeholder="Enter your email"
                  value={form.email} onChange={handleChange}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              {/* Delivery Address */}
              <div className="form-group">
                <label>Delivery Address *</label>
                <input
                  type="text" name="address"
                  placeholder="House no, Street, Area"
                  value={form.address} onChange={handleChange}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>

              {/* Pincode + Landmark */}
              <div className="form-row">
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text" name="pincode"
                    placeholder="600001" maxLength={6}
                    value={form.pincode} onChange={handleChange}
                  />
                  {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                </div>
                <div className="form-group">
                  <label>Landmark <span className="optional">(optional)</span></label>
                  <input
                    type="text" name="landmark"
                    placeholder="Near bus stop, temple..."
                    value={form.landmark} onChange={handleChange}
                  />
                </div>
              </div>

              {/* Time Slot */}
              <div className="form-group">
                <label>Delivery Time Slot *</label>
                <div className="slot-grid">
                  {TIME_SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`slot-btn ${form.slot === s ? "slot-active" : ""}`}
                      onClick={() => { setForm({ ...form, slot: s }); setErrors({ ...errors, slot: "" }); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {errors.slot && <span className="field-error">{errors.slot}</span>}
              </div>

              {/* Message */}
              <div className="form-group">
                <label>Message <span className="optional">(optional)</span></label>
                <textarea
                  name="message"
                  placeholder="Special instructions, extra sauce, ring the bell..."
                  rows={4}
                  value={form.message} onChange={handleChange}
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