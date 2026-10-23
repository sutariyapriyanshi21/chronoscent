import { Link } from "react-router-dom";
import "../css/OfferBanner.css";

function OfferBanner() {

    return (

        <section className="offer-banner">

            <div className="offer-content">

                <span className="offer-tag">
                    LIMITED TIME OFFER
                </span>

                <h2>
                    Free Worldwide Shipping
                </h2>

                <p>
                    Enjoy complimentary shipping on all orders above
                    <strong> ₹2,500 </strong>
                    and experience luxury delivered to your doorstep.
                </p>

                <div className="offer-buttons">
                    <Link to="/watches" className="banner-link watch-btn">
                        Shop Watches
                    </Link>

                    <Link to="/fragrances" className="banner-link perfume-btn">
                        Shop Fragrances
                    </Link>
                </div>

            </div>

        </section>

    );

}

export default OfferBanner;