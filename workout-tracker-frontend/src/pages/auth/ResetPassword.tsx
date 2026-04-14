import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./ResetPassword.css"

function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")

  async function handleReset() {
    if (!password || !confirm) {
      setError("Fill all fields")
      return
    }

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }
    const API = import.meta.env.VITE_API_URL
    const res = await fetch(`${API}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token,
        newPassword: password
      })
    })

    if (res.ok) {
      alert("Password changed")
      navigate("/login")
    } else {
      setError("Invalid or expired token")
    }
  }
  async function handleCancel() {
    navigate("/login")
  }

  return (
    <div className="page">
      <div className="card">
        <img src="/reset-button.png" className="reset-icon" alt="reset-icon" />
        <h1 className="header">Reset Password</h1>

      <input
      className="input"
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
      />

      <button className="button" onClick={handleReset}>Reset password</button>
      <button className="cancel-button" onClick={handleCancel}>Cancel</button>

      <p>{error}</p>
      </div>
    </div>
  )
}

export default ResetPassword