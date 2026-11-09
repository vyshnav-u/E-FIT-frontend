
import React, { useState } from "react";
import TrainerHeader from "../components/TrainerHeader";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

function WorkoutManagement() {
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      name: "Strength Foundation",
      category: "Strength",
      duration: "8 Weeks",
      level: "Beginner",
      exercises: 6,
      members: 12
    },
    {
      id: 2,
      name: "Muscle Building Program",
      category: "Hypertrophy",
      duration: "12 Weeks",
      level: "Intermediate",
      exercises: 8,
      members: 18
    },
    {
      id: 3,
      name: "Fat Loss Challenge",
      category: "Weight Loss",
      duration: "6 Weeks",
      level: "Beginner",
      exercises: 7,
      members: 9
    },
    {
      id: 4,
      name: "Advanced Strength",
      category: "Strength",
      duration: "10 Weeks",
      level: "Advanced",
      exercises: 9,
      members: 6
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Strength",
    duration: "",
    level: "Beginner",
    exercises: "",
    members: 0
  });

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch = workout.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "All" ||
      workout.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setWorkouts((prev) =>
        prev.map((workout) =>
          workout.id === editingId
            ? {
                ...formData,
                id: editingId,
                exercises: Number(formData.exercises),
                members: Number(formData.members)
              }
            : workout
        )
      );
    } else {
      setWorkouts((prev) => [
        ...prev,
        {
          ...formData,
          id: Date.now(),
          exercises: Number(formData.exercises),
          members: Number(formData.members)
        }
      ]);
    }

    closeForm();
  };

  const handleEdit = (workout) => {
    setFormData({
      ...workout,
      exercises: String(workout.exercises),
      members: String(workout.members)
    });
    setEditingId(workout.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setWorkouts((prev) =>
      prev.filter((workout) => workout.id !== id)
    );
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      category: "Strength",
      duration: "",
      level: "Beginner",
      exercises: "",
      members: 0
    });
  };

  return (
    <div className="min-h-screen bg-[#080908] text-white">
      <TrainerHeader />

      <main className="px-5 md:px-10 lg:px-16 py-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[#DFF500] text-xs tracking-[4px] uppercase mb-3">
              Training Programs
            </p>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Workout <span className="text-[#DFF500]">Management.</span>
            </h1>

            <p className="text-gray-500 mt-4 text-sm">
              Create, organize and assign workout programs to your members.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 bg-[#DFF500] text-black px-6 py-3 text-sm font-semibold hover:bg-white transition w-fit"
          >
            <FaPlus />
            Create Workout
          </button>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-8 border-y border-white/10 py-8 mb-12">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Total Programs
            </p>
            <h2 className="text-4xl font-bold mt-3">
              {workouts.length.toString().padStart(2, "0")}
            </h2>
          </div>

          <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Assigned Members
            </p>
            <h2 className="text-4xl font-bold text-[#DFF500] mt-3">
              {workouts.reduce((total, workout) => total + workout.members, 0)}
            </h2>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Total Exercises
            </p>
            <h2 className="text-4xl font-bold mt-3">
              {workouts.reduce((total, workout) => total + workout.exercises, 0)}
            </h2>
          </div>
        </section>

        <section>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
            <div>
              <h2 className="text-2xl font-semibold">Workout Programs</h2>
              <p className="text-gray-500 text-sm mt-2">
                Manage your training plans
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 border-b border-white/20 px-2 py-3">
                <FaSearch className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search workouts..."
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
                <option value="Strength">Strength</option>
                <option value="Hypertrophy">Hypertrophy</option>
                <option value="Weight Loss">Weight Loss</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="py-5 font-medium">Program</th>
                  <th className="py-5 font-medium">Duration</th>
                  <th className="py-5 font-medium">Level</th>
                  <th className="py-5 font-medium">Exercises</th>
                  <th className="py-5 font-medium">Members</th>
                  <th className="py-5 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredWorkouts.map((workout) => (
                  <tr
                    key={workout.id}
                    className="border-b border-white/10 hover:bg-white/[0.02] transition"
                  >
                    <td className="py-6 pr-5">
                      <p className="font-semibold">{workout.name}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {workout.category}
                      </p>
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {workout.duration}
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {workout.level}
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {workout.exercises}
                    </td>

                    <td className="py-6 text-sm text-gray-400">
                      {workout.members}
                    </td>

                    <td className="py-6">
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => handleEdit(workout)}
                          className="text-gray-400 hover:text-[#DFF500] transition"
                          title="Edit workout"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(workout.id)}
                          className="text-gray-400 hover:text-red-500 transition"
                          title="Delete workout"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredWorkouts.length === 0 && (
              <p className="text-center text-gray-500 py-12">
                No workout programs found.
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
                  Workout Details
                </p>
                <h2 className="text-2xl font-bold mt-2">
                  {editingId ? "Edit Workout" : "Create Workout"}
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
                  Workout Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter workout name"
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
                    <option value="Strength">Strength</option>
                    <option value="Hypertrophy">Hypertrophy</option>
                    <option value="Weight Loss">Weight Loss</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    placeholder="Example: 8 Weeks"
                    className="w-full bg-transparent border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Difficulty Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full bg-[#10120B] border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest">
                    Number of Exercises
                  </label>
                  <input
                    type="number"
                    name="exercises"
                    value={formData.exercises}
                    onChange={handleChange}
                    min="1"
                    required
                    placeholder="Example: 6"
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
                  {editingId ? "Update Workout" : "Create Workout"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutManagement;