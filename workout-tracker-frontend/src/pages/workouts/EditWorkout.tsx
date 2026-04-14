import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditWorkout.css"



export default function EditWorkout() {
    const { id } = useParams()
    const [name, setName] = useState("")
    const [length, setLength] = useState("")
    const [date, setDate] = useState("")
    const [notes, setNotes] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
    const API = import.meta.env.VITE_API_URL
    fetch(`${API}/workouts/${id}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        })
        .then(res => res.json())
    .then(data => {setName(data.name)
        setLength(data.length)
        setDate(data.date)
        setNotes(data.notes)
    })
    
  }, [])

  async function updateWorkout() {
    const API = import.meta.env.VITE_API_URL
    fetch(`${API}/workouts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, length, date, notes })
    })
    navigate('/workouts')
}

return(
    <div className="edit-page">
      <div className="edit-card">
            <i className="fa-solid fa-dumbbell edit-icon"></i>
        
          <h2>
            Edit workout
          </h2>
          <div className="edit-form">
            {[
              { placeholder: "Name", value: name, setter: setName, type: "text" },
              { placeholder: "Length (min)", value: length, setter: setLength, type: "number" },
              { placeholder: "Date", value: date, setter: setDate, type: "date" },
              { placeholder: "Notes", value: notes, setter: setNotes, type: "text" },
            ].map((field) => (
              <input
                key={field.placeholder}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                className="edit-input"
              />
            ))}
          </div>
          <button
              onClick={updateWorkout}
              className="save-button"
            >
              Save
            </button>
            </div>
        </div>
)
}

