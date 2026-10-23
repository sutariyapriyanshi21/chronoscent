import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "../css/ProductCard.css";

function ProductCard({
  _id,
  image,
  brand,
  name,
  price,
  rating,
  type = "watch",
  product
}) {
  const item = product || { _id, image, brand, name, price, rating, type };
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist } = useWishlist();

  // Convert the price to a number for cart logic
  const numericPrice = typeof item.price === "number" 
    ? item.price 
    : Number(String(item.price).replace(/[^0-9.-]+/g, ""));

  const displayPrice = typeof item.price === "number"
    ? `₹${item.price.toLocaleString("en-IN")}`
    : String(item.price).replace("$", "₹");

  const isInWishlist = wishlistItems.some((w) => w.name === item.name);
  const itemId = item._id || item.id;
  const detailLink = itemId 
    ? (item.type === "fragrance" ? `/fragrances/${itemId}` : `/watches/${itemId}`)
    : (item.type === "fragrance" ? "/fragrances" : "/watches");

  return (
    <div className="product-card">

      <div 
        className="wishlist" 
        onClick={() => {
          addToWishlist({
            _id: item._id,
            brand: item.brand,
            name: item.name,
            price: numericPrice,
            image: item.image,
            rating: item.rating,
            type: item.type
          });
        }}
        style={{ cursor: 'pointer', color: isInWishlist ? 'red' : 'inherit' }}
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <i className={isInWishlist ? "bi bi-heart-fill" : "bi bi-heart"}></i>
      </div>

      <Link to={detailLink} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src={item.image} alt={item.name} />
      </Link>

      <div className="product-info">

        <span className="brand">
          {item.brand}
        </span>

        <Link to={detailLink} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>{item.name}</h3>
        </Link>

        <p className="rating">
          ⭐ {item.rating}
        </p>

        <h4>{displayPrice}</h4>

        <button onClick={() => {
          addToCart({
            _id: item._id || `product-${item.brand.toLowerCase()}-${item.name.toLowerCase()}`.replace(/\s+/g, '-'),
            brand: item.brand,
            name: item.name,
            price: numericPrice,
            image: item.image,
            type: item.type
          });
        }}>
          Add to Cart
        </button>

      </div>

    </div>
  );
}

export default ProductCard;