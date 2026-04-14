import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Workouts from './pages/workouts/Workouts'
import Profile from './pages/profile/Profile'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import EditWorkout from './pages/workouts/EditWorkout'
import PrivateRoute from './pages/components/PrivateRoute'
import Register from './pages/auth/Register'
import WorkoutDetails from './pages/workouts/WorkoutsDetails'
import Statistics from './pages/stats/Statistics'
import { Navigate } from "react-router-dom"


function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>}/>
      <Route path='/workouts' element={<PrivateRoute><Workouts /></PrivateRoute>}/>
      <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
       
      <Route path='/workouts/:id/edit' element={<PrivateRoute><EditWorkout /></PrivateRoute>}/>
      <Route path='/workouts/:id' element={<PrivateRoute><WorkoutDetails /></PrivateRoute>}/>
      <Route path='/statistics' element={<PrivateRoute><Statistics /></PrivateRoute>}/>
    </Routes>
    </BrowserRouter>
  )
}
export default App