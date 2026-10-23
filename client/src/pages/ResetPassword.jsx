import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/auth.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the email that was passed from the Forgot Password page
  const userEmail = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userEmail) {
      setError("Email not found. Please go back and try again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, newPassword: newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password successfully reset! You can now log in.");
        navigate("/login");
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Cannot connect to server. Is the backend running?");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Create New Password</h2>
          <p>Set a new password for {userEmail || "your account"}.</p>
        </div>

        {error && <div className="alert alert-danger p-2 text-center" style={{fontSize: '0.9rem'}}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input 
              type="password" 
              id="newPassword" 
              className="form-control" 
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="form-control" 
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="auth-btn">
            Reset Password
          </button>
        </form>
        
        <div className="auth-footer mt-3">
          <Link to="/login">Cancel</Link>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
