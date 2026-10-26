import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    let savedUser = null;
    try {
      const stored = localStorage.getItem("chronoscent_user");
      if (stored) {
        savedUser = JSON.parse(stored);
      }
    } catch { }

    return {
      name: savedUser?.name || "",
      email: savedUser?.email || "",
      address: "",
      city: "",
      zip: "",
      paymentMethod: "Cash on Delivery"
    };
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("chronoscent_user");
      if (!storedUser) {
        navigate("/login", { state: { from: "/checkout" } });
      }
    } catch {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [navigate]);

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
        const data = await response.json().catch(() => null);
        clearCart();
        // Redirect to Virtual Receipt page, passing the order data along
        navigate("/order-success", { state: { orderData: data?.order || orderData } });
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
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label mb-0">Full Name</label>
                      {formData.name && (
                        <small className="text-success fw-semibold" style={{ fontSize: "0.75rem" }}>

                        </small>
                      )}
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label mb-0">Email Address</label>
                      {formData.email && (
                        <small className="text-success fw-semibold" style={{ fontSize: "0.75rem" }}>

                        </small>
                      )}
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    placeholder="House / Flat / Street address"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      placeholder="e.g. Mumbai, Surat, Delhi..."
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Pin Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="zip"
                      value={formData.zip}
                      placeholder="e.g. 395007"
                      required
                      onChange={handleChange}
                    />
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
