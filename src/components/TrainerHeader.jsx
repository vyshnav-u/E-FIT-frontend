
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function TrainerHeader() {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/trainer/dashboard" },
    { name: "My Profile", path: "/trainer/profile" },
    { name: "My Members", path: "/trainer/members" },
    { name: "Workouts", path: "/trainer/workouts" },
    { name: "Diet Plans", path: "/trainer/diet" },
    { name: "Schedule", path: "/trainer/schedule" },
    { name: "Attendance", path: "/trainer/attendance" },
    { name: "Progress", path: "/trainer/progress" }
  ];

  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between gap-5 px-5 py-5 md:px-10 border-b border-white/10">

      <Link
        to="/trainer/dashboard"
        className="text-2xl font-black tracking-[-2px] text-[#DFF500]"
      >
        E/FIT
      </Link>

      <nav className="flex flex-wrap items-center gap-3 lg:gap-5 text-xs text-gray-400">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`transition hover:text-[#DFF500] ${
              location.pathname === link.path
                ? "text-[#DFF500]"
                : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <Link
        to="/trainer/profile"
        className="text-[#DFF500] text-2xl hover:text-white transition"
      >
        <FaUserCircle />
      </Link>

    </header>
  );
}

export default TrainerHeader;
