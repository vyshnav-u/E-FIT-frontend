
import React, { useMemo, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

const initialSchedules = [
  {
    id: 1,
    title: "Strength Training",
    member: "Arjun Menon",
    trainer: "Alex Morgan",
    date: "2026-10-30",
    time: "09:00",
    duration: 60,
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Weight Loss Session",
    member: "Rahul Krishna",
    trainer: "David James",
    date: "2026-10-30",
    time: "11:00",
    duration: 45,
    status: "Completed",
  },
  {
    id: 3,
    title: "Cardio Training",
    member: "Adithya Raj",
    trainer: "John Mathew",
    date: "2026-10-31",
    time: "10:00",
    duration: 40,
    status: "Upcoming",
  },
  {
    id: 4,
    title: "Muscle Building",
    member: "Nikhil Das",
    trainer: "Alex Morgan",
    date: "2026-10-31",
    time: "15:00",
    duration: 60,
    status: "Cancelled",
  },
  {
    id: 5,
    title: "Fitness Assessment",
    member: "Vishnu Prasad",
    trainer: "David James",
    date: "2026-11-01",
    time: "09:30",
    duration: 30,
    status: "Upcoming",
  },
];

const members = [
  "Arjun Menon",
  "Rahul Krishna",
  "Adithya Raj",
  "Nikhil Das",
  "Vishnu Prasad",
  "Kiran Thomas",
];

const trainers = [
  "Alex Morgan",
  "David James",
  "John Mathew",
  "Michael Thomas",
];

const emptyForm = {
  title: "",
  member: members[0],
  trainer: trainers[0],
  date: "",
  time: "",
  duration: 60,
  status: "Upcoming",
};

function ScheduleMonitoring() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesSearch =
        schedule.title.toLowerCase().includes(search.toLowerCase()) ||
        schedule.member.toLowerCase().includes(search.toLowerCase()) ||
        schedule.trainer.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || schedule.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [schedules, search, statusFilter]);

  const upcomingCount = schedules.filter(
    (schedule) => schedule.status === "Upcoming"
  ).length;

  const completedCount = schedules.filter(
    (schedule) => schedule.status === "Completed"
  ).length;

  const cancelledCount = schedules.filter(
    (schedule) => schedule.status === "Cancelled"
  ).length;

  const openAddModal = () => {
    setEditingSchedule(null);
    setFormData({
      ...emptyForm,
      date: new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      title: schedule.title,
      member: schedule.member,
      trainer: schedule.trainer,
      date: schedule.date,
      time: schedule.time,
      duration: schedule.duration,
      status: schedule.status,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const scheduleData = {
      ...formData,
      duration: Number(formData.duration),
    };

    if (editingSchedule) {
      setSchedules((previous) =>
        previous.map((schedule) =>
          schedule.id === editingSchedule.id
            ? { ...schedule, ...scheduleData }
            : schedule
        )
      );
    } else {
      setSchedules((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...scheduleData,
        },
      ]);
    }

    setShowModal(false);
    setEditingSchedule(null);
    setFormData(emptyForm);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this schedule?"
    );

    if (confirmed) {
      setSchedules((previous) =>
        previous.filter((schedule) => schedule.id !== id)
      );
    }
  };

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#080908] text-[#EBEDE3]">
      <AdminHeader />

      <div className="lg:grid lg:grid-cols-[250px_1fr]">
        <AdminSidebar />

        <main className="min-w-0 p-5 sm:p-8 lg:p-10">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.3em] text-[#DFF500]">
                ADMINISTRATION / SCHEDULES
              </p>
              <h1 className="text-3xl font-black sm:text-4xl">
                Schedule Monitoring
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Monitor training sessions and trainer assignments.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-[#DFF500] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#c8dc00]"
            >
              <FaPlus />
              Add Schedule
            </button>
          </div>

          <div className="mb-10 grid grid-cols-2 gap-6 border-y border-white/10 py-6 sm:grid-cols-4">
            <div>
              <p className="mb-3 text-xs tracking-widest text-gray-500">
                TOTAL SESSIONS
              </p>
              <p className="text-3xl font-bold">{schedules.length}</p>
            </div>

            <div>
              <p className="mb-3 text-xs tracking-widest text-gray-500">
                UPCOMING
              </p>
              <p className="text-3xl font-bold text-[#DFF500]">
                {upcomingCount}
              </p>
            </div>

            <div>
              <p className="mb-3 text-xs tracking-widest text-gray-500">
                COMPLETED
              </p>
              <p className="text-3xl font-bold">{completedCount}</p>
            </div>

            <div>
              <p className="mb-3 text-xs tracking-widest text-gray-500">
                CANCELLED
              </p>
              <p className="text-3xl font-bold">{cancelledCount}</p>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 border-b border-white/20 px-2 py-3 sm:w-80">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sessions, members, trainers..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-white/10 bg-[#080908] px-4 py-3 text-sm outline-none focus:border-[#DFF500]"
            >
              <option value="All">All Sessions</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs tracking-widest text-gray-500">
                  <th className="px-4 py-4">SESSION</th>
                  <th className="px-4 py-4">MEMBER</th>
                  <th className="px-4 py-4">TRAINER</th>
                  <th className="px-4 py-4">DATE</th>
                  <th className="px-4 py-4">TIME</th>
                  <th className="px-4 py-4">DURATION</th>
                  <th className="px-4 py-4">STATUS</th>
                  <th className="px-4 py-4">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredSchedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="border-b border-white/10 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-5 font-semibold">
                      {schedule.title}
                    </td>

                    <td className="px-4 py-5 text-sm text-gray-400">
                      {schedule.member}
                    </td>

                    <td className="px-4 py-5 text-sm text-gray-400">
                      {schedule.trainer}
                    </td>

                    <td className="px-4 py-5 text-sm text-gray-400">
                      {formatDate(schedule.date)}
                    </td>

                    <td className="px-4 py-5 text-sm text-gray-400">
                      {formatTime(schedule.time)}
                    </td>

                    <td className="px-4 py-5 text-sm text-gray-400">
                      {schedule.duration} min
                    </td>

                    <td className="px-4 py-5">
                      <span
                        className={`text-xs font-semibold ${
                          schedule.status === "Upcoming"
                            ? "text-[#DFF500]"
                            : schedule.status === "Completed"
                              ? "text-blue-400"
                              : "text-red-400"
                        }`}
                      >
                        {schedule.status}
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openEditModal(schedule)}
                          className="text-gray-400 transition hover:text-[#DFF500]"
                          aria-label="Edit schedule"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="text-gray-400 transition hover:text-red-500"
                          aria-label="Delete schedule"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSchedules.length === 0 && (
              <p className="py-12 text-center text-sm text-gray-500">
                No schedules found.
              </p>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">
          <div className="my-8 w-full max-w-xl border border-white/10 bg-[#11120F] p-6 sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="mb-2 text-xs tracking-widest text-[#DFF500]">
                  SESSION DETAILS
                </p>
                <h2 className="text-2xl font-bold">
                  {editingSchedule ? "Edit Schedule" : "Create Schedule"}
                </h2>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs text-gray-400">
                  Session Title
                </label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter session title"
                  className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Member
                  </label>
                  <select
                    name="member"
                    value={formData.member}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  >
                    {members.map((member) => (
                      <option key={member} className="bg-[#11120F]">
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Trainer
                  </label>
                  <select
                    name="trainer"
                    value={formData.trainer}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  >
                    {trainers.map((trainer) => (
                      <option key={trainer} className="bg-[#11120F]">
                        {trainer}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Session Date
                  </label>
                  <input
                    required
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Session Time
                  </label>
                  <input
                    required
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Duration (minutes)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Session Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  >
                    <option className="bg-[#11120F]">Upcoming</option>
                    <option className="bg-[#11120F]">Completed</option>
                    <option className="bg-[#11120F]">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border border-white/20 px-5 py-3 text-sm text-gray-300 transition hover:border-white/50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#DFF500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#c8dc00]"
                >
                  {editingSchedule ? "Save Changes" : "Add Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleMonitoring;
