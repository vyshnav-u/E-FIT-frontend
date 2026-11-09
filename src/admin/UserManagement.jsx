
import React, { useEffect, useMemo, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaSearch,
  FaUsers,
  FaUserShield,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllUsersAPI, deleteUserAPI } from "../services/authservice";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllUsersAPI(token);

      const formattedUsers = response.data.users.map((user) => ({
        id: user._id,
        name: user.username,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        status: user.status || "Active",
      }));

      setUsers(formattedUsers);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch users";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    toast.info(
      <div className="flex flex-col gap-3">
        <p>Are you sure you want to delete {name}?</p>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await deleteUserAPI(id, token);

                setUsers((prevUsers) =>
                  prevUsers.filter((user) => user.id !== id)
                );

                toast.success("User deleted successfully");
              } catch (err) {
                toast.error(
                  err.response?.data?.message || "Failed to delete user"
                );
              }
            }}
            className="rounded bg-red-600 px-3 py-1 text-white"
          >
            Delete
          </button>

          <button
            onClick={() => toast.dismiss()}
            className="rounded border border-gray-500 px-3 py-1"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: true,
      }
    );
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const totalMembers = users.filter(
    (user) => user.role === "member"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  const getRoleColor = (role) => {
    if (role === "admin") return "text-[#DFF500]";
    return "text-gray-300";
  };

  return (
    <div className="min-h-screen bg-[#080908] text-[#EBEDE3]">
      <AdminHeader />

      <div className="lg:flex">
        <AdminSidebar />

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-10">
            <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#DFF500]">
              ADMINISTRATION / USERS
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              User Management
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              View and monitor registered application users.
            </p>
          </div>

          <section className="grid grid-cols-1 gap-7 border-b border-white/10 pb-8 sm:grid-cols-2">
            {[
              { title: "Total Members", value: totalMembers, icon: FaUsers },
              { title: "Total Admins", value: totalAdmins, icon: FaUserShield },
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
                <h2 className="text-lg font-bold">Registered Users</h2>
                <p className="mt-1 text-xs text-gray-500">
                  {filteredUsers.length} users displayed
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-3 border-b border-white/20 px-2 py-3">
                  <FaSearch className="text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name or email"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600 sm:w-52"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border-b border-white/20 bg-[#080908] px-3 py-3 text-sm text-gray-300 outline-none focus:border-[#DFF500]"
                >
                  <option value="All">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <p className="py-12 text-center text-sm text-gray-500">
                  Loading users...
                </p>
              ) : error ? (
                <p className="py-12 text-center text-sm text-red-500">
                  {error}
                </p>
              ) : (
                <>
                  <table className="w-full min-w-[750px] text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                        <th className="pb-5 pr-5">User</th>
                        <th className="pb-5 pr-5">Phone</th>
                        <th className="pb-5 pr-5">Role</th>
                        <th className="pb-5 pr-5">Status</th>
                        <th className="pb-5 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-white/10 text-sm"
                        >
                          <td className="py-5 pr-5">
                            <p className="font-semibold">{user.name}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              {user.email}
                            </p>
                          </td>

                          <td className="py-5 pr-5 text-gray-400">
                            {user.phone || "Not provided"}
                          </td>

                          <td className="py-5 pr-5">
                            <span className={getRoleColor(user.role)}>
                              {user.role}
                            </span>
                          </td>

                          <td className="py-5 pr-5">
                            <span
                              className={
                                user.status === "Active"
                                  ? "text-[#DFF500]"
                                  : "text-gray-500"
                              }
                            >
                              {user.status}
                            </span>
                          </td>

                          <td className="py-5 text-center">
                            <button
                              onClick={() => handleDelete(user.id, user.name)}
                              className="text-gray-500 transition hover:text-red-500"
                              title="Delete User"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredUsers.length === 0 && (
                    <p className="py-12 text-center text-sm text-gray-500">
                      No users found.
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default UserManagement;
