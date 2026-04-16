import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import "./WorkoutsDetails.css"
import { apiFetch } from "../../lib/api"

type Exercise = {
  id: number  
  name: string
  sets: number
  reps: number
  weight: number
}

type PreviousExercise = {
  name: string
  sets: number
  reps: number
  weight: number
}

type WorkoutDetail = {
  name: string
  length: number
  date: string
  notes: string
  exercises: Exercise[]
}

export default function WorkoutDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null)
  const [newExercise, setNewExercise] = useState({ name: "", sets: "", reps: "", weight: "" })
  const [exerciseNames, setExerciseNames] = useState<string[]>([])
  const [previousData, setPreviousData] = useState<Record<string, PreviousExercise>>({})
  useEffect(() => {
    apiFetch<WorkoutDetail>(`/workouts/${id}`).then(data => setWorkout(data))
    apiFetch<string[]>("/exercises/my").then(data => setExerciseNames(data))
  }, [])

  useEffect(() => {
    if (!workout?.exercises?.length) return
    workout.exercises.forEach(ex => {
      apiFetch<PreviousExercise | null>(`/exercises/previous?name=${encodeURIComponent(ex.name)}`)
        .then(data => {
          if (data) setPreviousData(prev => ({ ...prev, [ex.name]: data }))
        })
        .catch(() => {})
    })
  }, [workout])

  if (!workout) return <div className="edit-page"><p>Loading...</p></div>
 
async function addExercise() {
  if (!newExercise.name.trim()) return
  await apiFetch(`/workouts/${id}/exercises`, {
    method: "POST",
    body: {
      name: newExercise.name,
      sets: Number(newExercise.sets),
      reps: Number(newExercise.reps),
      weight: Number(newExercise.weight),
    },
  })
  const data = await apiFetch<WorkoutDetail>(`/workouts/${id}`)
  setWorkout(data)
  setNewExercise({ name: "", sets: "", reps: "", weight: "" })
}  

async function deleteExercise(exerciseId: number) {
  await apiFetch(`/workouts/${id}/exercises/${exerciseId}`, { method: "DELETE" })
  setWorkout({
    ...workout!,
    exercises: workout!.exercises.filter(ex => ex.id !== exerciseId),
  })
}
  return (
    <div className="edit-page">
      <div className="edit-card">
        <i className="fa-solid fa-dumbbell edit-icon"></i>
        <h2>{workout.name}</h2>
        <p style={{ color: "#7aa0df" }}>
          {workout.date} · {workout.length} min
        </p>
        {workout.notes && <p style={{ color: "#a0a0b0" }}>{workout.notes}</p>}

        <h3 style={{ color: "white", marginTop: "20px" }}>Exercises</h3>

        {workout.exercises.length === 0 ? (
          <p style={{ color: "#a0a0b0" }}>No exercises added</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr style={{ color: "#7aa0df", fontSize: "13px" }}>
                <th style={{ textAlign: "left", padding: "8px" }}>Exercise</th>
                <th style={{ padding: "8px" }}>Sets</th>
                <th style={{ padding: "8px" }}>Reps</th>
                <th style={{ padding: "8px" }}>Weight (kg)</th>
              </tr>
            </thead>
            <tbody>
              {workout.exercises.map((ex, i) => (
                <tr
                  key={i}
                  style={{ color: "#e0e0e0", borderTop: "1px solid #3d4f6b" }}
                >
                  <td style={{ padding: "8px" }}>
                    <div>{ex.name}</div>
                    <div
                      style={{
                        color: "#a0a0b0",
                        fontSize: "12px",
                        marginTop: "2px",
                      }}
                    >
                      {previousData[ex.name]
                        ? `Last: ${previousData[ex.name].sets}×${previousData[ex.name].reps} @ ${previousData[ex.name].weight}kg`
                        : ""}
                    </div>
                  </td>
                  <td style={{ textAlign: "center", padding: "8px" }}>
                    {ex.sets}
                  </td>
                  <td style={{ textAlign: "center", padding: "8px" }}>
                    {ex.reps}
                  </td>
                  <td style={{ textAlign: "center", padding: "8px" }}>
                    {ex.weight}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteExercise(ex.id)}
                      className="details-delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="exercise-row" style={{ marginTop: "16px" }}>
          <input
            list="exercise-names"
            placeholder="Exercise"
            value={newExercise.name}
            onChange={(e) =>
              setNewExercise({ ...newExercise, name: e.target.value })
            }
            className="edit-input"
          />
          <datalist id="exercise-names">
            {exerciseNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <input
            placeholder="Sets"
            type="number"
            value={newExercise.sets}
            onChange={(e) =>
              setNewExercise({ ...newExercise, sets: e.target.value })
            }
            className="edit-input"
          />
          <input
            placeholder="Reps"
            type="number"
            value={newExercise.reps}
            onChange={(e) =>
              setNewExercise({ ...newExercise, reps: e.target.value })
            }
            className="edit-input"
          />
          <input
            placeholder="Weight"
            type="number"
            value={newExercise.weight}
            onChange={(e) =>
              setNewExercise({ ...newExercise, weight: e.target.value })
            }
            className="edit-input"
          />
          <button onClick={addExercise} className="exercise-add-button">
            Add
          </button>
        </div>

        <button
          onClick={() => navigate("/workouts")}
          className="details-update-button"
          style={{ marginTop: "24px" }}
        >
          Update
        </button>
      </div>
    </div>
  );
}