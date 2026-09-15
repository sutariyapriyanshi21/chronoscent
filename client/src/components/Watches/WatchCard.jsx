import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

function WatchCard({ watch, heightClass = "" }) {
  const { wishlistItems, addToWishlist } = useWishlist();
  const isInWishlist = wishlistItems.some((item) => item.name === watch.name);

  return (
    <article className={`watch-card ${heightClass}`}>
      <div className="watch-card-image">
        <Link to={`/watches/${watch._id}`}>
          <img
            src={watch.image}
            alt={`${watch.brand} ${watch.name}`}
          />
        </Link>
        <button
          type="button"
          className="watch-wishlist-btn shadow-sm"
          aria-label={`Add ${watch.name} to wishlist`}
          onClick={() => addToWishlist(watch)}
          style={{ color: isInWishlist ? 'red' : 'inherit' }}
        >
          <FiHeart size={16} fill={isInWishlist ? "red" : "none"} />
        </button>
      </div>

      <div className="watch-card-body mt-2">
        <p className="watch-brand">{watch.brand}</p>
        <Link to={`/watches/${watch._id}`} className="text-decoration-none">
          <h4 className="watch-name">{watch.name}</h4>
        </Link>
        <div className="d-flex justify-content-between align-items-center mt-1">
          <strong className="watch-price">
            ${watch.price.toLocaleString("en-US")}
          </strong>
        </div>
      </div>
    </article>
  );
}

export default WatchCard;