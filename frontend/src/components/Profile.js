import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authAPI, slotsAPI } from "../services/api";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Profile = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
      });
      fetchBookings();
    }
  }, [isAuthenticated, navigate, user]);

  const fetchBookings = async () => {
    try {
      const response = await slotsAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      currentPassword: "",
      newPassword: "",
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      // Only include password fields if newPassword is provided
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          showMessage(
            "Please enter your current password to change password",
            "error"
          );
          setLoading(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      console.log("Sending update request:", {
        ...updateData,
        currentPassword: "***",
        newPassword: "***",
      });
      const response = await authAPI.updateProfile(updateData);
      console.log("Update response:", response.data);

      if (response.data.success) {
        // Update token if provided
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Update user in context
        const updatedUser = response.data.user;
        if (setUser) {
          setUser(updatedUser);
        }

        setIsEditing(false);
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
        });
        showMessage("Profile updated successfully!", "success");

        // Reload user data
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      showMessage(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4 pb-20">
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 pb-20">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 mb-6 sm:mb-8 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-500/20 mb-4">
          <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gradient mb-2">
          My Profile
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Manage your account information
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`glass-card p-4 mb-6 flex items-center gap-3 animate-slide-up ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30"
              : "bg-red-500/10 border-red-500/30"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <p
            className={
              message.type === "success" ? "text-green-300" : "text-red-300"
            }
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Profile Information */}
      <div className="glass-card p-6 sm:p-8 animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary-400" />
          Account Details
        </h2>

        <div className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <User className="w-4 h-4 text-primary-400" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your name"
              />
            ) : (
              <div className="glass-card p-4 border border-white/10">
                <p className="text-white font-medium">{user.name}</p>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Mail className="w-4 h-4 text-primary-400" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
              />
            ) : (
              <div className="glass-card p-4 border border-white/10">
                <p className="text-white font-medium">{user.email}</p>
              </div>
            )}
          </div>

          {/* Password Fields */}
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Lock className="w-4 h-4 text-primary-400" />
                  Current Password (Required if changing password)
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Lock className="w-4 h-4 text-primary-400" />
                  New Password (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="input-field pr-12"
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                <Lock className="w-4 h-4 text-primary-400" />
                Password
              </label>
              <div className="glass-card p-4 border border-white/10">
                <p className="text-white font-medium">••••••••••••</p>
              </div>
            </div>
          )}

          {/* Member Since */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Calendar className="w-4 h-4 text-primary-400" />
              Member Since
            </label>
            <div className="glass-card p-4 border border-white/10">
              <p className="text-white font-medium">{joinDate}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="animated-button flex-1"
                  disabled={loading}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                  </svg>
                  <span className="text">
                    {loading ? "Saving..." : "Save Changes"}
                  </span>
                  <span className="circle" />
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                  </svg>
                </button>
                <button
                  onClick={handleCancel}
                  className="animated-button flex-1"
                  style={{
                    color: "#ef4444",
                    boxShadow: "0 0 0 2px #ef4444",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                  </svg>
                  <span className="text">Cancel</span>
                  <span
                    className="circle"
                    style={{ backgroundColor: "#ef4444" }}
                  />
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button onClick={handleEdit} className="animated-button flex-1">
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                  </svg>
                  <span className="text">Edit Profile</span>
                  <span className="circle" />
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="animated-button flex-1"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                  </svg>
                  <span className="text">View My Bookings</span>
                  <span className="circle" />
                  <svg
                    viewBox="0 0 24 24"
                    className="arr-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="glass-card p-6 sm:p-8 mt-6 animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-6">
          Account Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 border border-primary-500/30 text-center">
            <p className="text-3xl font-bold text-primary-400">
              {bookings.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Bookings</p>
          </div>
          <div className="glass-card p-4 border border-primary-500/30 text-center">
            <p className="text-3xl font-bold text-primary-400">
              {
                bookings.filter((b) => {
                  const bookingDateTime = new Date(
                    `${b.date}T${b.timeSlot.split(" - ")[1]}:00`
                  );
                  return bookingDateTime >= new Date();
                }).length
              }
            </p>
            <p className="text-sm text-gray-400 mt-1">Active Bookings</p>
          </div>
          <div className="glass-card p-4 border border-primary-500/30 text-center">
            <p className="text-3xl font-bold text-primary-400">
              {
                bookings.filter((b) => {
                  const bookingDateTime = new Date(
                    `${b.date}T${b.timeSlot.split(" - ")[1]}:00`
                  );
                  return bookingDateTime < new Date();
                }).length
              }
            </p>
            <p className="text-sm text-gray-400 mt-1">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
