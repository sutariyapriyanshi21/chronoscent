import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/auth.css";

function Register() {
  // 1. Create state variables to hold what the user types
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // 2. Create an error state to show red text if something goes wrong
  const [error, setError] = useState("");

  // 3. This function runs when the user clicks "Create Account"
  const handleSubmit = (e) => {
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

    // If validation passes, we would normally send data to backend here
    console.log("Registration successful with:", { name, email, password });
    alert("Validation passed! Ready to create account.");
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

        <form className="auth-form" onSubmit={handleSubmit}>
          
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
            />
          </div>

          <button type="submit" className="auth-btn mt-3">
            Create Account
          </button>

        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login">Sign in here</Link>
        </div>

      </div>
    </section>
  );
}

export default Register;
