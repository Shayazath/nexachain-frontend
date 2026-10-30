import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const { register } = useAuth(),
    navigate = useNavigate();
  const [form, setForm] = useState({
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      referralCode: new URLSearchParams(location.search).get("ref") || "",
    }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-art">
        <div className="brand">
          <span className="brand-mark">N</span>
          <div>
            <b>nexachain</b>
            <small>INVESTOR PORTAL</small>
          </div>
        </div>
        <div className="art-copy">
          <span className="pill">START YOUR JOURNEY</span>
          <h1>
            One account.
            <br />
            <em>Clearer insights.</em>
          </h1>
          <p>
            Create a demo account to explore investments, daily ROI history, and
            referral tracking.
          </p>
        </div>
        <div className="art-bottom">
          Demo platform · No real money or payouts
        </div>
      </div>
      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow">CREATE ACCOUNT</span>
          <h2>Join Nexachain</h2>
          <p className="muted">Set up your investor profile.</p>
          {error && <div className="form-error">{error}</div>}
          <label>
            Full name
            <input
              name="fullName"
              required
              minLength="2"
              maxLength="100"
              value={form.fullName}
              onChange={change}
            />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={change}
            />
          </label>
          <label>
            Mobile number
            <input
              name="mobileNumber"
              required
              minLength="7"
              maxLength="20"
              value={form.mobileNumber}
              onChange={change}
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              required
              minLength="8"
              value={form.password}
              onChange={change}
            />
            <small>Use at least 8 characters.</small>
          </label>
          <label>
            Referral code <span className="optional">Optional</span>
            <input
              name="referralCode"
              value={form.referralCode}
              onChange={change}
              placeholder="If someone invited you"
            />
          </label>
          <button className="primary-btn full-btn" disabled={busy}>
            {busy ? "Creating account…" : "Create account"}{" "}
            <ArrowRight size={17} />
          </button>
          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
