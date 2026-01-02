import React, { useState, useEffect } from "react";
import { slotsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { format, addDays, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedCourt, setSelectedCourt] = useState("all");
  const [bookingSlot, setBookingSlot] = useState(null);
  const [message, setMessage] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const courts = [
    "all",
    "Court A - Indoor",
    "Court B - Outdoor",
    "Court C - Premium",
  ];
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return format(date, "yyyy-MM-dd");
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    filterSlots();
  }, [slots, selectedDate, selectedCourt]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await slotsAPI.getSlots();
      setSlots(response.data.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
      showMessage("Failed to load slots", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterSlots = () => {
    let filtered = slots.filter((slot) => slot.date === selectedDate);
    if (selectedCourt !== "all") {
      filtered = filtered.filter((slot) => slot.courtName === selectedCourt);
    }
    setFilteredSlots(filtered);
  };

  const handleBookSlot = async (slotId) => {
    if (!isAuthenticated) {
      showMessage("Please login to book a slot", "error");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    setBookingSlot(slotId);
    try {
      await slotsAPI.bookSlot(slotId);
      showMessage("Slot booked successfully!", "success");
      fetchSlots();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to book slot",
        "error"
      );
    } finally {
      setBookingSlot(null);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const groupSlotsByCourt = () => {
    const grouped = {};
    filteredSlots.forEach((slot) => {
      if (!grouped[slot.courtName]) {
        grouped[slot.courtName] = [];
      }
      grouped[slot.courtName].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByCourt();

  return (
    <div className="max-w-7xl mx-auto p-4 pb-20">
      {/* Hero Section */}
      <div className="glass-card p-8 mb-8 text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
          Book Your Court
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Reserve your preferred time slot across our premium indoor and outdoor
          courts
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

      {/* Filters */}
      <div
        className="glass-card p-6 mb-8 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-display font-semibold">Filters</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Date
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    selectedDate === date
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "bg-white/5 hover:bg-white/10 text-gray-300"
                  }`}
                >
                  <div className="text-xs opacity-70">
                    {format(parseISO(date), "EEE")}
                  </div>
                  <div className="font-bold">
                    {format(parseISO(date), "d MMM")}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Court Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Court
            </label>
            <div className="space-y-2">
              {courts.map((court) => (
                <button
                  key={court}
                  onClick={() => setSelectedCourt(court)}
                  className={`w-full p-3 rounded-xl text-left font-medium transition-all ${
                    selectedCourt === court
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "bg-white/5 hover:bg-white/10 text-gray-300"
                  }`}
                >
                  {court === "all" ? "All Courts" : court}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slots Display */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Loading slots...</p>
        </div>
      ) : Object.keys(groupedSlots).length === 0 ? (
        <div className="glass-card p-12 text-center">
          <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-400">
            No slots available for selected filters
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSlots).map(
            ([courtName, courtSlots], index) => (
              <div
                key={courtName}
                className="glass-card p-6 animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <h3 className="text-2xl font-display font-bold text-gradient mb-6">
                  {courtName}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {courtSlots.map((slot) => (
                    <div
                      key={slot._id}
                      className={
                        slot.isBooked ? "slot-card-booked" : "slot-card"
                      }
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-primary-400">
                          <Clock className="w-4 h-4" />
                          <span className="font-semibold">{slot.timeSlot}</span>
                        </div>
                        {slot.isBooked ? (
                          <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">
                            Booked
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                            Available
                          </span>
                        )}
                      </div>

                      {slot.isBooked && slot.bookedBy && (
                        <div className="mb-3 p-2 bg-white/5 rounded-lg">
                          <p className="text-xs text-gray-400">Booked by</p>
                          <p className="text-sm text-gray-300 font-medium">
                            {slot.bookedBy.name}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-gray-300 mb-4">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-bold text-lg">₹{slot.price}</span>
                        <span className="text-sm text-gray-400">/ hour</span>
                      </div>

                      <button
                        onClick={() => handleBookSlot(slot._id)}
                        disabled={slot.isBooked || bookingSlot === slot._id}
                        className={`w-full py-2 rounded-lg font-semibold transition-all ${
                          slot.isBooked
                            ? "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                            : bookingSlot === slot._id
                            ? "bg-primary-500/50 text-white cursor-wait"
                            : "bg-primary-500 hover:bg-primary-600 text-white"
                        }`}
                      >
                        {bookingSlot === slot._id
                          ? "Booking..."
                          : slot.isBooked
                          ? "Not Available"
                          : "Book Now"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
