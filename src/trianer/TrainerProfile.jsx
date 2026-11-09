
import React, { useState } from "react";
import TrainerHeader from "../components/TrainerHeader";
import { FaUserCircle, FaCamera, FaEdit, FaSave } from "react-icons/fa";

function TrainerProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [trainer, setTrainer] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@email.com",
    phone: "+91 9876543210",
    specialization: "Strength & Conditioning",
    experience: "5 Years",
    certification: "Certified Personal Trainer",
    bio: "Passionate fitness trainer focused on helping individuals build strength, improve endurance, and achieve sustainable fitness goals."
  });

  const handleChange = (e) => {
    setTrainer({
      ...trainer,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const profileFields = [
    { label: "Full Name", name: "name" },
    { label: "Email Address", name: "email" },
    { label: "Phone Number", name: "phone" },
    { label: "Specialization", name: "specialization" },
    { label: "Experience", name: "experience" },
    { label: "Certification", name: "certification" }
  ];

  return (
    <div className="min-h-screen bg-[#080908] text-white">
      <TrainerHeader />

      <main className="px-5 md:px-10 lg:px-16 py-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[#DFF500] text-xs tracking-[4px] uppercase mb-3">
              Trainer Account
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              My <span className="text-[#DFF500]">Profile.</span>
            </h1>
            <p className="text-gray-500 mt-4 text-sm">
              Manage your personal information and professional details.
            </p>
          </div>

          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="flex items-center gap-3 bg-[#DFF500] text-black px-6 py-3 text-sm font-semibold hover:bg-white transition w-fit"
          >
            {isEditing ? <FaSave /> : <FaEdit />}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-14">

          <section className="flex flex-col items-center lg:items-start">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border border-[#DFF500]/40 flex items-center justify-center overflow-hidden">
                <FaUserCircle className="text-[150px] text-gray-600" />
              </div>

              <button className="absolute bottom-2 right-2 bg-[#DFF500] text-black p-3 rounded-full">
                <FaCamera />
              </button>
            </div>

            <h2 className="text-2xl font-bold mt-7">
              {trainer.name}
            </h2>

            <p className="text-[#DFF500] text-sm mt-2">
              {trainer.specialization}
            </p>

            <div className="w-full border-t border-white/10 mt-8 pt-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest">
                  Experience
                </p>
                <p className="text-xl font-semibold mt-2">
                  {trainer.experience}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest">
                  Members
                </p>
                <p className="text-xl font-semibold mt-2">
                  48
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="border-b border-white/10 pb-5 mb-8">
              <h2 className="text-xl font-semibold">
                Personal Information
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Your contact and professional information.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {profileFields.map((field) => (
                <div key={field.name}>
                  <label className="text-gray-500 text-xs uppercase tracking-widest">
                    {field.label}
                  </label>

                  {isEditing ? (
                    <input
                      type="text"
                      name={field.name}
                      value={trainer[field.name]}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-[#DFF500]/50 py-3 text-white outline-none focus:border-[#DFF500]"
                    />
                  ) : (
                    <p className="text-white mt-3 border-b border-white/10 pb-3">
                      {trainer[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12">
              <label className="text-gray-500 text-xs uppercase tracking-widest">
                About Me
              </label>

              {isEditing ? (
                <textarea
                  name="bio"
                  value={trainer.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-transparent border-b border-[#DFF500]/50 py-3 text-white outline-none focus:border-[#DFF500] resize-none"
                />
              ) : (
                <p className="text-gray-400 leading-7 mt-4 max-w-3xl">
                  {trainer.bio}
                </p>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default TrainerProfile;
