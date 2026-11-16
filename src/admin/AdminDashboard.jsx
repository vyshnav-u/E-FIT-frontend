
import React, { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaUsers,
  FaDumbbell,
  FaUtensils,
  FaCalendarAlt,
  FaArrowUp,
} from "react-icons/fa";

import {
  getAllUsersAPI,
  getWorkoutsAPI,
  getDietAPI,
} from "../services/authservice";

function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setErrors(["Please log in to view the dashboard."]);
          return;
        }

        const results = await Promise.allSettled([
          getAllUsersAPI(token),
          getWorkoutsAPI(token),
          getDietAPI(token),
        ]);

        const failedRequests = [];

        if (results[0].status === "fulfilled") {
          setUsers(results[0].value.data.users || []);
        } else {
          failedRequests.push("Unable to fetch users.");
        }

        if (results[1].status === "fulfilled") {
          setWorkouts(results[1].value.data.workouts || []);
        } else {
          failedRequests.push("Unable to fetch workout plans.");
        }

        if (results[2].status === "fulfilled") {
          setDiets(results[2].value.data.diets || []);
        } else {
          failedRequests.push("Unable to fetch diet plans.");
        }

        setErrors(failedRequests);

      } catch (error) {
        console.error("Dashboard error:", error);
        setErrors(["Something went wrong while loading dashboard data."]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const registeredUsers = users.filter(
    (user) => user.role !== "admin"
  );

  const recentUsers = [...registeredUsers].sort((a, b) => {
    const dateA = a.createdAt
      ? new Date(a.createdAt).getTime()
      : parseInt(a._id.substring(0, 8), 16) * 1000;

    const dateB = b.createdAt
      ? new Date(b.createdAt).getTime()
      : parseInt(b._id.substring(0, 8), 16) * 1000;

    return dateB - dateA;
  }).slice(0, 5);

  const formatDate = (user) => {
    const date = user.createdAt
      ? new Date(user.createdAt)
      : new Date(parseInt(user._id.substring(0, 8), 16) * 1000);

    if (isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const stats = [
    {
      title: "Registered Users",
      value: registeredUsers.length,
      description: "Total member accounts",
      icon: FaUsers,
    },
    {
      title: "Workout Plans",
      value: workouts.length,
      description: "Available workout programs",
      icon: FaDumbbell,
    },
    {
      title: "Diet Plans",
      value: diets.length,
      description: "Available nutrition programs",
      icon: FaUtensils,
    },
  ];

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#080908] text-[#EBEDE3]">

      <AdminHeader />

      <div className="lg:flex">

        <AdminSidebar />

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">

          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#DFF500]">
                OVERVIEW
              </p>

              <h1 className="text-3xl font-bold sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-3 text-sm text-gray-500">
                Manage users, workouts and nutrition programs.
              </p>
            </div>

            <p className="text-xs text-gray-500">
              <FaCalendarAlt className="mr-2 inline text-[#DFF500]" />
              {currentDate}
            </p>

          </div>

          {errors.length > 0 && (
            <div className="mb-8 border border-red-500/20 bg-red-500/5 px-5 py-4">
              {errors.map((error, index) => (
                <p key={index} className="text-xs text-red-400">
                  {error}
                </p>
              ))}
            </div>
          )}

          <section>

            <div className="mb-7 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                Platform Statistics
              </h2>

              <span className="text-xs text-gray-600">
                Live data
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">

              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="border-b border-white/10 pb-6"
                  >

                    <div className="mb-5 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {stat.title}
                      </p>

                      <Icon className="text-lg text-[#DFF500]" />
                    </div>

                    <h3 className="text-4xl font-bold">
                      {loading ? (
                        <span className="text-2xl text-gray-600">...</span>
                      ) : (
                        stat.value
                      )}
                    </h3>

                    <p className="mt-3 text-xs text-gray-500">
                      {stat.description}
                    </p>

                  </div>
                );
              })}

            </div>

          </section>

          <section className="mt-16">

            <div className="mb-7 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-bold">
                  Recently Registered Users
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Latest members registered on E/FIT
                </p>
              </div>

              <FaUsers className="text-xl text-[#DFF500]" />

            </div>

            {loading ? (
              <p className="py-8 text-sm text-gray-500">
                Loading users...
              </p>
            ) : recentUsers.length === 0 ? (
              <p className="py-8 text-sm text-gray-500">
                No registered users found.
              </p>
            ) : (

              <div>

                {recentUsers.map((user, index) => (

                  <div
                    key={user._id}
                    className="flex flex-col justify-between gap-3 border-b border-white/10 py-5 sm:flex-row sm:items-center"
                  >

                    <div className="flex items-center gap-5">

                      <span className="text-xs text-gray-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <p className="text-sm font-semibold">
                          {user.username}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>

                    </div>

                    <p className="text-xs text-gray-500">
                      {formatDate(user)}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </section>

          <section className="mt-16 border-t border-white/10 pt-9">

            <p className="text-xs tracking-[0.25em] text-gray-600">
              E/FIT ADMINISTRATION
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Manage. Monitor. Improve.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
              Manage registered users, organize workout programs and maintain
              nutrition plans through one centralized administration panel.
            </p>

          </section>

        </main>

      </div>

    </div>
  );
}

export default AdminDashboard;
