import React, { useState } from "react";
import Header from "../components/UserHeader";
import {
  FaWeight,
  FaDumbbell,
  FaFire,
  FaRunning,
  FaTrophy,
  FaArrowUp,
  FaCalendarAlt
} from "react-icons/fa";
import { FiTrendingUp, FiActivity, FiTarget } from "react-icons/fi";

function ProgressHistory() {
  const [selectedPeriod, setSelectedPeriod] = useState("6 Months");

  const weightData = [
    { month: "May", weight: 72 },
    { month: "Jun", weight: 71 },
    { month: "Jul", weight: 70 },
    { month: "Aug", weight: 69 },
    { month: "Sep", weight: 68 },
    { month: "Oct", weight: 67 }
  ];

  const strengthData = [
    { exercise: "Bench Press", previous: 35, current: 50 },
    { exercise: "Squats", previous: 45, current: 65 },
    { exercise: "Deadlift", previous: 50, current: 80 },
    { exercise: "Shoulder Press", previous: 15, current: 25 }
  ];

  const progressRecords = [
    {
      date: "30 October 2026",
      title: "Weight Progress",
      description: "Reached 67 kg body weight",
      category: "Body Weight",
      value: "-1 kg"
    },
    {
      date: "24 October 2026",
      title: "Strength Improvement",
      description: "Bench press improved to 50 kg",
      category: "Strength",
      value: "+5 kg"
    },
    {
      date: "15 October 2026",
      title: "Workout Milestone",
      description: "Completed 20 workout sessions",
      category: "Consistency",
      value: "20 Sessions"
    },
    {
      date: "05 October 2026",
      title: "Fitness Achievement",
      description: "Completed 5 km running session",
      category: "Endurance",
      value: "5 KM"
    }
  ];

  const milestones = [
    {
      title: "First 10 Workouts",
      date: "August 2026",
      description: "Completed your first 10 training sessions",
      icon: <FaDumbbell />
    },
    {
      title: "Strength Builder",
      date: "September 2026",
      description: "Reached 50 kg bench press",
      icon: <FaTrophy />
    },
    {
      title: "Consistency Champion",
      date: "October 2026",
      description: "Completed 20 workout sessions",
      icon: <FaFire />
    }
  ];

  const displayedWeightData =
    selectedPeriod === "3 Months"
      ? weightData.slice(-3)
      : weightData;

  const minWeight = Math.min(...displayedWeightData.map(item => item.weight));
  const maxWeight = Math.max(...displayedWeightData.map(item => item.weight));
  const weightDifference = displayedWeightData[0].weight - displayedWeightData[displayedWeightData.length - 1].weight;

  const chartPoints = displayedWeightData.map((item, index) => {
    const x = 40 + index * (320 / Math.max(displayedWeightData.length - 1, 1));
    const y = 35 + ((maxWeight === minWeight ? 0.5 : (maxWeight - item.weight) / (maxWeight - minWeight)) * 140);
    return { ...item, x, y };
  });

  const chartLine = chartPoints.map(point => `${point.x},${point.y}`).join(" ");

  return (
    <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">
      <Header />

      <main className="px-5 md:px-10 lg:px-14 py-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <p className="text-[#DFF500] text-[10px] tracking-[3px] uppercase mb-4">
              Fitness analytics
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Progress History<span className="text-[#DFF500]">.</span>
            </h1>
            <p className="text-sm text-gray-500 mt-3">
              Every improvement tells a story. Track how far you've come.
            </p>
          </div>

          <div className="bg-[#171916] border border-white/5 rounded-xl px-5 py-3">
            <p className="text-[10px] text-gray-500 tracking-widest">TRACKING PERIOD</p>
            <p className="text-sm mt-2 font-medium">May – October 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">

          <div className="bg-[#DFF500] text-black rounded-[24px] p-6">
            <FaWeight className="text-xl mb-5" />
            <h2 className="text-4xl font-bold">67 kg</h2>
            <p className="text-xs mt-2 opacity-70">Current Weight</p>
            <p className="text-[10px] mt-4 font-semibold">↓ 5 kg since May</p>
          </div>

          <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
            <FaDumbbell className="text-[#DFF500] text-xl mb-5" />
            <h2 className="text-4xl font-semibold">80 kg</h2>
            <p className="text-xs text-gray-500 mt-2">Best Deadlift</p>
            <p className="text-[10px] text-[#DFF500] mt-4">+30 kg improvement</p>
          </div>

          <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
            <FaFire className="text-[#DFF500] text-xl mb-5" />
            <h2 className="text-4xl font-semibold">20</h2>
            <p className="text-xs text-gray-500 mt-2">Workout Sessions</p>
            <p className="text-[10px] text-[#DFF500] mt-4">This month</p>
          </div>

          <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
            <FaRunning className="text-[#DFF500] text-xl mb-5" />
            <h2 className="text-4xl font-semibold">5 KM</h2>
            <p className="text-xs text-gray-500 mt-2">Best Running Distance</p>
            <p className="text-[10px] text-[#DFF500] mt-4">Endurance milestone</p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

          <section className="lg:col-span-7 bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
              <div>
                <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                  BODY COMPOSITION
                </p>
                <h2 className="text-xl font-semibold">Weight Progress</h2>
              </div>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-[#22241F] text-xs text-[#DFF500] border border-white/10 rounded-xl px-4 py-3 outline-none"
              >
                <option value="6 Months">Last 6 Months</option>
                <option value="3 Months">Last 3 Months</option>
              </select>
            </div>

            <div className="flex items-end gap-3 mb-7">
              <h3 className="text-4xl font-semibold">
                {displayedWeightData[displayedWeightData.length - 1].weight} kg
              </h3>
              <span className="text-xs text-[#DFF500] mb-2 flex items-center gap-1">
                <FaArrowUp className="rotate-180" />
                {Math.abs(weightDifference)} kg change
              </span>
            </div>

            <div className="w-full">
              <svg viewBox="0 0 400 220" className="w-full overflow-visible">
                {[45, 90, 135, 180].map((y) => (
                  <line
                    key={y}
                    x1="30"
                    y1={y}
                    x2="370"
                    y2={y}
                    stroke="#34372F"
                    strokeDasharray="4 5"
                  />
                ))}

                <polyline
                  points={chartLine}
                  fill="none"
                  stroke="#DFF500"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {chartPoints.map((point) => (
                  <g key={point.month}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="#DFF500"
                    />
                    <text
                      x={point.x}
                      y={point.y - 14}
                      fill="#EDEEE8"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {point.weight}
                    </text>
                    <text
                      x={point.x}
                      y="210"
                      fill="#777"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {point.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <p className="text-[10px] text-gray-500 mt-3">
              Weight measurements in kilograms
            </p>

          </section>

          <section className="lg:col-span-5 bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8">

            <div className="mb-8">
              <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                PERFORMANCE ANALYSIS
              </p>
              <h2 className="text-xl font-semibold">Strength Progress</h2>
            </div>

            <div className="space-y-7">
              {strengthData.map((item) => (
                <div key={item.exercise}>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-medium">{item.exercise}</p>
                    <p className="text-xs text-[#DFF500]">{item.current} kg</p>
                  </div>

                  <div className="h-2 bg-[#292C25] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#DFF500] rounded-full"
                      style={{ width: `${(item.current / 100) * 100}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-gray-500 mt-2">
                    Previous: {item.previous} kg
                    <span className="text-[#DFF500] ml-3">
                      +{item.current - item.previous} kg
                    </span>
                  </p>
                </div>
              ))}
            </div>

          </section>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <section className="lg:col-span-7 bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8">

            <div className="mb-8">
              <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                RECENT ACTIVITY
              </p>
              <h2 className="text-xl font-semibold">Progress Records</h2>
            </div>

            <div className="space-y-4">
              {progressRecords.map((record, index) => (
                <div
                  key={index}
                  className="bg-[#22241F] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-[10px] text-gray-500 mb-2">{record.date}</p>
                    <h3 className="text-sm font-semibold">{record.title}</h3>
                    <p className="text-xs text-gray-400 mt-2">{record.description}</p>
                    <p className="text-[10px] text-[#DFF500] mt-3">{record.category}</p>
                  </div>

                  <span className="text-sm font-semibold whitespace-nowrap">
                    {record.value}
                  </span>
                </div>
              ))}
            </div>

          </section>

          <section className="lg:col-span-5 bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8">

            <div className="mb-8">
              <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                YOUR ACHIEVEMENTS
              </p>
              <h2 className="text-xl font-semibold">Fitness Milestones</h2>
            </div>

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#DFF500]/10 text-[#DFF500] flex items-center justify-center text-xl shrink-0">
                    {milestone.icon}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">{milestone.title}</h3>
                    <p className="text-[10px] text-[#DFF500] mt-1">{milestone.date}</p>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-[#22241F]">
              <FiTarget className="text-[#DFF500] text-2xl mb-3" />
              <h3 className="text-sm font-semibold">Keep pushing forward</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Small improvements every day lead to remarkable results over time.
              </p>
            </div>

          </section>

        </div>

        <div className="mt-6 bg-[#DFF500] text-black rounded-[28px] p-7 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <p className="text-[10px] tracking-[2px] font-semibold mb-2">
              YOUR FITNESS JOURNEY
            </p>
            <h2 className="text-2xl font-bold">Progress, not perfection.</h2>
            <p className="text-xs mt-2 opacity-70">
              Stay consistent. Your future self will thank you.
            </p>
          </div>
          <FiActivity className="text-4xl opacity-30" />
        </div>

      </main>
    </div>
  );
}

export default ProgressHistory;