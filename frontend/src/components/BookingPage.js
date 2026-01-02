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
  const [selectedTime, setSelectedTime] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
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

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "Indoor", label: "Indoor Courts" },
    { value: "Outdoor", label: "Outdoor Courts" },
    { value: "Premium", label: "Premium Courts" },
  ];

  const timeSlots = [
    { value: "all", label: "All Times" },
    { value: "06:00 - 07:00", label: "Morning (6-7 AM)" },
    { value: "07:00 - 08:00", label: "Morning (7-8 AM)" },
    { value: "08:00 - 09:00", label: "Morning (8-9 AM)" },
    { value: "09:00 - 10:00", label: "Morning (9-10 AM)" },
    { value: "10:00 - 11:00", label: "Late Morning (10-11 AM)" },
    { value: "11:00 - 12:00", label: "Late Morning (11-12 PM)" },
    { value: "12:00 - 13:00", label: "Afternoon (12-1 PM)" },
    { value: "13:00 - 14:00", label: "Afternoon (1-2 PM)" },
    { value: "14:00 - 15:00", label: "Afternoon (2-3 PM)" },
    { value: "15:00 - 16:00", label: "Afternoon (3-4 PM)" },
    { value: "16:00 - 17:00", label: "Evening (4-5 PM)" },
    { value: "17:00 - 18:00", label: "Evening (5-6 PM)" },
    { value: "18:00 - 19:00", label: "Evening (6-7 PM)" },
    { value: "19:00 - 20:00", label: "Evening (7-8 PM)" },
    { value: "20:00 - 21:00", label: "Night (8-9 PM)" },
    { value: "21:00 - 22:00", label: "Night (9-10 PM)" },
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
  }, [slots, selectedDate, selectedCourt, selectedTime, selectedLocation]);

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

    // Filter by court
    if (selectedCourt !== "all") {
      filtered = filtered.filter((slot) => slot.courtName === selectedCourt);
    }

    // Filter by time
    if (selectedTime !== "all") {
      filtered = filtered.filter((slot) => slot.timeSlot === selectedTime);
    }

    // Filter by location
    if (selectedLocation !== "all") {
      if (selectedLocation === "Indoor") {
        filtered = filtered.filter(
          (slot) => slot.courtName === "Court A - Indoor"
        );
      } else if (selectedLocation === "Outdoor") {
        filtered = filtered.filter(
          (slot) => slot.courtName === "Court B - Outdoor"
        );
      } else if (selectedLocation === "Premium") {
        filtered = filtered.filter(
          (slot) => slot.courtName === "Court C - Premium"
        );
      }
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Date
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dates.slice(0, 4).map((date) => (
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
              {courts.slice(0, 3).map((court) => (
                <button
                  key={court}
                  onClick={() => setSelectedCourt(court)}
                  className={`w-full p-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                    selectedCourt === court
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "bg-white/5 hover:bg-white/10 text-gray-300"
                  }`}
                >
                  {court === "all" ? "All Courts" : court.split(" - ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Location Type
            </label>
            <div className="space-y-2">
              {locations.map((location) => (
                <button
                  key={location.value}
                  onClick={() => setSelectedLocation(location.value)}
                  className={`w-full p-2.5 rounded-xl text-left text-sm font-medium transition-all ${
                    selectedLocation === location.value
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "bg-white/5 hover:bg-white/10 text-gray-300"
                  }`}
                >
                  {location.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Time Slot
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              {timeSlots.map((time) => (
                <option
                  key={time.value}
                  value={time.value}
                  className="bg-gray-900"
                >
                  {time.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedCourt !== "all" ||
          selectedTime !== "all" ||
          selectedLocation !== "all") && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {selectedCourt !== "all" && (
                <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                  {selectedCourt}
                </span>
              )}
              {selectedLocation !== "all" && (
                <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                  {locations.find((l) => l.value === selectedLocation)?.label}
                </span>
              )}
              {selectedTime !== "all" && (
                <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                  {timeSlots.find((t) => t.value === selectedTime)?.label}
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCourt("all");
                  setSelectedTime("all");
                  setSelectedLocation("all");
                }}
                className="ml-2 text-sm text-red-400 hover:text-red-300 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
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
