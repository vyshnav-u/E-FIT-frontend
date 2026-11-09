import React, { useMemo, useState } from "react";
import TrainerHeader from "../components/TrainerHeader";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaChartLine,
  FaWeight,
  FaSave,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

function ProgressMonitoring() {
  const [members] = useState([
    { id: 1, name: "Arjun Menon", goal: "Muscle Building" },
    { id: 2, name: "Rahul Krishna", goal: "Weight Loss" },
    { id: 3, name: "Adithya Raj", goal: "Fitness Improvement" },
    { id: 4, name: "Nikhil Das", goal: "Strength Building" },
    { id: 5, name: "Vishnu Prasad", goal: "Weight Loss" },
    { id: 6, name: "Kiran Thomas", goal: "Muscle Building" },
  ]);

  const [records, setRecords] = useState([
    {
      id: 1,
      memberId: 1,
      date: "2026-10-01",
      weight: 72,
      bodyFat: 18,
      muscleMass: 31,
      chest: 98,
      waist: 82,
      hips: 96,
      notes: "Started strength training program.",
    },
    {
      id: 2,
      memberId: 1,
      date: "2026-10-15",
      weight: 71,
      bodyFat: 17,
      muscleMass: 32,
      chest: 99,
      waist: 80,
      hips: 96,
      notes: "Good improvement in strength.",
    },
    {
      id: 3,
      memberId: 1,
      date: "2026-10-30",
      weight: 70.5,
      bodyFat: 16,
      muscleMass: 33,
      chest: 100,
      waist: 79,
      hips: 95,
      notes: "Consistent progress.",
    },
    {
      id: 4,
      memberId: 2,
      date: "2026-10-05",
      weight: 85,
      bodyFat: 27,
      muscleMass: 29,
      chest: 104,
      waist: 96,
      hips: 105,
      notes: "Initial fitness assessment.",
    },
    {
      id: 5,
      memberId: 2,
      date: "2026-10-25",
      weight: 82,
      bodyFat: 25,
      muscleMass: 29.5,
      chest: 102,
      waist: 92,
      hips: 103,
      notes: "Improved activity and consistency.",
    },
    {
      id: 6,
      memberId: 3,
      date: "2026-10-20",
      weight: 68,
      bodyFat: 20,
      muscleMass: 30,
      chest: 94,
      waist: 84,
      hips: 94,
      notes: "Fitness assessment completed.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("1");
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const emptyForm = {
    date: new Date().toISOString().split("T")[0],
    weight: "",
    bodyFat: "",
    muscleMass: "",
    chest: "",
    waist: "",
    hips: "",
    notes: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMember = members.find(
    (member) => member.id === Number(selectedMemberId)
  );

  const memberRecords = useMemo(() => {
    return records
      .filter((record) => record.memberId === Number(selectedMemberId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [records, selectedMemberId]);

  const latestRecord = memberRecords[0];
  const previousRecord = memberRecords[1];

  const weightChange =
    latestRecord && previousRecord
      ? (Number(latestRecord.weight) - Number(previousRecord.weight)).toFixed(1)
      : null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingRecord(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      weight: record.weight,
      bodyFat: record.bodyFat,
      muscleMass: record.muscleMass,
      chest: record.chest,
      waist: record.waist,
      hips: record.hips,
      notes: record.notes,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRecord(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecord = {
      ...formData,
      id: editingRecord ? editingRecord.id : Date.now(),
      memberId: Number(selectedMemberId),
      weight: Number(formData.weight),
      bodyFat: Number(formData.bodyFat),
      muscleMass: Number(formData.muscleMass),
      chest: Number(formData.chest),
      waist: Number(formData.waist),
      hips: Number(formData.hips),
    };

    if (editingRecord) {
      setRecords((previous) =>
        previous.map((record) =>
          record.id === editingRecord.id ? newRecord : record
        )
      );
    } else {
      setRecords((previous) => [...previous, newRecord]);
    }

    closeForm();
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this progress record?"
    );

    if (confirmed) {
      setRecords((previous) =>
        previous.filter((record) => record.id !== id)
      );
    }
  };

  const getWeightChangeText = () => {
    if (weightChange === null) return "Need another record";

    const change = Number(weightChange);

    if (change > 0) return `+${change} kg since previous record`;
    if (change < 0) return `${change} kg since previous record`;

    return "No change since previous record";
  };

  return (
    <div className="min-h-screen bg-[#080908] text-[#EBEDE3]">
      <TrainerHeader />

      <main className="px-5 py-10 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.35em] text-[#DFF500]">
                TRAINER / PROGRESS
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Progress Monitoring
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Track member performance, monitor physical changes, and keep
                fitness goals moving forward.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 bg-[#DFF500] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#c9df00]"
            >
              <FaPlus />
              Add Progress
            </button>
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-[280px_1fr]">
            <aside>
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                Select Member
              </h2>

              <div className="mb-5 flex items-center gap-3 border-b border-white/20 pb-3">
                <FaSearch className="text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search members..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1">
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMemberId(String(member.id))}
                    className={`w-full border-l-2 px-4 py-4 text-left transition ${
                      selectedMemberId === String(member.id)
                        ? "border-[#DFF500] bg-white/[0.04]"
                        : "border-transparent hover:bg-white/[0.03]"
                    }`}
                  >
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{member.goal}</p>
                  </button>
                ))}

                {filteredMembers.length === 0 && (
                  <p className="py-5 text-sm text-gray-500">
                    No members found.
                  </p>
                )}
              </div>
            </aside>

            <section className="min-w-0">
              {selectedMember && (
                <>
                  <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-3">
                        <FaUser className="text-[#DFF500]" />
                        <h2 className="text-2xl font-bold">
                          {selectedMember.name}
                        </h2>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Fitness Goal: {selectedMember.goal}
                      </p>
                    </div>

                    <p className="text-xs tracking-wider text-gray-500">
                      {memberRecords.length} PROGRESS RECORDS
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-white/10 py-8 md:grid-cols-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Current Weight
                      </p>
                      <p className="mt-3 text-3xl font-bold">
                        {latestRecord ? `${latestRecord.weight} kg` : "--"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Body Fat
                      </p>
                      <p className="mt-3 text-3xl font-bold">
                        {latestRecord ? `${latestRecord.bodyFat}%` : "--"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Muscle Mass
                      </p>
                      <p className="mt-3 text-3xl font-bold">
                        {latestRecord ? `${latestRecord.muscleMass} kg` : "--"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Weight Change
                      </p>
                      <p className="mt-3 text-3xl font-bold text-[#DFF500]">
                        {weightChange === null
                          ? "--"
                          : `${Number(weightChange) > 0 ? "+" : ""}${weightChange}`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {getWeightChangeText()}
                      </p>
                    </div>
                  </div>

                  <div className="py-8">
                    <div className="mb-6 flex items-center gap-3">
                      <FaChartLine className="text-[#DFF500]" />
                      <h3 className="text-lg font-bold">Latest Measurements</h3>
                    </div>

                    {latestRecord ? (
                      <div className="grid grid-cols-2 gap-y-7 sm:grid-cols-3">
                        {[
                          ["Chest", latestRecord.chest, "cm"],
                          ["Waist", latestRecord.waist, "cm"],
                          ["Hips", latestRecord.hips, "cm"],
                        ].map(([label, value, unit]) => (
                          <div key={label}>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                              {label}
                            </p>
                            <p className="mt-2 text-xl font-semibold">
                              {value} {unit}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No measurements recorded yet.
                      </p>
                    )}
                  </div>

                  <div className="border-t border-white/10 py-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold">Progress History</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          Previous fitness assessments and measurements
                        </p>
                      </div>

                      <FaWeight className="text-xl text-[#DFF500]" />
                    </div>

                    {memberRecords.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left">
                          <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                              <th className="pb-4 pr-4">Date</th>
                              <th className="pb-4 pr-4">Weight</th>
                              <th className="pb-4 pr-4">Body Fat</th>
                              <th className="pb-4 pr-4">Muscle Mass</th>
                              <th className="pb-4 pr-4">Waist</th>
                              <th className="pb-4">Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {memberRecords.map((record) => (
                              <tr
                                key={record.id}
                                className="border-b border-white/10 text-sm"
                              >
                                <td className="py-5 pr-4 text-gray-400">
                                  {record.date}
                                </td>
                                <td className="py-5 pr-4 font-semibold">
                                  {record.weight} kg
                                </td>
                                <td className="py-5 pr-4">
                                  {record.bodyFat}%
                                </td>
                                <td className="py-5 pr-4">
                                  {record.muscleMass} kg
                                </td>
                                <td className="py-5 pr-4">
                                  {record.waist} cm
                                </td>
                                <td className="py-5">
                                  <div className="flex items-center gap-4">
                                    <button
                                      onClick={() => openEditForm(record)}
                                      className="text-gray-400 transition hover:text-[#DFF500]"
                                      aria-label="Edit progress record"
                                    >
                                      <FaEdit />
                                    </button>

                                    <button
                                      onClick={() => handleDelete(record.id)}
                                      className="text-gray-400 transition hover:text-red-500"
                                      aria-label="Delete progress record"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="py-8 text-sm text-gray-500">
                        No progress records available for this member.
                      </p>
                    )}
                  </div>

                  {latestRecord && (
                    <div className="border-t border-white/10 pt-8">
                      <h3 className="mb-4 text-lg font-bold">
                        Latest Trainer Notes
                      </h3>
                      <p className="max-w-2xl text-sm leading-7 text-gray-400">
                        {latestRecord.notes || "No notes added."}
                      </p>
                      <p className="mt-4 text-xs text-gray-600">
                        Last updated: {latestRecord.date}
                      </p>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">
          <div className="my-auto w-full max-w-2xl border border-white/10 bg-[#11120F] p-6 sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.25em] text-[#DFF500]">
                  MEMBER PROGRESS
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {editingRecord ? "Update Record" : "Add Progress Record"}
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
              <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5 text-sm text-gray-400">
                <FaUser className="text-[#DFF500]" />
                {selectedMember?.name}
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-xs text-gray-400">
                  Assessment Date
                </label>
                <div className="flex items-center gap-3 border-b border-white/20 pb-3">
                  <FaCalendarAlt className="text-gray-500" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  ["weight", "Weight (kg)"],
                  ["bodyFat", "Body Fat (%)"],
                  ["muscleMass", "Muscle Mass (kg)"],
                  ["chest", "Chest (cm)"],
                  ["waist", "Waist (cm)"],
                  ["hips", "Hips (cm)"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="mb-2 block text-xs text-gray-400">
                      {label}
                    </label>
                    <input
                      type="number"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      required
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="w-full border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none transition focus:border-[#DFF500]"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-xs text-gray-400">
                  Trainer Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Add observations about the member's progress..."
                  className="w-full resize-none border-b border-white/20 bg-transparent py-3 text-sm text-white outline-none transition focus:border-[#DFF500]"
                />
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-3 text-sm text-gray-400 transition hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-[#DFF500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#c9df00]"
                >
                  <FaSave />
                  {editingRecord ? "Update Record" : "Save Progress"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressMonitoring;