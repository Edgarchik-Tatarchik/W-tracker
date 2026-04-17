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

type HistoryPoint = {
  date: string
  weight: number
  sets: number
  reps: number
}

type WorkoutDetail = {
  name: string
  length: number
  date: string
  notes: string
  exercises: Exercise[]
}

function getVolume(sets: number, reps: number, weight: number) {
  return sets * reps * weight
}

function EfficiencyComment({ ex, prev }: { ex: Exercise; prev: PreviousExercise | undefined }) {
  if (!prev) return null

  const currVol = getVolume(ex.sets, ex.reps, ex.weight)
  const prevVol = getVolume(prev.sets, prev.reps, prev.weight)
  const volDiff = currVol - prevVol
  const weightDiff = ex.weight - prev.weight

  const lines: { text: string; className: string }[] = []

  if (weightDiff > 0) lines.push({ text: `+${weightDiff}kg к весу по сравнению с прошлым разом`, className: "efficiency-positive" })
  else if (weightDiff < 0) lines.push({ text: `${weightDiff}kg к весу по сравнению с прошлым разом`, className: "efficiency-negative" })

  if (volDiff > 0) lines.push({ text: `Объём вырос на ${volDiff}kg (${Math.round((volDiff / prevVol) * 100)}%)`, className: "efficiency-positive" })
  else if (volDiff < 0) lines.push({ text: `Объём упал на ${Math.abs(volDiff)}kg (${Math.round((Math.abs(volDiff) / prevVol) * 100)}%)`, className: "efficiency-negative" })
  else lines.push({ text: "Объём не изменился", className: "efficiency-neutral" })

  return (
    <div className="efficiency-comment">
      {lines.map((l, i) => (
        <div key={i} className={`efficiency-line ${l.className}`}>{l.text}</div>
      ))}
    </div>
  )
}

function ProgressModal({ name, onClose }: { name: string; onClose: () => void }) {
  const [history, setHistory] = useState<HistoryPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<HistoryPoint[]>(`/exercises/history?name=${encodeURIComponent(name)}`)
      .then(data => { setHistory(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [name])

  const maxWeight = Math.max(...history.map(h => h.weight), 0)
  const chartH = 120
  const chartW = 300

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Progress: {name}</h3>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        {loading && <p className="modal-message">Загрузка...</p>}
        {!loading && history.length === 0 && (
          <p className="modal-message">Недостаточно данных для графика</p>
        )}
        {!loading && history.length > 0 && (
          <>
            <svg width={chartW} height={chartH} className="modal-chart">
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                points={history.map((h, i) => {
                  const x = (i / (history.length - 1)) * chartW
                  const y = chartH - (h.weight / maxWeight) * chartH
                  return `${x},${y}`
                }).join(" ")}
              />
              {history.map((h, i) => {
                const x = (i / (history.length - 1)) * chartW
                const y = chartH - (h.weight / maxWeight) * chartH
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={4} fill="#3B82F6" />
                    <text x={x} y={y - 8} textAnchor="middle" fontSize="10" fill="#a0a0b0">{h.weight}kg</text>
                  </g>
                )
              })}
            </svg>
            <div className="modal-dates">
              {history.map((h, i) => (
                <span key={i} className="modal-date-label">{h.date.slice(5)}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function WorkoutDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null)
  const [newExercise, setNewExercise] = useState({ name: "", sets: "", reps: "", weight: "" })
  const [exerciseNames, setExerciseNames] = useState<string[]>([])
  const [previousData, setPreviousData] = useState<Record<string, PreviousExercise>>({})
  const [prData, setPrData] = useState<Record<string, number>>({})
  const [chartFor, setChartFor] = useState<string | null>(null)

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

      apiFetch<{ maxWeight: number }>(`/exercises/pr?name=${encodeURIComponent(ex.name)}`)
        .then(data => {
          if (data) setPrData(prev => ({ ...prev, [ex.name]: data.maxWeight }))
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
      {chartFor && <ProgressModal name={chartFor} onClose={() => setChartFor(null)} />}
      <div className="edit-card">
        <i className="fa-solid fa-dumbbell edit-icon"></i>
        <h2>{workout.name}</h2>
        <p className="workout-meta">
          {workout.date} · {workout.length} min
        </p>
        {workout.notes && <p className="workout-notes">{workout.notes}</p>}

        <h3 className="section-title">Exercises</h3>

        {workout.exercises.length === 0 ? (
          <p className="exercises-empty">No exercises added</p>
        ) : (
          <table className="exercises-table">
            <thead>
              <tr className="exercises-thead-row">
                <th className="exercises-th-left">Exercise</th>
                <th className="exercises-th">Sets</th>
                <th className="exercises-th">Reps</th>
                <th className="exercises-th">Weight (kg)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {workout.exercises.map((ex, i) => {
                const prev = previousData[ex.name]
                const pr = prData[ex.name]
                const isPR = pr !== undefined && ex.weight >= pr

                return (
                  <tr key={i} className="exercises-row">
                    <td className="exercises-td">
                      <div className="exercise-name-row">
                        {ex.name}
                        {isPR && <span className="pr-badge">PR</span>}
                      </div>
                      {prev && (
                        <div className="exercise-prev">
                          Last: {prev.sets}×{prev.reps} @ {prev.weight}kg
                        </div>
                      )}
                      <EfficiencyComment ex={ex} prev={prev} />
                    </td>
                    <td className="exercises-td-center">{ex.sets}</td>
                    <td className="exercises-td-center">{ex.reps}</td>
                    <td className="exercises-td-center">{ex.weight}</td>
                    <td className="exercises-td-actions">
                      <button
                        onClick={() => setChartFor(ex.name)}
                        className="chart-button"
                        title="Progress chart"
                      >📈</button>
                      <button onClick={() => deleteExercise(ex.id)} className="details-delete-button">
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {workout.exercises.some(ex => previousData[ex.name]) && (
          <div className="workout-summary">
            <div className="workout-summary-title">Итоги тренировки</div>
            {workout.exercises.map(ex => {
              const prev = previousData[ex.name]
              if (!prev) return null
              const currVol = getVolume(ex.sets, ex.reps, ex.weight)
              const prevVol = getVolume(prev.sets, prev.reps, prev.weight)
              const diff = currVol - prevVol
              const sign = diff > 0 ? "+" : ""
              const colorClass = diff > 0 ? "efficiency-positive" : diff < 0 ? "efficiency-negative" : "efficiency-neutral"
              return (
                <div key={ex.name} className="workout-summary-row">
                  <span>{ex.name}</span>
                  <span className={colorClass}>{sign}{diff}kg объёма</span>
                </div>
              )
            })}
          </div>
        )}

        <div className="exercise-row">
          <input
            list="exercise-names"
            placeholder="Exercise"
            value={newExercise.name}
            onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
            className="edit-input"
          />
          <datalist id="exercise-names">
            {exerciseNames.map(name => <option key={name} value={name} />)}
          </datalist>
          <input placeholder="Sets" type="number" value={newExercise.sets}
            onChange={e => setNewExercise({ ...newExercise, sets: e.target.value })} className="edit-input" />
          <input placeholder="Reps" type="number" value={newExercise.reps}
            onChange={e => setNewExercise({ ...newExercise, reps: e.target.value })} className="edit-input" />
          <input placeholder="Weight" type="number" value={newExercise.weight}
            onChange={e => setNewExercise({ ...newExercise, weight: e.target.value })} className="edit-input" />
          <button onClick={addExercise} className="exercise-add-button">Add</button>
        </div>

        <button onClick={() => navigate("/workouts")} className="details-update-button">
          Update
        </button>
      </div>
    </div>
  )
}
