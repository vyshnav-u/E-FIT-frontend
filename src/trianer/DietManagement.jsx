
import React, { useState } from "react";
import TrainerHeader from "../components/TrainerHeader";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

function DietManagement() {
  const [dietPlans, setDietPlans] = useState([
    {
      id: 1,
      name: "Muscle Gain Diet",
      category: "Muscle Gain",
      calories: 2800,
      protein: 180,
      carbs: 320,
      fats: 80,
      members: 12
    },
    {
      id: 2,
      name: "Weight Loss Diet",
      category: "Weight Loss",
      calories: 1800,
      protein: 140,
      carbs: 180,
      fats: 55,
      members: 15
    },
    {
      id: 3,
      name: "Balanced Fitness Diet",
      category: "Maintenance",
      calories: 2200,
      protein: 130,
      carbs: 250,
      fats: 70,
      members: 8
    },
    {
      id: 4,
      name: "High Protein Diet",
      category: "Muscle Gain",
      calories: 2500,
      protein: 200,
      carbs: 230,
      fats: 75,
      members: 6
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Muscle Gain",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    members: 0
  });

  const filteredPlans = dietPlans.filter((plan) => {
    const matchesSearch = plan.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "All" ||
      plan.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      category: "Muscle Gain",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      members: 0
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPlan = {
      ...formData,
      id: editingId || Date.now(),
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fats: Number(formData.fats),
      members: Number(formData.members)
    };

    if (editingId) {
      setDietPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingId ? updatedPlan : plan
        )
      );
    } else {
      setDietPlans((prev) => [...prev, updatedPlan]);
    }

    closeForm();
  };

  const handleEdit = (plan) => {
    setFormData({
      ...plan,
      calories: String(plan.calories),
      protein: String(plan.protein),
      carbs: String(plan.carbs),
      fats: String(plan.fats),
      members: String(plan.members)
    });

    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setDietPlans((prev) =>
      prev.filter((plan) => plan.id !== id)
    );
  };

  const totalMembers = dietPlans.reduce(
    (total, plan) => total + plan.members,
    0
  );

  return (
    <div className="min-h-screen bg-[#080908] text-white">
      <TrainerHeader />

      <main className="px-5 md:px-10 lg:px-16 py-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[#DFF500] text-xs tracking-[4px] uppercase mb-3">
              Nutrition Management
            </p>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Diet <span className="text-[#DFF500]">Plans.</span>
            </h1>

            <p className="text-gray-500 mt-4 text-sm">
              Create nutrition plans and manage your members' dietary goals.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 bg-[#DFF500] text-black px-6 py-3 text-sm font-semibold hover:bg-white transition w-fit"
          >
            <FaPlus />
            Create Diet Plan
          </button>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-8 border-y border-white/10 py-8 mb-12">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Total Diet Plans
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              {dietPlans.length.toString().padStart(2, "0")}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Assigned Members
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#DFF500] mt-3">
              {totalMembers}
            </h2>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Average Calories
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              {dietPlans.length
                ? Math.round(
                    dietPlans.reduce(
                      (total, plan) => total + plan.calories,
                      0
                    ) / dietPlans.length
                  ).toLocaleString()
                : 0}
            </h2>
          </div>
        </section>

        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
            <div>
              <h2 className="text-2xl font-semibold">Nutrition Programs</h2>
              <p className="text-gray-500 text-sm mt-2">
                Manage your members' diet plans
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 border-b border-white/20 px-2 py-3">
                <FaSearch className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search diet plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full sm:w-48 placeholder:text-gray-600"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#080908] border-b border-white/20 px-3 py-3 text-sm text-gray-300 outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="py-5 font-medium">Diet Plan</th>
                  <th className="py-5 font-medium">Calories</th>
                  <th className="py-5 font-medium">Protein</th>
                  <th className="py-5 font-medium">Carbs</th>
                  <th className="py-5 font-medium">Fats</th>
                  <th className="py-5 font-medium">Members</th>
                  <th className="py-5 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="border-b border-white/10 hover:bg-white/[0.02] transition"
                  >
                    <td className="py-6 pr-5">
                      <p className="font-semibold">{plan.name}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {plan.category}
                      </p>
                    </td>

                    <td className="py-6 text-sm text-[#DFF500]">
                      {plan.calories} kcal
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {plan.protein} g
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {plan.carbs} g
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {plan.fats} g
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {plan.members}
                    </td>

                    <td className="py-6">
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="text-gray-400 hover:text-[#DFF500] transition"
                          title="Edit diet plan"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="text-gray-400 hover:text-red-500 transition"
                          title="Delete diet plan"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPlans.length === 0 && (
              <p className="text-center text-gray-500 py-12">
                No diet plans found.
              </p>
            )}
          </div>
        </section>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#10120B] border border-white/10 p-6 md:p-10 my-auto">

            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[#DFF500] text-xs tracking-widest uppercase">
                  Nutrition Details
                </p>
                <h2 className="text-2xl font-bold mt-2">
                  {editingId ? "Edit Diet Plan" : "Create Diet Plan"}
                </h2>
              </div>

              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-white text-xl"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest">
                  Plan Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter diet plan name"
                  className="w-full bg-transparent border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#10120B] border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                  >
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Daily Calories (kcal)
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    min="1"
                    required
                    placeholder="Example: 2200"
                    className="w-full bg-transparent border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Example: 150"
                    className="w-full bg-transparent border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Carbohydrates (g)
                  </label>
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Example: 250"
                    className="w-full bg-transparent border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    name="fats"
                    value={formData.fats}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Example: 70"
                    className="w-full bg-transparent border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Assigned Members
                  </label>
                  <input
                    type="number"
                    name="members"
                    value={formData.members}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Example: 5"
                    className="w-full bg-transparent border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-3 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#DFF500] text-black px-7 py-3 text-sm font-semibold hover:bg-white transition"
                >
                  {editingId ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DietManagement;