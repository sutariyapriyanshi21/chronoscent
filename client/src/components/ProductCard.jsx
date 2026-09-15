import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "../css/ProductCard.css";

function ProductCard({
  image,
  brand,
  name,
  price,
  rating
}) {
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist } = useWishlist();

  // Convert the string price (e.g. "$899") to a number for the cart logic
  const numericPrice = Number(price.replace(/[^0-9.-]+/g,""));

  const isInWishlist = wishlistItems.some((item) => item.name === name);

  return (
    <div className="product-card">

      <div 
        className="wishlist" 
        onClick={() => {
          addToWishlist({ brand, name, price, image, rating });
        }}
        style={{ cursor: 'pointer', color: isInWishlist ? 'red' : 'inherit' }}
      >
        <i className={isInWishlist ? "bi bi-heart-fill" : "bi bi-heart"}></i>
      </div>

      <img src={image} alt={name} />

      <div className="product-info">

        <span className="brand">
          {brand}
        </span>

        <h3>{name}</h3>

        <p className="rating">
          ⭐ {rating}
        </p>

        <h4>{price}</h4>

        <button onClick={() => {
          addToCart({
            id: Math.random(), // since featured products don't have real IDs passed currently
            brand,
            name,
            price: numericPrice,
            image,
            type: 'featured'
          });
        }}>
          Add to Cart
        </button>

      </div>

    </div>
  );
}

export default ProductCard;