import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/auth.css";

function Login() {
  // 1. Create state variables to hold what the user types
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 2. Create an error state to show red text if something goes wrong
  const [error, setError] = useState("");

  // 3. This function runs when the user clicks "Sign In"
  const handleSubmit = (e) => {
    e.preventDefault(); // Stops the page from refreshing
    setError(""); // Clear any old errors

    // Basic Validation
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // If validation passes, we would normally send data to backend here
    console.log("Login successful with:", { email, password });
    alert("Validation passed! Ready to send to backend.");
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Log in to your ChronoScent Elite account.</p>
        </div>

        {/* Display the error message if it exists */}
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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-control" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="auth-options">
            <div>
              <input type="checkbox" id="remember" className="me-2" />
              <label htmlFor="remember" className="d-inline fw-normal text-muted mb-0">Remember me</label>
            </div>
            <Link to="#">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-btn">
            Sign In
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account? 
          <Link to="/register">Create one now</Link>
        </div>

      </div>
    </section>
  );
}

export default Login;
