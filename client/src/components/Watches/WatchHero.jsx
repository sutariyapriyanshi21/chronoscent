import "./WatchHero.css";
import watchHero from "../../assests/hero/watch-hero.jpg";

function WatchHero() {
  return (
    <section className="watch-hero d-flex align-items-center">
      <div className="container">

        <div className="row justify-content-center justify-content-lg-start">

          <div className="col-lg-7 col-md-9 col-12 text-center text-lg-start">

            <p className="text-uppercase fw-semibold hero-tag mb-3">
              Luxury Collection
            </p>

            <h1 className="display-4 fw-bold text-white mb-4">
              Luxury Watch Collection
            </h1>

            <p className="lead text-light mb-4">
              Discover premium timepieces crafted with timeless precision,
              exceptional engineering, and iconic luxury from the world's
              finest watchmakers.
            </p>

            <button className="btn hero-btn px-4 py-3">
              Explore Collection
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default WatchHero;