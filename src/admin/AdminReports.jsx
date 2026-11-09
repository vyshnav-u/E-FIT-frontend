
import React, { useMemo, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaUsers,
  FaCalendarCheck,
  FaDumbbell,
  FaUserTie,
  FaDownload,
} from "react-icons/fa";

const reportData = {
  Weekly: {
    attendance: [72, 85, 68, 92, 78, 88, 80],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    rate: 82,
    sessions: 46,
    completed: 38,
    cancelled: 8,
  },
  Monthly: {
    attendance: [75, 82, 78, 90, 85, 88, 92],
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"],
    rate: 86,
    sessions: 186,
    completed: 164,
    cancelled: 22,
  },
  Yearly: {
    attendance: [68, 74, 79, 83, 80, 86, 91],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    rate: 80,
    sessions: 1420,
    completed: 1260,
    cancelled: 160,
  },
};

const memberReports = [
  {
    id: 1,
    name: "Arjun Menon",
    goal: "Muscle Building",
    startingWeight: 78,
    currentWeight: 74,
    progress: 80,
  },
  {
    id: 2,
    name: "Rahul Krishna",
    goal: "Weight Loss",
    startingWeight: 92,
    currentWeight: 85,
    progress: 70,
  },
  {
    id: 3,
    name: "Adithya Raj",
    goal: "Fitness Improvement",
    startingWeight: 68,
    currentWeight: 66,
    progress: 55,
  },
  {
    id: 4,
    name: "Nikhil Das",
    goal: "Strength Building",
    startingWeight: 72,
    currentWeight: 76,
    progress: 90,
  },
  {
    id: 5,
    name: "Vishnu Prasad",
    goal: "Weight Loss",
    startingWeight: 88,
    currentWeight: 82,
    progress: 65,
  },
];

const workoutStats = [
  { name: "Strength Training", count: 42, percentage: 85 },
  { name: "Cardio", count: 35, percentage: 70 },
  { name: "Weight Loss", count: 28, percentage: 56 },
  { name: "Muscle Building", count: 24, percentage: 48 },
  { name: "Flexibility", count: 18, percentage: 36 },
];

const trainerReports = [
  {
    id: 1,
    name: "Alex Morgan",
    sessions: 48,
    completed: 44,
    attendance: 92,
  },
  {
    id: 2,
    name: "David James",
    sessions: 42,
    completed: 38,
    attendance: 88,
  },
  {
    id: 3,
    name: "John Mathew",
    sessions: 36,
    completed: 32,
    attendance: 85,
  },
  {
    id: 4,
    name: "Michael Thomas",
    sessions: 30,
    completed: 25,
    attendance: 78,
  },
];

function AdminReports() {
  const [period, setPeriod] = useState("Monthly");
  const [search, setSearch] = useState("");

  const selectedReport = reportData[period];

  const filteredMembers = useMemo(() => {
    return memberReports.filter(
      (member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.goal.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const summaryStats = [
    {
      title: "TOTAL MEMBERS",
      value: "248",
      change: "+12 this month",
      icon: <FaUsers />,
    },
    {
      title: "ATTENDANCE RATE",
      value: `${selectedReport.rate}%`,
      change: "Member attendance",
      icon: <FaCalendarCheck />,
    },
    {
      title: "COMPLETED SESSIONS",
      value: selectedReport.completed,
      change: `${selectedReport.sessions} total sessions`,
      icon: <FaDumbbell />,
    },
    {
      title: "ACTIVE TRAINERS",
      value: "18",
      change: "Across all programs",
      icon: <FaUserTie />,
    },
  ];

  const handleExport = () => {
    const rows = [
      ["Member", "Fitness Goal", "Starting Weight", "Current Weight", "Progress"],
      ...memberReports.map((member) => [
        member.name,
        member.goal,
        member.startingWeight,
        member.currentWeight,
        `${member.progress}%`,
      ]),
    ];

    const csvContent = rows
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "efit-member-reports.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#080908] text-[#EBEDE3]">
      <AdminHeader />

      <div className="lg:grid lg:grid-cols-[250px_1fr]">
        <AdminSidebar />

        <main className="min-w-0 p-5 sm:p-8 lg:p-10">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.3em] text-[#DFF500]">
                ADMINISTRATION / ANALYTICS
              </p>

              <h1 className="text-3xl font-black sm:text-4xl">
                Reports & Analytics
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Monitor attendance, fitness progress and training performance.
              </p>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 border border-white/20 px-5 py-3 text-sm transition hover:border-[#DFF500] hover:text-[#DFF500]"
            >
              <FaDownload />
              Export Member Report
            </button>
          </div>

          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <p className="text-xs tracking-widest text-gray-500">
              REPORTING PERIOD
            </p>

            <div className="flex gap-2">
              {["Weekly", "Monthly", "Yearly"].map((item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`px-4 py-2 text-xs font-semibold transition ${
                    period === item
                      ? "bg-[#DFF500] text-black"
                      : "border border-white/10 text-gray-400 hover:border-white/30"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <section className="mb-12 grid grid-cols-2 gap-6 border-b border-white/10 pb-8 lg:grid-cols-4">
            {summaryStats.map((stat) => (
              <div key={stat.title}>
                <div className="mb-4 flex items-center gap-3 text-[#DFF500]">
                  <span className="text-lg">{stat.icon}</span>
                  <p className="text-[10px] font-bold tracking-widest text-gray-500">
                    {stat.title}
                  </p>
                </div>

                <h2 className="text-3xl font-black sm:text-4xl">
                  {stat.value}
                </h2>

                <p className="mt-2 text-xs text-gray-500">{stat.change}</p>
              </div>
            ))}
          </section>

          <section className="mb-14">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-2 text-xs tracking-widest text-[#DFF500]">
                  ATTENDANCE ANALYSIS
                </p>
                <h2 className="text-2xl font-bold">Attendance Overview</h2>
              </div>

              <p className="text-sm text-gray-500">
                Average attendance:{" "}
                <span className="font-bold text-[#DFF500]">
                  {selectedReport.rate}%
                </span>
              </p>
            </div>

            <div className="flex h-64 items-end justify-between gap-3 border-b border-white/10 pb-3 sm:gap-6">
              {selectedReport.attendance.map((value, index) => (
                <div
                  key={selectedReport.labels[index]}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                >
                  <span className="text-[10px] text-gray-400">{value}%</span>

                  <div className="flex h-full w-full items-end justify-center">
                    <div
                      className="w-full max-w-12 bg-[#DFF500] transition-all duration-500"
                      style={{ height: `${value}%` }}
                    />
                  </div>

                  <span className="text-[10px] text-gray-500">
                    {selectedReport.labels[index]}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#DFF500]" />
                Attendance percentage
              </span>

              <span>
                {selectedReport.completed} completed sessions
              </span>

              <span>
                {selectedReport.cancelled} cancelled sessions
              </span>
            </div>
          </section>

          <section className="mb-14">
            <div className="mb-7">
              <p className="mb-2 text-xs tracking-widest text-[#DFF500]">
                FITNESS PERFORMANCE
              </p>
              <h2 className="text-2xl font-bold">Member Progress Reports</h2>
              <p className="mt-2 text-sm text-gray-500">
                Overview of member fitness goals and weight progress.
              </p>
            </div>

            <div className="mb-6 flex items-center gap-3 border-b border-white/20 px-2 py-3 sm:w-80">
              <FaUsers className="text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members or goals..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs tracking-widest text-gray-500">
                    <th className="px-4 py-4">MEMBER</th>
                    <th className="px-4 py-4">FITNESS GOAL</th>
                    <th className="px-4 py-4">STARTING WEIGHT</th>
                    <th className="px-4 py-4">CURRENT WEIGHT</th>
                    <th className="px-4 py-4">PROGRESS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-white/10"
                    >
                      <td className="px-4 py-5 font-semibold">
                        {member.name}
                      </td>

                      <td className="px-4 py-5 text-sm text-gray-400">
                        {member.goal}
                      </td>

                      <td className="px-4 py-5 text-sm text-gray-400">
                        {member.startingWeight} kg
                      </td>

                      <td className="px-4 py-5 text-sm text-gray-400">
                        {member.currentWeight} kg
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-24 bg-white/10">
                            <div
                              className="h-full bg-[#DFF500]"
                              style={{ width: `${member.progress}%` }}
                            />
                          </div>

                          <span className="text-xs text-[#DFF500]">
                            {member.progress}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredMembers.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-500">
                  No member reports found.
                </p>
              )}
            </div>
          </section>

          <section className="mb-14 grid gap-12 xl:grid-cols-2">
            <div>
              <p className="mb-2 text-xs tracking-widest text-[#DFF500]">
                WORKOUT ANALYSIS
              </p>

              <h2 className="mb-8 text-2xl font-bold">
                Popular Workout Categories
              </h2>

              <div className="space-y-7">
                {workoutStats.map((workout) => (
                  <div key={workout.name}>
                    <div className="mb-3 flex justify-between gap-3 text-sm">
                      <span>{workout.name}</span>
                      <span className="text-gray-500">
                        {workout.count} plans
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-white/10">
                      <div
                        className="h-full bg-[#DFF500]"
                        style={{ width: `${workout.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs tracking-widest text-[#DFF500]">
                TRAINER PERFORMANCE
              </p>

              <h2 className="mb-8 text-2xl font-bold">
                Trainer Overview
              </h2>

              <div className="space-y-5">
                {trainerReports.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="border-b border-white/10 pb-5"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{trainer.name}</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {trainer.completed} of {trainer.sessions} sessions
                          completed
                        </p>
                      </div>

                      <span className="text-lg font-bold text-[#DFF500]">
                        {trainer.attendance}%
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-white/10">
                      <div
                        className="h-full bg-[#DFF500]"
                        style={{ width: `${trainer.attendance}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="border-t border-white/10 py-6 text-center text-xs text-gray-600">
            E/FIT ADMINISTRATION · REPORTS & ANALYTICS
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminReports;
