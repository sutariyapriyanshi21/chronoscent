import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("chronoscent_user");
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [navigate]);
  
  const [formData, setFormData] = useState(() => {
    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem("chronoscent_user"));
    } catch {}

    return {
      name: savedUser?.name || "",
      email: savedUser?.email || "",
      address: "",
      city: "",
      zip: "",
      paymentMethod: "Cash on Delivery"
    };
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data matching our Mongoose Schema
    const orderData = {
      customerInfo: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        paymentMethod: formData.paymentMethod
      },
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
        clearCart();
        // Redirect to Virtual Receipt page, passing the order data along
        navigate("/order-success", { state: { orderData: orderData } });
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
              <h3 className="mb-4">Shipping Information</h3>
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

                <h4 className="mb-3">Payment Method</h4>
                <div className="mb-4 p-3 border rounded bg-light">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="paymentMethod" id="cod" checked readOnly />
                    <label className="form-check-label fw-bold" htmlFor="cod">
                      Cash on Delivery (COD)
                    </label>
                    <p className="text-muted small mb-0 mt-1">Pay with cash when your order arrives at your doorstep.</p>
                  </div>
                </div>

                <button type="submit" className="btn btn-dark w-100 py-3 fw-bold fs-5">
                  Confirm Order - ₹{total.toLocaleString("en-IN")}
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
                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Checkout;
