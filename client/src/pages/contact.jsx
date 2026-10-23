import { useState } from "react";
import { FiMapPin, FiPhone, FiMail, FiCheckCircle } from "react-icons/fi";
import Footer from "../components/Footer";
import "../css/static.css";

function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Error sending message. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="static-page">
        <div className="container">

          <div className="static-header">
            <h1>Get in Touch</h1>
            <p>Our dedicated concierge team is here to assist you with any inquiries.</p>
          </div>

          <div className="row g-5">

            {/* Contact Information */}
            <div className="col-lg-5">
              <div className="contact-card">
                <h3 className="mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)' }}>Contact Information</h3>

                <div className="contact-info-item">
                  <FiMapPin className="contact-icon" />
                  <div className="contact-details">
                    <h4>Boutique Location</h4>
                    <p>Gujarat<br />India</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <FiPhone className="contact-icon" />
                  <div className="contact-details">
                    <h4>Direct Line</h4>
                    <p>+91 1xxxxxxxx9<br />Mon-Fri, 9am - 6pm EST</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <FiMail className="contact-icon" />
                  <div className="contact-details">
                    <h4>Email Concierge</h4>
                    <p>hello@chronoscentelite.com<br />We reply within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="contact-card">
                <h3 className="mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)' }}>Send a Message</h3>

                {success && (
                  <div className="alert alert-success d-flex align-items-center gap-2 mb-4 py-2 px-3 rounded-3" style={{ fontSize: '0.9rem' }}>
                    <FiCheckCircle size={18} />
                    <span>Thank you! Your message has been sent to our concierge team.</span>
                  </div>
                )}

                <form className="contact-form" onSubmit={handleSubmit}>

                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-contact mt-2" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </button>

                </form>
              </div>
            </div>

          </div>

        </div>
      </section>
      <Footer />
    </>
  );
}

export default Contact;