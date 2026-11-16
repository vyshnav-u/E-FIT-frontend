
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/UserHeader";
import {
    getProfileAPI,
    updateProfileAPI,
    uploadProfileImageAPI
} from "../services/authservice";

import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendar,
    FaEdit,
    FaCamera,
    FaSave
} from "react-icons/fa";

function MyProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        address: "",
        height: "",
        weight: "",
        fitnessGoal: ""
    });

    const [profileImage, setProfileImage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    const inputStyle =
        "w-full box-border bg-[#22241F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#DFF500] transition";

    const imageUrl = profileImage
        ? `http://localhost:3000${profileImage}`
        : "https://i.pravatar.cc/300?img=12";

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await getProfileAPI(token);
                const userData = response.data.user;

                setUser({
                    name: userData.username ?? "",
                    email: userData.email ?? "",
                    phone: userData.phone ?? "",
                    gender: userData.gender ?? "",
                    dob: userData.dob
                        ? userData.dob.split("T")[0]
                        : "",
                    address: userData.address ?? "",
                    height: userData.height ?? "",
                    weight: userData.weight ?? "",
                    fitnessGoal: userData.fitnessGoal ?? ""
                });

                setProfileImage(userData.profileImage ?? "");
            } catch (error) {
                console.log(error);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");

        const updatedData = {
            username: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            dob: user.dob || null,
            address: user.address,
            height: user.height === "" ? null : Number(user.height),
            weight: user.weight === "" ? null : Number(user.weight),
            fitnessGoal: user.fitnessGoal
        };

        try {
            const response = await updateProfileAPI(updatedData, token);
            const updatedUser = response.data.user;

            setUser({
                name: updatedUser.username ?? "",
                email: updatedUser.email ?? "",
                phone: updatedUser.phone ?? "",
                gender: updatedUser.gender ?? "",
                dob: updatedUser.dob
                    ? updatedUser.dob.split("T")[0]
                    : "",
                address: updatedUser.address ?? "",
                height: updatedUser.height ?? "",
                weight: updatedUser.weight ?? "",
                fitnessGoal: updatedUser.fitnessGoal ?? ""
            });

            setIsEditing(false);
            setMessage("Profile updated successfully.");
            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message || "Profile update failed."
            );
            setMessage("");
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            setError("Please select a JPG, PNG or WEBP image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            return;
        }

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setError("");
        setMessage("");
    };

    const handleImageUpload = async () => {
        if (!selectedImage) return;

        const token = localStorage.getItem("token");
        const formData = new FormData();

        formData.append("profileImage", selectedImage);

        try {
            setImageLoading(true);

            const response = await uploadProfileImageAPI(formData, token);

            setProfileImage(response.data.user.profileImage);
            setSelectedImage(null);
            setImagePreview("");
            setMessage("Profile picture updated successfully.");
            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Profile picture upload failed."
            );
        } finally {
            setImageLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const fields = [
        { label: "Full Name", name: "name", icon: FaUser },
        { label: "Email Address", name: "email", icon: FaEnvelope },
        { label: "Phone Number", name: "phone", icon: FaPhone },
        { label: "Date of Birth", name: "dob", icon: FaCalendar },
        { label: "Gender", name: "gender", icon: FaUser },
        { label: "Address", name: "address", icon: FaMapMarkerAlt }
    ];

    const fitnessFields = [
        { label: "Height", name: "height", unit: "cm" },
        { label: "Current Weight", name: "weight", unit: "kg" },
        { label: "Fitness Goal", name: "fitnessGoal", unit: "" }
    ];

    return (
        <div className="min-h-screen bg-[#080908] text-[#EDEEE8]">
            <Header />

            <main className="px-5 md:px-10 lg:px-14 py-10">

                <div className="flex flex-col md:flex-row justify-between md:items-end gap-5 mb-10">
                    <div>
                        <p className="text-[#DFF500] text-[10px] tracking-[3px] uppercase mb-4">
                            Your account
                        </p>

                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                            My Profile<span className="text-[#DFF500]">.</span>
                        </h1>

                        <p className="text-sm text-gray-500 mt-3">
                            Manage your personal information and fitness details.
                        </p>
                    </div>

                    <button
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className="flex items-center justify-center gap-2 bg-[#DFF500] text-black px-6 py-3 rounded-xl text-xs font-semibold hover:bg-white transition"
                    >
                        {isEditing ? <FaSave /> : <FaEdit />}
                        {isEditing ? "Save Changes" : "Edit Profile"}
                    </button>
                </div>

                {message && (
                    <p className="text-[#DFF500] text-sm mb-5">{message}</p>
                )}

                {error && (
                    <p className="text-red-400 text-sm mb-5">{error}</p>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <section className="lg:col-span-4 space-y-6">

                        <div className="bg-[#171916] border border-white/5 rounded-[28px] p-7">

                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <img
                                    src={imagePreview || imageUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full border-2 border-[#DFF500]"
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-0 right-0 bg-[#DFF500] text-black p-3 rounded-full hover:bg-white transition"
                                    title="Change profile picture"
                                >
                                    <FaCamera />
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>

                            {selectedImage && (
                                <div className="flex justify-center mb-6">
                                    <button
                                        onClick={handleImageUpload}
                                        disabled={imageLoading}
                                        className="bg-[#DFF500] text-black px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white transition disabled:opacity-50"
                                    >
                                        {imageLoading ? "Uploading..." : "Save Photo"}
                                    </button>
                                </div>
                            )}

                            <div className="text-center">
                                <h2 className="text-2xl font-semibold">
                                    {user.name}
                                </h2>

                                <p className="text-xs text-gray-500 mt-2">
                                    {user.email}
                                </p>

                                <span className="inline-block mt-5 bg-[#DFF500]/10 text-[#DFF500] px-4 py-2 rounded-full text-[10px] tracking-wider">
                                    ACTIVE MEMBER
                                </span>
                            </div>

                            <div className="border-t border-white/10 mt-7 pt-6 grid grid-cols-2 gap-5">
                                <div>
                                    <p className="text-2xl font-semibold">
                                        {user.height || "--"}
                                        <span className="text-xs text-gray-500 ml-1">cm</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Height</p>
                                </div>

                                <div>
                                    <p className="text-2xl font-semibold">
                                        {user.weight || "--"}
                                        <span className="text-xs text-gray-500 ml-1">kg</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Weight</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#171916] border border-white/5 rounded-[28px] p-6">
                            <p className="text-[10px] tracking-[2px] text-gray-500 mb-5">
                                FITNESS INFORMATION
                            </p>

                            {fitnessFields.map((field) => (
                                <div key={field.name} className="mb-5 last:mb-0">
                                    <label className="text-xs text-gray-400 block mb-2">
                                        {field.label}
                                    </label>

                                    {isEditing ? (
                                        <input
                                            type={field.name === "fitnessGoal" ? "text" : "number"}
                                            name={field.name}
                                            value={user[field.name]}
                                            onChange={handleChange}
                                            className={inputStyle}
                                        />
                                    ) : (
                                        <p className="text-sm font-medium">
                                            {user[field.name] || "--"} {field.unit}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="lg:col-span-8 space-y-6">

                        <div className="bg-[#171916] border border-white/5 rounded-[28px] p-6 md:p-8">

                            <div className="mb-8">
                                <p className="text-[10px] tracking-[2px] text-[#DFF500] mb-2">
                                    PERSONAL INFORMATION
                                </p>

                                <h2 className="text-xl font-semibold">
                                    Basic Details
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fields.map((field) => (
                                    <div key={field.name}>
                                        <label className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                            <field.icon className="text-[#DFF500]" />
                                            {field.label}
                                        </label>

                                        {isEditing ? (
                                            <input
                                                type={field.name === "dob" ? "date" : "text"}
                                                name={field.name}
                                                value={user[field.name]}
                                                onChange={handleChange}
                                                className={inputStyle}
                                            />
                                        ) : (
                                            <p className="text-sm bg-[#22241F] border border-white/5 rounded-xl px-4 py-3 min-h-[54px] flex items-center box-border">
                                                {user[field.name] || "--"}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#DFF500] text-black rounded-[28px] p-7 flex flex-col md:flex-row justify-between gap-5 items-start md:items-center">
                            <div>
                                <p className="text-[10px] tracking-[2px] font-semibold mb-2">
                                    E/FIT MEMBERSHIP
                                </p>

                                <h2 className="text-2xl font-bold">
                                    Your journey. Your progress.
                                </h2>

                                <p className="text-xs mt-2 opacity-70">
                                    Keep your personal information up to date.
                                </p>
                            </div>

                            <FaUser className="text-4xl opacity-30" />
                        </div>

                    </section>
                </div>
            </main>
        </div>
    );
}

export default MyProfile;
