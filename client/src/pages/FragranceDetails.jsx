import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState, useEffect } from "react";

import "../css/watch-details.css";

function FragranceDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist } = useWishlist();

  const [fragrance, setFragrance] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/fragrances/${id}`)
      .then((res) => res.json())
      .then((data) => setFragrance(data))
      .catch((err) => console.error(err));
  }, [id]);

  const isInWishlist = fragrance ? wishlistItems.some((item) => item.name === fragrance.name) : false;

  /* ================================
     PRODUCT NOT FOUND
  ================================= */

  if (!fragrance) {
    return (
      <section className="watch-details-page py-5">
        <div className="container text-center">

          <h2 className="text-white">
            Fragrance Not Found
          </h2>

          <p className="text-secondary">
            The fragrance you are looking for does not exist.
          </p>

          <Link
            to="/Fragrances"
            className="btn btn-primary"
          >
            Back to Fragrances
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
          to="/Fragrances"
          className="watch-back-link"
        >
          <FiArrowLeft />
          Back to Fragrances
        </Link>


        {/* ================= PRODUCT ================= */}

        <div className="row g-5 mt-3">


          {/* ================= IMAGE ================= */}

          <div className="col-12 col-lg-6">

            <div className="watch-details-image sticky-lg-top mb-4 mb-lg-0" style={{ top: '120px' }}>

              <img
                src={fragrance.image}
                alt={fragrance.name}
                className="img-fluid watch-hero-img"
              />

            </div>

          </div>


          {/* ================= DETAILS ================= */}

          <div className="col-12 col-lg-6 position-relative z-3 pt-3 pt-lg-0">

            <p className="watch-details-brand mb-1">
              {fragrance.brand}
            </p>

            <h1 className="watch-details-name mt-1 mb-2">
              {fragrance.name}
            </h1>

            <p className="watch-details-model mb-4">
              Type: {fragrance.model}
            </p>


            {/* Rating */}

            <div className="mb-4">
              <span className="watch-details-rating">
                ★ {fragrance.rating}
              </span>
            </div>


            {/* Price */}

            <h2 className="watch-details-price my-4">
              ${fragrance.price.toLocaleString("en-US")}
            </h2>


            {/* Description */}

            <p className="watch-details-description">
              Experience the exquisite essence of{" "}
              {fragrance.name}. Designed for those who
              appreciate luxury, elegance, and unforgettable
              signature scents.
            </p>


            {/* ================= SPECIFICATIONS ================= */}

            <div className="watch-specifications">

              <div>
                <strong>Gender</strong>
                <span>{fragrance.gender}</span>
              </div>

              <div>
                <strong>Profile</strong>
                <span>{fragrance.fragranceType}</span>
              </div>

              <div>
                <strong>Category</strong>
                <span>{fragrance.category}</span>
              </div>

              <div>
                <strong>Availability</strong>
                <span>
                  {fragrance.inStock
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
                  addToCart({ ...fragrance, type: 'fragrance' });
                }}
              >
                <FiShoppingCart className="me-2" />
                Add to Cart
              </button>

              <button
                className="btn btn-outline-primary"
                aria-label="Add to wishlist"
                onClick={() => addToWishlist(fragrance)}
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

export default FragranceDetails;
