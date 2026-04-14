import { useNavigate } from "react-router-dom";
import "./Navbar.css"


function Navbar() {
    const navigate = useNavigate()

async function handleLogout(){
  localStorage.removeItem("token")
  navigate("/login")
}
async function handleProfile(){
  navigate("/profile")
}
async function handleStats(){
  navigate("/statistics")
}
async function handleDash(){
  navigate("/workouts")
}
   return (
  <div className="navbar">
    <img src="/wtracker-logo1.png" className="logo" alt="logo" />
    <div className="navbar-right">
      <button className="logout-button" onClick={handleDash}>Dashboard</button>
      <button className="logout-button" onClick={handleStats}>Statistics</button>
      <button className="logout-button" onClick={handleProfile} >Profile</button>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      
    </div>
  </div>
)
}
export default Navbar