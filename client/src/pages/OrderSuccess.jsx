import { useLocation, Link } from "react-router-dom";
import "../css/auth.css"; // We can reuse some basic styles

function OrderSuccess() {
  const location = useLocation();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="container py-5 text-center">
        <h2>No order data found.</h2>
        <Link to="/" className="btn btn-primary mt-3">Return to Home</Link>
      </div>
    );
  }

  // Function to print/download the receipt as PDF
  const handleDownload = () => {
    window.print(); // This opens the browser's print dialog, allowing user to "Save as PDF"
  };

  return (
    <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container d-flex justify-content-center">
        <div className="card shadow-lg border-0 p-5" style={{ maxWidth: "600px", width: "100%" }}>
          <div className="text-center mb-4">
            <h1 className="text-success mb-3">Order Confirmed!</h1>
            <p className="text-muted">Thank you for shopping with Chronoscent Elite.</p>
          </div>

          <div className="receipt-box border p-4 mb-4" style={{ backgroundColor: "#fff" }}>
            <h3 className="text-center border-bottom pb-3 mb-4">VIRTUAL RECEIPT</h3>
            
            <div className="mb-4">
              <h5 className="fw-bold">Customer Details:</h5>
              <p className="mb-1"><strong>Name:</strong> {orderData.customerInfo.name}</p>
              <p className="mb-1"><strong>Email:</strong> {orderData.customerInfo.email}</p>
              <p className="mb-1"><strong>Address:</strong> {orderData.customerInfo.address}, {orderData.customerInfo.city} {orderData.customerInfo.zip}</p>
              <p className="mb-0"><strong>Payment Method:</strong> {orderData.customerInfo.paymentMethod}</p>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold border-bottom pb-2">Items Purchased:</h5>
              <ul className="list-unstyled mt-3">
                {orderData.orderItems.map((item, index) => (
                  <li key={index} className="d-flex justify-content-between mb-2">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toLocaleString("en-US")}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="d-flex justify-content-between border-top pt-3 fw-bold fs-4">
              <span>Total Paid:</span>
              <span>${orderData.totalAmount.toLocaleString("en-US")}</span>
            </div>
          </div>

          {/* Buttons wrapped in a container that will be hidden when printing */}
          <div className="d-flex justify-content-between d-print-none">
            <Link to="/" className="btn btn-outline-dark">Back to Home</Link>
            <button onClick={handleDownload} className="btn btn-dark">Download Receipt</button>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;
