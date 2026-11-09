import React, { useState } from "react";
import Header from "../components/UserHeader";
import {
  FaFire,
  FaDrumstickBite,
  FaBreadSlice,
  FaAppleAlt,
  FaClock,
  FaCheck,
  FaUtensils
} from "react-icons/fa";
import { FiTarget, FiTrendingUp } from "react-icons/fi";

function DietPlans() {
  const [selectedDay, setSelectedDay] = useState("Today");

  const nutrition = {
    calories: 2200,
    consumed: 1450,
    protein: 150,
    proteinConsumed: 105,
    carbs: 250,
    carbsConsumed: 165,
    fats: 70,
    fatsConsumed: 48
  };

  const meals = [
    {
      time: "08:00 AM",
      name: "Breakfast",
      food: "Oatmeal, 2 boiled eggs, banana",
      calories: 450,
      protein: "25g",
      status: "Completed",
      icon: <FaAppleAlt />
    },
    {
      time: "11:00 AM",
      name: "Morning Snack",
      food: "Almonds and Greek yogurt",
      calories: 200,
      protein: "15g",
      status: "Completed",
      icon: <FaUtensils />
    },
    {
      time: "01:30 PM",
      name: "Lunch",
      food: "Rice, grilled chicken, vegetables",
      calories: 550,
      protein: "40g",
      status: "Completed",
      icon: <FaDrumstickBite />
    },
    {
      time: "05:00 PM",
      name: "Evening Snack",
      food: "Peanut butter toast and fruit",
      calories: 250,
      protein: "12g",
      status: "Upcoming",
      icon: <FaBreadSlice />
    },
    {
      time: "08:30 PM",
      name: "Dinner",
      food: "Chapati, paneer, vegetable curry",
      calories: 550,
      protein: "35g",
      status: "Upcoming",
      icon: <FaUtensils />
    }
  ];

  const caloriePercentage = Math.min(
    (nutrition.consumed / nutrition.calories) * 100,
    100
  );

  const macroData = [
    {
      name: "Protein",
      consumed: nutrition.proteinConsumed,
      target: nutrition.protein,
      icon: <FaDrumstickBite />,
      color: "#DFF500",
      unit: "g"
    },
    {
      name: "Carbs",
      consumed: nutrition.carbsConsumed,
      target: nutrition.carbs,
      icon: <FaBreadSlice />,
      color: "#E5A94D",
      unit: "g"
    },
    {
      name: "Fats",
      consumed: nutrition.fatsConsumed,
      target: nutrition.fats,
      icon: <FaAppleAlt />,
      color: "#8B9DFF",
      unit: "g"
    }
  ];

  return (
    <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">
      <Header />

      <main className="px-5 md:px-10 lg:px-14 py-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <p className="text-[#DFF500] text-[10px] tracking-[3px] uppercase mb-4">
              Nutrition management
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Diet Plans<span className="text-[#DFF500]">.</span>
            </h1>
            <p className="text-sm text-gray-500 mt-3">
              Fuel your body. Support your training. Reach your goals.
            </p>
          </div>

          <div className="bg-[#171916] border border-white/5 rounded-xl px-5 py-3">
            <p className="text-[10px] text-gray-500 tracking-widest">YOUR NUTRITION PLAN</p>
            <p className="text-sm mt-2 font-medium">Muscle Building Plan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

          <section className="lg:col-span-7 bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-9">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] tracking-[2px] text-gray-500 mb-3">
                  DAILY CALORIE INTAKE
                </p>
                <h2 className="text-3xl font-semibold">Calorie Overview</h2>
              </div>
              <FaFire className="text-[#DFF500] text-2xl" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 mt-9">
              <div className="relative w-48 h-48 shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  <circle
                    cx="100"
                    cy="100"
                    r="82"
                    fill="none"
                    stroke="#292C25"
                    strokeWidth="13"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="82"
                    fill="none"
                    stroke="#DFF500"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 82}`}
                    strokeDashoffset={`${2 * Math.PI * 82 * (1 - caloriePercentage / 100)}`}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{nutrition.consumed}</span>
                  <span className="text-[10px] text-gray-500 mt-1">KCAL CONSUMED</span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-5">
                <div>
                  <p className="text-xs text-gray-500">Daily calorie target</p>
                  <h3 className="text-2xl font-semibold mt-1">
                    {nutrition.calories.toLocaleString()} <span className="text-sm text-gray-500">kcal</span>
                  </h3>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <p className="text-xs text-gray-500">Remaining calories</p>
                  <h3 className="text-2xl font-semibold text-[#DFF500] mt-1">
                    {nutrition.calories - nutrition.consumed} <span className="text-sm text-gray-500">kcal</span>
                  </h3>
                </div>

                <p className="text-xs text-gray-500">
                  {Math.round(caloriePercentage)}% of your daily target completed.
                </p>
              </div>
            </div>
          </section>

          <section className="lg:col-span-5 bg-[#DFF500] text-black rounded-[28px] p-7 md:p-9 flex flex-col justify-between">
            <div>
              <FiTarget className="text-3xl mb-7" />
              <p className="text-[10px] tracking-[2px] font-semibold opacity-60">
                YOUR DAILY GOAL
              </p>
              <h2 className="text-3xl font-bold mt-3">Eat well. Train hard.</h2>
              <p className="text-sm mt-3 opacity-70 leading-relaxed">
                Consistent nutrition helps support your workout performance and recovery.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-black/15">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Nutrition progress</span>
                <span className="text-sm font-bold">{Math.round(caloriePercentage)}%</span>
              </div>
              <div className="h-2 bg-black/15 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-black rounded-full"
                  style={{ width: `${caloriePercentage}%` }}
                />
              </div>
            </div>
          </section>

        </div>

        <section className="bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8 mb-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                MACRONUTRIENTS
              </p>
              <h2 className="text-xl font-semibold">Nutrition Breakdown</h2>
            </div>
            <FiTrendingUp className="text-[#DFF500] text-2xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {macroData.map((macro) => (
              <div key={macro.name}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl" style={{ color: macro.color }}>
                      {macro.icon}
                    </span>
                    <span className="text-sm font-medium">{macro.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {macro.consumed}/{macro.target}{macro.unit}
                  </span>
                </div>

                <div className="h-2 bg-[#292C25] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((macro.consumed / macro.target) * 100, 100)}%`,
                      backgroundColor: macro.color
                    }}
                  />
                </div>

                <p className="text-[10px] text-gray-500 mt-3">
                  {macro.target - macro.consumed}{macro.unit} remaining
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
            <div>
              <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                DAILY MEAL SCHEDULE
              </p>
              <h2 className="text-xl font-semibold">Today's Meals</h2>
            </div>

            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="bg-[#22241F] text-xs text-[#DFF500] border border-white/10 rounded-xl px-4 py-3 outline-none"
            >
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
            </select>
          </div>

          <div className="space-y-3">
            {meals.map((meal, index) => (
              <div
                key={index}
                className="bg-[#22241F] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#DFF500]/10 text-[#DFF500] flex items-center justify-center text-xl shrink-0">
                    {meal.icon}
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">{meal.time}</p>
                    <h3 className="text-sm font-semibold">{meal.name}</h3>
                    <p className="text-xs text-gray-400 mt-2">{meal.food}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div>
                    <p className="text-sm font-semibold">{meal.calories} kcal</p>
                    <p className="text-[10px] text-gray-500 mt-1">{meal.protein} protein</p>
                  </div>

                  <span className={`text-[10px] px-3 py-2 rounded-full ${
                    meal.status === "Completed"
                      ? "bg-[#DFF500]/10 text-[#DFF500]"
                      : "bg-white/5 text-gray-400"
                  }`}>
                    {meal.status === "Completed" ? "COMPLETED" : "UPCOMING"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 flex items-center gap-3 bg-[#171916] border border-white/5 rounded-2xl p-5">
          <FaCheck className="text-[#DFF500] text-xl shrink-0" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Your diet plan is assigned by your trainer. Follow the recommended meal schedule and update your food intake regularly.
          </p>
        </div>

      </main>
    </div>
  );
}

export default DietPlans;