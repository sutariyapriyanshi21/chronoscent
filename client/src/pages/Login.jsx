import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/auth.css";

function Login() {
  // 1. Create state variables to hold what the user types
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 2. Create an error state to show red text if something goes wrong
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 3. This function runs when the user clicks "Sign In"
  const handleSubmit = async (e) => {
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

    // Send login request to backend
    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Save user to localStorage
        localStorage.setItem("chronoscent_user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("authChange"));

        // Clear the form FIRST so the user sees it empty
        setEmail("");
        setPassword("");
        
        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            const destination = location.state?.from || "/";
            navigate(destination);
          }
        }, 100);
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Cannot connect to server. Is the backend running?");
    }
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

        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          
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
              autoComplete="off"
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
              autoComplete="new-password"
            />
          </div>

          <div className="auth-options">
            <div>
              <input type="checkbox" id="remember" className="me-2" />
              <label htmlFor="remember" className="d-inline fw-normal text-muted mb-0">Remember me</label>
            </div>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-btn">
            Sign In
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account? 
          <Link to="/register" state={location.state}>Create one now</Link>
        </div>

      </div>
    </section>
  );
}

export default Login;
