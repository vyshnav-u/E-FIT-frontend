
import React, { useEffect, useMemo, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import {
    FaSearch,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaAppleAlt,
    FaUtensils,
    FaChevronDown,
    FaChevronUp,
    FaSave
} from "react-icons/fa";
import {
    getFoodsAPI,
    createFoodAPI,
    updateFoodAPI,
    deleteFoodAPI,
    getDietAPI,
    createDietAPI,
    updateDietAPI,
    deleteDietAPI
} from "../services/authservice";

const emptyFood = {
    name: "",
    caloriesPer100g: "",
    proteinPer100g: ""
};

const emptyDiet = {
    name: "",
    description: "",
    status: "Active"
};

const createEmptyMeal = () => ({
    mealName: "",
    foods: []
});

function DietOversight() {
    const [activeTab, setActiveTab] = useState("foods");

    const [foods, setFoods] = useState([]);
    const [diets, setDiets] = useState([]);

    const [foodSearch, setFoodSearch] = useState("");
    const [dietSearch, setDietSearch] = useState("");

    const [showFoodModal, setShowFoodModal] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [foodForm, setFoodForm] = useState({ ...emptyFood });

    const [showDietModal, setShowDietModal] = useState(false);
    const [editingDiet, setEditingDiet] = useState(null);
    const [dietForm, setDietForm] = useState({ ...emptyDiet });
    const [meals, setMeals] = useState([createEmptyMeal()]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);

        try {
            const [foodResponse, dietResponse] = await Promise.all([
                getFoodsAPI(token),
                getDietAPI(token)
            ]);

            setFoods(foodResponse.data.foods || []);
            setDiets(dietResponse.data.diets || []);
        } catch (error) {
            console.log(error);
            window.alert(
                error.response?.data?.message ||
                "Failed to load nutrition data"
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredFoods = useMemo(() => {
        return foods.filter((food) =>
            food.name.toLowerCase().includes(foodSearch.toLowerCase())
        );
    }, [foods, foodSearch]);

    const filteredDiets = useMemo(() => {
        return diets.filter((diet) =>
            diet.name.toLowerCase().includes(dietSearch.toLowerCase())
        );
    }, [diets, dietSearch]);

    const totalActiveDiets = diets.filter(
        (diet) => diet.status === "Active"
    ).length;

    const getMealTotals = (meal) => {
        return meal.foods.reduce(
            (totals, item) => {
                const selectedFood = foods.find(
                    (food) => food._id === item.food
                );

                if (!selectedFood) return totals;

                const quantity = Number(item.quantity) || 0;

                totals.calories +=
                    (quantity / 100) * selectedFood.caloriesPer100g;

                totals.protein +=
                    (quantity / 100) * selectedFood.proteinPer100g;

                return totals;
            },
            { calories: 0, protein: 0 }
        );
    };

    const dietTotals = meals.reduce(
        (totals, meal) => {
            const mealTotals = getMealTotals(meal);

            totals.calories += mealTotals.calories;
            totals.protein += mealTotals.protein;

            return totals;
        },
        { calories: 0, protein: 0 }
    );

    const formatNumber = (value) => Number(value.toFixed(2));

    const openAddFood = () => {
        setEditingFood(null);
        setFoodForm({ ...emptyFood });
        setShowFoodModal(true);
    };

    const openEditFood = (food) => {
        setEditingFood(food);

        setFoodForm({
            name: food.name,
            caloriesPer100g: food.caloriesPer100g,
            proteinPer100g: food.proteinPer100g
        });

        setShowFoodModal(true);
    };

    const handleFoodChange = (e) => {
        setFoodForm({
            ...foodForm,
            [e.target.name]: e.target.value
        });
    };

    const handleFoodSubmit = async (e) => {
        e.preventDefault();

        const foodData = {
            name: foodForm.name.trim(),
            caloriesPer100g: Number(foodForm.caloriesPer100g),
            proteinPer100g: Number(foodForm.proteinPer100g)
        };

        setSaving(true);

        try {
            if (editingFood) {
                const response = await updateFoodAPI(
                    editingFood._id,
                    foodData,
                    token
                );

                setFoods((previous) =>
                    previous.map((food) =>
                        food._id === editingFood._id
                            ? response.data.food
                            : food
                    )
                );
            } else {
                const response = await createFoodAPI(foodData, token);

                setFoods((previous) => [
                    ...previous,
                    response.data.food
                ]);
            }

            setShowFoodModal(false);
            setFoodForm({ ...emptyFood });
            setEditingFood(null);
        } catch (error) {
            console.log(error);
            window.alert(
                error.response?.data?.message || "Failed to save food"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleFoodDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this food?"
        );

        if (!confirmed) return;

        try {
            await deleteFoodAPI(id, token);

            setFoods((previous) =>
                previous.filter((food) => food._id !== id)
            );
        } catch (error) {
            console.log(error);
            window.alert(
                error.response?.data?.message || "Failed to delete food"
            );
        }
    };

    const closeFoodModal = () => {
        setShowFoodModal(false);
        setEditingFood(null);
        setFoodForm({ ...emptyFood });
    };

    const openAddDiet = () => {
        setEditingDiet(null);
        setDietForm({ ...emptyDiet });
        setMeals([createEmptyMeal()]);
        setShowDietModal(true);
    };

    const openEditDiet = (diet) => {
        setEditingDiet(diet);

        setDietForm({
            name: diet.name,
            description: diet.description || "",
            status: diet.status
        });

        setMeals(
            diet.meals.map((meal) => ({
                mealName: meal.mealName,
                foods: meal.foods.map((item) => ({
                    food:
                        typeof item.food === "object"
                            ? item.food?._id
                            : item.food,
                    quantity: item.quantity
                }))
            }))
        );

        setShowDietModal(true);
    };

    const handleDietChange = (e) => {
        setDietForm({
            ...dietForm,
            [e.target.name]: e.target.value
        });
    };

    const addMeal = () => {
        setMeals((previous) => [
            ...previous,
            createEmptyMeal()
        ]);
    };

    const removeMeal = (mealIndex) => {
        setMeals((previous) =>
            previous.filter((_, index) => index !== mealIndex)
        );
    };

    const updateMealName = (mealIndex, value) => {
        setMeals((previous) =>
            previous.map((meal, index) =>
                index === mealIndex
                    ? { ...meal, mealName: value }
                    : meal
            )
        );
    };

    const addFoodToMeal = (mealIndex) => {
        setMeals((previous) =>
            previous.map((meal, index) =>
                index === mealIndex
                    ? {
                        ...meal,
                        foods: [
                            ...meal.foods,
                            { food: "", quantity: 100 }
                        ]
                    }
                    : meal
            )
        );
    };

    const updateMealFood = (mealIndex, foodIndex, field, value) => {
        setMeals((previous) =>
            previous.map((meal, index) => {
                if (index !== mealIndex) return meal;

                return {
                    ...meal,
                    foods: meal.foods.map((item, itemIndex) =>
                        itemIndex === foodIndex
                            ? { ...item, [field]: value }
                            : item
                    )
                };
            })
        );
    };

    const removeFoodFromMeal = (mealIndex, foodIndex) => {
        setMeals((previous) =>
            previous.map((meal, index) =>
                index === mealIndex
                    ? {
                        ...meal,
                        foods: meal.foods.filter(
                            (_, itemIndex) => itemIndex !== foodIndex
                        )
                    }
                    : meal
            )
        );
    };

    const handleDietSubmit = async (e) => {
        e.preventDefault();

        if (foods.length === 0) {
            window.alert("Please add foods to the Food Library first.");
            return;
        }

        const invalidMeal = meals.some(
            (meal) =>
                !meal.mealName.trim() ||
                meal.foods.length === 0 ||
                meal.foods.some(
                    (item) =>
                        !item.food ||
                        !Number.isFinite(Number(item.quantity)) ||
                        Number(item.quantity) <= 0
                )
        );

        if (invalidMeal) {
            window.alert(
                "Enter a name for every meal and select foods with valid quantities."
            );
            return;
        }

        const dietData = {
            ...dietForm,
            meals: meals.map((meal) => ({
                mealName: meal.mealName,
                foods: meal.foods.map((item) => ({
                    food: item.food,
                    quantity: Number(item.quantity)
                }))
            }))
        };

        setSaving(true);

        try {
            if (editingDiet) {
                const response = await updateDietAPI(
                    editingDiet._id,
                    dietData,
                    token
                );

                setDiets((previous) =>
                    previous.map((diet) =>
                        diet._id === editingDiet._id
                            ? response.data.diet
                            : diet
                    )
                );
            } else {
                const response = await createDietAPI(dietData, token);

                setDiets((previous) => [
                    response.data.diet,
                    ...previous
                ]);
            }

            setShowDietModal(false);
            setEditingDiet(null);
            setDietForm({ ...emptyDiet });
            setMeals([createEmptyMeal()]);
        } catch (error) {
            console.log(error);
            window.alert(
                error.response?.data?.message || "Failed to save diet plan"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDietDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this diet plan?"
        );

        if (!confirmed) return;

        try {
            await deleteDietAPI(id, token);

            setDiets((previous) =>
                previous.filter((diet) => diet._id !== id)
            );
        } catch (error) {
            console.log(error);
            window.alert(
                error.response?.data?.message || "Failed to delete diet plan"
            );
        }
    };

    const closeDietModal = () => {
        setShowDietModal(false);
        setEditingDiet(null);
        setDietForm({ ...emptyDiet });
        setMeals([createEmptyMeal()]);
    };

    return (
        <div className="min-h-screen bg-[#080908] text-[#EBEDE3]">
            <AdminHeader />

            <div className="lg:grid lg:grid-cols-[250px_1fr]">
                <AdminSidebar />

                <main className="min-w-0 p-5 sm:p-8 lg:p-10">

                    <div className="mb-10">
                        <p className="mb-2 text-xs font-bold tracking-[0.3em] text-[#DFF500]">
                            ADMINISTRATION / NUTRITION
                        </p>

                        <h1 className="text-3xl font-black sm:text-4xl">
                            Diet Management
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Manage your food library and build nutrition plans.
                        </p>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 border-y border-white/10 py-6 sm:grid-cols-3">
                        <div>
                            <p className="mb-3 text-xs tracking-widest text-gray-500">
                                FOOD LIBRARY
                            </p>
                            <p className="text-3xl font-bold">
                                {foods.length}
                            </p>
                        </div>

                        <div>
                            <p className="mb-3 text-xs tracking-widest text-gray-500">
                                TOTAL DIET PLANS
                            </p>
                            <p className="text-3xl font-bold">
                                {diets.length}
                            </p>
                        </div>

                        <div>
                            <p className="mb-3 text-xs tracking-widest text-gray-500">
                                ACTIVE DIET PLANS
                            </p>
                            <p className="text-3xl font-bold text-[#DFF500]">
                                {totalActiveDiets}
                            </p>
                        </div>
                    </div>

                    <div className="mb-8 flex gap-8 border-b border-white/10">
                        <button
                            onClick={() => setActiveTab("foods")}
                            className={`pb-4 text-sm font-semibold transition ${
                                activeTab === "foods"
                                    ? "border-b-2 border-[#DFF500] text-[#DFF500]"
                                    : "text-gray-500 hover:text-white"
                            }`}
                        >
                            <FaAppleAlt className="mr-2 inline" />
                            Food Library
                        </button>

                        <button
                            onClick={() => setActiveTab("diets")}
                            className={`pb-4 text-sm font-semibold transition ${
                                activeTab === "diets"
                                    ? "border-b-2 border-[#DFF500] text-[#DFF500]"
                                    : "text-gray-500 hover:text-white"
                            }`}
                        >
                            <FaUtensils className="mr-2 inline" />
                            Diet Plans
                        </button>
                    </div>

                    {loading ? (
                        <p className="py-16 text-center text-sm text-gray-500">
                            Loading nutrition data...
                        </p>
                    ) : (
                        <>
                            {activeTab === "foods" && (
                                <section>
                                    <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                Food Library
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Nutrition values are stored per 100 grams.
                                            </p>
                                        </div>

                                        <button
                                            onClick={openAddFood}
                                            className="flex items-center justify-center gap-2 bg-[#DFF500] px-5 py-3 text-sm font-bold text-black hover:bg-[#c8dc00]"
                                        >
                                            <FaPlus />
                                            Add Food
                                        </button>
                                    </div>

                                    <div className="mb-6 flex items-center gap-3 border-b border-white/20 px-2 py-3 sm:w-80">
                                        <FaSearch className="text-gray-500" />
                                        <input
                                            value={foodSearch}
                                            onChange={(e) => setFoodSearch(e.target.value)}
                                            placeholder="Search foods..."
                                            className="w-full bg-transparent text-sm outline-none"
                                        />
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[600px] text-left">
                                            <thead>
                                                <tr className="border-b border-white/10 text-xs tracking-widest text-gray-500">
                                                    <th className="px-4 py-4">FOOD NAME</th>
                                                    <th className="px-4 py-4">QUANTITY</th>
                                                    <th className="px-4 py-4">CALORIES</th>
                                                    <th className="px-4 py-4">PROTEIN</th>
                                                    <th className="px-4 py-4">ACTIONS</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {filteredFoods.map((food) => (
                                                    <tr
                                                        key={food._id}
                                                        className="border-b border-white/10 hover:bg-white/[0.02]"
                                                    >
                                                        <td className="px-4 py-5 font-semibold">
                                                            {food.name}
                                                        </td>

                                                        <td className="px-4 py-5 text-sm text-gray-400">
                                                            100 g
                                                        </td>

                                                        <td className="px-4 py-5 text-sm text-gray-400">
                                                            {food.caloriesPer100g} kcal
                                                        </td>

                                                        <td className="px-4 py-5 text-sm text-gray-400">
                                                            {food.proteinPer100g} g
                                                        </td>

                                                        <td className="px-4 py-5">
                                                            <div className="flex gap-4">
                                                                <button
                                                                    onClick={() => openEditFood(food)}
                                                                    className="text-gray-400 hover:text-[#DFF500]"
                                                                >
                                                                    <FaEdit />
                                                                </button>

                                                                <button
                                                                    onClick={() => handleFoodDelete(food._id)}
                                                                    className="text-gray-400 hover:text-red-500"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {filteredFoods.length === 0 && (
                                            <p className="py-12 text-center text-sm text-gray-500">
                                                No foods found. Add your first food.
                                            </p>
                                        )}
                                    </div>
                                </section>
                            )}

                            {activeTab === "diets" && (
                                <section>
                                    <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                Diet Plans
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Build meals using foods from your library.
                                            </p>
                                        </div>

                                        <button
                                            onClick={openAddDiet}
                                            disabled={foods.length === 0}
                                            className="flex items-center justify-center gap-2 bg-[#DFF500] px-5 py-3 text-sm font-bold text-black hover:bg-[#c8dc00] disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <FaPlus />
                                            Create Diet Plan
                                        </button>
                                    </div>

                                    <div className="mb-6 flex items-center gap-3 border-b border-white/20 px-2 py-3 sm:w-80">
                                        <FaSearch className="text-gray-500" />
                                        <input
                                            value={dietSearch}
                                            onChange={(e) => setDietSearch(e.target.value)}
                                            placeholder="Search diet plans..."
                                            className="w-full bg-transparent text-sm outline-none"
                                        />
                                    </div>

                                    <div className="space-y-5">
                                        {filteredDiets.map((diet) => (
                                            <div
                                                key={diet._id}
                                                className="border-b border-white/10 py-6"
                                            >
                                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <h3 className="text-lg font-bold">
                                                                {diet.name}
                                                            </h3>

                                                            <span className={`text-xs ${
                                                                diet.status === "Active"
                                                                    ? "text-[#DFF500]"
                                                                    : "text-gray-500"
                                                            }`}>
                                                                {diet.status}
                                                            </span>
                                                        </div>

                                                        {diet.description && (
                                                            <p className="mt-2 text-sm text-gray-500">
                                                                {diet.description}
                                                            </p>
                                                        )}

                                                        <div className="mt-4 flex flex-wrap gap-5 text-sm">
                                                            <span>
                                                                <span className="font-bold text-[#DFF500]">
                                                                    {formatNumber(diet.totalCalories || 0)}
                                                                </span>
                                                                <span className="text-gray-500"> kcal</span>
                                                            </span>

                                                            <span>
                                                                <span className="font-bold text-[#DFF500]">
                                                                    {formatNumber(diet.totalProtein || 0)} g
                                                                </span>
                                                                <span className="text-gray-500"> protein</span>
                                                            </span>

                                                            <span className="text-gray-500">
                                                                {diet.meals.length} meals
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <button
                                                            onClick={() => openEditDiet(diet)}
                                                            className="text-gray-400 hover:text-[#DFF500]"
                                                        >
                                                            <FaEdit />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDietDelete(diet._id)}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                                    {diet.meals.map((meal, index) => (
                                                        <div
                                                            key={meal._id || index}
                                                            className="border border-white/10 p-4"
                                                        >
                                                            <h4 className="mb-3 font-semibold">
                                                                {meal.mealName}
                                                            </h4>

                                                            <div className="space-y-2">
                                                                {meal.foods.map((item, foodIndex) => (
                                                                    <div
                                                                        key={item._id || foodIndex}
                                                                        className="flex justify-between gap-3 text-sm"
                                                                    >
                                                                        <span className="text-gray-400">
                                                                            {item.foodName} · {item.quantity} g
                                                                        </span>

                                                                        <span className="whitespace-nowrap text-gray-300">
                                                                            {formatNumber(item.totalCalories)} kcal
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <div className="mt-4 flex justify-between border-t border-white/10 pt-3 text-xs">
                                                                <span className="text-gray-500">
                                                                    MEAL TOTAL
                                                                </span>

                                                                <span className="font-semibold text-[#DFF500]">
                                                                    {formatNumber(meal.totalCalories)} kcal · {formatNumber(meal.totalProtein)} g protein
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {filteredDiets.length === 0 && (
                                            <p className="py-12 text-center text-sm text-gray-500">
                                                No diet plans found. Create your first plan.
                                            </p>
                                        )}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </main>
            </div>

            {showFoodModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/80 p-4">
                    <div className="my-8 w-full max-w-xl border border-white/10 bg-[#11120F] p-6 sm:p-8">
                        <div className="mb-7 flex items-center justify-between">
                            <div>
                                <p className="mb-2 text-xs tracking-widest text-[#DFF500]">
                                    FOOD LIBRARY
                                </p>
                                <h2 className="text-2xl font-bold">
                                    {editingFood ? "Edit Food" : "Add Food"}
                                </h2>
                            </div>

                            <button onClick={closeFoodModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleFoodSubmit} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-xs text-gray-400">
                                    Food Name
                                </label>
                                <input
                                    required
                                    name="name"
                                    value={foodForm.name}
                                    onChange={handleFoodChange}
                                    placeholder="Chicken Breast"
                                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                                />
                            </div>

                            <p className="text-xs font-bold tracking-widest text-[#DFF500]">
                                NUTRITION PER 100 GRAMS
                            </p>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="mb-2 block text-xs text-gray-400">
                                        Calories (kcal)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="caloriesPer100g"
                                        value={foodForm.caloriesPer100g}
                                        onChange={handleFoodChange}
                                        className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs text-gray-400">
                                        Protein (g)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="any"
                                        name="proteinPer100g"
                                        value={foodForm.proteinPer100g}
                                        onChange={handleFoodChange}
                                        className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeFoodModal}
                                    className="border border-white/20 px-5 py-3 text-sm"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#DFF500] px-6 py-3 text-sm font-bold text-black disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : editingFood ? "Save Changes" : "Add Food"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDietModal && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/80 p-4">
                    <div className="my-6 w-full max-w-4xl border border-white/10 bg-[#11120F] p-5 sm:p-8">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <p className="mb-2 text-xs tracking-widest text-[#DFF500]">
                                    NUTRITION PLANNER
                                </p>

                                <h2 className="text-2xl font-bold">
                                    {editingDiet ? "Edit Diet Plan" : "Create Diet Plan"}
                                </h2>
                            </div>

                            <button onClick={closeDietModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleDietSubmit} className="space-y-7">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs text-gray-400">
                                        Diet Plan Name
                                    </label>

                                    <input
                                        required
                                        name="name"
                                        value={dietForm.name}
                                        onChange={handleDietChange}
                                        placeholder="Muscle Building Diet"
                                        className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs text-gray-400">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={dietForm.status}
                                        onChange={handleDietChange}
                                        className="w-full border-b border-white/20 bg-[#11120F] py-3 text-sm outline-none focus:border-[#DFF500]"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs text-gray-400">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={dietForm.description}
                                    onChange={handleDietChange}
                                    rows="2"
                                    placeholder="Describe this diet plan..."
                                    className="w-full resize-none border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                                />
                            </div>

                            <div className="border border-[#DFF500]/30 bg-[#DFF500]/[0.04] p-5">
                                <p className="mb-4 text-xs tracking-widest text-gray-400">
                                    AUTOMATIC DAILY NUTRITION TOTAL
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-2xl font-bold text-[#DFF500]">
                                            {formatNumber(dietTotals.calories)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            CALORIES (KCAL)
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-2xl font-bold text-[#DFF500]">
                                            {formatNumber(dietTotals.protein)} g
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PROTEIN
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">
                                        Meals
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={addMeal}
                                        className="flex items-center gap-2 text-sm font-semibold text-[#DFF500]"
                                    >
                                        <FaPlus />
                                        Add Meal
                                    </button>
                                </div>

                                {meals.map((meal, mealIndex) => {
                                    const totals = getMealTotals(meal);

                                    return (
                                        <div
                                            key={mealIndex}
                                            className="border border-white/10 p-4 sm:p-5"
                                        >
                                            <div className="mb-5 flex items-center justify-between gap-3">
                                                <div className="flex flex-1 items-center gap-3">
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#DFF500] text-sm font-bold text-black">
                                                        {mealIndex + 1}
                                                    </span>

                                                    <input
                                                        required
                                                        value={meal.mealName}
                                                        onChange={(e) =>
                                                            updateMealName(mealIndex, e.target.value)
                                                        }
                                                        placeholder={`Meal ${mealIndex + 1} - Breakfast`}
                                                        className="w-full border-b border-white/20 bg-transparent py-2 text-sm font-semibold outline-none focus:border-[#DFF500]"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeMeal(mealIndex)}
                                                    disabled={meals.length === 1}
                                                    className="text-gray-500 hover:text-red-500 disabled:opacity-20"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {meal.foods.map((item, foodIndex) => {
                                                    const selectedFood = foods.find(
                                                        (food) => food._id === item.food
                                                    );

                                                    const quantity = Number(item.quantity) || 0;

                                                    const calories = selectedFood
                                                        ? (quantity / 100) * selectedFood.caloriesPer100g
                                                        : 0;

                                                    const protein = selectedFood
                                                        ? (quantity / 100) * selectedFood.proteinPer100g
                                                        : 0;

                                                    return (
                                                        <div
                                                            key={foodIndex}
                                                            className="grid grid-cols-1 items-end gap-3 border-b border-white/10 pb-4 sm:grid-cols-[1fr_110px_120px_90px]"
                                                        >
                                                            <div>
                                                                <label className="mb-2 block text-xs text-gray-500">
                                                                    Food
                                                                </label>

                                                                <select
                                                                    required
                                                                    value={item.food}
                                                                    onChange={(e) =>
                                                                        updateMealFood(
                                                                            mealIndex,
                                                                            foodIndex,
                                                                            "food",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="w-full border-b border-white/20 bg-[#11120F] py-3 text-sm outline-none focus:border-[#DFF500]"
                                                                >
                                                                    <option value="">
                                                                        Select Food
                                                                    </option>

                                                                    {foods.map((food) => (
                                                                        <option
                                                                            key={food._id}
                                                                            value={food._id}
                                                                        >
                                                                            {food.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className="mb-2 block text-xs text-gray-500">
                                                                    Quantity (g)
                                                                </label>

                                                                <input
                                                                    required
                                                                    type="number"
                                                                    min="1"
                                                                    step="any"
                                                                    value={item.quantity}
                                                                    onChange={(e) =>
                                                                        updateMealFood(
                                                                            mealIndex,
                                                                            foodIndex,
                                                                            "quantity",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                                                                />
                                                            </div>

                                                            <div>
                                                                <p className="mb-2 text-xs text-gray-500">
                                                                    Nutrition
                                                                </p>

                                                                <p className="text-xs text-gray-300">
                                                                    {formatNumber(calories)} kcal
                                                                </p>

                                                                <p className="text-xs text-[#DFF500]">
                                                                    {formatNumber(protein)} g protein
                                                                </p>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeFoodFromMeal(mealIndex, foodIndex)
                                                                }
                                                                className="flex h-10 items-center justify-center text-gray-500 hover:text-red-500"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => addFoodToMeal(mealIndex)}
                                                className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#DFF500]"
                                            >
                                                <FaPlus />
                                                Add Food
                                            </button>

                                            <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-4">
                                                <span className="text-xs tracking-widest text-gray-500">
                                                    MEAL TOTAL
                                                </span>

                                                <span className="text-sm font-bold text-[#DFF500]">
                                                    {formatNumber(totals.calories)} kcal · {formatNumber(totals.protein)} g protein
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/10 pt-6 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={closeDietModal}
                                    disabled={saving}
                                    className="border border-white/20 px-6 py-3 text-sm text-gray-300 hover:border-white/50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 bg-[#DFF500] px-6 py-3 text-sm font-bold text-black hover:bg-[#c8dc00] disabled:opacity-50"
                                >
                                    <FaSave />
                                    {saving
                                        ? "Saving..."
                                        : editingDiet
                                            ? "Update Diet Plan"
                                            : "Save Diet Plan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DietOversight;
