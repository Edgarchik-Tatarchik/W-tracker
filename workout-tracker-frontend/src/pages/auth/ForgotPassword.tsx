import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./ForgotPassword.css"
import { apiFetchText } from "../../lib/api"


function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit() {
    try {
      const token = await apiFetchText("/auth/forgot-password", {
        method: "POST",
        body: { email },
      })
      console.log("TOKEN:", JSON.stringify(token))
      if (!token) {
        setMessage("No token received")
        return
      }
      navigate(`/reset-password?token=${token}`)
    } catch {
      setMessage("Something went wrong")
    }
  }
  async function handleCancel() {
    navigate("/login")
  }
  return (
  <div className="forpass-page">
    <div className="forpass-card">
        <img src="/password-icon.png" className="password-icon" alt="password-icon" />
        <h1 className="forpass-header"><p>Forgot password?</p><p>Enter your email first</p></h1>
    <input
        className="forpass-input"
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button className="forpass-button" onClick={handleSubmit}>Send reset link</button>
      <button className="forpass-cancel-button" onClick={handleCancel}>Cancel</button>
      <p>{message}</p>
    </div>
  </div>
  )
}

export default ForgotPassword

