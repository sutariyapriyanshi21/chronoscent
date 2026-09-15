import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState, useEffect } from "react";

import "../css/watch-details.css";

function WatchDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist } = useWishlist();

  const [watch, setWatch] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/watches/${id}`)
      .then((res) => res.json())
      .then((data) => setWatch(data))
      .catch((err) => console.error(err));
  }, [id]);

  const isInWishlist = watch ? wishlistItems.some((item) => item.name === watch.name) : false;

  /* ================================
     PRODUCT NOT FOUND
  ================================= */

  if (!watch) {
    return (
      <section className="watch-details-page py-5">
        <div className="container text-center">

          <h2 className="text-white">
            Watch Not Found
          </h2>

          <p className="text-secondary">
            The watch you are looking for does not exist.
          </p>

          <Link
            to="/watches"
            className="btn btn-primary"
          >
            Back to Watches
          </Link>

        </div>
      </section>
    );
  }


  return (
    <section className="watch-details-page py-5">

      <div className="container">

        {/* ================= BACK ================= */}

        <Link
          to="/watches"
          className="watch-back-link"
        >
          <FiArrowLeft />
          Back to Watches
        </Link>


        {/* ================= PRODUCT ================= */}

        <div className="row g-5 mt-3">


          {/* ================= IMAGE ================= */}

          <div className="col-12 col-lg-6">

            <div className="watch-details-image sticky-lg-top mb-4 mb-lg-0" style={{ top: '120px' }}>

              <img
                src={watch.image}
                alt={watch.name}
                className="img-fluid watch-hero-img"
              />

            </div>

          </div>


          {/* ================= DETAILS ================= */}

          <div className="col-12 col-lg-6 position-relative z-3 pt-3 pt-lg-0">

            <p className="watch-details-brand mb-1">
              {watch.brand}
            </p>

            <h1 className="watch-details-name mt-1 mb-2">
              {watch.name}
            </h1>

            <p className="watch-details-model mb-4">
              Model: {watch.model}
            </p>


            {/* Rating */}

            <div className="mb-4">
              <span className="watch-details-rating">
                ★ {watch.rating}
              </span>
            </div>


            {/* Price */}

            <h2 className="watch-details-price my-4">
              ${watch.price.toLocaleString("en-US")}
            </h2>


            {/* Description */}

            <p className="watch-details-description">
              Discover the refined craftsmanship of the{" "}
              {watch.name}. Designed for those who
              appreciate precision, style, and timeless
              luxury.
            </p>


            {/* ================= SPECIFICATIONS ================= */}

            <div className="watch-specifications">

              <div>
                <strong>Gender</strong>
                <span>{watch.gender}</span>
              </div>

              <div>
                <strong>Watch Type</strong>
                <span>{watch.watchType}</span>
              </div>

              <div>
                <strong>Category</strong>
                <span>{watch.category}</span>
              </div>

              <div>
                <strong>Availability</strong>
                <span>
                  {watch.inStock
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

            </div>


            {/* ================= ACTIONS ================= */}

            <div className="d-flex gap-3 mt-4">

              <button
                className="btn btn-primary flex-grow-1 d-flex justify-content-center align-items-center"
                onClick={() => {
                  addToCart({ ...watch, type: 'watch' });
                }}
              >
                <FiShoppingCart className="me-2" />
                Add to Cart
              </button>

              <button
                className="btn btn-outline-primary"
                aria-label="Add to wishlist"
                onClick={() => addToWishlist(watch)}
                style={{ color: isInWishlist ? 'red' : 'inherit', borderColor: isInWishlist ? 'red' : 'inherit' }}
              >
                <FiHeart className="fs-5" fill={isInWishlist ? "red" : "none"} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default WatchDetails;