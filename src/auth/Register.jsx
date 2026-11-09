

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from "../services/authservice";
import { toast } from "react-toastify";


function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleRegister = async (e) => {
    e.preventDefault();

    // check password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password Dont match")
      return
    }
    console.log(formData)

    const registerData = {
      username: formData.name,
      email: formData.email,
      password: formData.password
    }

    try {
      const response = await registerAPI(registerData)
      console.log(response.data);
      navigate('/login')
      toast.success("Registration Successful")
    } catch (err) {
      toast.error("Registration Failed")

    }

  };

  return (
    <div className="flex min-h-screen flex-col bg-black px-5 text-[#EBEDE3]">
      <header className="flex items-center justify-between border-b border-white/10 py-4">
        <Link to="/" className="text-2xl font-black tracking-[-2px] text-[#DFF500]">
          E/FIT
        </Link>
        <Link to="/login" className="text-sm text-gray-400 hover:text-[#DFF500]">
          Login ↗
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-3xl">
          <div className="mb-7">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#DFF500]">
              Join E/FIT
            </p>
            <h1 className="text-4xl font-black uppercase leading-none tracking-[-0.06em] sm:text-5xl">
              Start your journey<span className="text-[#DFF500]">.</span>
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              Create your account and take the first step.
            </p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase text-gray-400">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="w-full rounded-md border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#DFF500]"
                />
              </div>

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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-md border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#DFF500]"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-xs font-bold uppercase text-gray-400">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-md border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#DFF500]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-7 w-full rounded-md bg-[#DFF500] py-3.5 text-sm font-black uppercase text-black transition hover:bg-[#c8dc00]"
            >
              Create account ↗
            </button>
          </form>
          <pre>{JSON.stringify(formData, null, 2)}</pre>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#DFF500]">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;
