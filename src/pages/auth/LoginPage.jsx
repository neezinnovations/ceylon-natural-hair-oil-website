import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/errors";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserProfile, loginCustomer, logoutUser } from "../../services/authService";
import "./Auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      setError("");
      const credential = await loginCustomer(email.trim(), password);
      const profile = await getUserProfile(credential.user.uid);
      if (!profile || profile.status !== "active") {
        await logoutUser();
        throw new Error("Account unavailable.");
      }

      await refreshProfile();
      if (profile.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      const requested = location.state?.from;
      navigate(typeof requested === "string" && /^\/account(?:\/|\?|$)|^\/checkout(?:\?|$)/.test(requested) && !requested.includes("\\") ? requested : "/account", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo"><img src="/images/logo.webp" alt="Ceylon Natural Care" /></Link>
        <span className="auth-eyebrow">WELCOME BACK</span>
        <h1>Sign in</h1>
        <p>Access your orders, addresses and account.</p>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <div className="auth-links"><Link to="/forgot-password">Forgot password?</Link><Link to="/register">Create account</Link></div>
      </section>
    </main>
  );
}
