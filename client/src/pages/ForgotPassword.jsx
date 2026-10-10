import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // For student level simplicity, we just pass the email to the reset page
    // In a real app, this would send an email with a secure token!
    if (email) {
       // We pass the email in the state so the next page knows whose password to change
       navigate("/reset-password", { state: { email: email } });
    } else {
       setError("Please enter your email address.");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to reset your password.</p>
        </div>

        {error && <div className="alert alert-danger p-2 text-center" style={{fontSize: '0.9rem'}}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-btn">
            Continue
          </button>
        </form>

        <div className="auth-footer">
          Remember your password? 
          <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
