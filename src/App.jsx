import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './public/Home'
import Dashboard from './user/Dashboard'
import MyProfile from './user/MyProfile'
import WorkoutPlans from './user/WorkoutPlans'
import Attendance from './user/Attendance'
import DietPlans from './user/DietPlans'
import ProgressHistory from './user/ProgressHistory'
import TrainerDashboard from './trianer/TrainerDashboard'
import TrainerProfile from './trianer/TrainerProfile'
import MyMembers from './trianer/MyMembers'
import WorkoutManagement from './trianer/WorkoutManagement'
import DietManagement from './trianer/DietManagement'
import ScheduleManagement from './trianer/ScheduleManagement'
import AttendanceManagement from './trianer/AttendanceManagement'
import ProgressMonitoring from './trianer/ProgressMonitoring'
import AdminDashboard from './admin/AdminDashboard'
import UserManagement from './admin/UserManagement'
import TrainerManagement from './admin/TrainerManagement'
import MemberManagement from './admin/MemberManagement'
import WorkoutOversight from './admin/WorkoutOversight'
import DietOversight from './admin/DietOversight'
import ScheduleMonitoring from './admin/ScheduleMonitoring'
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
        <Route path='/' element={<Home />} />

        {/* user section */}
        <Route path='/userdash' element={<Dashboard />} />
        <Route path="/userprofile" element={<MyProfile />} />
        <Route path="/workouts" element={<WorkoutPlans />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/diet-plans" element={<DietPlans />} />
        <Route path="/progress-history" element={<ProgressHistory />} />

        {/* trainer section */}
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/profile" element={<TrainerProfile />} />
        <Route path="/trainer/members" element={<MyMembers />} />
        <Route path="/trainer/workouts" element={<WorkoutManagement />} />
        <Route path="/trainer/diet" element={<DietManagement />} />
        <Route path="/trainer/schedule" element={<ScheduleManagement />} />
        <Route path="/trainer/attendance" element={<AttendanceManagement />} />
        <Route path="/trainer/progress" element={<ProgressMonitoring />} />

        {/* admin section */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/trainers" element={<TrainerManagement />} />
        <Route path="/admin/members" element={<MemberManagement />} />
        <Route path="/admin/workouts" element={<WorkoutOversight />} />
        <Route path="/admin/diet" element={<DietOversight />} />
        <Route path="/admin/schedule" element={<ScheduleMonitoring />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App