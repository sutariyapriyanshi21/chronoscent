import { Link } from "react-router-dom";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import "../css/Cart.css";

function Cart() {
  const { 
    cartItems, 
    increaseQuantity, 
    decreaseQuantity, 
    removeItem, 
    subtotal, 
    shipping, 
    total 
  } = useCart();

  return (
    <section className="cart-page">
      <div className="container">
        
        <Link to="/watches" className="text-decoration-none text-muted mb-4 d-inline-block">
          <FiArrowLeft className="me-2" /> Continue Shopping
        </Link>

        <h1 className="cart-header">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <h3 className="text-muted">Your cart is currently empty.</h3>
            <Link to="/watches" className="btn btn-primary mt-3">Explore Products</Link>
          </div>
        ) : (
          <div className="row g-5">
            
            {/* ================= CART ITEMS LIST ================= */}
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div key={item.cartId} className="cart-item">
                  
                  {/* Image */}
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  
                  {/* Details */}
                  <div className="cart-item-details">
                    <p className="cart-item-brand">{item.brand}</p>
                    <Link to={item.type === "watch" ? `/watches/${item._id}` : `/fragrances/${item._id}`} className="text-decoration-none">
                      <h4 className="cart-item-name">{item.name}</h4>
                    </Link>
                    
                    <button className="remove-btn" onClick={() => removeItem(item.cartId)}>
                      <FiTrash2 /> Remove
                    </button>
                  </div>

                  {/* Quantity & Price */}
                  <div className="cart-item-price-wrapper text-lg-end">
                    <p className="cart-item-price mb-2">${item.price.toLocaleString("en-US")}</p>
                    
                    <div className="quantity-controls ms-auto ms-md-0">
                      <button className="quantity-btn" onClick={() => decreaseQuantity(item.cartId)}>-</button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => increaseQuantity(item.cartId)}>+</button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="col-lg-4">
              <div className="cart-summary">
                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString("en-US")}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>${shipping.toLocaleString("en-US")}</span>
                </div>
                
                <div className="summary-total">
                  <span>Total</span>
                  <span>${total.toLocaleString("en-US")}</span>
                </div>

                <Link 
                  to="/checkout"
                  className="checkout-btn d-block text-center text-decoration-none"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default Cart;
