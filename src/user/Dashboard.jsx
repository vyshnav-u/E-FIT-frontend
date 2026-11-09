import React from "react";
import Header from "../components/UserHeader";
import { FaFire, FaDumbbell, FaClock, FaArrowUp, FaArrowRight } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";

function Dashboard() {
  const sessions = [
    { day: "31", month: "OCT", title: "Upper Body Workout", time: "09:00 - 10:30", type: "Strength" },
    { day: "02", month: "NOV", title: "Cardio & Endurance", time: "17:00 - 18:00", type: "Cardio" },
    { day: "04", month: "NOV", title: "Full Body Training", time: "08:00 - 09:30", type: "Training" }
  ];

  const progress = [
    { title: "Strength", value: 85 },
    { title: "Cardio", value: 65 },
    { title: "Flexibility", value: 72 }
  ];

  return (
    <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">

      <Header />

      <main className="px-5 md:px-10 lg:px-14 py-8">

        <div className="flex flex-col md:flex-row justify-between md:items-end gap-5 mb-10">
          <div>
            <p className="text-[#DFF500] text-[10px] tracking-[3px] uppercase mb-4">
              Your personal fitness space
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Good morning,<br />
              <span className="text-[#DFF500]">Alex.</span>
            </h1>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">FRIDAY, OCTOBER 30</p>
            <p className="text-sm text-gray-300">Let's make today count.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          <section className="lg:col-span-4 space-y-5">

            <div className="bg-[#DFF500] text-black rounded-[28px] p-7 min-h-[230px] flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <p className="text-xs uppercase tracking-[2px] font-semibold">Fitness overview</p>
                <FaArrowUp />
              </div>

              <div>
                <h2 className="text-6xl font-bold tracking-tighter">24</h2>
                <p className="text-sm mt-1 font-medium">Workouts completed</p>
                <div className="mt-6 h-[1px] bg-black/20" />
                <p className="text-xs mt-4">Your consistency is paying off.</p>
              </div>
            </div>

            <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
              <div className="flex justify-between items-center mb-7">
                <h3 className="text-sm font-medium">Your activity</h3>
                <span className="text-[10px] text-gray-500">THIS MONTH</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <FaFire className="text-[#DFF500] mb-4 text-lg" />
                  <h3 className="text-3xl font-semibold">12</h3>
                  <p className="text-xs text-gray-500 mt-1">Day streak</p>
                </div>

                <div>
                  <FaClock className="text-[#DFF500] mb-4 text-lg" />
                  <h3 className="text-3xl font-semibold">18.5</h3>
                  <p className="text-xs text-gray-500 mt-1">Training hours</p>
                </div>
              </div>
            </div>

            <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-medium">Progress summary</h3>
                <FiTarget className="text-[#DFF500] text-xl" />
              </div>

              <div className="mb-7">
                <p className="text-4xl font-semibold">76.4 <span className="text-sm text-gray-500">kg</span></p>
                <p className="text-xs text-gray-500 mt-1">Current weight</p>
              </div>

              {progress.map((item) => (
                <div key={item.title} className="mb-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">{item.title}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#DFF500] rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </section>

          <section className="lg:col-span-5 space-y-5">

            <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">YOUR COACH</p>
                  <h2 className="text-xl font-semibold">Assigned Trainer</h2>
                </div>
                <span className="w-2 h-2 bg-[#DFF500] rounded-full" />
              </div>

              <div className="relative h-56 rounded-[20px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=900"
                  alt="Personal trainer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5">
                  <p className="text-xl font-semibold">James Anderson</p>
                  <p className="text-xs text-gray-300 mt-1">Certified Personal Trainer</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-5">
                <div>
                  <p className="text-xl font-semibold">8+ Years</p>
                  <p className="text-[10px] text-gray-500 mt-1">Experience</p>
                </div>
                <button className="bg-[#DFF500] text-black rounded-full px-5 py-3 text-xs font-semibold hover:bg-white transition">
                  Contact Trainer <FaArrowRight className="inline ml-2" />
                </button>
              </div>
            </div>

            <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
              <div className="flex justify-between items-center mb-7">
                <div>
                  <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">YOUR CALENDAR</p>
                  <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
                </div>
                <button className="text-xs text-[#DFF500]">View all ↗</button>
              </div>

              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.day} className="flex items-center gap-4 bg-[#20221F] rounded-2xl p-4">
                    <div className="bg-[#DFF500] text-black rounded-xl w-14 h-14 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xl font-bold leading-none">{session.day}</span>
                      <span className="text-[9px] font-semibold mt-1">{session.month}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium">{session.title}</h3>
                      <p className="text-[10px] text-gray-500 mt-2">{session.time}</p>
                    </div>

                    <FaArrowRight className="text-gray-500 text-xs shrink-0" />
                  </div>
                ))}
              </div>
            </div>

          </section>

          <aside className="lg:col-span-3 space-y-5">

            <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
              <p className="text-[10px] tracking-[2px] text-gray-500 mb-5">WEEKLY TARGET</p>

              <div className="flex items-end gap-2">
                <h2 className="text-5xl font-semibold">04</h2>
                <p className="text-gray-500 text-sm mb-2">/ 05 sessions</p>
              </div>

              <div className="flex gap-2 mt-7">
                {[1, 2, 3, 4, 5].map((day) => (
                  <div
                    key={day}
                    className={`h-2 flex-1 rounded-full ${day <= 4 ? "bg-[#DFF500]" : "bg-white/10"}`}
                  />
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-5">
                One more session to complete your weekly goal.
              </p>
            </div>

            <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
              <p className="text-[10px] tracking-[2px] text-gray-500 mb-6">PERFORMANCE</p>

              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-4xl font-semibold">82%</h2>
                  <p className="text-xs text-gray-500 mt-1">Goal completion</p>
                </div>
                <div className="text-[#DFF500] text-xs flex items-center gap-1">
                  <FaArrowUp /> 12%
                </div>
              </div>

              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#DFF500] rounded-full w-[82%]" />
              </div>
            </div>

            <div className="relative overflow-hidden bg-[#DFF500] text-black rounded-[28px] p-7 min-h-[240px] flex flex-col justify-between">
              <div className="flex justify-between">
                <FaDumbbell className="text-2xl" />
                <span className="text-[10px] tracking-[2px] font-semibold">E/FIT MINDSET</span>
              </div>

              <div>
                <h2 className="text-3xl font-bold leading-tight tracking-tight">
                  Progress<br />over perfection.
                </h2>
                <p className="text-xs mt-4 opacity-70">Show up. Put in the work. Repeat.</p>
              </div>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;