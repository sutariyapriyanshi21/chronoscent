import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import '../css/Wishlist.css';

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="wishlist-page">
      <h2>My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty!</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item, index) => (
            <div key={index} className="wishlist-card">
              <img src={item.image} alt={item.name} />
              <div className="wishlist-info">
                <h3>{item.name}</h3>
                <p className="price">₹{(typeof item.price === 'number' ? item.price : Number(String(item.price).replace(/[^0-9.-]+/g,""))).toLocaleString("en-IN")}</p>
                <div className="wishlist-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => {
                      const numericPrice = typeof item.price === 'string' ? Number(item.price.replace(/[^0-9.-]+/g,"")) : Number(item.price);
                      addToCart({
                        ...item,
                        _id: item._id || item.id,
                        price: numericPrice
                      });
                    }}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromWishlist(item.name)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
