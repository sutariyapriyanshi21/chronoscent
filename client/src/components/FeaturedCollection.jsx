import { Link } from "react-router-dom";
import "../css/FeaturedCollection.css";

import watchImage from "../assests/collections/watchcollection.jpg";
import perfumeImage from "../assests/collections/perfumecollection.jpg";

function FeaturedCollections() {
  return (
    <section className="featured-collections">

      <div className="section-title">
        <h2>Featured Collections</h2>
        <p>
          Discover timeless luxury through our carefully curated watches and
          premium fragrances.
        </p>
      </div>

      <div className="collection-grid">

        {/* Watch Collection */}

        <div className="collection-card">

          <img src={watchImage} alt="Luxury Watches" />

          <div className="collection-content">

            <h3>Luxury Watches</h3>

            <p>
              Precision, craftsmanship, and timeless elegance for every moment.
            </p>

            <Link to="/watches" className="btn text-decoration-none p-0 border-0" style={{background: 'none', color: 'inherit'}}>
              <button>Explore Watches →</button>
            </Link>

          </div>

        </div>

        {/* Perfume Collection */}

        <div className="collection-card">

          <img src={perfumeImage} alt="Premium Fragrances" />

          <div className="collection-content">

            <h3>Premium Fragrances</h3>

            <p>
              Signature scents designed to leave an unforgettable impression.
            </p>

            <Link to="/Fragrances" className="btn text-decoration-none p-0 border-0" style={{background: 'none', color: 'inherit'}}>
              <button>Explore Fragrances →</button>
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default FeaturedCollections;