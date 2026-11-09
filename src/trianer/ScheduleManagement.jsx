
import React, { useState } from "react";
import TrainerHeader from "../components/TrainerHeader";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaCalendarAlt,
    FaClock
} from "react-icons/fa";

function ScheduleManagement() {
    const [sessions, setSessions] = useState([
        {
            id: 1,
            member: "Arjun Menon",
            date: "2026-10-30",
            time: "09:00",
            duration: 60,
            type: "Strength Training",
            status: "In Progress"
        },
        {
            id: 2,
            member: "Rahul Krishna",
            date: "2026-10-30",
            time: "11:00",
            duration: 45,
            type: "Cardio Training",
            status: "Upcoming"
        },
        {
            id: 3,
            member: "Adithya Raj",
            date: "2026-10-30",
            time: "14:00",
            duration: 60,
            type: "Full Body Workout",
            status: "Upcoming"
        },
        {
            id: 4,
            member: "Nikhil Das",
            date: "2026-10-31",
            time: "10:00",
            duration: 60,
            type: "Weight Training",
            status: "Upcoming"
        },
        {
            id: 5,
            member: "Vishnu Prasad",
            date: "2026-10-31",
            time: "16:00",
            duration: 45,
            type: "Cardio Training",
            status: "Upcoming"
        }
    ]);

    const [selectedDate, setSelectedDate] = useState("2026-10-30");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        member: "",
        date: "2026-10-30",
        time: "",
        duration: "60",
        type: "Strength Training",
        status: "Upcoming"
    });

    const members = [
        "Arjun Menon",
        "Rahul Krishna",
        "Adithya Raj",
        "Nikhil Das",
        "Vishnu Prasad",
        "Kiran Thomas"
    ];

    const filteredSessions = sessions
        .filter((session) => session.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time));

    const todaySessions = sessions.filter(
        (session) => session.date === "2026-10-30"
    );

    const upcomingSessions = sessions.filter(
        (session) => session.status === "Upcoming"
    );

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
            member: "",
            date: selectedDate,
            time: "",
            duration: "60",
            type: "Strength Training",
            status: "Upcoming"
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedSession = {
            ...formData,
            id: editingId || Date.now(),
            duration: Number(formData.duration)
        };

        if (editingId) {
            setSessions((prev) =>
                prev.map((session) =>
                    session.id === editingId ? updatedSession : session
                )
            );
        } else {
            setSessions((prev) => [...prev, updatedSession]);
        }

        setSelectedDate(formData.date);
        closeForm();
    };

    const handleEdit = (session) => {
        setFormData({
            ...session,
            duration: String(session.duration)
        });

        setEditingId(session.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setSessions((prev) =>
            prev.filter((session) => session.id !== id)
        );
    };

    const changeDate = (days) => {
        const currentDate = new Date(`${selectedDate}T12:00:00`);
        currentDate.setDate(currentDate.getDate() + days);

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");

        setSelectedDate(`${year}-${month}-${day}`);
    };

    const formatDate = (date) => {
        return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const formatTime = (time) => {
        return new Date(`2026-01-01T${time}`).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="min-h-screen bg-[#080908] text-white">
            <TrainerHeader />

            <main className="px-5 md:px-10 lg:px-16 py-12">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                    <div>
                        <p className="text-[#DFF500] text-xs tracking-[4px] uppercase mb-3">
                            Training Calendar
                        </p>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Schedule <span className="text-[#DFF500]">Management.</span>
                        </h1>

                        <p className="text-gray-500 mt-4 text-sm">
                            Organize training sessions and manage your daily schedule.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setFormData({
                                member: "",
                                date: selectedDate,
                                time: "",
                                duration: "60",
                                type: "Strength Training",
                                status: "Upcoming"
                            });
                            setEditingId(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-3 bg-[#DFF500] text-black px-6 py-3 text-sm font-semibold hover:bg-white transition w-fit"
                    >
                        <FaPlus />
                        Schedule Session
                    </button>
                </div>

                <section className="grid grid-cols-2 md:grid-cols-3 gap-8 border-y border-white/10 py-8 mb-12">
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                            Total Sessions
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold mt-3">
                            {sessions.length.toString().padStart(2, "0")}
                        </h2>
                    </div>

                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                            Today's Sessions
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#DFF500] mt-3">
                            {todaySessions.length.toString().padStart(2, "0")}
                        </h2>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                            Upcoming Sessions
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold mt-3">
                            {upcomingSessions.length.toString().padStart(2, "0")}
                        </h2>
                    </div>
                </section>

                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

                        <div>
                            <p className="text-[#DFF500] text-xs uppercase tracking-widest mb-3">
                                Selected Date
                            </p>
                            <h2 className="text-2xl md:text-3xl font-semibold">
                                {formatDate(selectedDate)}
                            </h2>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => changeDate(-1)}
                                className="border border-white/20 px-4 py-3 text-sm hover:border-[#DFF500] transition"
                            >
                                Previous
                            </button>

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent border border-white/20 px-3 py-3 text-sm text-white outline-none [color-scheme:dark]"
                            />

                            <button
                                onClick={() => changeDate(1)}
                                className="border border-white/20 px-4 py-3 text-sm hover:border-[#DFF500] transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-white/10">
                        {filteredSessions.map((session, index) => (
                            <div
                                key={session.id}
                                className="grid md:grid-cols-[100px_1fr_150px_120px] gap-5 md:items-center py-7 border-b border-white/10"
                            >
                                <div>
                                    <p className="text-[#DFF500] text-lg font-semibold">
                                        {formatTime(session.time)}
                                    </p>
                                    <p className="text-gray-600 text-xs mt-2">
                                        {String(index + 1).padStart(2, "0")}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {session.member}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-2">
                                        {session.type}
                                    </p>
                                    <p className="text-gray-600 text-xs mt-2">
                                        {session.duration} minutes
                                    </p>
                                </div>

                                <div>
                                    <span
                                        className={`text-xs ${session.status === "Completed"
                                                ? "text-green-400"
                                                : session.status === "In Progress"
                                                    ? "text-[#DFF500]"
                                                    : "text-gray-400"
                                            }`}
                                    >
                                        {session.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-5">
                                    <button
                                        onClick={() => handleEdit(session)}
                                        className="text-gray-400 hover:text-[#DFF500] transition"
                                        title="Edit session"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(session.id)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                        title="Delete session"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredSessions.length === 0 && (
                            <div className="py-20 text-center">
                                <FaCalendarAlt className="text-3xl text-gray-700 mx-auto mb-5" />
                                <p className="text-gray-400">No sessions scheduled for this date.</p>
                                <p className="text-gray-600 text-sm mt-2">
                                    Create a new session to get started.
                                </p>
                            </div>
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
                                    Session Details
                                </p>
                                <h2 className="text-2xl font-bold mt-2">
                                    {editingId ? "Edit Session" : "Schedule New Session"}
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
                                    Select Member
                                </label>
                                <select
                                    name="member"
                                    value={formData.member}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#10120B] border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                                >
                                    <option value="">Choose a member</option>
                                    {members.map((member) => (
                                        <option key={member} value={member}>
                                            {member}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-transparent border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500] [color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-transparent border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500] [color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest">
                                        Duration (Minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        min="15"
                                        required
                                        className="w-full bg-transparent border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest">
                                        Training Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full bg-[#10120B] border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                                    >
                                        <option value="Strength Training">Strength Training</option>
                                        <option value="Cardio Training">Cardio Training</option>
                                        <option value="Full Body Workout">Full Body Workout</option>
                                        <option value="Weight Training">Weight Training</option>
                                        <option value="Flexibility Training">Flexibility Training</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest">
                                        Session Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full bg-[#10120B] border-b border-white/20 py-3 mt-2 outline-none focus:border-[#DFF500]"
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
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
                                    {editingId ? "Update Session" : "Create Session"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ScheduleManagement;