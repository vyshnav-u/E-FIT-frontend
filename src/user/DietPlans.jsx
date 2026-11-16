
import React, { useEffect, useState } from "react";
import Header from "../components/UserHeader";
import {
    FaFire,
    FaDrumstickBite,
    FaAppleAlt,
    FaUtensils,
    FaCheck,
    FaChevronDown
} from "react-icons/fa";
import { FiTarget, FiTrendingUp } from "react-icons/fi";

import {
    getUserDietAPI,
    getDailyMealLogsAPI,
    createMealLogAPI
} from "../services/authservice";

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function DietPlans() {
    const [diets, setDiets] = useState([]);
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [mealLogs, setMealLogs] = useState([]);
    const [mealQuantities, setMealQuantities] = useState({});
    const [expandedMeals, setExpandedMeals] = useState({});
    const [loading, setLoading] = useState(true);
    const [savingMealId, setSavingMealId] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const today = getTodayDate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                if (!token) {
                    setError("Please login to view your diet plans.");
                    return;
                }

                const [dietResponse, logResponse] = await Promise.all([
                    getUserDietAPI(token),
                    getDailyMealLogsAPI(today, token)
                ]);

                const availableDiets = dietResponse.data.diets || [];

                setDiets(availableDiets);
                setMealLogs(logResponse.data.logs || []);

                if (availableDiets.length > 0) {
                    setSelectedDiet(availableDiets[0]);
                }
            } catch (error) {
                console.log(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load diet information."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const selectedLogs = mealLogs.filter(
        (log) => String(log.dietPlan) === String(selectedDiet?._id)
    );

    const consumedCalories = selectedLogs.reduce(
        (total, log) => total + log.totalCalories,
        0
    );

    const consumedProtein = selectedLogs.reduce(
        (total, log) => total + log.totalProtein,
        0
    );

    const calorieTarget = selectedDiet?.totalCalories || 0;
    const proteinTarget = selectedDiet?.totalProtein || 0;

    const caloriePercentage = calorieTarget > 0
        ? Math.min((consumedCalories / calorieTarget) * 100, 100)
        : 0;

    const proteinPercentage = proteinTarget > 0
        ? Math.min((consumedProtein / proteinTarget) * 100, 100)
        : 0;

    const completedMeals = selectedLogs.length;
    const totalMeals = selectedDiet?.meals?.length || 0;

    const isMealTaken = (mealId) => {
        return selectedLogs.some(
            (log) => String(log.mealId) === String(mealId)
        );
    };

    const getMealLog = (mealId) => {
        return selectedLogs.find(
            (log) => String(log.mealId) === String(mealId)
        );
    };

    const handleDietChange = (diet) => {
        setSelectedDiet(diet);
        setExpandedMeals({});
        setSuccessMessage("");
    };

    const toggleMeal = (mealId) => {
        setExpandedMeals((previous) => ({
            ...previous,
            [mealId]: !previous[mealId]
        }));
    };

    const handleQuantityChange = (mealId, foodId, quantity) => {
        setMealQuantities((previous) => ({
            ...previous,
            [mealId]: {
                ...previous[mealId],
                [foodId]: quantity
            }
        }));
    };

    const handleLogMeal = async (meal) => {
        try {
            setError("");
            setSuccessMessage("");

            const mealId = meal._id;

            if (isMealTaken(mealId)) {
                return;
            }

            const foods = meal.foods.map((food) => ({
                foodItemId: food._id,
                quantity: Number(
                    mealQuantities[mealId]?.[food._id] ?? food.quantity
                )
            }));

            if (foods.some((food) => !Number.isFinite(food.quantity) || food.quantity < 0)) {
                setError("Please enter valid food quantities.");
                return;
            }

            if (!foods.some((food) => food.quantity > 0)) {
                setError("Enter at least one food quantity greater than zero.");
                return;
            }

            setSavingMealId(mealId);

            const response = await createMealLogAPI(
                {
                    dietPlanId: selectedDiet._id,
                    mealId,
                    date: today,
                    foods
                },
                token
            );

            const savedLog = response.data.log;

            setMealLogs((previous) => [
                ...previous,
                savedLog
            ]);

            setSuccessMessage(
                `${meal.mealName} recorded successfully!`
            );

            setExpandedMeals((previous) => ({
                ...previous,
                [mealId]: true
            }));
        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to record meal."
            );
        } finally {
            setSavingMealId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">
            <Header />

            <main className="px-5 md:px-10 lg:px-14 py-10">

                <div className="mb-10">
                    <p className="text-[#DFF500] text-[10px] tracking-[3px] uppercase mb-4">
                        Nutrition management
                    </p>

                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                        Diet Plans<span className="text-[#DFF500]">.</span>
                    </h1>

                    <p className="text-sm text-gray-500 mt-3">
                        Track what you eat. Understand your nutrition. Stay consistent.
                    </p>
                </div>

                {loading && (
                    <div className="bg-[#171916] rounded-2xl p-10 text-center">
                        <p className="text-sm text-gray-400">
                            Loading your diet information...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-[#171916] border border-red-500/20 rounded-2xl p-5 mb-6">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                {!loading && successMessage && (
                    <div className="bg-[#DFF500]/10 border border-[#DFF500]/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <FaCheck className="text-[#DFF500]" />

                        <p className="text-sm text-[#DFF500]">
                            {successMessage}
                        </p>
                    </div>
                )}

                {!loading && diets.length === 0 && !error && (
                    <div className="bg-[#171916] rounded-2xl p-10 text-center">
                        <FaUtensils className="text-[#DFF500] text-3xl mx-auto mb-4" />

                        <h2 className="text-xl font-semibold">
                            No Active Diet Plans
                        </h2>

                        <p className="text-sm text-gray-500 mt-3">
                            Check again later for available diet plans.
                        </p>
                    </div>
                )}

                {!loading && selectedDiet && (
                    <>
                        <section className="mb-8">
                            <div className="mb-5">
                                <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                    AVAILABLE PROGRAMS
                                </p>

                                <h2 className="text-xl font-semibold">
                                    Select Your Diet Plan
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {diets.map((diet) => (
                                    <button
                                        key={diet._id}
                                        onClick={() => handleDietChange(diet)}
                                        className={`text-left rounded-2xl p-5 border transition ${selectedDiet._id === diet._id
                                                ? "bg-[#DFF500]/10 border-[#DFF500]"
                                                : "bg-[#171916] border-white/5 hover:border-white/20"
                                            }`}
                                    >
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold">
                                                {diet.name}
                                            </h3>

                                            {selectedDiet._id === diet._id && (
                                                <FaCheck className="text-[#DFF500]" />
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-500 mt-3">
                                            {diet.description || "No description available."}
                                        </p>

                                        <div className="flex gap-5 mt-5 text-xs">
                                            <span>
                                                <FaFire className="inline text-[#DFF500] mr-2" />
                                                {diet.totalCalories} kcal
                                            </span>

                                            <span>
                                                <FaDrumstickBite className="inline text-[#DFF500] mr-2" />
                                                {diet.totalProtein}g
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>


                        <section className="bg-[#171916] border border-white/5 rounded-[28px] p-6 md:p-8 mb-6">

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div>
                                    <p className="text-[#DFF500] text-[10px] tracking-[2px] mb-2">
                                        DAILY NUTRITION OVERVIEW
                                    </p>

                                    <h2 className="text-2xl font-semibold">
                                        Your Daily Progress<span className="text-[#DFF500]">.</span>
                                    </h2>

                                    <p className="text-xs text-gray-500 mt-2">
                                        {today} · {selectedDiet.name}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 bg-[#22241F] rounded-xl px-4 py-3">
                                    <FiTrendingUp className="text-[#DFF500]" />
                                    <span className="text-xs text-gray-400">
                                        Today's nutrition
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">

                                    <div className="bg-[#22241F] rounded-2xl p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="w-11 h-11 rounded-xl bg-[#DFF500]/10 flex items-center justify-center">
                                                <FaFire className="text-[#DFF500] text-lg" />
                                            </div>

                                            <span className="text-[10px] text-gray-500 tracking-wider">
                                                CALORIES
                                            </span>
                                        </div>

                                        <h3 className="text-3xl font-semibold">
                                            {Math.round(consumedCalories)}
                                            <span className="text-sm text-gray-500 ml-2 font-normal">
                                                kcal
                                            </span>
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-2">
                                            Target: {calorieTarget} kcal
                                        </p>

                                        <div className="mt-6">
                                            <div className="flex justify-between items-center text-xs mb-3">
                                                <span className="text-gray-400">Daily progress</span>
                                                <span className="text-[#DFF500] font-semibold">
                                                    {Math.round(caloriePercentage)}%
                                                </span>
                                            </div>

                                            <div className="h-2.5 bg-[#111310] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#DFF500] rounded-full transition-all duration-500"
                                                    style={{ width: `${caloriePercentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500">
                                                Remaining
                                            </span>

                                            <span className="text-sm font-semibold">
                                                {Math.max(0, calorieTarget - consumedCalories).toFixed(0)} kcal
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-[#22241F] rounded-2xl p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="w-11 h-11 rounded-xl bg-[#DFF500]/10 flex items-center justify-center">
                                                <FaDrumstickBite className="text-[#DFF500] text-lg" />
                                            </div>

                                            <span className="text-[10px] text-gray-500 tracking-wider">
                                                PROTEIN
                                            </span>
                                        </div>

                                        <h3 className="text-3xl font-semibold">
                                            {consumedProtein.toFixed(1)}
                                            <span className="text-sm text-gray-500 ml-2 font-normal">
                                                g
                                            </span>
                                        </h3>

                                        <p className="text-xs text-gray-500 mt-2">
                                            Target: {proteinTarget}g
                                        </p>

                                        <div className="mt-6">
                                            <div className="flex justify-between items-center text-xs mb-3">
                                                <span className="text-gray-400">Daily progress</span>
                                                <span className="text-[#DFF500] font-semibold">
                                                    {Math.round(proteinPercentage)}%
                                                </span>
                                            </div>

                                            <div className="h-2.5 bg-[#111310] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#DFF500] rounded-full transition-all duration-500"
                                                    style={{ width: `${proteinPercentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] text-gray-500">
                                                Remaining
                                            </span>

                                            <span className="text-sm font-semibold">
                                                {Math.max(0, proteinTarget - consumedProtein).toFixed(1)}g
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <div className="bg-[#22241F] rounded-2xl p-6 flex flex-col items-center justify-center">

                                    <p className="text-[10px] text-gray-500 tracking-[2px] mb-7">
                                        MEAL COMPLETION
                                    </p>

                                    <div
                                        className="w-40 h-40 rounded-full flex items-center justify-center"
                                        style={{
                                            background: `conic-gradient(#DFF500 ${totalMeals > 0
                                                    ? (completedMeals / totalMeals) * 360
                                                    : 0
                                                }deg, #34372F 0deg)`
                                        }}
                                    >
                                        <div className="w-[124px] h-[124px] rounded-full bg-[#22241F] flex flex-col items-center justify-center">
                                            <h3 className="text-3xl font-bold">
                                                {totalMeals > 0
                                                    ? Math.round((completedMeals / totalMeals) * 100)
                                                    : 0}%
                                            </h3>

                                            <p className="text-[10px] text-gray-500 mt-1">
                                                Completed
                                            </p>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold mt-7">
                                        {completedMeals} of {totalMeals} meals
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        {completedMeals === totalMeals && totalMeals > 0
                                            ? "All meals recorded today!"
                                            : `${Math.max(0, totalMeals - completedMeals)} meals remaining today`}
                                    </p>

                                    <div className="w-full mt-6 pt-5 border-t border-white/5 flex justify-between text-xs">
                                        <span className="text-gray-500">Recorded</span>
                                        <span className="text-[#DFF500] font-semibold">
                                            {completedMeals} meals
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </section>


                        <section className="bg-[#DFF500] text-black rounded-[28px] p-7 md:p-9 mb-6">
                            <FiTarget className="text-3xl mb-5" />

                            <p className="text-[10px] tracking-[2px] font-semibold opacity-60">
                                YOUR SELECTED PLAN
                            </p>

                            <h2 className="text-3xl font-bold mt-3">
                                {selectedDiet.name}
                            </h2>

                            <p className="text-sm mt-3 opacity-70">
                                {selectedDiet.description}
                            </p>

                            <div className="flex flex-wrap gap-8 mt-7 pt-6 border-t border-black/15">
                                <div>
                                    <p className="text-xs opacity-60">
                                        Remaining calories
                                    </p>

                                    <p className="text-2xl font-bold mt-1">
                                        {Math.max(0, calorieTarget - consumedCalories).toFixed(0)} kcal
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs opacity-60">
                                        Remaining protein
                                    </p>

                                    <p className="text-2xl font-bold mt-1">
                                        {Math.max(0, proteinTarget - consumedProtein).toFixed(1)}g
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="bg-[#171916] border border-white/5 rounded-[28px] p-7 md:p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <p className="text-[10px] tracking-[2px] text-gray-500 mb-2">
                                        DAILY MEAL TRACKER
                                    </p>

                                    <h2 className="text-xl font-semibold">
                                        Record Your Meals
                                    </h2>
                                </div>

                                <FaUtensils className="text-[#DFF500] text-2xl" />
                            </div>

                            <div className="space-y-4">
                                {selectedDiet.meals?.map((meal, index) => {
                                    const taken = isMealTaken(meal._id);
                                    const savedLog = getMealLog(meal._id);

                                    return (
                                        <div
                                            key={meal._id}
                                            className="bg-[#22241F] rounded-2xl overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleMeal(meal._id)}
                                                className="w-full p-5 flex items-center justify-between gap-4 text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-[#DFF500]/10 text-[#DFF500] flex items-center justify-center text-xl">
                                                        {index === 0 ? (
                                                            <FaAppleAlt />
                                                        ) : (
                                                            <FaUtensils />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] text-gray-500 mb-1">
                                                            MEAL {index + 1}
                                                        </p>

                                                        <h3 className="text-sm font-semibold">
                                                            {meal.mealName}
                                                        </h3>

                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {meal.foods?.length || 0} food items
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold">
                                                            {meal.totalCalories} kcal
                                                        </p>

                                                        <p className="text-[10px] text-gray-500">
                                                            {meal.totalProtein}g protein
                                                        </p>

                                                        {taken && (
                                                            <span className="text-[10px] text-[#DFF500]">
                                                                RECORDED
                                                            </span>
                                                        )}
                                                    </div>

                                                    <FaChevronDown
                                                        className={`text-gray-400 transition-transform ${expandedMeals[meal._id]
                                                                ? "rotate-180"
                                                                : ""
                                                            }`}
                                                    />
                                                </div>
                                            </button>

                                            {expandedMeals[meal._id] && (
                                                <div className="px-5 pb-5">
                                                    <div className="border-t border-white/10 pt-5">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h4 className="text-xs font-semibold">
                                                                Food quantities
                                                            </h4>

                                                            <span className="text-[10px] text-gray-500">
                                                                Quantity in grams
                                                            </span>
                                                        </div>

                                                        <div className="space-y-4">
                                                            {meal.foods?.map((food) => (
                                                                <div
                                                                    key={food._id}
                                                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                                                >
                                                                    <div>
                                                                        <p className="text-sm font-medium">
                                                                            {food.foodName}
                                                                        </p>

                                                                        <p className="text-[10px] text-gray-500 mt-1">
                                                                            {food.caloriesPer100g} kcal / 100g · {food.proteinPer100g}g protein / 100g
                                                                        </p>
                                                                    </div>

                                                                    <div className="flex items-center gap-3">
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            step="1"
                                                                            disabled={taken}
                                                                            value={
                                                                                mealQuantities[meal._id]?.[food._id] ??
                                                                                food.quantity
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleQuantityChange(
                                                                                    meal._id,
                                                                                    food._id,
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            className="w-24 bg-[#171916] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#DFF500] disabled:opacity-50"
                                                                        />

                                                                        <span className="text-xs text-gray-500">
                                                                            g
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {taken ? (
                                                            <div className="mt-6 bg-[#DFF500]/10 border border-[#DFF500]/20 rounded-xl p-4">
                                                                <div className="flex items-center gap-2 text-[#DFF500]">
                                                                    <FaCheck />

                                                                    <p className="text-sm font-semibold">
                                                                        Meal Recorded Successfully
                                                                    </p>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                                    <div>
                                                                        <p className="text-[10px] text-gray-500">
                                                                            ACTUALLY CONSUMED
                                                                        </p>

                                                                        <p className="text-lg font-semibold mt-1">
                                                                            {savedLog?.totalCalories} kcal
                                                                        </p>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-[10px] text-gray-500">
                                                                            PROTEIN CONSUMED
                                                                        </p>

                                                                        <p className="text-lg font-semibold mt-1">
                                                                            {savedLog?.totalProtein}g
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <p className="text-[10px] text-gray-500 mt-3">
                                                                    Recorded at: {savedLog?.takenAt ? new Date(savedLog.takenAt).toLocaleTimeString() : ""}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleLogMeal(meal)}
                                                                disabled={savingMealId === meal._id}
                                                                className="w-full mt-6 bg-[#DFF500] text-black rounded-xl py-3 text-sm font-semibold hover:bg-[#c9dc00] transition disabled:opacity-50"
                                                            >
                                                                {savingMealId === meal._id
                                                                    ? "Saving Meal..."
                                                                    : "Mark Meal as Taken"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <div className="mt-6 flex items-center gap-3 bg-[#171916] border border-white/5 rounded-2xl p-5">
                            <FaCheck className="text-[#DFF500] text-xl shrink-0" />

                            <p className="text-xs text-gray-400 leading-relaxed">
                                Your meal records are saved securely against your account. Your daily progress is calculated using the actual food quantities you record.
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default DietPlans;
