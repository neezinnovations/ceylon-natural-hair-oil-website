import { getErrorMessage } from "../../utils/errors";
import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import "./Auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage("");
    try {
      setError("");
      await resetPassword(email.trim());
      setMessage("If an account exists for this email, you will receive a password reset link.");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setMessage("If an account exists for this email, you will receive a password reset link.");
      } else {
        setError(getErrorMessage(err, "Unable to send reset email."));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page"><section className="auth-card">
      <Link to="/" className="auth-logo"><img src="/images/logo.webp" alt="Ceylon Natural Care" /></Link>
      <span className="auth-eyebrow">ACCOUNT RECOVERY</span><h1>Reset password</h1>
      {message && <div className="form-success">{message}</div>}{error && <div className="form-error">{error}</div>}
      <form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><button disabled={loading}>{loading ? "Sending..." : "Send reset email"}</button></form>
      <div className="auth-links"><Link to="/login">Back to login</Link></div>
    </section></main>
  );
}
