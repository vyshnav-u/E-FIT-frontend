
import React, { useMemo, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";

const initialMembers = [
  {
    id: 1,
    name: "Arjun Menon",
    email: "arjun@gmail.com",
    phone: "9876543210",
    goal: "Muscle Building",
    trainer: "Alex Morgan",
    joinDate: "2026-08-12",
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul Krishna",
    email: "rahul@gmail.com",
    phone: "9876543211",
    goal: "Weight Loss",
    trainer: "David James",
    joinDate: "2026-09-05",
    status: "Active",
  },
  {
    id: 3,
    name: "Adithya Raj",
    email: "adithya@gmail.com",
    phone: "9876543212",
    goal: "Fitness Improvement",
    trainer: "John Mathew",
    joinDate: "2026-09-18",
    status: "Active",
  },
  {
    id: 4,
    name: "Nikhil Das",
    email: "nikhil@gmail.com",
    phone: "9876543213",
    goal: "Strength Building",
    trainer: "Alex Morgan",
    joinDate: "2026-07-20",
    status: "Inactive",
  },
  {
    id: 5,
    name: "Vishnu Prasad",
    email: "vishnu@gmail.com",
    phone: "9876543214",
    goal: "Weight Loss",
    trainer: "David James",
    joinDate: "2026-10-01",
    status: "Active",
  },
  {
    id: 6,
    name: "Kiran Thomas",
    email: "kiran@gmail.com",
    phone: "9876543215",
    goal: "Muscle Building",
    trainer: "John Mathew",
    joinDate: "2026-06-15",
    status: "Inactive",
  },
];

const trainers = ["Alex Morgan", "David James", "John Mathew", "Michael Thomas"];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  goal: "Muscle Building",
  trainer: "Alex Morgan",
  joinDate: new Date().toISOString().split("T")[0],
  status: "Active",
};

function MemberManagement() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  const activeCount = members.filter(
    (member) => member.status === "Active"
  ).length;

  const inactiveCount = members.filter(
    (member) => member.status === "Inactive"
  ).length;

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      ...emptyForm,
      joinDate: new Date().toISOString().split("T")[0],
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      goal: member.goal,
      trainer: member.trainer,
      joinDate: member.joinDate,
      status: member.status,
    });
    setError("");
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

    const emailExists = members.some(
      (member) =>
        member.email.toLowerCase() === formData.email.toLowerCase() &&
        member.id !== editingMember?.id
    );

    if (emailExists) {
      setError("A member with this email already exists.");
      return;
    }

    if (editingMember) {
      setMembers((previous) =>
        previous.map((member) =>
          member.id === editingMember.id
            ? { ...member, ...formData }
            : member
        )
      );
    } else {
      setMembers((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setShowModal(false);
    setEditingMember(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member?"
    );

    if (confirmed) {
      setMembers((previous) =>
        previous.filter((member) => member.id !== id)
      );
    }
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
                ADMINISTRATION / MEMBERS
              </p>
              <h1 className="text-3xl font-black sm:text-4xl">
                Member Management
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage registered members and their training assignments.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-[#DFF500] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#c8dc00]"
            >
              <FaPlus />
              Add Member
            </button>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 border-y border-white/10 py-6 sm:grid-cols-3">
            <div>
              <div className="mb-3 flex items-center gap-3 text-gray-500">
                <FaUsers className="text-[#DFF500]" />
                <span className="text-xs tracking-widest">TOTAL MEMBERS</span>
              </div>
              <p className="text-3xl font-bold">{members.length}</p>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3 text-gray-500">
                <FaUserTie className="text-[#DFF500]" />
                <span className="text-xs tracking-widest">ACTIVE MEMBERS</span>
              </div>
              <p className="text-3xl font-bold">{activeCount}</p>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3 text-gray-500">
                <FaUsers className="text-gray-500" />
                <span className="text-xs tracking-widest">INACTIVE MEMBERS</span>
              </div>
              <p className="text-3xl font-bold">{inactiveCount}</p>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 border-b border-white/20 px-2 py-3 sm:w-80">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-white/10 bg-[#080908] px-4 py-3 text-sm outline-none focus:border-[#DFF500]"
            >
              <option value="All">All Members</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs tracking-widest text-gray-500">
                  <th className="px-4 py-4">MEMBER</th>
                  <th className="px-4 py-4">FITNESS GOAL</th>
                  <th className="px-4 py-4">ASSIGNED TRAINER</th>
                  <th className="px-4 py-4">JOIN DATE</th>
                  <th className="px-4 py-4">STATUS</th>
                  <th className="px-4 py-4">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-white/10 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-5">
                      <p className="font-semibold">{member.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {member.email}
                      </p>
                    </td>

                    <td className="px-4 py-5 text-sm text-gray-400">
                      {member.goal}
                    </td>

                    <td className="px-4 py-5 text-sm text-gray-400">
                      {member.trainer}
                    </td>

                    <td className="px-4 py-5 text-sm text-gray-400">
                      {member.joinDate}
                    </td>

                    <td className="px-4 py-5">
                      <span
                        className={`text-xs font-semibold ${
                          member.status === "Active"
                            ? "text-[#DFF500]"
                            : "text-gray-500"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openEditModal(member)}
                          className="text-gray-400 transition hover:text-[#DFF500]"
                          aria-label="Edit member"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-gray-400 transition hover:text-red-500"
                          aria-label="Delete member"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMembers.length === 0 && (
              <p className="py-12 text-center text-sm text-gray-500">
                No members found.
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
                  MEMBER DETAILS
                </p>
                <h2 className="text-2xl font-bold">
                  {editingMember ? "Edit Member" : "Add New Member"}
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
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Full Name
                  </label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Phone Number
                  </label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Fitness Goal
                  </label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  >
                    <option className="bg-[#11120F]">Muscle Building</option>
                    <option className="bg-[#11120F]">Weight Loss</option>
                    <option className="bg-[#11120F]">Strength Building</option>
                    <option className="bg-[#11120F]">Fitness Improvement</option>
                    <option className="bg-[#11120F]">Endurance Training</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Assigned Trainer
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
                    Join Date
                  </label>
                  <input
                    required
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-gray-400">
                    Membership Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none focus:border-[#DFF500]"
                  >
                    <option className="bg-[#11120F]">Active</option>
                    <option className="bg-[#11120F]">Inactive</option>
                  </select>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

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
                  {editingMember ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberManagement;
