
import React, { useEffect, useState } from "react";
import Header from "../components/UserHeader";
import {
    FaFire,
    FaDumbbell,
    FaClock,
    FaArrowUp,
    FaArrowRight,
    FaCheck
} from "react-icons/fa";
import { FiTarget, FiCalendar, FiTrendingUp } from "react-icons/fi";

import {
    getProfileAPI,
    getActiveWorkoutAPI,
    getWorkoutHistoryAPI,
    getUserDietAPI,
    getDailyMealLogsAPI,
    getWeightAPI,
    addWeightAPI,
    setWeightGoalAPI
} from "../services/authservice";

const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getWeekStart = () => {
    const today = new Date();
    const day = today.getDay();
    const difference = day === 0 ? 6 : day - 1;

    today.setDate(today.getDate() - difference);
    today.setHours(0, 0, 0, 0);

    return today;
};

const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long"
    }).toUpperCase();
};

const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning,";
    if (hour < 17) return "Good afternoon,";
    return "Good evening,";
};

const formatWeightDate = date => {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
    });
};

function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [workoutLogs, setWorkoutLogs] = useState([]);
    const [dietPlans, setDietPlans] = useState([]);
    const [mealLogs, setMealLogs] = useState([]);

    const [weightLogs, setWeightLogs] = useState([]);
    const [weightGoal, setWeightGoal] = useState("");
    const [weightInput, setWeightInput] = useState("");

    const [weightLoading, setWeightLoading] = useState(false);
    const [weightMessage, setWeightMessage] = useState("");
    const [weightError, setWeightError] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                if (!token) {
                    setError("Please login to view your dashboard.");
                    return;
                }

                const today = getTodayDate();

                const [
                    profileResponse,
                    activeWorkoutResponse,
                    historyResponse,
                    dietResponse,
                    mealLogResponse,
                    weightResponse
                ] = await Promise.all([
                    getProfileAPI(token),
                    getActiveWorkoutAPI(token),
                    getWorkoutHistoryAPI(token),
                    getUserDietAPI(token),
                    getDailyMealLogsAPI(today, token),
                    getWeightAPI(token)
                ]);

                const user =
                    profileResponse.data.user ||
                    profileResponse.data.profile ||
                    profileResponse.data;

                setProfile(user);

                setActiveWorkout(
                    activeWorkoutResponse.data.workout || null
                );

                setWorkoutLogs(
                    historyResponse.data.logs || []
                );

                setDietPlans(
                    dietResponse.data.diets || []
                );

                setMealLogs(
                    mealLogResponse.data.logs || []
                );

                const logs = weightResponse.data.logs || [];

                setWeightLogs(logs);

                setWeightGoal(
                    weightResponse.data.weightGoal != null
                        ? String(weightResponse.data.weightGoal)
                        : ""
                );

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard information."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleAddWeight = async (e) => {
        e.preventDefault();

        const weight = Number(weightInput);

        if (!Number.isFinite(weight) || weight < 1 || weight > 500) {
            setWeightError("Enter a valid weight between 1 and 500 kg.");
            return;
        }

        try {
            setWeightLoading(true);
            setWeightError("");
            setWeightMessage("");

            await addWeightAPI({ weight }, token);

            const response = await getWeightAPI(token);

            setWeightLogs(response.data.logs || []);

            setProfile(prev => ({
                ...prev,
                weight
            }));

            setWeightInput("");
            setWeightMessage("Weight recorded successfully.");
        } catch (error) {
            setWeightError(
                error.response?.data?.message ||
                "Unable to save weight."
            );
        } finally {
            setWeightLoading(false);
        }
    };

    const handleSetWeightGoal = async (e) => {
        e.preventDefault();

        const goal = Number(weightGoal);

        if (!Number.isFinite(goal) || goal < 1 || goal > 500) {
            setWeightError("Enter a valid target weight.");
            return;
        }

        try {
            setWeightLoading(true);
            setWeightError("");
            setWeightMessage("");

            await setWeightGoalAPI(
                { weightGoal: goal },
                token
            );

            setWeightGoal(String(goal));
            setWeightMessage("Weight goal updated successfully.");
        } catch (error) {
            setWeightError(
                error.response?.data?.message ||
                "Unable to update weight goal."
            );
        } finally {
            setWeightLoading(false);
        }
    };

    const userName =
        profile?.username ||
        profile?.name ||
        "Member";

    const firstName = userName.split(" ")[0];

    const completedLogs = workoutLogs.filter(
        log => log.status === "Completed"
    );

    const completedWorkoutCount = completedLogs.length;

    const completedDates = [
        ...new Set(
            completedLogs.map(log => log.dateKey).filter(Boolean)
        )
    ].sort().reverse();

    const today = getTodayDate();

    const completedToday = completedDates.includes(today);

    const streak = (() => {
        if (!completedDates.length) return 0;

        const dateSet = new Set(completedDates);
        const currentDate = new Date();

        if (!dateSet.has(today)) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        let count = 0;

        while (dateSet.has(
            `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`
        )) {
            count++;
            currentDate.setDate(currentDate.getDate() - 1);
        }

        return count;
    })();

    const weekStart = getWeekStart();

    const thisWeekLogs = completedLogs.filter(log => {
        if (!log.dateKey) return false;

        const logDate = new Date(`${log.dateKey}T00:00:00`);

        return logDate >= weekStart && logDate <= new Date();
    });

    const weeklySessions = [
        ...new Set(thisWeekLogs.map(log => log.dateKey))
    ].length;

    const workoutDays = activeWorkout?.days?.filter(
        day => !day.isRestDay
    ) || [];

    const weeklyTarget = workoutDays.length || 0;

    const weeklyPercentage = weeklyTarget
        ? Math.min(
            Math.round((weeklySessions / weeklyTarget) * 100),
            100
        )
        : 0;

    const todayCalories = mealLogs.reduce(
        (total, log) => total + (Number(log.totalCalories) || 0),
        0
    );

    const todayProtein = mealLogs.reduce(
        (total, log) => total + (Number(log.totalProtein) || 0),
        0
    );

    const activeDiet = dietPlans[0] || null;

    const currentWeight =
        weightLogs.length > 0
            ? Number(weightLogs[weightLogs.length - 1].weight)
            : Number(profile?.weight) || null;

    const sortedWeightLogs = [...weightLogs].sort(
        (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
    );

    const firstWeightLog = sortedWeightLogs[0];
    const latestWeightLog = sortedWeightLogs[sortedWeightLogs.length - 1];

    const startingWeight = firstWeightLog
        ? Number(firstWeightLog.weight)
        : currentWeight;

    const targetWeight = Number(weightGoal);

    const validGoal = Number.isFinite(targetWeight) && targetWeight > 0;

    const weightDifference =
        currentWeight !== null && startingWeight !== null
            ? currentWeight - startingWeight
            : 0;

    const weightProgress = (() => {
        if (!validGoal || currentWeight === null || startingWeight === null) {
            return 0;
        }

        if (startingWeight === targetWeight) {
            return currentWeight === targetWeight ? 100 : 0;
        }

        const totalDistance = Math.abs(startingWeight - targetWeight);

        const completedDistance =
            targetWeight < startingWeight
                ? startingWeight - currentWeight
                : currentWeight - startingWeight;

        return Math.max(
            0,
            Math.min(
                100,
                Math.round((completedDistance / totalDistance) * 100)
            )
        );
    })();

    const estimatedDays = (() => {
        if (
            !validGoal ||
            !latestWeightLog ||
            !firstWeightLog ||
            sortedWeightLogs.length < 2
        ) {
            return null;
        }

        const firstDate = new Date(firstWeightLog.recordedAt);
        const lastDate = new Date(latestWeightLog.recordedAt);

        const elapsedDays = Math.floor(
            (lastDate - firstDate) / (1000 * 60 * 60 * 24)
        );

        if (elapsedDays < 7) return null;

        const firstWeight = Number(firstWeightLog.weight);
        const lastWeight = Number(latestWeightLog.weight);

        const dailyRate =
            targetWeight < firstWeight
                ? (firstWeight - lastWeight) / elapsedDays
                : (lastWeight - firstWeight) / elapsedDays;

        if (currentWeight === targetWeight) return 0;

        if (dailyRate <= 0) return null;

        const remainingWeight = Math.abs(currentWeight - targetWeight);

        return Math.ceil(remainingWeight / dailyRate);
    })();

    const weightHistory = sortedWeightLogs.slice(-7);

    const minWeight = weightHistory.length
        ? Math.min(...weightHistory.map(log => Number(log.weight)))
        : 0;

    const maxWeight = weightHistory.length
        ? Math.max(...weightHistory.map(log => Number(log.weight)))
        : 0;

    const getWeightBarHeight = weight => {
        if (maxWeight === minWeight) return 55;

        return 25 + (
            ((Number(weight) - minWeight) / (maxWeight - minWeight)) * 75
        );
    };

    const getDayLog = dayNumber => {
        return workoutLogs.find(
            log =>
                Number(log.dayNumber) === Number(dayNumber) &&
                log.status === "Completed"
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">
                <Header />
                <div className="py-32 text-center text-gray-500 text-sm">
                    Loading your fitness dashboard...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">
                <Header />
                <div className="py-32 text-center">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

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
                            {getGreeting()}<br />
                            <span className="text-[#DFF500]">
                                {firstName}.
                            </span>
                        </h1>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-2">
                            {getFormattedDate()}
                        </p>
                        <p className="text-sm text-gray-300">
                            Let's make today count.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                    <section className="lg:col-span-4 space-y-5">

                        <div className="bg-[#DFF500] text-black rounded-[28px] p-7 min-h-[230px] flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <p className="text-xs uppercase tracking-[2px] font-semibold">
                                    Fitness overview
                                </p>
                                <FaArrowUp />
                            </div>

                            <div>
                                <h2 className="text-6xl font-bold tracking-tighter">
                                    {completedWorkoutCount}
                                </h2>

                                <p className="text-sm mt-1 font-medium">
                                    Workouts completed
                                </p>

                                <div className="mt-6 h-[1px] bg-black/20" />

                                <p className="text-xs mt-4">
                                    Every completed session moves you forward.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
                            <div className="flex justify-between items-center mb-7">
                                <h3 className="text-sm font-medium">
                                    Your activity
                                </h3>

                                <span className="text-[10px] text-gray-500">
                                    THIS WEEK
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <FaFire className="text-[#DFF500] mb-4 text-lg" />
                                    <h3 className="text-3xl font-semibold">
                                        {streak}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Day streak
                                    </p>
                                </div>

                                <div>
                                    <FaClock className="text-[#DFF500] mb-4 text-lg" />
                                    <h3 className="text-3xl font-semibold">
                                        {weeklySessions}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Sessions this week
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-medium">
                                    Weight progress
                                </h3>
                                <FiTrendingUp className="text-[#DFF500] text-xl" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Current weight
                                    </p>
                                    <h3 className="text-3xl font-semibold">
                                        {currentWeight ?? "--"}
                                        <span className="text-xs text-gray-500 ml-1">kg</span>
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        Target weight
                                    </p>
                                    <h3 className="text-3xl font-semibold text-[#DFF500]">
                                        {validGoal ? targetWeight : "--"}
                                        <span className="text-xs text-gray-500 ml-1">kg</span>
                                    </h3>
                                </div>
                            </div>

                            {validGoal && currentWeight !== null ? (
                                <>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-400">
                                            Goal progress
                                        </span>
                                        <span>{weightProgress}%</span>
                                    </div>

                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#DFF500] rounded-full transition-all"
                                            style={{ width: `${weightProgress}%` }}
                                        />
                                    </div>

                                    <p className="text-xs text-gray-500 mt-4">
                                        {weightProgress >= 100
                                            ? "You've reached your target weight."
                                            : estimatedDays !== null
                                                ? `Estimated ${estimatedDays} days remaining based on your recorded trend.`
                                                : "Record weights over at least 7 days to estimate your progress."}
                                    </p>
                                </>
                            ) : (
                                <p className="text-xs text-gray-500">
                                    Set your target weight to start tracking your goal.
                                </p>
                            )}
                        </div>

                        <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-medium">
                                    Record your weight
                                </h3>
                                <FiTarget className="text-[#DFF500] text-xl" />
                            </div>

                            <form onSubmit={handleAddWeight}>
                                <label className="text-xs text-gray-500 block mb-2">
                                    Current weight (kg)
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="500"
                                        value={weightInput}
                                        onChange={e => setWeightInput(e.target.value)}
                                        placeholder="e.g. 70.5"
                                        className="w-full min-w-0 bg-[#22241F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#DFF500]"
                                    />

                                    <button
                                        type="submit"
                                        disabled={weightLoading}
                                        className="bg-[#DFF500] text-black px-5 rounded-xl text-xs font-semibold disabled:opacity-50"
                                    >
                                        {weightLoading ? "..." : "Save"}
                                    </button>
                                </div>
                            </form>

                            <form onSubmit={handleSetWeightGoal} className="mt-6">
                                <label className="text-xs text-gray-500 block mb-2">
                                    Set your target weight (kg)
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="500"
                                        value={weightGoal}
                                        onChange={e => setWeightGoal(e.target.value)}
                                        placeholder="e.g. 68"
                                        className="w-full min-w-0 bg-[#22241F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#DFF500]"
                                    />

                                    <button
                                        type="submit"
                                        disabled={weightLoading}
                                        className="border border-[#DFF500] text-[#DFF500] px-4 rounded-xl text-xs font-semibold disabled:opacity-50"
                                    >
                                        Set goal
                                    </button>
                                </div>
                            </form>

                            {weightError && (
                                <p className="text-xs text-red-400 mt-4">
                                    {weightError}
                                </p>
                            )}

                            {weightMessage && (
                                <p className="text-xs text-[#DFF500] mt-4">
                                    {weightMessage}
                                </p>
                            )}
                        </div>

                        <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-medium">
                                    Weight history
                                </h3>
                                <span className="text-[10px] text-gray-500">
                                    LAST 7 RECORDS
                                </span>
                            </div>

                            {weightHistory.length > 0 ? (
                                <>
                                    <div className="h-32 flex items-end gap-3">
                                        {weightHistory.map((log, index) => (
                                            <div
                                                key={log._id || index}
                                                className="flex-1 flex flex-col items-center justify-end h-full"
                                            >
                                                <span className="text-[9px] text-gray-400 mb-2">
                                                    {Number(log.weight).toFixed(1)}
                                                </span>

                                                <div
                                                    className="w-full max-w-8 bg-[#DFF500] rounded-t-md"
                                                    style={{
                                                        height: `${getWeightBarHeight(log.weight)}%`
                                                    }}
                                                />

                                                <span className="text-[9px] text-gray-500 mt-2">
                                                    {formatWeightDate(log.recordedAt)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="h-[1px] bg-white/10 mt-4 mb-4" />

                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">
                                            Change since first record
                                        </span>

                                        <span className={
                                            weightDifference < 0
                                                ? "text-[#DFF500]"
                                                : weightDifference > 0
                                                    ? "text-orange-400"
                                                    : "text-gray-300"
                                        }>
                                            {weightDifference > 0 ? "+" : ""}
                                            {weightDifference.toFixed(1)} kg
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-xs text-gray-500 py-5">
                                    Your weight history will appear here after your first entry.
                                </p>
                            )}
                        </div>

                    </section>

                    <section className="lg:col-span-5 space-y-5">

                        <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
                            <div className="flex justify-between items-center mb-7">
                                <div>
                                    <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                        YOUR TRAINING
                                    </p>

                                    <h2 className="text-xl font-semibold">
                                        Active Workout
                                    </h2>
                                </div>

                                <FaDumbbell className="text-[#DFF500] text-xl" />
                            </div>

                            {activeWorkout ? (
                                <>
                                    <div className="bg-[#22241F] rounded-2xl p-5">
                                        <p className="text-[10px] tracking-widest text-[#DFF500] mb-3">
                                            CURRENT PLAN
                                        </p>

                                        <h3 className="text-2xl font-semibold">
                                            {activeWorkout.name}
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-2">
                                            {activeWorkout.goal} · {activeWorkout.level}
                                        </p>

                                        <div className="flex gap-6 mt-6">
                                            <div>
                                                <p className="text-xl font-semibold">
                                                    {workoutDays.length}
                                                </p>
                                                <p className="text-[10px] text-gray-500 mt-1">
                                                    Training days
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xl font-semibold">
                                                    {activeWorkout.duration}
                                                </p>
                                                <p className="text-[10px] text-gray-500 mt-1">
                                                    Weeks
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-medium">
                                                Weekly schedule
                                            </h3>
                                            <span className="text-[10px] text-gray-500">
                                                {workoutDays.length} TRAINING DAYS
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {activeWorkout.days?.map(day => {
                                                const completed = getDayLog(day.dayNumber);

                                                return (
                                                    <div
                                                        key={day._id || day.dayNumber}
                                                        className="flex items-center gap-4 bg-[#20221F] rounded-2xl p-4"
                                                    >
                                                        <div className="bg-[#DFF500] text-black rounded-xl w-12 h-12 flex flex-col items-center justify-center shrink-0">
                                                            <span className="text-lg font-bold">
                                                                {String(day.dayNumber).padStart(2, "0")}
                                                            </span>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-medium">
                                                                {day.isRestDay
                                                                    ? "Rest Day"
                                                                    : day.title || "Workout"}
                                                            </h3>

                                                            <p className="text-[10px] text-gray-500 mt-1">
                                                                {day.isRestDay
                                                                    ? "Recovery"
                                                                    : `${day.exercises?.length || 0} exercises`}
                                                            </p>
                                                        </div>

                                                        {day.isRestDay ? (
                                                            <FiCalendar className="text-gray-500" />
                                                        ) : completed ? (
                                                            <FaCheck className="text-[#DFF500]" />
                                                        ) : (
                                                            <FaArrowRight className="text-gray-500 text-xs" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-10 text-center">
                                    <FaDumbbell className="text-[#DFF500] text-3xl mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold">
                                        No active workout
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Activate a workout plan to start tracking your progress.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
                            <div className="flex justify-between items-center mb-7">
                                <div>
                                    <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                        YOUR NUTRITION
                                    </p>
                                    <h2 className="text-xl font-semibold">
                                        Today's Nutrition
                                    </h2>
                                </div>

                                <FaFire className="text-[#DFF500] text-xl" />
                            </div>

                            {activeDiet && (
                                <p className="text-xs text-gray-500 mb-5">
                                    Diet plan: {activeDiet.name}
                                </p>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#22241F] rounded-2xl p-5">
                                    <p className="text-xs text-gray-500">
                                        Calories consumed
                                    </p>

                                    <h3 className="text-3xl font-semibold mt-3">
                                        {Math.round(todayCalories)}
                                    </h3>

                                    <p className="text-[10px] text-gray-500 mt-2">
                                        kcal
                                    </p>
                                </div>

                                <div className="bg-[#22241F] rounded-2xl p-5">
                                    <p className="text-xs text-gray-500">
                                        Protein consumed
                                    </p>

                                    <h3 className="text-3xl font-semibold mt-3">
                                        {Math.round(todayProtein)}
                                    </h3>

                                    <p className="text-[10px] text-gray-500 mt-2">
                                        grams
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mt-5">
                                {mealLogs.length
                                    ? `${mealLogs.length} meal${mealLogs.length === 1 ? "" : "s"} logged today.`
                                    : "No meals logged today yet."}
                            </p>
                        </div>

                    </section>

                    <aside className="lg:col-span-3 space-y-5">

                        <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
                            <p className="text-[10px] tracking-[2px] text-gray-500 mb-5">
                                WEEKLY TARGET
                            </p>

                            <div className="flex items-end gap-2">
                                <h2 className="text-5xl font-semibold">
                                    {String(weeklySessions).padStart(2, "0")}
                                </h2>

                                <p className="text-gray-500 text-sm mb-2">
                                    / {String(weeklyTarget).padStart(2, "0")} sessions
                                </p>
                            </div>

                            <div className="flex gap-2 mt-7">
                                {Array.from(
                                    { length: weeklyTarget || 5 },
                                    (_, index) => (
                                        <div
                                            key={index}
                                            className={`h-2 flex-1 rounded-full ${
                                                index < weeklySessions
                                                    ? "bg-[#DFF500]"
                                                    : "bg-white/10"
                                            }`}
                                        />
                                    )
                                )}
                            </div>

                            <p className="text-xs text-gray-500 mt-5">
                                {weeklyTarget
                                    ? weeklySessions >= weeklyTarget
                                        ? "Weekly workout target completed. Great work!"
                                        : `${weeklyTarget - weeklySessions} more session${weeklyTarget - weeklySessions === 1 ? "" : "s"} to reach your weekly target.`
                                    : "Activate a workout plan to set your weekly target."}
                            </p>
                        </div>

                        <div className="bg-[#171916] rounded-[28px] p-6 border border-white/5">
                            <p className="text-[10px] tracking-[2px] text-gray-500 mb-6">
                                FITNESS PROFILE
                            </p>

                            <div className="mb-5">
                                <p className="text-xs text-gray-500">
                                    Your fitness goal
                                </p>

                                <h2 className="text-xl font-semibold mt-2">
                                    {profile?.fitnessGoal || activeWorkout?.goal || "Not set"}
                                </h2>
                            </div>

                            <div className="h-[1px] bg-white/10 my-5" />

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Height</span>
                                <span>{profile?.height ? `${profile.height} cm` : "--"}</span>
                            </div>

                            <div className="flex justify-between text-sm mt-4">
                                <span className="text-gray-500">Weight</span>
                                <span>{currentWeight ? `${currentWeight} kg` : "--"}</span>
                            </div>

                            <div className="flex justify-between text-sm mt-4">
                                <span className="text-gray-500">Target</span>
                                <span>{validGoal ? `${targetWeight} kg` : "--"}</span>
                            </div>
                        </div>

                        <div className="relative overflow-hidden bg-[#DFF500] text-black rounded-[28px] p-7 min-h-[240px] flex flex-col justify-between">
                            <div className="flex justify-between">
                                <FaDumbbell className="text-2xl" />
                                <span className="text-[10px] tracking-[2px] font-semibold">
                                    E/FIT MINDSET
                                </span>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold leading-tight tracking-tight">
                                    Progress<br />over perfection.
                                </h2>

                                <p className="text-xs mt-4 opacity-70">
                                    Show up. Put in the work. Repeat.
                                </p>
                            </div>
                        </div>

                    </aside>

                </div>
            </main>
        </div>
    );
}

export default Dashboard;
