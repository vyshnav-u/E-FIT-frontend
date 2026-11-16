
import './App.css'
import { Route, Routes } from 'react-router-dom'

import Home from './public/Home'

import Dashboard from './user/Dashboard'
import MyProfile from './user/MyProfile'
import WorkoutPlans from './user/WorkoutPlans'
import DietPlans from './user/DietPlans'
import ProgressHistory from './user/ProgressHistory'

import AdminDashboard from './admin/AdminDashboard'
import UserManagement from './admin/UserManagement'
import WorkoutOversight from './admin/WorkoutOversight'
import DietOversight from './admin/DietOversight'
import AdminReports from './admin/AdminReports'
import Settings from './admin/Settings'

import Register from './auth/Register'
import Login from './auth/Login'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* User section */}
        <Route path="/userdash" element={<Dashboard />} />
        <Route path="/userprofile" element={<MyProfile />} />
        <Route path="/workouts" element={<WorkoutPlans />} />
        <Route path="/diet-plans" element={<DietPlans />} />
        <Route path="/progress-history" element={<ProgressHistory />} />

        {/* Admin section */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/workouts" element={<WorkoutOversight />} />
        <Route path="/admin/diet" element={<DietOversight />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App