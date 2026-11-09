import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaThLarge,
  FaUsers,
  FaUserTie,
  FaUser,
  FaDumbbell,
  FaUtensils,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

function AdminSidebar() {
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FaThLarge },
    { name: "User Management", path: "/admin/users", icon: FaUsers },
    { name: "Trainer Management", path: "/admin/trainers", icon: FaUserTie },
    { name: "Member Management", path: "/admin/members", icon: FaUser },
    { name: "Workout Management", path: "/admin/workouts", icon: FaDumbbell },
    { name: "Diet Management", path: "/admin/diet", icon: FaUtensils },
    { name: "Schedule Management", path: "/admin/schedule", icon: FaCalendarAlt },
    { name: "Reports", path: "/admin/reports", icon: FaChartBar },
    { name: "Settings", path: "/admin/settings", icon: FaCog },
  ];

  return (
    <aside className="w-full border-b border-white/10 px-4 py-5 lg:min-h-[calc(100vh-73px)] lg:w-64 lg:border-b-0 lg:border-r lg:px-5">
      <p className="mb-4 px-3 text-[10px] font-semibold tracking-[0.3em] text-gray-600">
        MAIN MENU
      </p>

      <nav className="flex flex-wrap gap-2 lg:flex-col">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 text-xs transition ${
                  isActive
                    ? "border-l-2 border-[#DFF500] bg-white/[0.05] text-[#DFF500]"
                    : "border-l-2 border-transparent text-gray-400 hover:bg-white/[0.03] hover:text-white"
                }`
              }
            >
              <Icon className="shrink-0 text-sm" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;