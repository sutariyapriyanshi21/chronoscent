import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

function FragranceCard({ fragrance, heightClass = "" }) {
  const { wishlistItems, addToWishlist } = useWishlist();
  const isInWishlist = wishlistItems.some((item) => item.name === fragrance.name);

  return (
    <article className={`watch-card ${heightClass}`}>
      <div className="watch-card-image">
        <Link to={`/fragrances/${fragrance._id}`}>
          <img
            src={fragrance.image}
            alt={`${fragrance.brand} ${fragrance.name}`}
          />
        </Link>
        <button
          type="button"
          className="watch-wishlist-btn shadow-sm"
          aria-label={`Add ${fragrance.name} to wishlist`}
          onClick={() => addToWishlist(fragrance)}
          style={{ color: isInWishlist ? 'red' : 'inherit' }}
        >
          <FiHeart size={16} fill={isInWishlist ? "red" : "none"} />
        </button>
      </div>

      <div className="watch-card-body mt-2">
        <p className="watch-brand">{fragrance.brand}</p>
        <Link to={`/fragrances/${fragrance._id}`} className="text-decoration-none">
          <h4 className="watch-name">{fragrance.name}</h4>
        </Link>
        <div className="d-flex justify-content-between align-items-center mt-1">
          <strong className="watch-price">
            ${fragrance.price.toLocaleString("en-US")}
          </strong>
        </div>
      </div>
    </article>
  );
}

export default FragranceCard;
