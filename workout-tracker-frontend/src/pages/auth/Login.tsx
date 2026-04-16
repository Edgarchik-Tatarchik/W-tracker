import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { apiFetch, ApiError } from "../../lib/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setErrorMessage("Fill all fields!");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!isValidEmail) {
      setErrorMessage("Enter a valid email address!");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: { email: trimmedEmail, password },
      });
      navigate("/workouts");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Server error. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <img src="/wtracker-logo.png" className="login-app-logo" alt="logo" />

      <div className="login-card">
        <img src="/login-user.png" className="login-icon" alt="user icon" />
        <h1 className="header">Login Page</h1>

        <form  className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            className="login-input"
            type="password"
            value={password}
            onChange={e => setPass(e.target.value)}
            placeholder="Password"
          />

          <button className="login-enter-button" type="submit" disabled={loading}>
            {loading ? "Entering..." : "Enter"}
          </button>
        </form>

        {errorMessage && <p className="login-error-text">{errorMessage}</p>}

        <br />

        <Link to="/forgot-password" className="link">
          Forgot password?
        </Link>
        <Link to="/register" className="link">
          Create new account?
        </Link>
      </div>
    </div>
  );
}

export default Login;