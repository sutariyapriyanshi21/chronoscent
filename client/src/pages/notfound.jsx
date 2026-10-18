import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../css/static.css";

function NotFound() {
  return (
    <>
      <section className="static-page d-flex align-items-center" style={{ minHeight: "75vh" }}>
        <div className="container text-center">
          <div className="static-header mb-4">
            <h1 style={{ fontSize: "5rem", letterSpacing: "4px", color: "var(--color-primary)" }}>404</h1>
            <h3 style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-main)", marginBottom: "15px" }}>
              Piece Not Found
            </h3>
            <p style={{ maxWidth: "520px", margin: "0 auto 30px", color: "var(--color-text-muted)" }}>
              The timepiece or signature fragrance you are seeking is unavailable or has been archived from our collection.
            </p>
            <Link 
              to="/" 
              className="btn btn-primary px-4 py-2" 
              style={{ 
                backgroundColor: "#0F4C81", 
                borderColor: "#0F4C81", 
                borderRadius: "4px",
                fontWeight: 500,
                letterSpacing: "0.5px"
              }}
            >
              Return to Boutique
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default NotFound;