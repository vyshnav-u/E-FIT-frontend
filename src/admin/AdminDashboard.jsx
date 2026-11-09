import React from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaUsers,
  FaUserTie,
  FaDumbbell,
  FaUserCheck,
  FaArrowUp,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

function AdminDashboard() {
  const stats = [
    {
      title: "Total Members",
      value: "248",
      change: "+12 this month",
      icon: FaUsers,
    },
    {
      title: "Total Trainers",
      value: "18",
      change: "+3 this month",
      icon: FaUserTie,
    },
    {
      title: "Total Workouts",
      value: "36",
      change: "8 active programs",
      icon: FaDumbbell,
    },
    {
      title: "Registered Users",
      value: "284",
      change: "+15 this month",
      icon: FaUserCheck,
    },
  ];

  const recentMembers = [
    { name: "Arjun Menon", email: "arjun@gmail.com", date: "30 Oct 2026" },
    { name: "Rahul Krishna", email: "rahul@gmail.com", date: "29 Oct 2026" },
    { name: "Adithya Raj", email: "adithya@gmail.com", date: "28 Oct 2026" },
    { name: "Nikhil Das", email: "nikhil@gmail.com", date: "27 Oct 2026" },
  ];

  const schedules = [
    {
      trainer: "Alex Morgan",
      member: "Arjun Menon",
      workout: "Strength Training",
      time: "09:00 AM",
    },
    {
      trainer: "David James",
      member: "Rahul Krishna",
      workout: "Cardio Training",
      time: "11:00 AM",
    },
    {
      trainer: "John Mathew",
      member: "Adithya Raj",
      workout: "Full Body Workout",
      time: "02:00 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080908] text-[#EBEDE3]">
      <AdminHeader />

      <div className="lg:flex">
        <AdminSidebar />

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#DFF500]">
                OVERVIEW
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Admin Dashboard
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Monitor and manage your fitness training application.
              </p>
            </div>

            <p className="text-xs text-gray-500">
              <FaCalendarAlt className="mr-2 inline text-[#DFF500]" />
              Friday, 30 October 2026
            </p>
          </div>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                Platform Statistics
              </h2>
              <span className="text-xs text-gray-600">Sample data</span>
            </div>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="border-b border-white/10 pb-6"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <Icon className="text-lg text-[#DFF500]" />
                    </div>

                    <h3 className="text-4xl font-bold">{stat.value}</h3>

                    <p className="mt-3 text-xs text-gray-500">
                      <FaArrowUp className="mr-1 inline text-[#DFF500]" />
                      {stat.change}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-14 grid gap-12 xl:grid-cols-2">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Recent Members</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Recently registered members
                  </p>
                </div>

                <FaUsers className="text-xl text-[#DFF500]" />
              </div>

              <div>
                {recentMembers.map((member, index) => (
                  <div
                    key={member.email}
                    className="flex flex-col justify-between gap-2 border-b border-white/10 py-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-600">
                        0{index + 1}
                      </span>

                      <div>
                        <p className="text-sm font-semibold">{member.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">{member.date}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Training Schedules</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Today's scheduled sessions
                  </p>
                </div>

                <FaClock className="text-xl text-[#DFF500]" />
              </div>

              <div>
                {schedules.map((session) => (
                  <div
                    key={`${session.member}-${session.time}`}
                    className="border-b border-white/10 py-5"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-sm font-semibold">
                          {session.workout}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Member: {session.member}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Trainer: {session.trainer}
                        </p>
                      </div>

                      <p className="text-xs font-semibold text-[#DFF500]">
                        {session.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14 border-t border-white/10 pt-8">
            <p className="text-xs tracking-[0.25em] text-gray-600">
              E/FIT ADMINISTRATION
            </p>
            <h2 className="mt-3 text-2xl font-bold">
              Manage. Monitor. Improve.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Manage registered users, trainers, fitness programs and training
              activities from one central dashboard.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;