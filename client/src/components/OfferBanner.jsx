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
                    <strong> $250 </strong>
                    and experience luxury delivered to your doorstep.
                </p>

                <div className="offer-buttons">

                    <Link to="/watches" className="text-decoration-none">
                        <button className="watch-btn">
                            Shop Watches
                        </button>
                    </Link>

                    <Link to="/Fragrances" className="text-decoration-none">
                        <button className="perfume-btn">
                            Shop Fragrances
                        </button>
                    </Link>

                </div>

            </div>

        </section>

    );

}

export default OfferBanner;