import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data matching our Mongoose Schema
    const orderData = {
      customerInfo: formData,
      orderItems: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: total
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert("Order successfully placed! Thank you for shopping with Chronoscent Elite.");
        clearCart();
        navigate("/"); // Redirect to home
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error connecting to server.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Your cart is empty!</h2>
        <Link to="/watches" className="btn btn-primary mt-3">Go back to shopping</Link>
      </div>
    );
  }

  return (
    <section className="checkout-page py-5">
      <div className="container">
        <h1 className="mb-4">Checkout</h1>
        
        <div className="row g-5">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4">
              <h3 className="mb-4">Shipping & Billing Information</h3>
              <form onSubmit={handleSubmit}>
                
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" name="name" required onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" name="email" required onChange={handleChange} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Street Address</label>
                  <input type="text" className="form-control" name="address" required onChange={handleChange} />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input type="text" className="form-control" name="city" required onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Zip Code</label>
                    <input type="text" className="form-control" name="zip" required onChange={handleChange} />
                  </div>
                </div>

                <h4 className="mb-3">Payment Details</h4>
                <div className="mb-4">
                  <label className="form-label">Credit Card Number</label>
                  <input type="text" className="form-control" name="cardNumber" placeholder="xxxx-xxxx-xxxx-xxxx" required onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-dark w-100 py-3 fw-bold fs-5">
                  Place Order - ${total.toLocaleString("en-US")}
                </button>
                
              </form>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4 bg-light">
              <h4>Order Summary</h4>
              <hr />
              {cartItems.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toLocaleString("en-US")}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>${total.toLocaleString("en-US")}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Checkout;
