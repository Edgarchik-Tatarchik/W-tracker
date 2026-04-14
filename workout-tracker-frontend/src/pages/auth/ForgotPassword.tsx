import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./ForgotPassword.css"


function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit() {
    try{
    const API = import.meta.env.VITE_API_URL
    const res = await fetch(`${API}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
        setMessage("Something went wrong");
        return;
      }

      const token = await res.text();
      console.log("TOKEN:", JSON.stringify(token)); 
      if (!token) {
        setMessage("No token received");
        return;
      }

      
      navigate(`/reset-password?token=${token}`);

    } catch (err) {
      setMessage("Network error");
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

