import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import "./Auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
      setError("");
      await resetPassword(email.trim());
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err.message || "Unable to send reset email.");
    }
  }

  return (
    <main className="auth-page"><section className="auth-card">
      <Link to="/" className="auth-logo"><img src="/images/logo.svg" alt="Ceylon Natural Care" /></Link>
      <span className="auth-eyebrow">ACCOUNT RECOVERY</span><h1>Reset password</h1>
      {message && <div className="form-success">{message}</div>}{error && <div className="form-error">{error}</div>}
      <form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><button>Send reset email</button></form>
      <div className="auth-links"><Link to="/login">Back to login</Link></div>
    </section></main>
  );
}
