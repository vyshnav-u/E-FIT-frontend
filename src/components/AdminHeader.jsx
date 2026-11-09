import React from "react";
import { FaDumbbell, FaUserShield, FaBell } from "react-icons/fa";

function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080908]/95 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaDumbbell className="text-xl text-[#DFF500]" />
          <h1 className="text-xl font-black tracking-[0.2em]">
            E<span className="text-[#DFF500]">/</span>FIT
          </h1>
          <span className="hidden border-l border-white/20 pl-3 text-xs tracking-widest text-gray-500 sm:block">
            ADMIN PANEL
          </span>
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            className="text-gray-400 transition hover:text-[#DFF500]"
            aria-label="Notifications"
          >
            <FaBell />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DFF500]/50 text-[#DFF500]">
              <FaUserShield />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">Administrator</p>
              <p className="text-xs text-gray-500">System Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;