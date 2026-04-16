import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Profile.css"


function Profile() {
  const [successMessage, setSuccessMessage] = useState("")
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [checkNewPass, setCheckNewPass] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isShowEditName, setIsShowEditName] = useState(false)
  const [isShowEditEmail, setIsShowEditEmail] = useState(false)
  const [isShowEditPass, setIsShowEditPass] = useState(false)

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL
    fetch(`${API}/users/me`,{
      method: "GET",
      credentials: "include",
       headers: {
    "Content-Type": "application/json",
  },
      })
      .then(res => {
          if (!res.ok) {
            navigate("/login")
          return
      }
      return res.json()
    })
    .then(data => {setName(data.name)
      setEmail(data.email)
      setIsLoading(false)
    })
  }, [])
  
  async function updateProfile() {
    const API = import.meta.env.VITE_API_URL
    const response = await fetch(`${API}/users/me`, {
      method: "PUT",
      credentials: "include",
       headers: {
    "Content-Type": "application/json",
  },
      body: JSON.stringify({ name, email})
    })
    if (!response.ok) {
  const err = await response.json()
  console.log(err)
  alert("Update failed")
  return
}
const data = await response.json()
setName(data.name)
setEmail(data.email)
    setSuccessMessage("Profile updated!")
    setTimeout(() => setSuccessMessage(""), 3000)
    setIsShowEditName(false)
    setIsShowEditEmail(false)
}

async function updatePassword(){
  if (newPass == "" || checkNewPass == "") {
    alert("Fill all fields!")
    return
    }
    if (newPass !== checkNewPass) {
    alert("Passwords don't match!")
    return
    }
    if (currentPass == newPass) {
    alert("This password is already in use. Try diffrent one!")
    return
    }
    const API = import.meta.env.VITE_API_URL
    const response = await fetch(`${API}/users/me/password`, {
    method: "PUT",
    credentials: "include",
     headers: {
    "Content-Type": "application/json",
  },
    body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass, checkPassword: checkNewPass})
  })
  setSuccessMessage("Password changed!")
  setTimeout(() => setSuccessMessage(""), 3000)
  const data = await response.json()
  console.log(data)
}

  if (isLoading) {
    return <div className="profile-page"><p>Loading...</p></div>
}
async function deleteAccount() {
    if (!confirm("Are you sure? This action cannot be undone.")) return
    const API = import.meta.env.VITE_API_URL
    const res = await fetch(`${API}/users/me`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    })
    if (res.ok) {
        navigate("/login")
    } else {
        alert("Failed to delete account. Try again.")
    }
}
  return ( 
    <div className="profile-page">
      <div className="profile-card">
        <img src="/profile-settings.png" alt="profile-icon" className="profile-icon" />
        <h1>Profile settings</h1>
       <div className="profile-form">
        <p>Username: <span className="profile-value">{name || "Unknown"}</span> <button className="profile-edit-button" onClick={() => setIsShowEditName(true)}>Edit</button></p>
        {isShowEditName &&
          <input placeholder = "Name" value = {name} className="profile-input" onChange={e => setName(e.target.value)} type = "text" />
        }
        <p>User email: <span className="profile-value">{email}</span> <button className="profile-edit-button" onClick={() => setIsShowEditEmail(true)}>Edit</button></p>
        {isShowEditEmail &&
          <input placeholder = "Email" value = {email} className="profile-input" onChange={e => setEmail(e.target.value)} type = "email" />
        }
        <p>Password:  •••••••• <button className="profile-edit-button" onClick={() => setIsShowEditPass(true)}>Edit</button></p>
        {isShowEditPass &&
        <>
        <input placeholder = "current password" value = {currentPass} className="profile-input" onChange={e => setCurrentPass(e.target.value)} type = "password" />
          <input placeholder = "new password" value = {newPass} className="profile-input" onChange={e => setNewPass(e.target.value)} type = "password" />
          <input placeholder = "check password" value = {checkNewPass} className="profile-input" onChange={e => setCheckNewPass(e.target.value)} type = "password" />
          <button className="update-password-button" onClick={updatePassword}>Update password</button>
        </>
        }
            
            <button
              onClick={updateProfile}
              className="profile-update-button"
            >
              Update
            </button>
            {successMessage && <p className="success-text">{successMessage}</p>}
            <button
              onClick={() => navigate("/workouts")}
              className="back-button"
            >
              Back to dashboard
            </button>
            <button onClick={deleteAccount} className="delete-account-button">
               Delete account
            </button>
          </div>
      </div>
    </div>
  
  )
}

export default Profile