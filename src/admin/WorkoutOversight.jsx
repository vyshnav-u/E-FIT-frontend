
import React, { useEffect, useMemo, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaDumbbell,
  FaCalendarAlt,
  FaLayerGroup,
  FaChevronDown,
  FaChevronUp,
  FaSave,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../services/api";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyExercise = {
  name: "",
  category: "Strength",
  muscle: "",
  equipment: "None",
  level: "Beginner",
};

const createEmptyPlan = () => ({
  name: "",
  goal: "Build Muscle",
  duration: "4 Weeks",
  level: "Beginner",
  days: [
    {
      day: "Monday",
      restDay: false,
      exercises: [],
      selectedExercise: "",
    },
  ],
});

const getExerciseId = (exercise) =>
  typeof exercise.exercise === "object"
    ? exercise.exercise?._id
    : exercise.exercise;

const normalizeExercise = (exercise) => ({
  id: exercise._id,
  name: exercise.name,
  category: exercise.category,
  muscle: exercise.muscleGroup,
  equipment: exercise.equipment,
  level: exercise.difficulty,
});

const normalizePlan = (plan) => ({
  id: plan._id,
  name: plan.name,
  goal: plan.goal,
  duration: `${plan.duration} ${plan.duration === 1 ? "Week" : "Weeks"}`,
  level: plan.level,
  days: (plan.days || [])
    .map((day) => ({
      day: day.title || weekDays[(day.dayNumber || 1) - 1],
      restDay: day.isRestDay,
      exercises: (day.exercises || []).map((item) => ({
        exerciseId: getExerciseId(item),
        sets: item.sets,
        reps: item.reps,
        rest: item.restSeconds,
      })),
      selectedExercise: "",
    }))
    .sort(
      (a, b) => weekDays.indexOf(a.day) - weekDays.indexOf(b.day)
    ),
});

function WorkoutOversight() {
  const [activeTab, setActiveTab] = useState("library");

  const [exercises, setExercises] = useState([]);
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [exerciseSearch, setExerciseSearch] = useState("");
  const [exerciseCategory, setExerciseCategory] = useState("All");

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [exerciseForm, setExerciseForm] = useState(emptyExercise);

  const [planForm, setPlanForm] = useState(createEmptyPlan());
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [expandedDays, setExpandedDays] = useState(["Monday"]);

  const [planSearch, setPlanSearch] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    if (!token) {
      toast.error("Please log in again");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [exerciseResponse, planResponse] = await Promise.all([
        api.get("/admin/exercises", authConfig),
        api.get("/admin/workouts", authConfig),
      ]);

      setExercises(
        (exerciseResponse.data.exercises || []).map(normalizeExercise)
      );

      setPlans(
        (planResponse.data.workouts || []).map(normalizePlan)
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load workout data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
        exercise.muscle.toLowerCase().includes(exerciseSearch.toLowerCase());

      const matchesCategory =
        exerciseCategory === "All" ||
        exercise.category === exerciseCategory;

      return matchesSearch && matchesCategory;
    });
  }, [exercises, exerciseSearch, exerciseCategory]);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) =>
      plan.name.toLowerCase().includes(planSearch.toLowerCase())
    );
  }, [plans, planSearch]);

  const totalExercises = exercises.length;
  const totalPlans = plans.length;

  const totalCategories = [
    ...new Set(exercises.map((item) => item.category)),
  ].length;

  const openAddExercise = () => {
    setEditingExercise(null);
    setExerciseForm({ ...emptyExercise });
    setShowExerciseModal(true);
  };

  const openEditExercise = (exercise) => {
    setEditingExercise(exercise);
    setExerciseForm({
      name: exercise.name,
      category: exercise.category,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      level: exercise.level,
    });
    setShowExerciseModal(true);
  };

  const handleExerciseChange = (e) => {
    setExerciseForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const saveExercise = async (e) => {
    e.preventDefault();

    if (!exerciseForm.name.trim() || !exerciseForm.muscle.trim()) {
      toast.warning("Enter the exercise name and muscle group");
      return;
    }

    const exerciseData = {
      name: exerciseForm.name.trim(),
      category: exerciseForm.category,
      muscleGroup: exerciseForm.muscle.trim(),
      equipment: exerciseForm.equipment,
      difficulty: exerciseForm.level,
    };

    try {
      setSaving(true);

      if (editingExercise) {
        const response = await api.put(
          `/admin/exercises/${editingExercise.id}`,
          exerciseData,
          authConfig
        );

        const updatedExercise = normalizeExercise(response.data.exercise);

        setExercises((previous) =>
          previous.map((item) =>
            item.id === editingExercise.id ? updatedExercise : item
          )
        );

        toast.success("Exercise updated successfully");
      } else {
        const response = await api.post(
          "/admin/exercises",
          exerciseData,
          authConfig
        );

        setExercises((previous) => [
          normalizeExercise(response.data.exercise),
          ...previous,
        ]);

        toast.success("Exercise added to library");
      }

      setShowExerciseModal(false);
      setEditingExercise(null);
      setExerciseForm({ ...emptyExercise });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save exercise"
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmAction = (message, action) => {
    toast.info(
      <div className="flex flex-col gap-3">
        <p>{message}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss();
              action();
            }}
            className="bg-red-600 px-3 py-1 text-white"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="border border-gray-500 px-3 py-1"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
      }
    );
  };

  const deleteExercise = (id) => {
    confirmAction(
      "Delete this exercise from the library?",
      async () => {
        try {
          await api.delete(`/admin/exercises/${id}`, authConfig);

          setExercises((previous) =>
            previous.filter((exercise) => exercise.id !== id)
          );

          setPlanForm((previous) => ({
            ...previous,
            days: previous.days.map((day) => ({
              ...day,
              exercises: day.exercises.filter(
                (item) => item.exerciseId !== id
              ),
            })),
          }));

          toast.success("Exercise deleted successfully");
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Failed to delete exercise"
          );
        }
      }
    );
  };

  const startNewPlan = () => {
    setEditingPlanId(null);
    setPlanForm(createEmptyPlan());
    setExpandedDays(["Monday"]);
    setActiveTab("builder");
  };

  const editPlan = (plan) => {
    setEditingPlanId(plan.id);

    setPlanForm({
      name: plan.name,
      goal: plan.goal,
      duration: plan.duration,
      level: plan.level,
      days: plan.days.map((day) => ({
        ...day,
        exercises: day.exercises.map((item) => ({ ...item })),
        selectedExercise: "",
      })),
    });

    setExpandedDays(plan.days.map((day) => day.day));
    setActiveTab("builder");
  };

  const updatePlanDetails = (e) => {
    setPlanForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const addPlanDay = () => {
    const availableDay = weekDays.find(
      (day) => !planForm.days.some((item) => item.day === day)
    );

    if (!availableDay) {
      toast.warning("All seven days have been added");
      return;
    }

    setPlanForm((previous) => ({
      ...previous,
      days: [
        ...previous.days,
        {
          day: availableDay,
          restDay: false,
          exercises: [],
          selectedExercise: "",
        },
      ],
    }));

    setExpandedDays((previous) => [...previous, availableDay]);
  };

  const removePlanDay = (dayName) => {
    setPlanForm((previous) => ({
      ...previous,
      days: previous.days.filter((day) => day.day !== dayName),
    }));

    setExpandedDays((previous) =>
      previous.filter((day) => day !== dayName)
    );
  };

  const updateDay = (dayName, updates) => {
    setPlanForm((previous) => ({
      ...previous,
      days: previous.days.map((day) =>
        day.day === dayName ? { ...day, ...updates } : day
      ),
    }));
  };

  const addExerciseToDay = (dayName) => {
    const selectedDay = planForm.days.find(
      (day) => day.day === dayName
    );

    if (!selectedDay?.selectedExercise) {
      toast.warning("Select an exercise first");
      return;
    }

    const exerciseId = selectedDay.selectedExercise;

    if (
      selectedDay.exercises.some(
        (exercise) => exercise.exerciseId === exerciseId
      )
    ) {
      toast.warning("This exercise is already added to this day");
      return;
    }

    updateDay(dayName, {
      selectedExercise: "",
      exercises: [
        ...selectedDay.exercises,
        {
          exerciseId,
          sets: 3,
          reps: "12",
          rest: 60,
        },
      ],
    });
  };

  const updateDayExercise = (dayName, exerciseId, field, value) => {
    const selectedDay = planForm.days.find(
      (day) => day.day === dayName
    );

    updateDay(dayName, {
      exercises: selectedDay.exercises.map((item) =>
        item.exerciseId === exerciseId
          ? { ...item, [field]: value }
          : item
      ),
    });
  };

  const removeExerciseFromDay = (dayName, exerciseId) => {
    const selectedDay = planForm.days.find(
      (day) => day.day === dayName
    );

    updateDay(dayName, {
      exercises: selectedDay.exercises.filter(
        (item) => item.exerciseId !== exerciseId
      ),
    });
  };

  const savePlan = async (e) => {
    e.preventDefault();

    if (!planForm.name.trim()) {
      toast.warning("Enter a workout plan name");
      return;
    }

    if (planForm.days.length === 0) {
      toast.warning("Add at least one day to the plan");
      return;
    }

    const hasExercises = planForm.days.some(
      (day) => day.exercises.length > 0 || day.restDay
    );

    if (!hasExercises) {
      toast.warning("Add exercises or a rest day to your plan");
      return;
    }

    const workoutData = {
      name: planForm.name.trim(),
      goal: planForm.goal,
      duration: Number.parseInt(planForm.duration, 10),
      level: planForm.level,
      days: planForm.days.map((day) => ({
        dayNumber: weekDays.indexOf(day.day) + 1,
        title: day.day,
        isRestDay: day.restDay,
        exercises: day.restDay
          ? []
          : day.exercises.map((item) => ({
              exercise: item.exerciseId,
              sets: Number(item.sets),
              reps: item.reps,
              duration: 0,
              restSeconds: Number(item.rest),
            })),
      })),
    };

    try {
      setSaving(true);

      if (editingPlanId) {
        await api.put(
          `/admin/workouts/${editingPlanId}`,
          workoutData,
          authConfig
        );

        toast.success("Workout plan updated successfully");
      } else {
        await api.post("/admin/workouts", workoutData, authConfig);

        toast.success("Workout plan created successfully");
      }

      await fetchData();

      setEditingPlanId(null);
      setPlanForm(createEmptyPlan());
      setActiveTab("plans");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to save workout plan"
      );
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = (id) => {
    confirmAction(
      "Are you sure you want to delete this workout plan?",
      async () => {
        try {
          await api.delete(`/admin/workouts/${id}`, authConfig);

          setPlans((previous) =>
            previous.filter((plan) => plan.id !== id)
          );

          toast.success("Workout plan deleted successfully");
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Failed to delete workout plan"
          );
        }
      }
    );
  };

  const toggleDay = (dayName) => {
    setExpandedDays((previous) =>
      previous.includes(dayName)
        ? previous.filter((day) => day !== dayName)
        : [...previous, dayName]
    );
  };

  const getExerciseName = (id) => {
    return (
      exercises.find((exercise) => exercise.id === id)?.name ||
      "Exercise unavailable"
    );
  };

  const planExerciseCount = (plan) =>
    plan.days.reduce((total, day) => total + day.exercises.length, 0);

  return (
    <div className="min-h-screen bg-[#080908] text-[#EBEDE3]">
      <AdminHeader />

      <div className="lg:grid lg:grid-cols-[250px_1fr]">
        <AdminSidebar />

        <main className="min-w-0 p-5 sm:p-8 lg:p-10">
          <div className="mb-9">
            <p className="mb-2 text-xs font-bold tracking-[0.3em] text-[#DFF500]">
              ADMINISTRATION / FITNESS
            </p>

            <h1 className="text-3xl font-black sm:text-4xl">
              Workout Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your exercise library and build structured workout programs.
            </p>
          </div>

          <section className="mb-9 grid grid-cols-1 gap-6 border-y border-white/10 py-6 sm:grid-cols-3">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs tracking-widest text-gray-500">
                  TOTAL EXERCISES
                </p>
                <FaDumbbell className="text-[#DFF500]" />
              </div>
              <p className="text-3xl font-bold">{totalExercises}</p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs tracking-widest text-gray-500">
                  WORKOUT PLANS
                </p>
                <FaCalendarAlt className="text-[#DFF500]" />
              </div>
              <p className="text-3xl font-bold">{totalPlans}</p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs tracking-widest text-gray-500">
                  EXERCISE CATEGORIES
                </p>
                <FaLayerGroup className="text-[#DFF500]" />
              </div>
              <p className="text-3xl font-bold">{totalCategories}</p>
            </div>
          </section>

          <div className="mb-9 flex flex-wrap gap-2 border-b border-white/10">
            {[
              { id: "library", label: "Exercise Library", icon: FaDumbbell },
              { id: "builder", label: "Plan Builder", icon: FaPlus },
              { id: "plans", label: "Workout Plans", icon: FaCalendarAlt },
            ].map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "border-[#DFF500] text-[#DFF500]"
                      : "border-transparent text-gray-500 hover:text-white"
                  }`}
                >
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <p className="py-16 text-center text-sm text-gray-500">
              Loading workout data...
            </p>
          ) : (
            <>
              {activeTab === "library" && (
                <section>
                  <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                      <h2 className="text-xl font-bold">Exercise Library</h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Manage individual exercises used in workout plans.
                      </p>
                    </div>

                    <button
                      onClick={openAddExercise}
                      className="flex items-center justify-center gap-2 bg-[#DFF500] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#c8dc00]"
                    >
                      <FaPlus />
                      Add Exercise
                    </button>
                  </div>

                  <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 border-b border-white/20 px-2 py-3 sm:w-80">
                      <FaSearch className="text-gray-500" />
                      <input
                        value={exerciseSearch}
                        onChange={(e) => setExerciseSearch(e.target.value)}
                        placeholder="Search exercises..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
                      />
                    </div>

                    <select
                      value={exerciseCategory}
                      onChange={(e) => setExerciseCategory(e.target.value)}
                      className="border border-white/10 bg-[#080908] px-4 py-3 text-sm outline-none focus:border-[#DFF500]"
                    >
                      <option value="All">All Categories</option>
                      <option value="Strength">Strength</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Core">Core</option>
                      <option value="Flexibility">Flexibility</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left">
                      <thead>
                        <tr className="border-b border-white/10 text-xs tracking-widest text-gray-500">
                          <th className="px-4 py-4">EXERCISE</th>
                          <th className="px-4 py-4">CATEGORY</th>
                          <th className="px-4 py-4">MUSCLE GROUP</th>
                          <th className="px-4 py-4">EQUIPMENT</th>
                          <th className="px-4 py-4">LEVEL</th>
                          <th className="px-4 py-4">ACTIONS</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredExercises.map((exercise) => (
                          <tr
                            key={exercise.id}
                            className="border-b border-white/10 text-sm transition hover:bg-white/[0.02]"
                          >
                            <td className="px-4 py-5 font-semibold">
                              {exercise.name}
                            </td>
                            <td className="px-4 py-5 text-gray-400">
                              {exercise.category}
                            </td>
                            <td className="px-4 py-5 text-gray-400">
                              {exercise.muscle}
                            </td>
                            <td className="px-4 py-5 text-gray-400">
                              {exercise.equipment}
                            </td>
                            <td className="px-4 py-5 text-gray-400">
                              {exercise.level}
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => openEditExercise(exercise)}
                                  className="text-gray-400 transition hover:text-[#DFF500]"
                                  title="Edit exercise"
                                >
                                  <FaEdit />
                                </button>

                                <button
                                  onClick={() => deleteExercise(exercise.id)}
                                  className="text-gray-400 transition hover:text-red-500"
                                  title="Delete exercise"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredExercises.length === 0 && (
                      <p className="py-12 text-center text-sm text-gray-500">
                        No exercises found.
                      </p>
                    )}
                  </div>
                </section>
              )}

              {activeTab === "builder" && (
                <section>
                  <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-xl font-bold">
                        {editingPlanId ? "Edit Workout Plan" : "Create Workout Plan"}
                      </h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Organize exercises into a weekly workout schedule.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPlanForm(createEmptyPlan());
                        setEditingPlanId(null);
                        setActiveTab("plans");
                      }}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={savePlan}>
                    <div className="mb-9 grid gap-5 border-b border-white/10 pb-8 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-xs text-gray-400">
                          Workout Plan Name
                        </label>
                        <input
                          required
                          name="name"
                          value={planForm.name}
                          onChange={updatePlanDetails}
                          placeholder="e.g. Muscle Building Program"
                          className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs text-gray-400">
                          Fitness Goal
                        </label>
                        <select
                          name="goal"
                          value={planForm.goal}
                          onChange={updatePlanDetails}
                          className="w-full border-b border-white/20 bg-[#080908] py-3 text-sm outline-none focus:border-[#DFF500]"
                        >
                          <option>Build Muscle</option>
                          <option>Weight Loss</option>
                          <option>Improve Strength</option>
                          <option>Improve Endurance</option>
                          <option>General Fitness</option>
                          <option>Improve Flexibility</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs text-gray-400">
                          Plan Duration
                        </label>
                        <select
                          name="duration"
                          value={planForm.duration}
                          onChange={updatePlanDetails}
                          className="w-full border-b border-white/20 bg-[#080908] py-3 text-sm outline-none focus:border-[#DFF500]"
                        >
                          <option>1 Week</option>
                          <option>2 Weeks</option>
                          <option>4 Weeks</option>
                          <option>6 Weeks</option>
                          <option>8 Weeks</option>
                          <option>12 Weeks</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs text-gray-400">
                          Difficulty Level
                        </label>
                        <select
                          name="level"
                          value={planForm.level}
                          onChange={updatePlanDetails}
                          className="w-full border-b border-white/20 bg-[#080908] py-3 text-sm outline-none focus:border-[#DFF500]"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold">Weekly Schedule</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          Add exercises and configure each training day.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addPlanDay}
                        className="flex items-center gap-2 border border-[#DFF500] px-4 py-2 text-xs font-bold text-[#DFF500] transition hover:bg-[#DFF500] hover:text-black"
                      >
                        <FaPlus />
                        Add Day
                      </button>
                    </div>

                    <div className="space-y-4">
                      {planForm.days.map((day) => (
                        <div
                          key={day.day}
                          className="border border-white/10 bg-white/[0.015]"
                        >
                          <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                            <button
                              type="button"
                              onClick={() => toggleDay(day.day)}
                              className="flex flex-1 items-center gap-3 text-left"
                            >
                              <FaCalendarAlt className="text-[#DFF500]" />
                              <div>
                                <p className="font-bold">{day.day}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {day.restDay
                                    ? "Rest day"
                                    : `${day.exercises.length} exercises added`}
                                </p>
                              </div>
                            </button>

                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() =>
                                  updateDay(day.day, {
                                    restDay: !day.restDay,
                                    exercises: !day.restDay ? [] : day.exercises,
                                  })
                                }
                                className={`text-xs ${
                                  day.restDay
                                    ? "text-[#DFF500]"
                                    : "text-gray-500 hover:text-white"
                                }`}
                              >
                                {day.restDay ? "Rest Day" : "Mark Rest"}
                              </button>

                              <button
                                type="button"
                                onClick={() => removePlanDay(day.day)}
                                className="text-gray-500 transition hover:text-red-500"
                                title="Remove day"
                              >
                                <FaTimes />
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleDay(day.day)}
                                className="text-gray-400"
                              >
                                {expandedDays.includes(day.day) ? (
                                  <FaChevronUp />
                                ) : (
                                  <FaChevronDown />
                                )}
                              </button>
                            </div>
                          </div>

                          {expandedDays.includes(day.day) && (
                            <div className="border-t border-white/10 p-4 sm:p-5">
                              {!day.restDay && (
                                <>
                                  <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                                    <select
                                      value={day.selectedExercise}
                                      onChange={(e) =>
                                        updateDay(day.day, {
                                          selectedExercise: e.target.value,
                                        })
                                      }
                                      className="min-w-0 flex-1 border border-white/10 bg-[#080908] px-3 py-3 text-sm outline-none focus:border-[#DFF500]"
                                    >
                                      <option value="">Choose an exercise</option>
                                      {exercises.map((exercise) => (
                                        <option
                                          key={exercise.id}
                                          value={exercise.id}
                                        >
                                          {exercise.name} — {exercise.muscle}
                                        </option>
                                      ))}
                                    </select>

                                    <button
                                      type="button"
                                      onClick={() => addExerciseToDay(day.day)}
                                      className="flex items-center justify-center gap-2 bg-[#DFF500] px-4 py-3 text-xs font-bold text-black hover:bg-[#c8dc00]"
                                    >
                                      <FaPlus />
                                      Add Exercise
                                    </button>
                                  </div>

                                  {day.exercises.length === 0 ? (
                                    <p className="py-5 text-center text-xs text-gray-500">
                                      No exercises added to this day yet.
                                    </p>
                                  ) : (
                                    <div className="space-y-3">
                                      {day.exercises.map((item) => (
                                        <div
                                          key={item.exerciseId}
                                          className="grid items-end gap-4 border-b border-white/10 pb-4 sm:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
                                        >
                                          <div>
                                            <p className="mb-2 text-xs text-gray-500">
                                              EXERCISE
                                            </p>
                                            <p className="text-sm font-semibold">
                                              {getExerciseName(item.exerciseId)}
                                            </p>
                                          </div>

                                          <div>
                                            <label className="mb-2 block text-xs text-gray-500">
                                              Sets
                                            </label>
                                            <input
                                              type="number"
                                              min="1"
                                              value={item.sets}
                                              onChange={(e) =>
                                                updateDayExercise(
                                                  day.day,
                                                  item.exerciseId,
                                                  "sets",
                                                  Number(e.target.value)
                                                )
                                              }
                                              className="w-full border-b border-white/20 bg-transparent py-2 text-sm outline-none focus:border-[#DFF500]"
                                            />
                                          </div>

                                          <div>
                                            <label className="mb-2 block text-xs text-gray-500">
                                              Reps / Duration
                                            </label>
                                            <input
                                              value={item.reps}
                                              onChange={(e) =>
                                                updateDayExercise(
                                                  day.day,
                                                  item.exerciseId,
                                                  "reps",
                                                  e.target.value
                                                )
                                              }
                                              placeholder="12"
                                              className="w-full border-b border-white/20 bg-transparent py-2 text-sm outline-none focus:border-[#DFF500]"
                                            />
                                          </div>

                                          <div>
                                            <label className="mb-2 block text-xs text-gray-500">
                                              Rest (sec)
                                            </label>
                                            <input
                                              type="number"
                                              min="0"
                                              value={item.rest}
                                              onChange={(e) =>
                                                updateDayExercise(
                                                  day.day,
                                                  item.exerciseId,
                                                  "rest",
                                                  Number(e.target.value)
                                                )
                                              }
                                              className="w-full border-b border-white/20 bg-transparent py-2 text-sm outline-none focus:border-[#DFF500]"
                                            />
                                          </div>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeExerciseFromDay(
                                                day.day,
                                                item.exerciseId
                                              )
                                            }
                                            className="mb-2 text-gray-500 transition hover:text-red-500"
                                            title="Remove exercise"
                                          >
                                            <FaTrash />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}

                              {day.restDay && (
                                <p className="py-5 text-center text-sm text-gray-500">
                                  Recovery day. No exercises scheduled.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#DFF500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#c8dc00] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <FaSave />
                        {saving
                          ? "Saving..."
                          : editingPlanId
                            ? "Update Workout Plan"
                            : "Save Workout Plan"}
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {activeTab === "plans" && (
                <section>
                  <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                      <h2 className="text-xl font-bold">Saved Workout Plans</h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Manage your created workout programs.
                      </p>
                    </div>

                    <button
                      onClick={startNewPlan}
                      className="flex items-center justify-center gap-2 bg-[#DFF500] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#c8dc00]"
                    >
                      <FaPlus />
                      Create Workout Plan
                    </button>
                  </div>

                  <div className="mb-7 flex items-center gap-3 border-b border-white/20 px-2 py-3 sm:w-80">
                    <FaSearch className="text-gray-500" />
                    <input
                      value={planSearch}
                      onChange={(e) => setPlanSearch(e.target.value)}
                      placeholder="Search workout plans..."
                      className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
                    />
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    {filteredPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="border border-white/10 p-5 transition hover:border-white/20 sm:p-6"
                      >
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div>
                            <p className="mb-2 text-xs font-semibold tracking-widest text-[#DFF500]">
                              {plan.goal.toUpperCase()}
                            </p>
                            <h3 className="text-lg font-bold">{plan.name}</h3>
                          </div>

                          <FaDumbbell className="text-xl text-[#DFF500]" />
                        </div>

                        <div className="mb-5 grid grid-cols-3 gap-3 border-y border-white/10 py-4">
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="mt-2 text-sm font-semibold">
                              {plan.duration}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Level</p>
                            <p className="mt-2 text-sm font-semibold">
                              {plan.level}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Exercises</p>
                            <p className="mt-2 text-sm font-semibold">
                              {planExerciseCount(plan)}
                            </p>
                          </div>
                        </div>

                        <div className="mb-5 flex flex-wrap gap-2">
                          {plan.days.map((day) => (
                            <span
                              key={day.day}
                              className={`border px-3 py-2 text-xs ${
                                day.restDay
                                  ? "border-white/10 text-gray-500"
                                  : "border-[#DFF500]/30 text-[#DFF500]"
                              }`}
                            >
                              {day.day.slice(0, 3)}
                              {day.restDay ? " · Rest" : ""}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-4">
                          <p className="text-xs text-gray-500">
                            {plan.days.length} scheduled days
                          </p>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => editPlan(plan)}
                              className="flex items-center gap-2 text-xs text-gray-400 transition hover:text-[#DFF500]"
                            >
                              <FaEdit />
                              Edit
                            </button>

                            <button
                              onClick={() => deletePlan(plan.id)}
                              className="flex items-center gap-2 text-xs text-gray-400 transition hover:text-red-500"
                            >
                              <FaTrash />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredPlans.length === 0 && (
                    <p className="py-12 text-center text-sm text-gray-500">
                      No workout plans found.
                    </p>
                  )}
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {showExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">
          <div className="my-8 w-full max-w-xl border border-white/10 bg-[#11120F] p-6 sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="mb-2 text-xs tracking-widest text-[#DFF500]">
                  EXERCISE LIBRARY
                </p>
                <h2 className="text-2xl font-bold">
                  {editingExercise ? "Edit Exercise" : "Add Exercise"}
                </h2>
              </div>

              <button
                onClick={() => setShowExerciseModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveExercise} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs text-gray-400">
                  Exercise Name
                </label>
                <input
                  required
                  name="name"
                  value={exerciseForm.name}
                  onChange={handleExerciseChange}
                  placeholder="e.g. Incline Dumbbell Press"
                  className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Category
                  </label>
                  <select
                    name="category"
                    value={exerciseForm.category}
                    onChange={handleExerciseChange}
                    className="w-full border-b border-white/20 bg-[#11120F] py-3 text-sm outline-none focus:border-[#DFF500]"
                  >
                    <option>Strength</option>
                    <option>Cardio</option>
                    <option>Core</option>
                    <option>Flexibility</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Muscle Group
                  </label>
                  <input
                    required
                    name="muscle"
                    value={exerciseForm.muscle}
                    onChange={handleExerciseChange}
                    placeholder="e.g. Chest"
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Equipment
                  </label>
                  <select
                    name="equipment"
                    value={exerciseForm.equipment}
                    onChange={handleExerciseChange}
                    className="w-full border-b border-white/20 bg-[#11120F] py-3 text-sm outline-none focus:border-[#DFF500]"
                  >
                    <option>None</option>
                    <option>Barbell</option>
                    <option>Dumbbell</option>
                    <option>Machine</option>
                    <option>Cable</option>
                    <option>Resistance Band</option>
                    <option>Treadmill</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Difficulty Level
                  </label>
                  <select
                    name="level"
                    value={exerciseForm.level}
                    onChange={handleExerciseChange}
                    className="w-full border-b border-white/20 bg-[#11120F] py-3 text-sm outline-none focus:border-[#DFF500]"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-5">
                <button
                  type="button"
                  onClick={() => setShowExerciseModal(false)}
                  className="border border-white/20 px-5 py-3 text-sm text-gray-300 hover:border-white/50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#DFF500] px-6 py-3 text-sm font-bold text-black hover:bg-[#c8dc00] disabled:opacity-50"
                >
                  <FaCheck />
                  {saving
                    ? "Saving..."
                    : editingExercise
                      ? "Save Changes"
                      : "Add to Library"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutOversight;
