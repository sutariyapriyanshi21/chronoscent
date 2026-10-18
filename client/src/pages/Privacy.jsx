import Footer from "../components/Footer";
import "../css/static.css";

function Privacy() {
  return (
    <>
      <section className="static-page">
        <div className="container">
          <div className="static-header">
            <h1>Privacy Policy</h1>
            <p>Your trust and privacy are paramount to ChronoScent Elite.</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="about-content">
                <h3>1. Commitment to Privacy</h3>
                <p>
                  At ChronoScent Elite, we are dedicated to safeguarding the personal data and confidentiality of our clientele. This Privacy Policy details how we collect, protect, and use your information when acquiring luxury timepieces and bespoke fragrances through our boutique.
                </p>

                <h3 className="mt-4">2. Information We Collect</h3>
                <p>
                  We only collect information necessary to provide an uncompromising client experience, such as your contact details (name, email, shipping address, and phone number) when you register, place orders, or contact our team.
                </p>

                <h3 className="mt-4">3. Data Protection & Security</h3>
                <p>
                  All transactions and records are processed using industry-standard encryption protocols. We do not sell, rent, or distribute your private information to third-party advertisers under any circumstances.
                </p>

                <h3 className="mt-4">4. Inquiries & Concierge</h3>
                <p>
                  Should you have any questions regarding your account or wish to review your data preferences, our concierge team is always available via our contact page or at concierge@chronoscent.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Privacy;
