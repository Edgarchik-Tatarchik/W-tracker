import { useEffect, useState,} from "react";
import "./Wokrouts.css"
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"

type Exercise = {
  name: string
  sets: string
  reps: string
  weight: string
}
type Workout = {
  id: number
  name: string 
  length: number
  date: string
  notes: string
  exercises: Exercise[]
}

export default function Workouts(){
  const[workouts, setWorkouts] = useState<Workout[]>([])
  const [name, setName] = useState("")
  const [length, setLength] = useState("")
  const [date, setDate] = useState("")
  const [notes, setNotes] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()
  const [ascending, setAscending] = useState(true)
  const [search, setSearch] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [exerciseNames, setExerciseNames] = useState<string[]>([])
  const API = import.meta.env.VITE_API_URL
  useEffect(() => {
    
    fetch(`${API}/workouts`,{
      method: "GET",
      credentials: "include",
       headers: {
    "Content-Type": "application/json",
  },
    })
    .then(res => res.json())
    .then(data => setWorkouts(data))
    fetch(`${API}/exercises/my`,
    { credentials: "include", headers: { "Content-Type": "application/json" } })
    .then(res => res.json())
    .then(data => setExerciseNames(data))
  }, [])

  async function createWorkout()

  {
    if (!name) {
  setErrorMessage(" ❢ Name is required")
  return
}
  if (!length || Number(length)<10) {
  setErrorMessage(" ❢ Length is required. More than 10 min!")
  return  
}
  if (!date) {
  setErrorMessage(" ❢ Date is required. Not earlier than 2000!")
  return  
}
const invalidExercise = exercises.some(ex => !ex.name.trim())
if (invalidExercise) {
  setErrorMessage("Fill in all exercise names!")
  return
} 
    const API = import.meta.env.VITE_API_URL
    const response = await fetch(`${API}/workouts`,{
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, length, date: date.replaceAll("/", "-"), notes, exercises: exercises.map(ex => ({
    ...ex,
    sets: Number(ex.sets),
    reps: Number(ex.reps),
    weight: Number(ex.weight)
  }))
 })
})
    
    if (!response.ok) {
      const data = await response.json()
      console.log(data)
      setErrorMessage(data.error)
      }
    else{
      const data = await response.json()
      console.log(data)
  setWorkouts([...workouts, data])
  setSuccessMessage("✅ Workout created!")
  setTimeout(() => setSuccessMessage(""), 3000)
  setErrorMessage("")
    }
  }
  function editWorkout(id: number){
    navigate(`/workouts/${id}/edit`)
  }
  async function deleteWorkout(id:number) {
    const API = import.meta.env.VITE_API_URL
    const res = await fetch(`${API}/workouts/${id}`, {
      method: "DELETE",
    credentials: "include",
     headers: {
    "Content-Type": "application/json",
  },
    })
    if (res.ok) {
      setWorkouts(workouts.filter(w => w.id !== id))
    }
    setName("")
    setLength("")
    setDate("")
    setNotes("")
  }
  function addExercise() {
  setExercises([...exercises, { name: "", sets: "", reps: "", weight: "" }])
  }

  function updateExercise(index: number, field: keyof Exercise, value: string) {
  const updated = [...exercises]
   updated[index] = { ...updated[index], [field]: value }
  setExercises(updated)
  }

  function removeExercise(index: number) {
  setExercises(exercises.filter((_, i) => i !== index))
  }
  return (
    <>
    <Navbar/>
    <div className="workout-page">
      <div className="workout-inner-page">

        <div className="workout-card">
          <h2 className="workout-header-h2">
            Add New workout
          </h2>
          <div className="workout-create-form">
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
                className="workout-create-input"
              />
            ))}
            <button
              onClick={createWorkout}
              className="workout-create-button"
            >
              + Create
            </button>  
          {errorMessage && <p className="error-text">{errorMessage}</p>}
          </div>
          {successMessage && <p className="workout-success-text">{successMessage}</p>}
          <button type="button" onClick={addExercise} className="add-exercise-button">
            + Add Exercise
          </button>
{exercises.length > 0 && (
  <div className="exercise-row" style={{  color: "#7aa0df", fontSize: "13px" }}>
      <span style={{ width: "185px" }}>Exercise</span>
    <span style={{ width: "185px" }}>Sets</span>
    <span style={{ width: "185px" }}>Reps</span>
    <span style={{ width: "185px" }}>Weight (kg)</span>
  </div>
)}            
{exercises.map((ex, i) => (
  <div key={i} className="exercise-row">
      <input list="exercise-names" placeholder="Exercise name" value={ex.name}
      onChange={e => updateExercise(i, "name", e.target.value)} className="workout-create-input" />
    <datalist id="exercise-names">
       {exerciseNames.map(n => <option key={n} value={n} />)}
    </datalist>
    <input placeholder="Sets" type="number" value={ex.sets}
      onChange={e => updateExercise(i, "sets", e.target.value)} className="workout-create-input" />
    <input placeholder="Reps" type="number" value={ex.reps}
      onChange={e => updateExercise(i, "reps", e.target.value)} className="workout-create-input" />
    <input placeholder="Weight (kg)" type="number" value={ex.weight}
      onChange={e => updateExercise(i, "weight", e.target.value)} className="workout-create-input" />
    <button onClick={() => removeExercise(i)} className="delete-button">✕</button>
  </div>
))}

        </div>
            
        
        <div className="workout-form">
          
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="workouts-header">
            My Workouts
          </h2>
          <input 
  value={search}
    onChange={e => setSearch(e.target.value)}
    placeholder="Search by name/length/date..."
    className="workout-search-input"
/>
        </div>
          
          <table className="workouts-table">
            <thead>
              <tr className="workouts-tr">
                {["Name", "Length"].map(h => (
                  <th key={h} className="workouts-th">{h}</th>
                ))}
                  <th className="workouts-th">
                  <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "bold" }}
                   onClick={() => setAscending(!ascending)}>
                  Date {ascending ? "↑" : "↓"}
                </button>
                  </th>
                {["Notes", "Adjust"].map(h => (
                <th key={h} className="workouts-th">{h}</th>
                ))}
            </tr>
            </thead>
            <tbody>
              {workouts.filter(w =>w.name.toLowerCase().includes(search) || w.length.toString().toLowerCase().includes(search) || w.date.toLowerCase().includes(search)).sort((a, b) => ascending ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date))
              .map((workout) => (
                <tr key={workout.id} style={{
                  backgroundColor: "#0F172A",
                  borderBottom: "1px solid #1E293B"
                }}>
                  <td style={{ padding: "12px 16px", color: "#e0e0e0", fontWeight: "500" }}>{workout.name}</td>
                  <td style={{ padding: "12px 16px", color: "#a0a0b0" }}>{workout.length} min</td>
                  <td style={{ padding: "12px 16px", color: "#a0a0b0" }}>{workout.date}</td>
                  <td style={{ padding: "12px 16px", color: "#a0a0b0" }}>{workout.notes || "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      
                     <button 
                     onClick={() => editWorkout(workout.id)}
                     className="workout-edit-button"
                     >
                      ✏️ Edit
                      </button>
                    <button onClick={() => navigate(`/workouts/${workout.id}`)} className="workout-details-button">
                        🔍 Details
                    </button>
                    <button
                      onClick={() => deleteWorkout(workout.id)}
                      className="workout-delete-button"
                    >
                      🗑 Delete
                    </button>
                 
                    </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          {workouts.length === 0 && (
            <p className="workouts-empty">
              No workouts yet. Create your first one!
            </p>
          )}
        </div>

      </div>
    </div>
    
    </>
  )
}