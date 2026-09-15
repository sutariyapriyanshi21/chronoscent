import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import Footer from "../components/Footer";
import "../css/static.css";

function Contact() {
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

                <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>

                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input type="text" id="firstName" className="form-control" required />
                    </div>
                    <div className="col-md-6 form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input type="text" id="lastName" className="form-control" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" className="form-control" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" className="form-control" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" className="form-control" required></textarea>
                  </div>

                  <button type="submit" className="btn-contact mt-2">
                    Send Message
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