import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../services/authservice";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setformData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await loginAPI(loginData);
      localStorage.setItem("token", response.data.token)

      toast.success("Login Successful");
      console.log(response.data);

      const role = response.data.user.role

      if (role === "admin") {
        navigate('/admin/dashboard')
      } else {
        navigate('/userdash')
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black px-5 text-[#EBEDE3]">
      <header className="flex items-center justify-between border-b border-white/10 py-4">
        <Link to="/" className="text-2xl font-black tracking-[-2px] text-[#DFF500]">
          E/FIT
        </Link>
        <Link to="/register" className="text-sm text-gray-400 hover:text-[#DFF500]">
          Create account ↗
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center py-6">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#DFF500]">
              Member Login
            </p>
            <h1 className="text-4xl font-black uppercase leading-none tracking-[-0.06em] sm:text-5xl">
              Welcome back<span className="text-[#DFF500]">.</span>
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              Sign in to continue your fitness journey.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase text-gray-400">
                Email address
              </label>
              <input
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-md border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#DFF500]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase text-gray-400">
                Password
              </label>
              <input
                id="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#DFF500]"
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-[#DFF500]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#DFF500] py-3.5 text-sm font-black uppercase text-black transition hover:bg-[#c8dc00]"
            >
              Login ↗
            </button>
          </form>
          <pre>{JSON.stringify(formData, null, 2)}</pre>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#DFF500]">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;