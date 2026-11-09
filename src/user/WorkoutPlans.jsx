
import React, { useEffect, useState } from "react";
import Header from "../components/UserHeader";
import {
    FaDumbbell,
    FaClock,
    FaFire,
    FaArrowRight,
    FaCheck,
    FaRedo
} from "react-icons/fa";
import { FiCalendar, FiTarget } from "react-icons/fi";
import { getUserWorkoutsAPI } from "../services/authservice";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function WorkoutPlans() {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
    const [selectedDay, setSelectedDay] = useState(0);
    const [completedExercises, setCompletedExercises] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [progressLoaded, setProgressLoaded] = useState(false);

    let loggedInUser = null;

    try {
        loggedInUser = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        loggedInUser = null;
    }

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                setLoading(true);
                setError("");

                if (!token) {
                    setError("Please login to view your workout plans.");
                    return;
                }

                const response = await getUserWorkoutsAPI(token);
                const fetchedWorkouts = response.data.workouts || [];

                setWorkouts(fetchedWorkouts);

                if (fetchedWorkouts.length > 0) {
                    setSelectedWorkoutId(fetchedWorkouts[0]._id);
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Unable to load workout plans."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    const selectedWorkout = workouts.find(
        (workout) => workout._id === selectedWorkoutId
    );

    const workoutDays = selectedWorkout?.days || [];

    const progressKey = `efit-workout-progress-${loggedInUser?.userId || loggedInUser?._id || "guest"}-${selectedWorkoutId || "none"}`;

    useEffect(() => {
        setProgressLoaded(false);

        try {
            const savedProgress = JSON.parse(
                localStorage.getItem(progressKey)
            ) || {};

            setCompletedExercises(savedProgress);
        } catch (error) {
            setCompletedExercises({});
        }

        setProgressLoaded(true);
    }, [progressKey]);

    useEffect(() => {
        if (progressLoaded) {
            localStorage.setItem(
                progressKey,
                JSON.stringify(completedExercises)
            );
        }
    }, [completedExercises, progressKey, progressLoaded]);

    useEffect(() => {
        setSelectedDay(0);
    }, [selectedWorkoutId]);

    const currentWorkout = workoutDays[selectedDay] || null;

    const getDayLabel = (dayNumber) => {
        return weekDays[Number(dayNumber) - 1] || `DAY ${dayNumber}`;
    };

    const getExerciseName = (exercise) => {
        return exercise.exercise?.name || "Exercise unavailable";
    };

    const getExerciseKey = (exercise, index) => {
        return exercise.exercise?._id ||
            exercise.exercise ||
            `${getExerciseName(exercise)}-${index}`;
    };

    const getDayKey = (day, index) => {
        return `day-${day.dayNumber ?? index + 1}`;
    };

    const allExercises = workoutDays.flatMap((day, dayIndex) =>
        (day.exercises || []).map((exercise, exerciseIndex) => ({
            ...exercise,
            progressKey: `${getDayKey(day, dayIndex)}-${getExerciseKey(exercise, exerciseIndex)}`
        }))
    );

    const totalExercises = allExercises.length;

    const completedCount = allExercises.filter(
        (exercise) =>
            completedExercises[
                exercise.progressKey.split("-").slice(0, 2).join("-")
            ]?.includes(
                exercise.progressKey.split("-").slice(2).join("-")
            )
    ).length;

    const completionPercentage = totalExercises
        ? Math.round((completedCount / totalExercises) * 100)
        : 0;

    const workoutDaysCount = workoutDays.filter(
        (day) => !day.isRestDay
    ).length;

    const currentDayKey = currentWorkout
        ? getDayKey(currentWorkout, selectedDay)
        : "";

    const currentCompleted = completedExercises[currentDayKey] || [];

    const currentExercises = currentWorkout?.exercises || [];

    const currentDayPercentage = currentExercises.length
        ? Math.round(
            (currentCompleted.length / currentExercises.length) * 100
        )
        : 0;

    const totalSets = currentExercises.reduce(
        (total, exercise) => total + (Number(exercise.sets) || 0),
        0
    );

    const estimatedDuration = currentExercises.reduce(
        (total, exercise) => total + (Number(exercise.duration) || 0),
        0
    );

    const toggleExercise = (exercise, index) => {
        const exerciseKey = getExerciseKey(exercise, index);

        setCompletedExercises((previous) => {
            const dayExercises = previous[currentDayKey] || [];

            const updatedExercises = dayExercises.includes(exerciseKey)
                ? dayExercises.filter((item) => item !== exerciseKey)
                : [...dayExercises, exerciseKey];

            return {
                ...previous,
                [currentDayKey]: updatedExercises
            };
        });
    };

    const resetCurrentWorkout = () => {
        setCompletedExercises((previous) => {
            const updatedProgress = { ...previous };
            delete updatedProgress[currentDayKey];
            return updatedProgress;
        });
    };

    const isDayCompleted = (day, index) => {
        const exercises = day.exercises || [];
        const dayKey = getDayKey(day, index);
        const completed = completedExercises[dayKey] || [];

        return (
            exercises.length > 0 &&
            completed.length === exercises.length
        );
    };

    return (
        <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">
            <Header />

            <main className="px-5 md:px-10 lg:px-14 py-10">

                <div className="flex flex-col md:flex-row justify-between md:items-end gap-5 mb-10">
                    <div>
                        <p className="text-[#DFF500] text-[10px] tracking-[3px] uppercase mb-4">
                            Training programme
                        </p>

                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                            Workout Plans<span className="text-[#DFF500]">.</span>
                        </h1>

                        <p className="text-sm text-gray-500 mt-3">
                            Your training routine, designed for your goals.
                        </p>
                    </div>

                    {workouts.length > 1 && (
                        <div className="w-full md:w-64">
                            <label className="text-[10px] tracking-widest text-gray-500 block mb-2">
                                SELECT WORKOUT PLAN
                            </label>

                            <select
                                value={selectedWorkoutId}
                                onChange={(e) => setSelectedWorkoutId(e.target.value)}
                                className="w-full bg-[#171916] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#DFF500]"
                            >
                                {workouts.map((workout) => (
                                    <option key={workout._id} value={workout._id}>
                                        {workout.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="py-24 text-center text-gray-500">
                        Loading your workout plans...
                    </div>
                ) : error ? (
                    <div className="py-24 text-center">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                ) : workouts.length === 0 ? (
                    <div className="py-24 text-center">
                        <FaDumbbell className="text-[#DFF500] text-4xl mx-auto mb-5" />
                        <h2 className="text-xl font-semibold">
                            No workout plans available
                        </h2>
                        <p className="text-sm text-gray-500 mt-3">
                            Your workout plans will appear here when they are added.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-7">
                            <p className="text-sm text-gray-500">
                                CURRENT PLAN
                            </p>
                            <h2 className="text-2xl font-semibold mt-2">
                                {selectedWorkout?.name}
                            </h2>
                            <p className="text-sm text-gray-500 mt-2">
                                {selectedWorkout?.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">

                            <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
                                <FaDumbbell className="text-[#DFF500] text-xl mb-5" />
                                <h2 className="text-3xl font-semibold">
                                    {workoutDaysCount.toString().padStart(2, "0")}
                                </h2>
                                <p className="text-xs text-gray-500 mt-2">
                                    Weekly workout days
                                </p>
                            </div>

                            <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
                                <FaClock className="text-[#DFF500] text-xl mb-5" />
                                <h2 className="text-3xl font-semibold">
                                    {selectedWorkout?.duration} Weeks
                                </h2>
                                <p className="text-xs text-gray-500 mt-2">
                                    Workout plan duration
                                </p>
                            </div>

                            <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6">
                                <FaFire className="text-[#DFF500] text-xl mb-5" />
                                <h2 className="text-3xl font-semibold">
                                    {completionPercentage}%
                                </h2>
                                <p className="text-xs text-gray-500 mt-2">
                                    Exercise completion
                                </p>

                                <div className="w-full h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                                    <div
                                        className="h-full bg-[#DFF500] rounded-full transition-all duration-300"
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            <section className="lg:col-span-4 bg-[#171916] border border-white/5 rounded-[28px] p-6">

                                <div className="mb-7">
                                    <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                        YOUR SCHEDULE
                                    </p>
                                    <h2 className="text-xl font-semibold">
                                        Weekly Routine
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {workoutDays.map((workout, index) => {
                                        const dayCompleted = (
                                            completedExercises[getDayKey(workout, index)] || []
                                        ).length;

                                        const dayTotal = workout.exercises?.length || 0;
                                        const completed = isDayCompleted(workout, index);

                                        return (
                                            <button
                                                key={workout._id || workout.dayNumber}
                                                onClick={() => setSelectedDay(index)}
                                                className={`w-full text-left p-4 rounded-2xl border transition ${
                                                    selectedDay === index
                                                        ? "bg-[#DFF500] text-black border-[#DFF500]"
                                                        : "bg-[#22241F] border-white/5 hover:border-[#DFF500]/40"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className={`text-[10px] tracking-widest mb-2 ${
                                                            selectedDay === index
                                                                ? "text-black/60"
                                                                : "text-gray-500"
                                                        }`}>
                                                            {getDayLabel(workout.dayNumber)}
                                                        </p>

                                                        <h3 className="text-sm font-semibold">
                                                            {workout.isRestDay
                                                                ? "Rest Day"
                                                                : workout.title || "Workout"}
                                                        </h3>

                                                        <p className={`text-xs mt-2 ${
                                                            selectedDay === index
                                                                ? "text-black/60"
                                                                : "text-gray-500"
                                                        }`}>
                                                            {workout.isRestDay
                                                                ? "Recovery"
                                                                : `${dayTotal} Exercises`}
                                                        </p>

                                                        {!workout.isRestDay && (
                                                            <p className={`text-[10px] mt-3 ${
                                                                selectedDay === index
                                                                    ? "text-black/70"
                                                                    : "text-gray-500"
                                                            }`}>
                                                                {dayCompleted}/{dayTotal} exercises completed
                                                            </p>
                                                        )}
                                                    </div>

                                                    {workout.isRestDay ? (
                                                        <FiCalendar />
                                                    ) : completed ? (
                                                        <FaCheck className="text-sm" />
                                                    ) : (
                                                        <FaArrowRight className="text-xs" />
                                                    )}
                                                </div>

                                                {!workout.isRestDay && (
                                                    <div className={`w-full h-1 rounded-full mt-4 ${
                                                        selectedDay === index
                                                            ? "bg-black/20"
                                                            : "bg-white/10"
                                                    }`}>
                                                        <div
                                                            className={`h-full rounded-full transition-all ${
                                                                selectedDay === index
                                                                    ? "bg-black"
                                                                    : "bg-[#DFF500]"
                                                            }`}
                                                            style={{
                                                                width: `${dayTotal ? (dayCompleted / dayTotal) * 100 : 0}%`
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                            </section>

                            <section className="lg:col-span-8 space-y-5">

                                {currentWorkout && (
                                    <>
                                        <div className="bg-[#DFF500] text-black rounded-[28px] p-7 md:p-9">

                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] tracking-[2px] font-semibold mb-4">
                                                        SELECTED WORKOUT · {getDayLabel(currentWorkout.dayNumber)}
                                                    </p>

                                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                                        {currentWorkout.isRestDay
                                                            ? "Rest Day"
                                                            : currentWorkout.title || "Workout"}
                                                    </h2>

                                                    <p className="text-sm mt-3 opacity-70">
                                                        {selectedWorkout?.goal} · {selectedWorkout?.level}
                                                    </p>
                                                </div>

                                                <FaDumbbell className="text-3xl opacity-50" />
                                            </div>

                                            <div className="flex flex-wrap gap-8 mt-9 pt-6 border-t border-black/20">

                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {currentExercises.length}
                                                    </p>
                                                    <p className="text-[10px] mt-1">
                                                        Exercises
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {totalSets}
                                                    </p>
                                                    <p className="text-[10px] mt-1">
                                                        Total Sets
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {estimatedDuration || "—"}
                                                    </p>
                                                    <p className="text-[10px] mt-1">
                                                        Duration
                                                    </p>
                                                </div>

                                            </div>

                                            {!currentWorkout.isRestDay && (
                                                <div className="mt-7">
                                                    <div className="flex justify-between text-xs font-semibold mb-2">
                                                        <span>DAILY PROGRESS</span>
                                                        <span>{currentDayPercentage}%</span>
                                                    </div>

                                                    <div className="w-full h-2 bg-black/15 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-black rounded-full transition-all duration-300"
                                                            style={{ width: `${currentDayPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                        </div>

                                        <div className="bg-[#171916] border border-white/5 rounded-[28px] p-6 md:p-8">

                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-7">
                                                <div>
                                                    <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                                        EXERCISE BREAKDOWN
                                                    </p>
                                                    <h2 className="text-xl font-semibold">
                                                        Workout Details
                                                    </h2>
                                                </div>

                                                {!currentWorkout.isRestDay && (
                                                    <div className="flex items-center gap-3">
                                                        <FiTarget className="text-[#DFF500] text-2xl" />

                                                        <button
                                                            onClick={resetCurrentWorkout}
                                                            disabled={currentCompleted.length === 0}
                                                            className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#DFF500] disabled:opacity-30 disabled:cursor-not-allowed transition"
                                                        >
                                                            <FaRedo />
                                                            Reset day
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {currentWorkout.isRestDay ? (
                                                <div className="py-12 text-center">
                                                    <FiCalendar className="text-[#DFF500] text-3xl mx-auto mb-4" />
                                                    <h3 className="text-lg font-semibold">
                                                        Recovery Day
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Take time to recover and prepare for your next workout.
                                                    </p>
                                                </div>
                                            ) : currentExercises.length === 0 ? (
                                                <p className="text-sm text-gray-500 py-8 text-center">
                                                    No exercises added for this day.
                                                </p>
                                            ) : (
                                                <div className="space-y-4">
                                                    {currentExercises.map((exercise, index) => {
                                                        const exerciseKey = getExerciseKey(exercise, index);
                                                        const isCompleted = currentCompleted.includes(exerciseKey);

                                                        return (
                                                            <div
                                                                key={exerciseKey}
                                                                className={`rounded-2xl p-5 border transition ${
                                                                    isCompleted
                                                                        ? "bg-[#DFF500]/5 border-[#DFF500]/30"
                                                                        : "bg-[#22241F] border-white/5"
                                                                }`}
                                                            >
                                                                <div className="flex items-start gap-4">

                                                                    <div className={`text-lg font-semibold ${
                                                                        isCompleted
                                                                            ? "text-[#DFF500]"
                                                                            : "text-gray-500"
                                                                    }`}>
                                                                        {String(index + 1).padStart(2, "0")}
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">

                                                                        <div className="flex flex-wrap justify-between items-center gap-3">
                                                                            <h3 className={`font-semibold text-sm ${
                                                                                isCompleted
                                                                                    ? "text-[#DFF500]"
                                                                                    : "text-white"
                                                                            }`}>
                                                                                {getExerciseName(exercise)}
                                                                            </h3>

                                                                            {isCompleted && (
                                                                                <span className="text-[10px] tracking-wider text-[#DFF500]">
                                                                                    COMPLETED
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                                                                            <span>{exercise.sets} Sets</span>
                                                                            <span>{exercise.reps} Reps</span>
                                                                            <span>Rest: {exercise.restSeconds} sec</span>
                                                                        </div>

                                                                        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                                                                            {exercise.exercise?.description || "Focus on proper form and controlled movements."}
                                                                        </p>

                                                                        <button
                                                                            onClick={() => toggleExercise(exercise, index)}
                                                                            className={`mt-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                                                                                isCompleted
                                                                                    ? "bg-white/10 text-white hover:bg-white/15"
                                                                                    : "bg-[#DFF500] text-black hover:bg-[#c8dc00]"
                                                                            }`}
                                                                        >
                                                                            {isCompleted ? (
                                                                                <>
                                                                                    <FaRedo />
                                                                                    Mark as incomplete
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <FaCheck />
                                                                                    Mark as completed
                                                                                </>
                                                                            )}
                                                                        </button>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {!currentWorkout.isRestDay && isDayCompleted(currentWorkout, selectedDay) && (
                                                <div className="mt-6 p-5 border border-[#DFF500]/30 bg-[#DFF500]/5 rounded-2xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#DFF500] flex items-center justify-center">
                                                            <FaCheck className="text-black" />
                                                        </div>

                                                        <div>
                                                            <h3 className="text-sm font-semibold text-[#DFF500]">
                                                                Workout completed!
                                                            </h3>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                Great work. All exercises for this day are completed.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </>
                                )}

                            </section>

                        </div>
                    </>
                )}

            </main>
        </div>
    );
}

export default WorkoutPlans;
