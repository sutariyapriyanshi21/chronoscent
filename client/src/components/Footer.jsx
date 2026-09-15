import { Link } from "react-router-dom";

import "../css/Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="row">

          {/* ================= BRAND ================= */}

          <div className="col-lg-4 col-md-6 mb-5">

            <h2 className="footer-logo">
              ChronoScent
              <span>Elite</span>
            </h2>

            <p className="footer-text">
              Discover luxury watches and premium fragrances crafted
              for those who appreciate timeless elegance.
            </p>

            <div className="social-icons">

              <i className="bi bi-instagram"></i>
              <i className="bi bi-facebook"></i>
              <i className="bi bi-twitter-x"></i>
              <i className="bi bi-youtube"></i>

            </div>

          </div>


          {/* ================= SHOP ================= */}

          <div className="col-lg-2 col-md-6 mb-4">

            <h5>Shop</h5>

            <ul>

              <li>
                <Link to="/watches">
                  Watches
                </Link>
              </li>

              <li>
                <Link to="/Fragrances">
                  Fragrances
                </Link>
              </li>

              <li>
                <Link to="/watches">
                  New Arrivals
                </Link>
              </li>

              <li>
                <Link to="/watches">
                  Collections
                </Link>
              </li>

            </ul>

          </div>


          {/* ================= COMPANY ================= */}

          <div className="col-lg-2 col-md-6 mb-4">

            <h5>Company</h5>

            <ul>

              <li>
                <Link to="/about">
                  About
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  Contact
                </Link>
              </li>

              <li>
                <Link to="/privacy">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link to="/terms">
                  Terms & Conditions
                </Link>
              </li>

            </ul>

          </div>


          {/* ================= CONTACT ================= */}

          <div className="col-lg-4 col-md-6 mb-4">

            <h5>Contact</h5>

            <p>
              <i className="bi bi-geo-alt-fill"></i>
              Surat, Gujarat, India
            </p>

            <p>
              <i className="bi bi-envelope-fill"></i>
              hello@chronoscentelite.com
            </p>

            <p>
              <i className="bi bi-telephone-fill"></i>
              +91 1xxxxxxxx9
            </p>

          </div>

        </div>


        <hr />


        {/* ================= FOOTER BOTTOM ================= */}

        <div className="footer-bottom">

          <p>
            © 2026 ChronoScent Elite. All Rights Reserved.
          </p>

          <span>
            Crafted with precision for luxury enthusiasts.
          </span>

        </div>

      </div>

    </footer>
  );
}

export default Footer;