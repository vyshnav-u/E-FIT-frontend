
import React, { useState, useEffect } from "react";
import Header from "../components/UserHeader";

import {
    FaWeight,
    FaDumbbell,
    FaFire,
    FaTrophy,
    FaArrowUp,
    FaCalendarAlt
} from "react-icons/fa";

import { FiActivity, FiTarget } from "react-icons/fi";

import {
    getWeightAPI,
    getWorkoutHistoryAPI
} from "../services/authservice";

function ProgressHistory() {
    const [selectedPeriod, setSelectedPeriod] = useState("All Time");
    const [weightLogs, setWeightLogs] = useState([]);
    const [workoutLogs, setWorkoutLogs] = useState([]);
    const [weightGoal, setWeightGoal] = useState(null);
    const [profileWeight, setProfileWeight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProgress = async () => {
            const token = localStorage.getItem("token");

            try {
                const [weightResponse, workoutResponse] = await Promise.all([
                    getWeightAPI(token),
                    getWorkoutHistoryAPI(token)
                ]);

                setWeightLogs(weightResponse.data.logs || []);
                setWeightGoal(weightResponse.data.weightGoal || null);
                setProfileWeight(weightResponse.data.currentWeight || null);
                setWorkoutLogs(workoutResponse.data.logs || []);
            } catch (error) {
                console.log(error);
                setError(
                    error.response?.data?.message ||
                    "Unable to load progress history."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    const getLogDate = (log) => {
        return log.recordedAt || log.dateKey || log.createdAt;
    };

    const parseDate = (dateValue) => {
        if (!dateValue) return null;

        if (
            typeof dateValue === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
        ) {
            const [year, month, day] = dateValue.split("-").map(Number);
            return new Date(year, month - 1, day);
        }

        const date = new Date(dateValue);

        return Number.isNaN(date.getTime()) ? null : date;
    };

    const formatDate = (dateValue) => {
        const date = parseDate(dateValue);

        if (!date) return "--";

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };

    const formatShortDate = (dateValue) => {
        const date = parseDate(dateValue);

        if (!date) return "--";

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short"
        });
    };

    const sortedWeightLogs = [...weightLogs].sort(
        (a, b) => {
            return (
                (parseDate(getLogDate(a))?.getTime() || 0) -
                (parseDate(getLogDate(b))?.getTime() || 0)
            );
        }
    );

    const currentWeight =
        sortedWeightLogs.length > 0
            ? sortedWeightLogs[sortedWeightLogs.length - 1].weight
            : profileWeight;

    const completedLogs = workoutLogs.filter(
        (log) => log.status === "Completed"
    );

    const inProgressLogs = workoutLogs.filter(
        (log) => log.status === "In Progress"
    );

    const completedLogsAsc = [...completedLogs].sort(
        (a, b) => {
            return (
                (parseDate(getLogDate(a))?.getTime() || 0) -
                (parseDate(getLogDate(b))?.getTime() || 0)
            );
        }
    );

    const now = new Date();

    const monthsToShow =
        selectedPeriod === "3 Months" ? 3 : 6;

    const periodStart = new Date(
        now.getFullYear(),
        now.getMonth() - monthsToShow + 1,
        1
    );

    const displayedWeightData = sortedWeightLogs
        .map((log, index) => {
            const previousWeight =
                index > 0 ? sortedWeightLogs[index - 1].weight : null;

            return {
                ...log,
                date: getLogDate(log),
                previousWeight,
                change:
                    previousWeight !== null
                        ? log.weight - previousWeight
                        : null
            };
        })
        .filter((log) => {
            if (selectedPeriod === "All Time") return true;

            const date = parseDate(log.date);

            return date && date >= periodStart && date <= now;
        });

    const firstWeight =
        displayedWeightData.length > 0
            ? displayedWeightData[0].weight
            : null;

    const latestPeriodWeight =
        displayedWeightData.length > 0
            ? displayedWeightData[displayedWeightData.length - 1].weight
            : null;

    const weightDifference =
        firstWeight !== null && latestPeriodWeight !== null
            ? latestPeriodWeight - firstWeight
            : null;

    const chartWeights = displayedWeightData.map(
        (item) => item.weight
    );

    const minWeight =
        chartWeights.length > 0
            ? Math.min(...chartWeights)
            : 0;

    const maxWeight =
        chartWeights.length > 0
            ? Math.max(...chartWeights)
            : 0;

    const chartWidth = Math.max(
        400,
        80 + (displayedWeightData.length - 1) * 65
    );

    const chartPoints = displayedWeightData.map((item, index) => {
        const x =
            displayedWeightData.length === 1
                ? 200
                : 40 + index * 65;

        const y =
            maxWeight === minWeight
                ? 105
                : 35 +
                  ((maxWeight - item.weight) /
                      (maxWeight - minWeight)) *
                      130;

        return {
            ...item,
            x,
            y
        };
    });

    const chartLine = chartPoints
        .map((point) => `${point.x},${point.y}`)
        .join(" ");

    const progressRecords = [
        ...sortedWeightLogs.map((log, index) => ({
            id: `weight-${log._id || index}`,
            date: getLogDate(log),
            title: "Weight Recorded",
            description: `Recorded body weight: ${log.weight} kg`,
            category: "Body Weight",
            value: `${log.weight} kg`
        })),

        ...workoutLogs.map((log, index) => ({
            id: `workout-${log._id || index}`,
            date: getLogDate(log),
            title:
                log.status === "Completed"
                    ? "Workout Completed"
                    : "Workout In Progress",
            description:
                log.dayTitle || `Workout Day ${log.dayNumber}`,
            category: "Workout Activity",
            value: log.status
        }))
    ].sort(
        (a, b) =>
            (parseDate(b.date)?.getTime() || 0) -
            (parseDate(a.date)?.getTime() || 0)
    );

    const milestones = [
        {
            count: 1,
            title: "First Workout",
            description: "Completed your first workout session"
        },
        {
            count: 10,
            title: "Consistency Builder",
            description: "Completed 10 workout sessions"
        },
        {
            count: 20,
            title: "Consistency Champion",
            description: "Completed 20 workout sessions"
        },
        {
            count: 50,
            title: "Fitness Dedication",
            description: "Completed 50 workout sessions"
        }
    ].filter(
        (milestone) => completedLogs.length >= milestone.count
    );

    const latestWorkout = [...workoutLogs].sort(
        (a, b) =>
            (parseDate(getLogDate(b))?.getTime() || 0) -
            (parseDate(getLogDate(a))?.getTime() || 0)
    )[0];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">
                <Header />
                <div className="flex justify-center items-center min-h-[70vh]">
                    <p className="text-[#DFF500] text-sm">
                        Loading your progress...
                    </p>
                </div>
            </div>
        );
    }

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
                        <p className="text-[10px] text-gray-500 tracking-widest">
                            TRACKING PERIOD
                        </p>

                        <p className="text-sm mt-2 font-medium">
                            {selectedPeriod === "All Time"
                                ? "All recorded data"
                                : `Last ${selectedPeriod === "3 Months" ? "3" : "6"} Months`}
                        </p>
                    </div>
                </div>

                {error && (
                    <p className="text-red-400 text-sm mb-6">{error}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">

                    <div className="bg-[#DFF500] text-black rounded-[24px] p-6">
                        <FaWeight className="text-xl mb-5" />

                        <h2 className="text-4xl font-bold">
                            {currentWeight !== null ? `${currentWeight} kg` : "--"}
                        </h2>

                        <p className="text-xs mt-2 opacity-70">
                            Current Weight
                        </p>

                        <p className="text-[10px] mt-4 font-semibold">
                            {weightLogs.length} weight records
                        </p>
                    </div>

                    <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
                        <FiTarget className="text-[#DFF500] text-xl mb-5" />

                        <h2 className="text-4xl font-semibold">
                            {weightGoal ? `${weightGoal} kg` : "--"}
                        </h2>

                        <p className="text-xs text-gray-500 mt-2">
                            Target Weight
                        </p>

                        <p className="text-[10px] text-[#DFF500] mt-4">
                            {weightGoal && currentWeight !== null
                                ? `${Math.abs(currentWeight - weightGoal).toFixed(1)} kg to target`
                                : "Set a weight goal"}
                        </p>
                    </div>

                    <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
                        <FaDumbbell className="text-[#DFF500] text-xl mb-5" />

                        <h2 className="text-4xl font-semibold">
                            {completedLogs.length}
                        </h2>

                        <p className="text-xs text-gray-500 mt-2">
                            Completed Workouts
                        </p>

                        <p className="text-[10px] text-[#DFF500] mt-4">
                            {inProgressLogs.length} in progress
                        </p>
                    </div>

                    <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
                        <FaFire className="text-[#DFF500] text-xl mb-5" />

                        <h2 className="text-4xl font-semibold">
                            {weightDifference === null
                                ? "--"
                                : `${weightDifference > 0 ? "+" : ""}${weightDifference.toFixed(1)} kg`}
                        </h2>

                        <p className="text-xs text-gray-500 mt-2">
                            Weight Change
                        </p>

                        <p className="text-[10px] text-[#DFF500] mt-4">
                            {selectedPeriod}
                        </p>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

                    <section className="lg:col-span-7 bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8">

                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                            <div>
                                <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                    BODY COMPOSITION
                                </p>

                                <h2 className="text-xl font-semibold">
                                    Weight Progress
                                </h2>
                            </div>

                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="bg-[#22241F] text-xs text-[#DFF500] border border-white/10 rounded-xl px-4 py-3 outline-none"
                            >
                                <option value="All Time">All Records</option>
                                <option value="6 Months">Last 6 Months</option>
                                <option value="3 Months">Last 3 Months</option>
                            </select>
                        </div>

                        {displayedWeightData.length > 0 ? (
                            <>
                                <div className="flex items-end gap-3 mb-7">
                                    <h3 className="text-4xl font-semibold">
                                        {latestPeriodWeight} kg
                                    </h3>

                                    {weightDifference !== null && (
                                        <span className="text-xs text-[#DFF500] mb-2 flex items-center gap-1">
                                            <FaArrowUp className={
                                                weightDifference < 0 ? "rotate-180" : ""
                                            } />

                                            {Math.abs(weightDifference).toFixed(1)} kg change
                                        </span>
                                    )}
                                </div>

                                <div className="w-full overflow-x-auto">
                                    <svg
                                        viewBox={`0 0 ${chartWidth} 230`}
                                        width={chartWidth}
                                        height="230"
                                        className="max-w-none"
                                    >
                                        {[45, 90, 135, 180].map((y) => (
                                            <line
                                                key={y}
                                                x1="30"
                                                y1={y}
                                                x2={chartWidth - 20}
                                                y2={y}
                                                stroke="#34372F"
                                                strokeDasharray="4 5"
                                            />
                                        ))}

                                        {chartPoints.length > 1 && (
                                            <polyline
                                                points={chartLine}
                                                fill="none"
                                                stroke="#DFF500"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        )}

                                        {chartPoints.map((point, index) => (
                                            <g key={`${point._id || "weight"}-${index}`}>
                                                <circle
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="5"
                                                    fill="#DFF500"
                                                />

                                                <text
                                                    x={point.x}
                                                    y={point.y - 13}
                                                    fill="#EDEEE8"
                                                    fontSize="10"
                                                    textAnchor="middle"
                                                >
                                                    {point.weight}
                                                </text>

                                                <text
                                                    x={point.x}
                                                    y="210"
                                                    fill="#999"
                                                    fontSize="10"
                                                    textAnchor="middle"
                                                >
                                                    {formatShortDate(point.date)}
                                                </text>
                                            </g>
                                        ))}
                                    </svg>
                                </div>

                                <p className="text-[10px] text-gray-500 mt-3">
                                    Every recorded weight is shown in kilograms. Scroll horizontally to view older entries.
                                </p>
                            </>
                        ) : (
                            <div className="py-16 text-center">
                                <FaWeight className="text-3xl text-gray-600 mx-auto mb-4" />

                                <p className="text-sm text-gray-400">
                                    No weight records for this period.
                                </p>

                                <p className="text-xs text-gray-600 mt-2">
                                    Record your weight to start tracking your progress.
                                </p>
                            </div>
                        )}

                    </section>

                    <section className="lg:col-span-5 bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8">

                        <div className="mb-8">
                            <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                WORKOUT ANALYSIS
                            </p>

                            <h2 className="text-xl font-semibold">
                                Workout Activity
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-7">
                            <div className="bg-[#22241F] rounded-2xl p-5">
                                <FaDumbbell className="text-[#DFF500] mb-4" />

                                <h3 className="text-3xl font-semibold">
                                    {completedLogs.length}
                                </h3>

                                <p className="text-xs text-gray-500 mt-2">
                                    Completed
                                </p>
                            </div>

                            <div className="bg-[#22241F] rounded-2xl p-5">
                                <FiActivity className="text-[#DFF500] mb-4" />

                                <h3 className="text-3xl font-semibold">
                                    {inProgressLogs.length}
                                </h3>

                                <p className="text-xs text-gray-500 mt-2">
                                    In Progress
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-6">
                            <p className="text-[10px] tracking-[2px] text-gray-500 mb-5">
                                LATEST WORKOUT
                            </p>

                            {latestWorkout ? (
                                <div>
                                    <h3 className="text-sm font-semibold">
                                        {latestWorkout.dayTitle ||
                                            `Workout Day ${latestWorkout.dayNumber}`}
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-2">
                                        {formatDate(getLogDate(latestWorkout))}
                                    </p>

                                    <span className={`inline-block mt-4 px-3 py-2 rounded-lg text-[10px] ${
                                        latestWorkout.status === "Completed"
                                            ? "bg-[#DFF500]/10 text-[#DFF500]"
                                            : "bg-white/5 text-gray-400"
                                    }`}>
                                        {latestWorkout.status}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500">
                                    No workout activity recorded yet.
                                </p>
                            )}
                        </div>

                    </section>

                </div>

                <section className="bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8 mb-6">

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
                        <div>
                            <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                COMPLETE WEIGHT LOG
                            </p>

                            <h2 className="text-xl font-semibold">
                                Every Weight Change
                            </h2>

                            <p className="text-xs text-gray-500 mt-2">
                                All your recorded measurements, from the first entry to the latest.
                            </p>
                        </div>

                        <span className="text-xs text-[#DFF500]">
                            {sortedWeightLogs.length} total records
                        </span>
                    </div>

                    {sortedWeightLogs.length > 0 ? (
                        <div className="space-y-3">
                            {[...sortedWeightLogs].reverse().map((log, index) => {
                                const originalIndex =
                                    sortedWeightLogs.length - 1 - index;

                                const previousWeight =
                                    originalIndex > 0
                                        ? sortedWeightLogs[originalIndex - 1].weight
                                        : null;

                                const change =
                                    previousWeight !== null
                                        ? log.weight - previousWeight
                                        : null;

                                return (
                                    <div
                                        key={log._id || `${getLogDate(log)}-${index}`}
                                        className="bg-[#22241F] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                    >
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(getLogDate(log))}
                                            </p>

                                            <h3 className="text-lg font-semibold mt-2">
                                                {log.weight} kg
                                            </h3>

                                            <p className="text-[10px] text-gray-500 mt-1">
                                                {index === sortedWeightLogs.length - 1
                                                    ? "Latest recorded weight"
                                                    : "Weight measurement"}
                                            </p>
                                        </div>

                                        <div className="sm:text-right">
                                            {change === null ? (
                                                <span className="text-xs text-gray-500">
                                                    First record
                                                </span>
                                            ) : (
                                                <>
                                                    <p className={`text-sm font-semibold ${
                                                        change < 0
                                                            ? "text-[#DFF500]"
                                                            : change > 0
                                                            ? "text-orange-400"
                                                            : "text-gray-400"
                                                    }`}>
                                                        {change > 0 ? "+" : ""}
                                                        {change.toFixed(1)} kg
                                                    </p>

                                                    <p className="text-[10px] text-gray-500 mt-1">
                                                        Since previous record
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-10">
                            Your weight records will appear here once you start logging your weight.
                        </p>
                    )}

                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <section className="lg:col-span-7 bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8">

                        <div className="mb-8">
                            <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                RECENT ACTIVITY
                            </p>

                            <h2 className="text-xl font-semibold">
                                Progress Records
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {progressRecords.length > 0 ? (
                                progressRecords.slice(0, 6).map((record) => (
                                    <div
                                        key={record.id}
                                        className="bg-[#22241F] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div>
                                            <p className="text-[10px] text-gray-500 mb-2">
                                                {formatDate(record.date)}
                                            </p>

                                            <h3 className="text-sm font-semibold">
                                                {record.title}
                                            </h3>

                                            <p className="text-xs text-gray-400 mt-2">
                                                {record.description}
                                            </p>

                                            <p className="text-[10px] text-[#DFF500] mt-3">
                                                {record.category}
                                            </p>
                                        </div>

                                        <span className="text-sm font-semibold whitespace-nowrap">
                                            {record.value}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 py-8 text-center">
                                    Your progress records will appear here.
                                </p>
                            )}
                        </div>

                    </section>

                    <section className="lg:col-span-5 bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8">

                        <div className="mb-8">
                            <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                YOUR ACHIEVEMENTS
                            </p>

                            <h2 className="text-xl font-semibold">
                                Fitness Milestones
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {milestones.length > 0 ? (
                                milestones.map((milestone) => {
                                    const milestoneLog =
                                        completedLogsAsc[milestone.count - 1];

                                    return (
                                        <div
                                            key={milestone.count}
                                            className="flex gap-4"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-[#DFF500]/10 text-[#DFF500] flex items-center justify-center text-xl shrink-0">
                                                <FaTrophy />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold">
                                                    {milestone.title}
                                                </h3>

                                                <p className="text-[10px] text-[#DFF500] mt-1">
                                                    {formatDate(getLogDate(milestoneLog))}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                                    {milestone.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center">
                                    <FaTrophy className="text-3xl text-gray-600 mx-auto mb-4" />

                                    <p className="text-sm text-gray-400">
                                        Your first milestone is waiting.
                                    </p>

                                    <p className="text-xs text-gray-600 mt-2">
                                        Complete your first workout to unlock it.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 p-5 rounded-2xl bg-[#22241F]">
                            <FiTarget className="text-[#DFF500] text-2xl mb-3" />

                            <h3 className="text-sm font-semibold">
                                Keep pushing forward
                            </h3>

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

                        <h2 className="text-2xl font-bold">
                            Progress, not perfection.
                        </h2>

                        <p className="text-xs mt-2 opacity-70">
                            Stay consistent. Your future self will thank you.
                        </p>
                    </div>

                    <FaCalendarAlt className="text-4xl opacity-30" />
                </div>

            </main>
        </div>
    );
}

export default ProgressHistory;