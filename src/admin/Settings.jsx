
import React, { useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import {
  FaCog,
  FaBuilding,
  FaBell,
  FaShieldAlt,
  FaUsers,
  FaSave,
  FaUndo,
} from "react-icons/fa";

const initialSettings = {
  gymName: "E/FIT Fitness Center",
  email: "admin@efit.com",
  phone: "+91 9876543210",
  address: "Ernakulam, Kerala, India",
  openingTime: "06:00",
  closingTime: "22:00",
  emailNotifications: true,
  sessionNotifications: true,
  membershipNotifications: true,
  allowRegistration: true,
  membershipDuration: "30",
  maxMembers: "300",
  twoFactor: false,
  sessionTimeout: "30",
};

function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setSaved(false);
  };

  const SettingToggle = ({ name, title, description }) => (
    <div className="flex items-center justify-between gap-5 border-b border-white/10 py-5">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          name={name}
          checked={settings[name]}
          onChange={handleChange}
          className="peer sr-only"
        />

        <div className="h-6 w-11 rounded-full bg-gray-700 transition peer-checked:bg-[#DFF500] after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5 peer-checked:after:bg-black" />
      </label>
    </div>
  );

  const InputField = ({ label, name, type = "text" }) => (
    <div>
      <label className="mb-2 block text-xs text-gray-400">{label}</label>

      <input
        type={type}
        name={name}
        value={settings[name]}
        onChange={handleChange}
        className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none transition focus:border-[#DFF500]"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080908] text-[#EBEDE3]">
      <AdminHeader />

      <div className="lg:grid lg:grid-cols-[250px_1fr]">
        <AdminSidebar />

        <main className="min-w-0 p-5 sm:p-8 lg:p-10">
          <div className="mb-10">
            <p className="mb-2 text-xs font-bold tracking-[0.3em] text-[#DFF500]">
              ADMINISTRATION / CONFIGURATION
            </p>

            <h1 className="text-3xl font-black sm:text-4xl">
              Application Settings
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your fitness center and application preferences.
            </p>
          </div>

          <form onSubmit={handleSave}>
            <section className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <FaBuilding className="text-[#DFF500]" />
                <div>
                  <h2 className="text-xl font-bold">Gym Information</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Manage your fitness center details.
                  </p>
                </div>
              </div>

              <div className="grid gap-7 border-b border-white/10 pb-8 sm:grid-cols-2">
                <InputField label="Gym Name" name="gymName" />
                <InputField label="Contact Email" name="email" type="email" />
                <InputField label="Phone Number" name="phone" />
                <InputField label="Address" name="address" />

                <InputField
                  label="Opening Time"
                  name="openingTime"
                  type="time"
                />

                <InputField
                  label="Closing Time"
                  name="closingTime"
                  type="time"
                />
              </div>
            </section>

            <section className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <FaBell className="text-[#DFF500]" />
                <div>
                  <h2 className="text-xl font-bold">
                    Notification Preferences
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Choose which notifications the application should enable.
                  </p>
                </div>
              </div>

              <SettingToggle
                name="emailNotifications"
                title="Email Notifications"
                description="Enable email notifications for important updates."
              />

              <SettingToggle
                name="sessionNotifications"
                title="Training Session Notifications"
                description="Receive reminders about upcoming training sessions."
              />

              <SettingToggle
                name="membershipNotifications"
                title="Membership Notifications"
                description="Receive alerts about new and expiring memberships."
              />
            </section>

            <section className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <FaUsers className="text-[#DFF500]" />
                <div>
                  <h2 className="text-xl font-bold">Membership Settings</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Configure membership registration and limits.
                  </p>
                </div>
              </div>

              <SettingToggle
                name="allowRegistration"
                title="Allow New Registrations"
                description="Allow new members to register through the application."
              />

              <div className="grid gap-7 border-b border-white/10 py-7 sm:grid-cols-2">
                <InputField
                  label="Membership Duration (Days)"
                  name="membershipDuration"
                  type="number"
                />

                <InputField
                  label="Maximum Members"
                  name="maxMembers"
                  type="number"
                />
              </div>
            </section>

            <section className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <FaShieldAlt className="text-[#DFF500]" />
                <div>
                  <h2 className="text-xl font-bold">Security Settings</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Manage basic application security preferences.
                  </p>
                </div>
              </div>

              <SettingToggle
                name="twoFactor"
                title="Two-Factor Authentication"
                description="Enable an additional verification step for admin access."
              />

              <div className="max-w-sm border-b border-white/10 py-7">
                <label className="mb-2 block text-xs text-gray-400">
                  Session Timeout
                </label>

                <select
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  className="w-full border-b border-white/20 bg-[#080908] py-3 text-sm outline-none focus:border-[#DFF500]"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                  <option value="120">120 Minutes</option>
                </select>
              </div>
            </section>

            <div className="flex flex-col justify-between gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
              <div>
                {saved && (
                  <p className="text-sm font-semibold text-[#DFF500]">
                    Settings saved successfully!
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 border border-white/20 px-5 py-3 text-sm transition hover:border-white/50"
                >
                  <FaUndo />
                  Reset
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#DFF500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#c8dc00]"
                >
                  <FaSave />
                  Save Settings
                </button>
              </div>
            </div>
          </form>

          <div className="mt-12 border-t border-white/10 py-6 text-center text-xs text-gray-600">
            E/FIT ADMINISTRATION · APPLICATION SETTINGS
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
