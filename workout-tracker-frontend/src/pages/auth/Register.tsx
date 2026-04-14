import { useState } from "react";
import "./Register.css"
import { useNavigate, Link } from "react-router-dom";


function Register(){
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPass] = useState("")
    const [checkPass, setCheckPass] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

async function handleRegister(e: React.FormEvent) {
    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()
    e.preventDefault()
    setErrorMessage("")
    

  if (!trimmedUsername || !trimmedEmail || !password || !checkPass) {
    setErrorMessage("Fill all fields!")
    return
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

  if (!isValidEmail) {
    setErrorMessage("Enter a valid email address!")
    return
  }

  if (password !== checkPass) {
    setErrorMessage("Passwords don't match!")
    return
  }
  if (loading) return
    setLoading(true)

  try {
    const API = import.meta.env.VITE_API_URL
    const response = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: trimmedUsername,
        email: trimmedEmail,
        password: password
      })
    })

    if (!response.ok) {
  const data = await response.json()

  if (data.email) {
    setErrorMessage(data.email)
  } else if (data.password) {
    setErrorMessage(data.password)
  } else if (data.name) {
    setErrorMessage(data.name)
  } else if (data.error) {
    setErrorMessage(data.error)
  } else {
    setErrorMessage("Registration failed")
  }
      return
    }

    setErrorMessage("")
    navigate("/login")
  } catch (error) {
    setErrorMessage("Server error. Try again.")
  }
  finally {
  setLoading(false)
}
}
  return (
    <div className="register-page">
      <img src="/wtracker-logo.png" className="register-app-logo" alt="logo" />

      <div className="register-card">
        <img src="/login-user.png" className="register-icon" alt="user icon" />
        <h1 className="register-header">Create account</h1>

        <form className="register-form" onSubmit={handleRegister}>
            <input
          className="register-input"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
        />

        <input
          className="register-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          className="register-input"
          type="password"
          value={password}
          onChange={e => setPass(e.target.value)}
          placeholder="Password"
        />

        <input
          className="register-input"
          type="password"
          value={checkPass}
          onChange={e => setCheckPass(e.target.value)}
          placeholder="Password(check)"
        />

        <button
            type="submit"
            className="user-create-button"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>

        </form>

        {errorMessage && <p className="register-error-text">{errorMessage}</p>}

        <br />

        <Link to="/login" className="link">
  Already have an account? Login
        </Link>
      </div>
    </div>
  );
}
export default Register