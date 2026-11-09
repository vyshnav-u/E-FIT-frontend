
import React from "react";
import { Link, useLocation } from "react-router-dom";

function PublicHeader() {
  const location = useLocation();

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <header className="relative z-20 grid grid-cols-3 items-center  px-5 py-5 md:px-10">

      <Link
        to="/"
        className="w-fit text-2xl font-black tracking-[-2px] text-[#DFF500]"
      >
        E/FIT
      </Link>

      <nav className="hidden items-center justify-center gap-20 text-xs tracking-wide text-gray-400 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`transition hover:text-[#DFF500] ${
              location.pathname === link.path ? "text-[#DFF500]" : ""
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-end gap-2 sm:gap-3">
        <Link
          to="/login"
          className="px-3 py-2 text-xs font-semibold text-[#EBEDE3] transition hover:text-[#DFF500] sm:text-sm"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="rounded-full bg-[#DFF500] px-4 py-2.5 text-xs font-bold text-black transition hover:bg-[#c8dc00] sm:px-5 sm:text-sm"
        >
          Register
        </Link>
      </div>

    </header>
  );
}

export default PublicHeader;
