import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import Navbar from "../components/Navbar"
import "./Statistics.css"

type StatPoint = {
  date: string
  sets: number
  reps: number
  weight: number
  volume: number
}

type ProgressionDto = {
  exerciseName: string
  lastWeight: number
  lastSets: number
  lastReps: number
  recommendation: string
  suggestedWeight: number
}

export default function Statistics() {
  const [exerciseNames, setExerciseNames] = useState<string[]>([])
  const [selectedExercise, setSelectedExercise] = useState("")
  const [stats, setStats] = useState<StatPoint[]>([])
  const [period, setPeriod] = useState<"week" | "month" | "all">("all")
  const [progression, setProgression] = useState<ProgressionDto[]>([])
  const API = import.meta.env.VITE_API_URL
  useEffect(() => {
    fetch(`${API}/exercises/my`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(r => r.json())
      .then(data => setExerciseNames(data))
    fetch(`${API}/exercises/progression`, {
    credentials: "include"
  })
    .then(r => r.json())
    .then(data => setProgression(data))
  }, [])

  useEffect(() => {
    if (!selectedExercise) return
    const API = import.meta.env.VITE_API_URL
    fetch(`${API}/exercises/stats?name=${encodeURIComponent(selectedExercise)}`,{
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(r => r.json())
      .then(data => setStats(data))
  }, [selectedExercise])

  function filterByPeriod(data: StatPoint[]) {
    if (period === "all") return data
    const now = new Date()
    const cutoff = new Date()
    if (period === "week") cutoff.setDate(now.getDate() - 7)
    if (period === "month") cutoff.setMonth(now.getMonth() - 1)
    return data.filter(d => new Date(d.date) >= cutoff)
  }

  const filtered = filterByPeriod(stats)

  return (
    <>
      <Navbar />
      <div className="stats-page">
        <div className="stats-card">
          <h1>Statistics</h1>

          <div className="stats-controls">
            <select
              className="stats-select"
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              <option value="">Select exercise</option>
              {exerciseNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <div className="period-buttons">
              {(["week", "month", "all"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={period === p ? "period-btn active" : "period-btn"}
                >
                  {p === "week" ? "Week" : p === "month" ? "Month" : "All time"}
                </button>
              ))}
            </div>
          </div>

          {!selectedExercise && (
            <p className="stats-empty">Select an exercise to see progress</p>
          )}

          {selectedExercise && filtered.length === 0 && (
            <p className="stats-empty">No data for this period</p>
          )}

          {filtered.length > 0 && (
            <>
              <h3>Weight (kg)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3d4f6b" />
                  <XAxis dataKey="date" stroke="#7aa0df" fontSize={12} />
                  <YAxis stroke="#7aa0df" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2d3e57",
                      border: "none",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#7aa0df"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <h3>Sets & Reps</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3d4f6b" />
                  <XAxis dataKey="date" stroke="#7aa0df" fontSize={12} />
                  <YAxis stroke="#7aa0df" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2d3e57",
                      border: "none",
                      color: "white",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sets"
                    stroke="#6fcf97"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reps"
                    stroke="#eb5757"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <h3>Volume (kg)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={filtered}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3d4f6b" />
                  <XAxis dataKey="date" stroke="#7aa0df" fontSize={12} />
                  <YAxis stroke="#7aa0df" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2d3e57",
                      border: "none",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#ffc107"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="stats-progression">
                <h2 className="stats-header">Recommendations</h2>
                {progression.map((p) => (
                  <div key={p.exerciseName} className="progression-card">
                    <span className="progression-name">{p.exerciseName}</span>
                    <span className="progression-detail">
                      {p.lastSets} × {p.lastReps} @ {p.lastWeight}kg
                    </span>
                    <span
                      className={`progression-badge badge-${p.recommendation.toLowerCase()}`}
                    >
                      {p.recommendation === "INCREASE" &&
                        `↑ ${p.suggestedWeight}kg`}
                      {p.recommendation === "HOLD" &&
                        `= ${p.suggestedWeight}kg`}
                      {p.recommendation === "DECREASE" &&
                        `↓ ${p.suggestedWeight}kg`}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}