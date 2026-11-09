import React, { useState } from "react";
import Header from "../components/UserHeader";
import { FaCheck, FaTimes, FaCalendarAlt, FaClock, FaArrowUp } from "react-icons/fa";
import { FiActivity } from "react-icons/fi";

function Attendance() {

  const [selectedMonth, setSelectedMonth] = useState("October");

  const attendanceData = [
    { date: "30 Oct 2026", workout: "Upper Body Training", time: "09:00 AM", status: "Present" },
    { date: "28 Oct 2026", workout: "Cardio Training", time: "05:00 PM", status: "Present" },
    { date: "26 Oct 2026", workout: "Leg Day", time: "08:00 AM", status: "Absent" },
    { date: "24 Oct 2026", workout: "Full Body Workout", time: "09:00 AM", status: "Present" },
    { date: "22 Oct 2026", workout: "Chest & Triceps", time: "10:00 AM", status: "Present" },
    { date: "20 Oct 2026", workout: "Back & Biceps", time: "05:00 PM", status: "Present" },
    { date: "18 Oct 2026", workout: "Cardio Training", time: "07:00 AM", status: "Absent" },
    { date: "16 Oct 2026", workout: "Shoulder Workout", time: "09:00 AM", status: "Present" }
  ];

  const calendarDays = [
    { day: 28, status: "none" },
    { day: 29, status: "none" },
    { day: 30, status: "none" },
    { day: 1, status: "present" },
    { day: 2, status: "present" },
    { day: 3, status: "none" },
    { day: 4, status: "none" },
    { day: 5, status: "present" },
    { day: 6, status: "absent" },
    { day: 7, status: "present" },
    { day: 8, status: "none" },
    { day: 9, status: "none" },
    { day: 10, status: "none" },
    { day: 11, status: "present" },
    { day: 12, status: "present" },
    { day: 13, status: "none" },
    { day: 14, status: "none" },
    { day: 15, status: "present" },
    { day: 16, status: "present" },
    { day: 17, status: "none" },
    { day: 18, status: "absent" },
    { day: 19, status: "none" },
    { day: 20, status: "present" },
    { day: 21, status: "none" },
    { day: 22, status: "present" },
    { day: 23, status: "none" },
    { day: 24, status: "present" },
    { day: 25, status: "none" },
    { day: 26, status: "absent" },
    { day: 27, status: "none" },
    { day: 28, status: "present" },
    { day: 29, status: "none" },
    { day: 30, status: "present" },
    { day: 31, status: "none" }
  ];

  const filteredRecords = attendanceData.filter((record) => {
    return record.date.includes(selectedMonth);
  });

  const presentCount = filteredRecords.filter((record) => record.status === "Present").length;
  const absentCount = filteredRecords.filter((record) => record.status === "Absent").length;
  const totalSessions = presentCount + absentCount;
  const attendancePercentage = totalSessions
    ? Math.round((presentCount / totalSessions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">

      <Header />

      <main className="px-5 md:px-10 lg:px-14 py-10">

        <div className="flex flex-col md:flex-row justify-between md:items-end gap-5 mb-10">
          <div>
            <p className="text-[#DFF500] text-[10px] tracking-[3px] uppercase mb-4">
              Training records
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Attendance<span className="text-[#DFF500]">.</span>
            </h1>
            <p className="text-sm text-gray-500 mt-3">
              Track your consistency and training participation.
            </p>
          </div>

          <div className="text-xs text-gray-500">
            ATTENDANCE RECORD
            <p className="text-white text-sm mt-2">October 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">

          <div className="bg-[#DFF500] text-black rounded-[24px] p-6">
            <FaCalendarAlt className="text-xl mb-5" />
            <h2 className="text-4xl font-bold">{totalSessions}</h2>
            <p className="text-xs mt-2 opacity-70">Total Sessions</p>
          </div>

          <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
            <FaCheck className="text-[#DFF500] text-xl mb-5" />
            <h2 className="text-4xl font-semibold">{presentCount}</h2>
            <p className="text-xs text-gray-500 mt-2">Present Sessions</p>
          </div>

          <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
            <FaTimes className="text-red-400 text-xl mb-5" />
            <h2 className="text-4xl font-semibold">{absentCount}</h2>
            <p className="text-xs text-gray-500 mt-2">Absent Sessions</p>
          </div>

          <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
            <FaArrowUp className="text-[#DFF500] text-xl mb-5" />
            <h2 className="text-4xl font-semibold">{attendancePercentage}%</h2>
            <p className="text-xs text-gray-500 mt-2">Attendance Rate</p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <section className="lg:col-span-5 bg-[#171916] border border-white/5 rounded-[28px] p-6 md:p-8">

            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                  ATTENDANCE CALENDAR
                </p>
                <h2 className="text-xl font-semibold">Monthly Overview</h2>
              </div>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[#22241F] text-xs text-[#DFF500] border border-white/10 px-3 py-2 outline-none"
              >
                <option value="October">October</option>
              </select>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-5">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <p key={day} className="text-[9px] text-gray-500">{day}</p>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((item, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center text-xs rounded-xl ${
                    item.status === "present"
                      ? "bg-[#DFF500] text-black font-semibold"
                      : item.status === "absent"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : index < 3
                      ? "text-gray-600"
                      : "bg-[#22241F] text-gray-400"
                  }`}
                >
                  {item.day}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-5 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DFF500]" />
                Present
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                Absent
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22241F]" />
                No Session
              </div>
            </div>

          </section>

          <section className="lg:col-span-7 bg-[#171916] border border-white/5 rounded-[28px] p-6 md:p-8">

            <div className="flex justify-between items-center mb-7">
              <div>
                <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                  SESSION HISTORY
                </p>
                <h2 className="text-xl font-semibold">Attendance Records</h2>
              </div>
              <FiActivity className="text-[#DFF500] text-2xl" />
            </div>

            <div className="space-y-3">

              {filteredRecords.map((record, index) => (
                <div
                  key={index}
                  className="bg-[#22241F] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-xs text-gray-500 mb-2">{record.date}</p>
                    <h3 className="text-sm font-medium">{record.workout}</h3>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                      <FaClock className="text-[#DFF500]" />
                      {record.time}
                    </p>
                  </div>

                  <span className={`text-[10px] font-semibold px-4 py-2 rounded-full w-fit ${
                    record.status === "Present"
                      ? "bg-[#DFF500]/10 text-[#DFF500]"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {record.status.toUpperCase()}
                  </span>
                </div>
              ))}

              {filteredRecords.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-10">
                  No attendance records found.
                </p>
              )}

            </div>

          </section>

        </div>

        <div className="mt-6 bg-[#DFF500] text-black rounded-[28px] p-7 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div>
            <p className="text-[10px] tracking-[2px] font-semibold mb-2">
              CONSISTENCY MATTERS
            </p>
            <h2 className="text-2xl font-bold">Every session counts.</h2>
            <p className="text-xs mt-2 opacity-70">
              Keep showing up and stay committed to your goals.
            </p>
          </div>
          <FaCheck className="text-4xl opacity-30" />
        </div>

      </main>
    </div>
  );
}

export default Attendance;