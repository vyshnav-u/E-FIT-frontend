
import React, { useEffect, useState } from "react";
import Header from "../components/UserHeader";
import {
    FaDumbbell,
    FaClock,
    FaFire,
    FaArrowRight,
    FaCheck,
    FaRedo,
    FaLock
} from "react-icons/fa";
import { FiCalendar, FiTarget } from "react-icons/fi";
import {
    getUserWorkoutsAPI,
    getUserExercisesAPI,
    createCustomWorkoutAPI,
    activateWorkoutAPI,
    getActiveWorkoutAPI,
    saveWorkoutProgressAPI,
    getWorkoutHistoryAPI
} from "../services/authservice";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

function WorkoutPlans() {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
    const [selectedDay, setSelectedDay] = useState(0);

    const [activeAssignment, setActiveAssignment] = useState(null);
    const [completedExercises, setCompletedExercises] = useState({});
    const [startedDays, setStartedDays] = useState({});
    const [workoutLogs, setWorkoutLogs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [progressError, setProgressError] = useState("");
    const [savingProgress, setSavingProgress] = useState(false);
    const [activatingPlan, setActivatingPlan] = useState(false);

    const [showGenerator, setShowGenerator] = useState(false);
    const [exerciseLibrary, setExerciseLibrary] = useState([]);
    const [generatorLoading, setGeneratorLoading] = useState(false);
    const [savingPlan, setSavingPlan] = useState(false);
    const [generatorError, setGeneratorError] = useState("");
    const [generatorSuccess, setGeneratorSuccess] = useState("");

    const [goal, setGoal] = useState("General Fitness");
    const [level, setLevel] = useState("Beginner");
    const [daysPerWeek, setDaysPerWeek] = useState(3);
    const [duration, setDuration] = useState(4);

    const token = localStorage.getItem("token");

    const getWorkoutPlanId = assignment => {
        if (!assignment) return "";

        return assignment.planType === "Admin"
            ? assignment.workoutPlan?._id || assignment.workoutPlan
            : assignment.customWorkoutPlan?._id || assignment.customWorkoutPlan;
    };

    const loadWorkoutProgress = (logs, assignmentId) => {
        const assignmentLogs = logs.filter(
            log => String(log.assignment) === String(assignmentId)
        );

        const latestLogs = {};

        assignmentLogs.forEach(log => {
            const dayKey = `day-${log.dayNumber}`;
            const existing = latestLogs[dayKey];

            if (
                !existing ||
                new Date(log.dateKey) > new Date(existing.dateKey)
            ) {
                latestLogs[dayKey] = log;
            }
        });

        const progress = {};
        const started = {};

        Object.entries(latestLogs).forEach(([dayKey, log]) => {
            started[dayKey] = true;

            progress[dayKey] = (log.completedExercises || [])
                .map(item => {
                    if (typeof item.exercise === "object") {
                        return item.exercise?._id;
                    }

                    return item.exercise;
                })
                .filter(Boolean);
        });

        setCompletedExercises(progress);
        setStartedDays(started);
    };

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                setLoading(true);
                setError("");

                if (!token) {
                    setError("Please login to view your workout plans.");
                    return;
                }

                const [workoutResponse, activeResponse, historyResponse] =
                    await Promise.all([
                        getUserWorkoutsAPI(token),
                        getActiveWorkoutAPI(token),
                        getWorkoutHistoryAPI(token)
                    ]);

                const fetchedWorkouts = workoutResponse.data.workouts || [];
                const assignment = activeResponse.data.assignment;
                const logs = historyResponse.data.logs || [];

                setWorkouts(fetchedWorkouts);
                setActiveAssignment(assignment);
                setWorkoutLogs(logs);

                if (assignment) {
                    const activePlanId = getWorkoutPlanId(assignment);
                    setSelectedWorkoutId(String(activePlanId));
                    loadWorkoutProgress(logs, assignment._id);
                } else if (fetchedWorkouts.length > 0) {
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
        workout => workout._id === selectedWorkoutId
    );

    const workoutDays = selectedWorkout?.days || [];

    const isActivePlan =
        activeAssignment &&
        String(getWorkoutPlanId(activeAssignment)) ===
        String(selectedWorkoutId);

    const getDayLabel = dayNumber => {
        return weekDays[Number(dayNumber) - 1] || `DAY ${dayNumber}`;
    };

    const getExerciseName = exercise => {
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

    const currentWorkout = workoutDays[selectedDay] || null;
    const currentDayKey = currentWorkout
        ? getDayKey(currentWorkout, selectedDay)
        : "";

    const currentExercises = currentWorkout?.exercises || [];
    const currentCompleted = completedExercises[currentDayKey] || [];

    const isDayCompleted = (day, index) => {
        const exercises = day.exercises || [];
        const completed = completedExercises[getDayKey(day, index)] || [];

        return exercises.length > 0 &&
            exercises.every((exercise, exerciseIndex) =>
                completed.includes(getExerciseKey(exercise, exerciseIndex))
            );
    };

    const isDayUnlocked = dayIndex => {
        for (let index = 0; index < dayIndex; index++) {
            const previousDay = workoutDays[index];

            if (previousDay.isRestDay) {
                continue;
            }

            if (!isDayCompleted(previousDay, index)) {
                return false;
            }
        }

        return true;
    };

    const currentDayUnlocked = isDayUnlocked(selectedDay);
    const currentDayStarted = Boolean(startedDays[currentDayKey]);

    const saveProgress = async (day, exerciseIds) => {
        if (!activeAssignment || !token) {
            setProgressError("Activate a workout plan before saving progress.");
            return false;
        }

        try {
            setSavingProgress(true);
            setProgressError("");

            const response = await saveWorkoutProgressAPI(
                {
                    dayNumber: Number(day.dayNumber),
                    dateKey: getTodayDate(),
                    completedExercises: exerciseIds
                },
                token
            );

            const savedLog = response.data.log;

            setWorkoutLogs(previous => [
                savedLog,
                ...previous.filter(log => log._id !== savedLog._id)
            ]);

            return true;
        } catch (error) {
            setProgressError(
                error.response?.data?.message ||
                "Unable to save workout progress."
            );

            return false;
        } finally {
            setSavingProgress(false);
        }
    };

    const activateSelectedWorkout = async () => {
        if (!selectedWorkout) return;

        try {
            setActivatingPlan(true);
            setError("");
            setProgressError("");

            const response = await activateWorkoutAPI(
                {
                    planId: selectedWorkout._id,
                    planType: selectedWorkout.planType
                },
                token
            );

            const assignment = response.data.assignment;

            setActiveAssignment(assignment);
            setCompletedExercises({});
            setStartedDays({});
            setSelectedDay(0);

            const historyResponse = await getWorkoutHistoryAPI(token);
            const logs = historyResponse.data.logs || [];

            setWorkoutLogs(logs);
            loadWorkoutProgress(logs, assignment._id);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to activate this workout plan."
            );
        } finally {
            setActivatingPlan(false);
        }
    };

    const startWorkout = async () => {
        if (
            !currentDayUnlocked ||
            currentWorkout?.isRestDay ||
            !isActivePlan
        ) {
            return;
        }

        const success = await saveProgress(currentWorkout, currentCompleted);

        if (success) {
            setStartedDays(previous => ({
                ...previous,
                [currentDayKey]: true
            }));
        }
    };

    const toggleExercise = async (exercise, index) => {
        if (
            !currentDayUnlocked ||
            !currentDayStarted ||
            !isActivePlan ||
            savingProgress
        ) {
            return;
        }

        const exerciseKey = getExerciseKey(exercise, index);

        const updatedExercises = currentCompleted.includes(exerciseKey)
            ? currentCompleted.filter(item => item !== exerciseKey)
            : [...currentCompleted, exerciseKey];

        const success = await saveProgress(
            currentWorkout,
            updatedExercises
        );

        if (success) {
            setCompletedExercises(previous => ({
                ...previous,
                [currentDayKey]: updatedExercises
            }));
        }
    };

    const resetCurrentWorkout = async () => {
        if (!currentDayUnlocked || !isActivePlan || savingProgress) {
            return;
        }

        const success = await saveProgress(currentWorkout, []);

        if (success) {
            setCompletedExercises(previous => ({
                ...previous,
                [currentDayKey]: []
            }));
        }
    };

    const allExercises = workoutDays.flatMap((day, dayIndex) =>
        (day.exercises || []).map((exercise, exerciseIndex) => ({
            dayKey: getDayKey(day, dayIndex),
            exerciseKey: getExerciseKey(exercise, exerciseIndex)
        }))
    );

    const totalExercises = allExercises.length;

    const completedCount = allExercises.filter(item =>
        (completedExercises[item.dayKey] || []).includes(item.exerciseKey)
    ).length;

    const completionPercentage = totalExercises
        ? Math.round((completedCount / totalExercises) * 100)
        : 0;

    const workoutDaysCount = workoutDays.filter(
        day => !day.isRestDay
    ).length;

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

    const openGenerator = async () => {
        setShowGenerator(true);
        setGeneratorError("");
        setGeneratorSuccess("");

        if (exerciseLibrary.length > 0) return;

        try {
            setGeneratorLoading(true);

            const response = await getUserExercisesAPI(token);
            setExerciseLibrary(response.data.exercises || []);
        } catch (error) {
            setGeneratorError(
                error.response?.data?.message ||
                "Unable to load the exercise library."
            );
        } finally {
            setGeneratorLoading(false);
        }
    };

    const generateWorkout = async () => {
        setGeneratorError("");
        setGeneratorSuccess("");

        if (!exerciseLibrary.length) {
            setGeneratorError("No exercises are available in the library.");
            return;
        }

        const difficultyOrder = {
            Beginner: 1,
            Intermediate: 2,
            Advanced: 3
        };

        const availableExercises = exerciseLibrary.filter(exercise =>
            difficultyOrder[exercise.difficulty] <= difficultyOrder[level]
        );

        if (availableExercises.length < daysPerWeek * 2) {
            setGeneratorError(
                "Not enough exercises for this level. Add more exercises to the admin library."
            );
            return;
        }

        const dailyGroups = Array.from(
            { length: daysPerWeek },
            () => []
        );

        availableExercises.forEach((exercise, index) => {
            dailyGroups[index % daysPerWeek].push(exercise);
        });

        const sets = goal === "Muscle Building" ? 3 : 2;

        const reps = goal === "Muscle Building"
            ? "8-12"
            : goal === "Weight Loss"
                ? "12-15"
                : "10-12";

        const restSeconds = goal === "Weight Loss" ? 45 : 60;

        const trainingTitles = [
            "Full Body Training",
            "Strength Training",
            "Upper Body Training",
            "Lower Body Training",
            "Conditioning Training",
            "Full Body Workout"
        ];

        const days = Array.from({ length: 7 }, (_, index) => {
            if (index >= daysPerWeek) {
                return {
                    dayNumber: index + 1,
                    title: "Recovery",
                    isRestDay: true,
                    exercises: []
                };
            }

            return {
                dayNumber: index + 1,
                title: trainingTitles[index % trainingTitles.length],
                isRestDay: false,
                exercises: dailyGroups[index].map(exercise => ({
                    exercise: exercise._id,
                    sets,
                    reps,
                    duration: 0,
                    restSeconds
                }))
            };
        });

        const planData = {
            name: `My ${goal} Plan`,
            goal,
            duration: Number(duration),
            level,
            description: `A custom ${level.toLowerCase()} plan for ${goal.toLowerCase()}.`,
            days
        };

        try {
            setSavingPlan(true);

            const response = await createCustomWorkoutAPI(planData, token);
            const createdWorkout = {
                ...response.data.workout,
                planType: "Custom"
            };

            setWorkouts(previous => [
                createdWorkout,
                ...previous
            ]);

            setSelectedWorkoutId(createdWorkout._id);
            setSelectedDay(0);
            setShowGenerator(false);
            setGeneratorSuccess("Your custom workout plan has been created.");

            const activationResponse = await activateWorkoutAPI(
                {
                    planId: createdWorkout._id,
                    planType: "Custom"
                },
                token
            );

            setActiveAssignment(activationResponse.data.assignment);
            setCompletedExercises({});
            setStartedDays({});
        } catch (error) {
            setGeneratorError(
                error.response?.data?.message ||
                "Unable to create or activate your custom workout plan."
            );
        } finally {
            setSavingPlan(false);
        }
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

                    <button
                        onClick={openGenerator}
                        className="bg-[#DFF500] text-black px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#c8dc00] transition"
                    >
                        + Create Custom Plan
                    </button>
                </div>

                {generatorSuccess && (
                    <p className="text-[#DFF500] text-sm mb-5">
                        {generatorSuccess}
                    </p>
                )}

                {loading ? (
                    <div className="py-24 text-center text-gray-500">
                        Loading your workout plans...
                    </div>
                ) : error ? (
                    <div className="py-24 text-center">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                ) : workouts.length === 0 ? (
                    <div className="py-20 text-center">
                        <FaDumbbell className="text-[#DFF500] text-4xl mx-auto mb-5" />
                        <h2 className="text-xl font-semibold">
                            No workout plans available
                        </h2>
                        <p className="text-sm text-gray-500 mt-3">
                            Create your own plan or check back when a plan is added.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <p className="text-xs text-gray-500 tracking-widest">
                                YOUR WORKOUT PLAN
                            </p>

                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mt-3">
                                {selectedWorkout?.name}
                                <span className="text-[#DFF500]">.</span>
                            </h2>

                            <p className="text-sm text-gray-500 mt-3 max-w-2xl">
                                {selectedWorkout?.description}
                            </p>

                            {workouts.length > 1 && (
                                <select
                                    value={selectedWorkoutId}
                                    onChange={e => {
                                        setSelectedWorkoutId(e.target.value);
                                        setSelectedDay(0);
                                    }}
                                    className="mt-5 bg-[#171916] border border-white/10 rounded-xl p-3 text-sm text-white outline-none"
                                >
                                    {workouts.map(workout => (
                                        <option key={workout._id} value={workout._id}>
                                            {workout.name} ({workout.planType})
                                        </option>
                                    ))}
                                </select>
                            )}

                            {selectedWorkout && (
                                <div className="mt-5 flex flex-wrap items-center gap-4">
                                    {isActivePlan ? (
                                        <span className="text-xs text-[#DFF500] flex items-center gap-2">
                                            <FaCheck />
                                            ACTIVE WORKOUT PLAN
                                        </span>
                                    ) : (
                                        <button
                                            onClick={activateSelectedWorkout}
                                            disabled={activatingPlan}
                                            className="bg-[#DFF500] text-black px-5 py-3 rounded-xl text-xs font-bold disabled:opacity-50"
                                        >
                                            {activatingPlan ? "Activating..." : "Set as Active Plan"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {activeAssignment && !isActivePlan && (
                            <p className="text-xs text-gray-500 mb-5">
                                Another workout plan is currently active. Activate this plan to switch to it.
                            </p>
                        )}

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
                                        className="h-full bg-[#DFF500] rounded-full transition-all"
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {progressError && (
                            <p className="text-sm text-red-400 mb-5">
                                {progressError}
                            </p>
                        )}

                        <div className="bg-[#171916] border border-white/5 rounded-[24px] p-6 mb-7">
                            <h3 className="text-sm font-semibold text-[#DFF500] mb-3">
                                HOW TO USE YOUR WORKOUT PLAN
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-gray-400">
                                <p>01. Activate a plan and select an available workout day.</p>
                                <p>02. Start your workout and mark each exercise as completed.</p>
                                <p>03. Complete all exercises to unlock your next workout day.</p>
                            </div>

                            <p className="text-xs text-gray-500 mt-4">
                                Your workout progress is saved to your account.
                            </p>
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
                                        const dayKey = getDayKey(workout, index);
                                        const dayCompleted = (
                                            completedExercises[dayKey] || []
                                        ).length;

                                        const dayTotal = workout.exercises?.length || 0;
                                        const completed = isDayCompleted(workout, index);
                                        const unlocked = isDayUnlocked(index);

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
                                                                {dayCompleted}/{dayTotal} completed
                                                            </p>
                                                        )}
                                                    </div>

                                                    {workout.isRestDay ? (
                                                        <FiCalendar />
                                                    ) : completed ? (
                                                        <FaCheck />
                                                    ) : !unlocked ? (
                                                        <FaLock />
                                                    ) : (
                                                        <FaArrowRight />
                                                    )}
                                                </div>

                                                {!workout.isRestDay && (
                                                    <div className={`w-full h-1 rounded-full mt-4 ${
                                                        selectedDay === index
                                                            ? "bg-black/20"
                                                            : "bg-white/10"
                                                    }`}>
                                                        <div
                                                            className={`h-full rounded-full ${
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
                                                    <p className="text-[10px] mt-1">Exercises</p>
                                                </div>

                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {totalSets}
                                                    </p>
                                                    <p className="text-[10px] mt-1">Total Sets</p>
                                                </div>

                                                <div>
                                                    <p className="text-2xl font-bold">
                                                        {estimatedDuration || "—"}
                                                    </p>
                                                    <p className="text-[10px] mt-1">Duration</p>
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
                                                            className="h-full bg-black rounded-full transition-all"
                                                            style={{ width: `${currentDayPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-[#171916] border border-white/5 rounded-[28px] p-6 md:p-8">
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
                                            ) : !isActivePlan ? (
                                                <div className="text-center py-12">
                                                    <FaLock className="text-[#DFF500] text-3xl mx-auto mb-5" />
                                                    <h3 className="text-xl font-semibold">
                                                        This plan is not active
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-3 mb-7">
                                                        Activate this plan before starting or updating its progress.
                                                    </p>
                                                    <button
                                                        onClick={activateSelectedWorkout}
                                                        disabled={activatingPlan}
                                                        className="bg-[#DFF500] text-black px-8 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
                                                    >
                                                        {activatingPlan ? "Activating..." : "Activate Plan"}
                                                    </button>
                                                </div>
                                            ) : !currentDayUnlocked ? (
                                                <>
                                                    <div className="text-center py-7">
                                                        <FaLock className="text-[#DFF500] text-3xl mx-auto mb-4" />
                                                        <h3 className="text-lg font-semibold">
                                                            This workout is locked
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-2">
                                                            Complete the previous workout day to unlock this one.
                                                        </p>
                                                    </div>

                                                    <ExerciseList
                                                        exercises={currentExercises}
                                                        completed={currentCompleted}
                                                        getExerciseKey={getExerciseKey}
                                                        getExerciseName={getExerciseName}
                                                        onToggle={toggleExercise}
                                                        disabled
                                                    />
                                                </>
                                            ) : !currentDayStarted ? (
                                                <div className="text-center py-12">
                                                    <FaDumbbell className="text-[#DFF500] text-3xl mx-auto mb-5" />
                                                    <h3 className="text-xl font-semibold">
                                                        Ready to train?
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-3 mb-7">
                                                        Start this workout to reveal your exercise breakdown.
                                                    </p>

                                                    <button
                                                        onClick={startWorkout}
                                                        disabled={savingProgress}
                                                        className="bg-[#DFF500] text-black px-8 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
                                                    >
                                                        {savingProgress ? "Saving..." : "Start Workout"}
                                                        <FaArrowRight className="inline ml-2" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-7">
                                                        <div>
                                                            <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                                                EXERCISE BREAKDOWN
                                                            </p>
                                                            <h2 className="text-xl font-semibold">
                                                                Workout Details
                                                            </h2>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <FiTarget className="text-[#DFF500] text-2xl" />

                                                            <button
                                                                onClick={resetCurrentWorkout}
                                                                disabled={currentCompleted.length === 0 || savingProgress}
                                                                className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#DFF500] disabled:opacity-30 transition"
                                                            >
                                                                <FaRedo />
                                                                Reset day
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <ExerciseList
                                                        exercises={currentExercises}
                                                        completed={currentCompleted}
                                                        getExerciseKey={getExerciseKey}
                                                        getExerciseName={getExerciseName}
                                                        onToggle={toggleExercise}
                                                        disabled={savingProgress}
                                                    />

                                                    {savingProgress && (
                                                        <p className="text-xs text-gray-500 mt-5">
                                                            Saving your progress...
                                                        </p>
                                                    )}

                                                    {isDayCompleted(currentWorkout, selectedDay) && (
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
                                                                        Great work. Your next workout day is now unlocked.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </section>
                        </div>
                    </>
                )}
            </main>

            {showGenerator && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5 overflow-y-auto">
                    <div className="w-full max-w-xl bg-[#171916] border border-white/10 rounded-[28px] p-7 my-auto">
                        <div className="flex justify-between items-start mb-7">
                            <div>
                                <p className="text-[10px] tracking-[2px] text-[#DFF500] mb-2">
                                    BUILD YOUR ROUTINE
                                </p>
                                <h2 className="text-2xl font-bold">
                                    Custom Workout Plan
                                </h2>
                            </div>

                            <button
                                onClick={() => setShowGenerator(false)}
                                className="text-gray-400 hover:text-white text-xl"
                            >
                                ×
                            </button>
                        </div>

                        {generatorLoading ? (
                            <p className="text-sm text-gray-400 py-8 text-center">
                                Loading exercise library...
                            </p>
                        ) : (
                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">
                                        FITNESS GOAL
                                    </label>
                                    <select
                                        value={goal}
                                        onChange={e => setGoal(e.target.value)}
                                        className="w-full bg-[#22241F] border border-white/10 rounded-xl p-3 text-sm outline-none"
                                    >
                                        <option>General Fitness</option>
                                        <option>Muscle Building</option>
                                        <option>Weight Loss</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">
                                        EXPERIENCE LEVEL
                                    </label>
                                    <select
                                        value={level}
                                        onChange={e => setLevel(e.target.value)}
                                        className="w-full bg-[#22241F] border border-white/10 rounded-xl p-3 text-sm outline-none"
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">
                                        WORKOUT DAYS PER WEEK
                                    </label>
                                    <select
                                        value={daysPerWeek}
                                        onChange={e => setDaysPerWeek(Number(e.target.value))}
                                        className="w-full bg-[#22241F] border border-white/10 rounded-xl p-3 text-sm outline-none"
                                    >
                                        <option value={3}>3 Days</option>
                                        <option value={4}>4 Days</option>
                                        <option value={5}>5 Days</option>
                                        <option value={6}>6 Days</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 block mb-2">
                                        PLAN DURATION
                                    </label>
                                    <select
                                        value={duration}
                                        onChange={e => setDuration(Number(e.target.value))}
                                        className="w-full bg-[#22241F] border border-white/10 rounded-xl p-3 text-sm outline-none"
                                    >
                                        <option value={2}>2 Weeks</option>
                                        <option value={4}>4 Weeks</option>
                                        <option value={6}>6 Weeks</option>
                                        <option value={8}>8 Weeks</option>
                                        <option value={12}>12 Weeks</option>
                                    </select>
                                </div>

                                <p className="text-xs text-gray-500">
                                    The generator selects exercises from the existing admin exercise library based on your chosen experience level.
                                </p>

                                {generatorError && (
                                    <p className="text-sm text-red-400">
                                        {generatorError}
                                    </p>
                                )}

                                <button
                                    onClick={generateWorkout}
                                    disabled={savingPlan || !exerciseLibrary.length}
                                    className="w-full bg-[#DFF500] text-black py-3 rounded-xl font-bold text-sm disabled:opacity-40"
                                >
                                    {savingPlan ? "Creating Plan..." : "Generate My Plan"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function ExerciseList({
    exercises,
    completed,
    getExerciseKey,
    getExerciseName,
    onToggle,
    disabled = false
}) {
    if (!exercises.length) {
        return (
            <p className="text-sm text-gray-500 py-8 text-center">
                No exercises added for this day.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {exercises.map((exercise, index) => {
                const exerciseKey = getExerciseKey(exercise, index);
                const isCompleted = completed.includes(exerciseKey);

                return (
                    <div
                        key={exerciseKey}
                        className={`rounded-2xl p-5 border ${
                            isCompleted
                                ? "bg-[#DFF500]/5 border-[#DFF500]/30"
                                : "bg-[#22241F] border-white/5"
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`text-lg font-semibold ${
                                isCompleted ? "text-[#DFF500]" : "text-gray-500"
                            }`}>
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap justify-between items-center gap-3">
                                    <h3 className="font-semibold text-sm">
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
                                    {exercise.exercise?.description ||
                                        "Focus on proper form and controlled movements."}
                                </p>

                                <button
                                    onClick={() => onToggle(exercise, index)}
                                    disabled={disabled}
                                    className={`mt-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                                        isCompleted
                                            ? "bg-white/10 text-white"
                                            : "bg-[#DFF500] text-black"
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
    );
}

export default WorkoutPlans;
