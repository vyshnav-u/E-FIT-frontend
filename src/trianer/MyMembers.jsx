
import React, { useState } from "react";
import TrainerHeader from "../components/TrainerHeader";
import { FaSearch, FaArrowRight, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function MyMembers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const members = [
    {
      id: 1,
      name: "Arjun Menon",
      email: "arjun@gmail.com",
      goal: "Muscle Building",
      plan: "Strength Training",
      progress: 78,
      status: "Active",
      joined: "12 Jan 2026"
    },
    {
      id: 2,
      name: "Rahul Krishna",
      email: "rahul@gmail.com",
      goal: "Weight Loss",
      plan: "Cardio & Endurance",
      progress: 65,
      status: "Active",
      joined: "18 Feb 2026"
    },
    {
      id: 3,
      name: "Adithya Raj",
      email: "adithya@gmail.com",
      goal: "Fitness Improvement",
      plan: "Full Body Training",
      progress: 42,
      status: "Active",
      joined: "05 Mar 2026"
    },
    {
      id: 4,
      name: "Nikhil Das",
      email: "nikhil@gmail.com",
      goal: "Strength Building",
      plan: "Weight Training",
      progress: 85,
      status: "Inactive",
      joined: "21 Dec 2025"
    },
    {
      id: 5,
      name: "Vishnu Prasad",
      email: "vishnu@gmail.com",
      goal: "Weight Loss",
      plan: "Fat Loss Program",
      progress: 56,
      status: "Active",
      joined: "14 Apr 2026"
    },
    {
      id: 6,
      name: "Kiran Thomas",
      email: "kiran@gmail.com",
      goal: "Muscle Building",
      plan: "Hypertrophy Training",
      progress: 71,
      status: "Inactive",
      joined: "09 Nov 2025"
    }
  ];

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || member.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const activeMembers = members.filter(
    (member) => member.status === "Active"
  ).length;

  return (
    <div className="min-h-screen bg-[#080908] text-white">
      <TrainerHeader />

      <main className="px-5 md:px-10 lg:px-16 py-12">

        <div className="mb-14">
          <p className="text-[#DFF500] text-xs tracking-[4px] uppercase mb-3">
            Trainer Workspace
          </p>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            My <span className="text-[#DFF500]">Members.</span>
          </h1>

          <p className="text-gray-500 mt-4 text-sm">
            Manage your assigned members and track their fitness journey.
          </p>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-8 border-y border-white/10 py-8 mb-12">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Total Members
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              {members.length.toString().padStart(2, "0")}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Active Members
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#DFF500] mt-3">
              {activeMembers.toString().padStart(2, "0")}
            </h2>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Inactive Members
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              {(members.length - activeMembers).toString().padStart(2, "0")}
            </h2>
          </div>
        </section>

        <section>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">

            <div>
              <h2 className="text-2xl font-semibold">Assigned Members</h2>
              <p className="text-gray-500 text-sm mt-2">
                Your current member list
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

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#080908] border-b border-white/20 px-3 py-3 text-sm text-gray-300 outline-none"
              >
                <option value="All">All Members</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">

              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="py-5 font-medium">Member</th>
                  <th className="py-5 font-medium">Fitness Goal</th>
                  <th className="py-5 font-medium">Workout Plan</th>
                  <th className="py-5 font-medium">Progress</th>
                  <th className="py-5 font-medium">Status</th>
                  <th className="py-5 font-medium">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-white/10 hover:bg-white/[0.02] transition"
                  >
                    <td className="py-6 pr-5">
                      <div className="flex items-center gap-4">
                        <FaUserCircle className="text-3xl text-gray-600 shrink-0" />
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {member.goal}
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {member.plan}
                    </td>

                    <td className="py-6 pr-6">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-1 bg-white/10">
                          <div
                            className="h-full bg-[#DFF500]"
                            style={{ width: `${member.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {member.progress}%
                        </span>
                      </div>
                    </td>

                    <td className="py-6">
                      <span
                        className={`text-xs ${
                          member.status === "Active"
                            ? "text-[#DFF500]"
                            : "text-gray-500"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="py-6">
                      <Link
                        to={`/trainer/members/${member.id}`}
                        className="text-gray-400 hover:text-[#DFF500] transition"
                      >
                        <FaArrowRight />
                      </Link>
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

export default MyMembers;