import React from "react";
import TrainerHeader from "../components/TrainerHeader";
import {
  FaUsers,
  FaCalendarCheck,
  FaClock,
  FaArrowRight,
  FaDumbbell,
  FaUserCircle
} from "react-icons/fa";
import { FiActivity, FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

function TrainerDashboard() {

  const stats = [
    {
      title: "Total Members",
      value: "48",
      description: "Currently assigned members",
      icon: <FaUsers />
    },
    {
      title: "Today's Sessions",
      value: "06",
      description: "Scheduled for today",
      icon: <FaCalendarCheck />
    },
    {
      title: "Upcoming Sessions",
      value: "12",
      description: "Sessions scheduled ahead",
      icon: <FaClock />
    }
  ];

  const sessions = [
    {
      name: "Arjun Menon",
      workout: "Upper Body Training",
      time: "09:00 AM",
      duration: "60 min",
      status: "In Progress"
    },
    {
      name: "Rahul Krishna",
      workout: "Strength Training",
      time: "11:00 AM",
      duration: "45 min",
      status: "Upcoming"
    },
    {
      name: "Adithya Raj",
      workout: "Cardio & Endurance",
      time: "02:00 PM",
      duration: "60 min",
      status: "Upcoming"
    },
    {
      name: "Nikhil Das",
      workout: "Full Body Workout",
      time: "04:00 PM",
      duration: "60 min",
      status: "Upcoming"
    }
  ];

  const activities = [
    {
      title: "Workout plan assigned",
      member: "Arjun Menon",
      time: "Today, 08:30 AM"
    },
    {
      title: "Progress record updated",
      member: "Rahul Krishna",
      time: "Yesterday, 05:15 PM"
    },
    {
      title: "Diet plan created",
      member: "Adithya Raj",
      time: "Yesterday, 11:00 AM"
    },
    {
      title: "Attendance marked",
      member: "Nikhil Das",
      time: "28 October, 04:30 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">

      <TrainerHeader />

      <main className="px-5 md:px-10 lg:px-14 py-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
          <div>
            <p className="text-[#DFF500] text-[10px] tracking-[3px] uppercase mb-4">
              Trainer workspace
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Dashboard<span className="text-[#DFF500]">.</span>
            </h1>

            <p className="text-sm text-gray-500 mt-3">
              Manage your members and keep their fitness journey on track.
            </p>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 tracking-widest">
              TRAINER OVERVIEW
            </p>
            <p className="text-sm mt-2">Friday, 30 October 2026</p>
          </div>
        </div>

        <section className="mb-14">

          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-[10px] text-gray-500 tracking-[2px] mb-2">
                PERFORMANCE OVERVIEW
              </p>
              <h2 className="text-xl font-semibold">Your Statistics</h2>
            </div>

            <FiActivity className="text-[#DFF500] text-2xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

            {stats.map((item, index) => (
              <div
                key={item.title}
                className={`py-5 ${index === 0 ? "sm:border-r sm:border-white/10 sm:pr-6" : index === 1 ? "sm:border-r sm:border-white/10 sm:pr-6" : ""}`}
              >
                <div className="flex items-center gap-3 text-[#DFF500] mb-6">
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-xs text-gray-400">{item.title}</p>
                </div>

                <h3 className="text-5xl font-semibold tracking-tight">
                  {item.value}
                </h3>

                <p className="text-xs text-gray-500 mt-3">
                  {item.description}
                </p>
              </div>
            ))}

          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <section className="lg:col-span-7">

            <div className="flex justify-between items-center mb-7">
              <div>
                <p className="text-[10px] text-gray-500 tracking-[2px] mb-2">
                  TRAINING SCHEDULE
                </p>
                <h2 className="text-xl font-semibold">Today's Sessions</h2>
              </div>

              <Link
                to="/trainer/schedule"
                className="text-xs text-[#DFF500] flex items-center gap-2 hover:gap-3 transition-all"
              >
                View Schedule <FaArrowRight />
              </Link>
            </div>

            <div>
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className="py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#DFF500]">
                      <FaUserCircle className="text-xl" />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">{session.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.workout}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 sm:gap-7">
                    <div>
                      <p className="text-xs">{session.time}</p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {session.duration}
                      </p>
                    </div>

                    <span className={`text-[10px] ${
                      session.status === "In Progress"
                        ? "text-[#DFF500]"
                        : "text-gray-500"
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </section>

          <section className="lg:col-span-5">

            <div className="mb-7">
              <p className="text-[10px] text-gray-500 tracking-[2px] mb-2">
                RECENT UPDATES
              </p>
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>

            <div>
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex gap-4 py-5 border-b border-white/10"
                >
                  <div className="w-9 h-9 rounded-full bg-[#DFF500]/10 text-[#DFF500] flex items-center justify-center shrink-0">
                    <FiActivity />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">
                      {activity.title}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      {activity.member}
                    </p>

                    <p className="text-[10px] text-gray-600 mt-2">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </section>

        </div>

        <section className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">

          <div>
            <p className="text-[10px] text-[#DFF500] tracking-[2px] mb-2">
              TRAINER ACTIONS
            </p>
            <h2 className="text-xl font-semibold">
              Keep your members progressing.
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Review member records and update their training plans.
            </p>
          </div>

          <Link
            to="/trainer/members"
            className="inline-flex items-center justify-center gap-3 bg-[#DFF500] text-black px-6 py-4 rounded-full text-xs font-semibold hover:bg-white transition"
          >
            Manage Members <FiArrowUpRight className="text-base" />
          </Link>

        </section>

      </main>
    </div>
  );
}

export default TrainerDashboard;