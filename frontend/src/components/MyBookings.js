import React, { useState, useEffect } from "react";
import { slotsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  DollarSign,
  Trash2,
  AlertCircle,
  CheckCircle,
  BookOpen,
} from "lucide-react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [isAuthenticated, navigate]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await slotsAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showMessage("Failed to load bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (slotId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(slotId);
    try {
      await slotsAPI.cancelBooking(slotId);
      showMessage("Booking cancelled successfully", "success");
      fetchBookings();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to cancel booking",
        "error"
      );
    } finally {
      setCancellingId(null);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const isPastBooking = (date, timeSlot) => {
    const [endTime] = timeSlot.split(" - ")[1].split(":");
    const bookingDateTime = new Date(`${date}T${endTime}:00`);
    return bookingDateTime < new Date();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20">
      {/* Header */}
      <div className="glass-card p-8 mb-8 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-4">
          <BookOpen className="w-8 h-8 text-primary-400" />
        </div>
        <h1 className="text-4xl font-display font-bold text-gradient mb-2">
          My Bookings
        </h1>
        <p className="text-gray-400">Manage your court reservations</p>
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

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-12 text-center animate-slide-up">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-400 mb-6">No bookings yet</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Browse Available Slots
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, index) => {
            const past = isPastBooking(booking.date, booking.timeSlot);
            const slotId = booking.slot?._id || booking.slot;
            return (
              <div
                key={booking._id}
                className={`glass-card p-6 animate-slide-up ${
                  past ? "opacity-60" : ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-display font-bold text-gradient mb-1">
                          {booking.courtName}
                        </h3>
                        {past && (
                          <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-primary-400" />
                        <div>
                          <div className="text-xs text-gray-400">Date</div>
                          <div className="font-semibold">
                            {format(parseISO(booking.date), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4 text-primary-400" />
                        <div>
                          <div className="text-xs text-gray-400">Time</div>
                          <div className="font-semibold">
                            {booking.timeSlot}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-300">
                        <DollarSign className="w-4 h-4 text-primary-400" />
                        <div>
                          <div className="text-xs text-gray-400">Price</div>
                          <div className="font-semibold">₹{booking.price}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!past && (
                    <button
                      onClick={() => handleCancelBooking(slotId)}
                      disabled={cancellingId === slotId}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        cancellingId === slotId
                          ? "bg-red-500/30 text-red-300 cursor-wait"
                          : "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      {cancellingId === slotId ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
