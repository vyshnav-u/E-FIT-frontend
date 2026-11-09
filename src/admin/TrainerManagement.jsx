import React, { useMemo, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUserTie,
  FaDumbbell,
} from "react-icons/fa";

function TrainerManagement() {
  const [trainers, setTrainers] = useState([
    {
      id: 1,
      name: "Alex Morgan",
      email: "alex@gmail.com",
      phone: "9876543210",
      specialization: "Strength & Conditioning",
      experience: "5",
      certification: "Certified Personal Trainer",
      status: "Active",
    },
    {
      id: 2,
      name: "David James",
      email: "david@gmail.com",
      phone: "9876543211",
      specialization: "Weight Loss",
      experience: "3",
      certification: "Fitness Training Certificate",
      status: "Active",
    },
    {
      id: 3,
      name: "John Mathew",
      email: "john@gmail.com",
      phone: "9876543212",
      specialization: "Cardio & Endurance",
      experience: "4",
      certification: "Advanced Fitness Trainer",
      status: "Active",
    },
    {
      id: 4,
      name: "Michael Thomas",
      email: "michael@gmail.com",
      phone: "9876543213",
      specialization: "Muscle Building",
      experience: "6",
      certification: "Strength Training Certification",
      status: "Inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    specialization: "Strength & Conditioning",
    experience: "",
    certification: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(emptyForm);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const matchesSearch =
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialization =
        specializationFilter === "All" ||
        trainer.specialization === specializationFilter;

      return matchesSearch && matchesSpecialization;
    });
  }, [trainers, searchTerm, specializationFilter]);

  const activeTrainers = trainers.filter(
    (trainer) => trainer.status === "Active"
  ).length;

  const inactiveTrainers = trainers.filter(
    (trainer) => trainer.status === "Inactive"
  ).length;

  const averageExperience =
    trainers.length > 0
      ? (
          trainers.reduce(
            (total, trainer) => total + Number(trainer.experience),
            0
          ) / trainers.length
        ).toFixed(1)
      : "0";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingTrainer(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      specialization: trainer.specialization,
      experience: trainer.experience,
      certification: trainer.certification,
      status: trainer.status,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTrainer(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailExists = trainers.some(
      (trainer) =>
        trainer.email.toLowerCase() ===
          formData.email.trim().toLowerCase() &&
        trainer.id !== editingTrainer?.id
    );

    if (emailExists) {
      window.alert("A trainer with this email already exists.");
      return;
    }

    const updatedTrainer = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      id: editingTrainer ? editingTrainer.id : Date.now(),
    };

    if (editingTrainer) {
      setTrainers((previous) =>
        previous.map((trainer) =>
          trainer.id === editingTrainer.id ? updatedTrainer : trainer
        )
      );
    } else {
      setTrainers((previous) => [...previous, updatedTrainer]);
    }

    closeForm();
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trainer?"
    );

    if (confirmed) {
      setTrainers((previous) =>
        previous.filter((trainer) => trainer.id !== id)
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#080908] text-[#EBEDE3]">
      <AdminHeader />

      <div className="lg:flex">
        <AdminSidebar />

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#DFF500]">
                ADMINISTRATION / TRAINERS
              </p>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Trainer Management
              </h1>

              <p className="mt-3 text-sm text-gray-500">
                Manage trainer profiles, qualifications and professional details.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 bg-[#DFF500] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#c9df00]"
            >
              <FaPlus />
              Add Trainer
            </button>
          </div>

          <section className="grid grid-cols-1 gap-7 border-b border-white/10 pb-8 sm:grid-cols-3">
            {[
              {
                title: "Total Trainers",
                value: trainers.length,
                icon: FaUserTie,
              },
              {
                title: "Active Trainers",
                value: activeTrainers,
                icon: FaDumbbell,
              },
              {
                title: "Average Experience",
                value: `${averageExperience} Years`,
                icon: FaUserTie,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title}>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">{item.title}</p>
                    <Icon className="text-lg text-[#DFF500]" />
                  </div>

                  <p className="text-4xl font-bold">{item.value}</p>
                </div>
              );
            })}
          </section>

          <section className="pt-9">
            <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold">Registered Trainers</h2>
                <p className="mt-1 text-xs text-gray-500">
                  {filteredTrainers.length} trainers displayed
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-3 border-b border-white/20 px-2 py-3">
                  <FaSearch className="text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search trainers..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600 sm:w-48"
                  />
                </div>

                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="border-b border-white/20 bg-[#080908] px-3 py-3 text-sm text-gray-300 outline-none focus:border-[#DFF500]"
                >
                  <option value="All">All Specializations</option>
                  <option value="Strength & Conditioning">
                    Strength & Conditioning
                  </option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Cardio & Endurance">
                    Cardio & Endurance
                  </option>
                  <option value="Muscle Building">Muscle Building</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                    <th className="pb-5 pr-5">Trainer</th>
                    <th className="pb-5 pr-5">Specialization</th>
                    <th className="pb-5 pr-5">Experience</th>
                    <th className="pb-5 pr-5">Certification</th>
                    <th className="pb-5 pr-5">Status</th>
                    <th className="pb-5">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTrainers.map((trainer) => (
                    <tr
                      key={trainer.id}
                      className="border-b border-white/10 text-sm"
                    >
                      <td className="py-5 pr-5">
                        <p className="font-semibold">{trainer.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {trainer.email}
                        </p>
                      </td>

                      <td className="py-5 pr-5 text-gray-400">
                        {trainer.specialization}
                      </td>

                      <td className="py-5 pr-5 text-gray-400">
                        {trainer.experience} Years
                      </td>

                      <td className="py-5 pr-5 text-gray-400">
                        {trainer.certification}
                      </td>

                      <td className="py-5 pr-5">
                        <span
                          className={
                            trainer.status === "Active"
                              ? "text-[#DFF500]"
                              : "text-gray-500"
                          }
                        >
                          {trainer.status}
                        </span>
                      </td>

                      <td className="py-5">
                        <div className="flex items-center gap-5">
                          <button
                            onClick={() => openEditForm(trainer)}
                            className="text-gray-400 transition hover:text-[#DFF500]"
                            aria-label={`Edit ${trainer.name}`}
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleDelete(trainer.id)}
                            className="text-gray-400 transition hover:text-red-500"
                            aria-label={`Delete ${trainer.name}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTrainers.length === 0 && (
                <p className="py-12 text-center text-sm text-gray-500">
                  No trainers found.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">
          <div className="my-auto w-full max-w-2xl border border-white/10 bg-[#11120F] p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.25em] text-[#DFF500]">
                  TRAINER MANAGEMENT
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {editingTrainer ? "Edit Trainer" : "Add New Trainer"}
                </h2>
              </div>

              <button
                onClick={closeForm}
                className="text-gray-400 transition hover:text-white"
                aria-label="Close form"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { name: "name", label: "Full Name", type: "text" },
                  { name: "email", label: "Email Address", type: "email" },
                  { name: "phone", label: "Phone Number", type: "tel" },
                  {
                    name: "experience",
                    label: "Experience (Years)",
                    type: "number",
                  },
                  {
                    name: "certification",
                    label: "Certification",
                    type: "text",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="mb-2 block text-xs text-gray-400">
                      {field.label}
                    </label>

                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      min={field.name === "experience" ? "0" : undefined}
                      step={field.name === "experience" ? "1" : undefined}
                      required
                      className="w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none transition focus:border-[#DFF500]"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Specialization
                  </label>

                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-[#11120F] py-3 text-sm text-white outline-none focus:border-[#DFF500]"
                  >
                    <option value="Strength & Conditioning">
                      Strength & Conditioning
                    </option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Cardio & Endurance">
                      Cardio & Endurance
                    </option>
                    <option value="Muscle Building">Muscle Building</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Account Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-[#11120F] py-3 text-sm text-white outline-none focus:border-[#DFF500]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-9 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-3 text-sm text-gray-400 transition hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#DFF500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#c9df00]"
                >
                  {editingTrainer ? "Update Trainer" : "Create Trainer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainerManagement;