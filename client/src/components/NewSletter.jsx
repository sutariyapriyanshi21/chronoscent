import "../css/Newsletter.css";

function Newsletter() {
  return (
    <section className="newsletter">

      <div className="newsletter-content">

        <h2>Stay Connected</h2>

        <p>
          Be the first to discover exclusive collections,
          luxury launches and special offers from ChronoScent Elite.
        </p>

        <div className="newsletter-form">

          <input
            type="email"
            placeholder="Enter your email address"
          />

          <button>
            Join Now
          </button>

        </div>

      </div>

    </section>
  );
}

export default Newsletter;