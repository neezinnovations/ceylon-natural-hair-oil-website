import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../../services/authService";
import "./Auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await registerCustomer(form);
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo"><img src="/images/logo.webp" alt="Ceylon Natural Care" /></Link>
        <span className="auth-eyebrow">NEW CUSTOMER</span>
        <h1>Create account</h1>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={submit}>
          <label>Name<input name="name" required value={form.name} onChange={update} /></label>
          <label>Phone<input name="phone" required value={form.phone} onChange={update} /></label>
          <label>Email<input name="email" type="email" required value={form.email} onChange={update} /></label>
          <label>Password<input name="password" type="password" minLength="6" required value={form.password} onChange={update} /></label>
          <button disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        </form>
        <div className="auth-links"><Link to="/login">Already have an account?</Link></div>
      </section>
    </main>
  );
}
