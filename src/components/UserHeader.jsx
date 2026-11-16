
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'

function UserHeader() {

  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { name: 'Dashboard', path: '/userdash' },
    { name: 'My Profile', path: '/userprofile' },
    { name: 'Workout Plans', path: '/workouts' },
    { name: 'Diet Plans', path: '/diet-plans' },
    { name: 'Progress History', path: '/progress-history' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="relative z-20 flex items-center justify-between px-5 py-5 md:px-10 border-b border-white/10">

      <Link to="/userdash" className="text-2xl font-black tracking-[-2px] text-[#DFF500]">
        E/FIT
      </Link>

      <nav className="hidden lg:flex items-center gap-8 text-xs text-gray-400">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`transition hover:text-[#DFF500] ${
              location.pathname === link.path ? 'text-[#DFF500]' : ''
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-5">

        <Link
          to="/userprofile"
          className="text-[#DFF500] text-2xl hover:text-white transition"
        >
          <FaUserCircle />
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#DFF500] transition"
        >
          <FaSignOutAlt className="text-base" />
          <span>Logout</span>
        </button>

      </div>

    </header>
  )
}

export default UserHeader
