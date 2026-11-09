
import React, { useState } from "react";
import TrainerHeader from "../components/TrainerHeader";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaClock,
  FaCalendarAlt
} from "react-icons/fa";

function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState("2026-10-30");
  const [searchTerm, setSearchTerm] = useState("");

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Arjun Menon",
      email: "arjun@gmail.com",
      session: "Strength Training",
      time: "09:00 AM",
      status: "Present"
    },
    {
      id: 2,
      name: "Rahul Krishna",
      email: "rahul@gmail.com",
      session: "Cardio Training",
      time: "11:00 AM",
      status: "Absent"
    },
    {
      id: 3,
      name: "Adithya Raj",
      email: "adithya@gmail.com",
      session: "Full Body Workout",
      time: "02:00 PM",
      status: "Late"
    },
    {
      id: 4,
      name: "Nikhil Das",
      email: "nikhil@gmail.com",
      session: "Weight Training",
      time: "04:00 PM",
      status: "Present"
    },
    {
      id: 5,
      name: "Vishnu Prasad",
      email: "vishnu@gmail.com",
      session: "Strength Training",
      time: "05:00 PM",
      status: "Not Marked"
    },
    {
      id: 6,
      name: "Kiran Thomas",
      email: "kiran@gmail.com",
      session: "Cardio Training",
      time: "06:00 PM",
      status: "Not Marked"
    }
  ]);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = members.filter(
    (member) => member.status === "Present"
  ).length;

  const absentCount = members.filter(
    (member) => member.status === "Absent"
  ).length;

  const lateCount = members.filter(
    (member) => member.status === "Late"
  ).length;

  const markedCount = presentCount + absentCount + lateCount;

  const markAttendance = (id, status) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id
          ? { ...member, status }
          : member
      )
    );
  };

  const markAllPresent = () => {
    setMembers((prev) =>
      prev.map((member) => ({
        ...member,
        status: "Present"
      }))
    );
  };

  const getStatusColor = (status) => {
    if (status === "Present") return "text-[#DFF500]";
    if (status === "Absent") return "text-red-400";
    if (status === "Late") return "text-orange-400";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-[#080908] text-white">
      <TrainerHeader />

      <main className="px-5 md:px-10 lg:px-16 py-12">

        <div className="mb-14">
          <p className="text-[#DFF500] text-xs tracking-[4px] uppercase mb-3">
            Member Records
          </p>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Attendance <span className="text-[#DFF500]">Management.</span>
          </h1>

          <p className="text-gray-500 mt-4 text-sm">
            Track member attendance and maintain daily training records.
          </p>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/10 py-8 mb-12">

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Total Members
            </p>
            <h2 className="text-4xl font-bold mt-3">
              {members.length.toString().padStart(2, "0")}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Present
            </p>
            <h2 className="text-4xl font-bold text-[#DFF500] mt-3">
              {presentCount.toString().padStart(2, "0")}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Absent
            </p>
            <h2 className="text-4xl font-bold text-red-400 mt-3">
              {absentCount.toString().padStart(2, "0")}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Late
            </p>
            <h2 className="text-4xl font-bold text-orange-400 mt-3">
              {lateCount.toString().padStart(2, "0")}
            </h2>
          </div>

        </section>

        <section>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">

            <div>
              <p className="text-[#DFF500] text-xs uppercase tracking-widest mb-3">
                Daily Attendance
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold">
                Member Records
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Manage attendance for your scheduled training sessions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">

              <div className="flex items-center gap-3 border-b border-white/20 px-2 py-3">
                <FaSearch className="text-gray-500" />

                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full sm:w-48 placeholder:text-gray-600"
                />
              </div>

              <div className="flex items-center gap-3 border-b border-white/20 px-2 py-3">
                <FaCalendarAlt className="text-gray-500" />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-sm text-white outline-none [color-scheme:dark]"
                />
              </div>

            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-white/10 py-5 mb-2">
            <div>
              <p className="text-sm text-gray-400">
                Attendance marked:{" "}
                <span className="text-[#DFF500] font-semibold">
                  {markedCount}/{members.length}
                </span>
              </p>
            </div>

            <button
              onClick={markAllPresent}
              className="text-xs uppercase tracking-widest text-[#DFF500] hover:text-white transition w-fit"
            >
              Mark All Present
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">

              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="py-5 font-medium">Member</th>
                  <th className="py-5 font-medium">Training Session</th>
                  <th className="py-5 font-medium">Time</th>
                  <th className="py-5 font-medium">Status</th>
                  <th className="py-5 font-medium">Mark Attendance</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-white/10 hover:bg-white/[0.02] transition"
                  >
                    <td className="py-6 pr-5">
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {member.email}
                      </p>
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {member.session}
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {member.time}
                    </td>

                    <td className="py-6">
                      <span className={`text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>

                    <td className="py-6">
                      <div className="flex items-center gap-4">

                        <button
                          onClick={() => markAttendance(member.id, "Present")}
                          title="Mark Present"
                          className={`transition ${
                            member.status === "Present"
                              ? "text-[#DFF500]"
                              : "text-gray-600 hover:text-[#DFF500]"
                          }`}
                        >
                          <FaCheck />
                        </button>

                        <button
                          onClick={() => markAttendance(member.id, "Absent")}
                          title="Mark Absent"
                          className={`transition ${
                            member.status === "Absent"
                              ? "text-red-400"
                              : "text-gray-600 hover:text-red-400"
                          }`}
                        >
                          <FaTimes />
                        </button>

                        <button
                          onClick={() => markAttendance(member.id, "Late")}
                          title="Mark Late"
                          className={`transition ${
                            member.status === "Late"
                              ? "text-orange-400"
                              : "text-gray-600 hover:text-orange-400"
                          }`}
                        >
                          <FaClock />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {filteredMembers.length === 0 && (
              <p className="text-center text-gray-500 py-12">
                No members found.
              </p>
            )}
          </div>

          <p className="text-gray-600 text-xs mt-6">
            Showing {filteredMembers.length} of {members.length} members
          </p>

        </section>
      </main>
    </div>
  );
}

export default AttendanceManagement;