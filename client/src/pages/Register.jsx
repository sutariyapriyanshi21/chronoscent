import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/auth.css";

function Register() {
  // 1. Create state variables to hold what the user types
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // 2. Create an error state to show red text if something goes wrong
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 3. This function runs when the user clicks "Create Account"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stops the page from refreshing
    setError(""); // Clear any old errors

    // Advanced Validation
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters long.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Send data to backend
    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Clear the form fields FIRST so the user sees them empty
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        // Wait a tiny bit (100ms) for React to update the screen, THEN show alert and navigate
        setTimeout(() => {
          alert("Account created successfully! You can now log in.");
          navigate("/login", { state: location.state }); // Redirect to login page
        }, 100);
      } else {
        setError(data.message || "Failed to register.");
      }
    } catch {
      setError("Cannot connect to server. Is the backend running?");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        
        <div className="auth-header">
          <h2>Create an Account</h2>
          <p>Join ChronoScent Elite for exclusive benefits.</p>
        </div>

        {/* Display the error message if it exists */}
        {error && <div className="alert alert-danger p-2 text-center" style={{fontSize: '0.9rem'}}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className="form-control" 
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              autoComplete="off"
            />
          </div>

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
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="form-control" 
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-btn mt-3">
            Create Account
          </button>

        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" state={location.state}>Sign in here</Link>
        </div>

      </div>
    </section>
  );
}

export default Register;
