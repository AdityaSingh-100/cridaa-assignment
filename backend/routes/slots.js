const express = require("express");
const Slot = require("../models/Slot");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/slots
// @desc    Get all available slots (with optional filters)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { date, courtName, available } = req.query;

    let filter = {};
    if (date) filter.date = date;
    if (courtName) filter.courtName = courtName;
    if (available === "true") filter.isBooked = false;

    const slots = await Slot.find(filter)
      .populate("bookedBy", "name email")
      .sort({ date: 1, timeSlot: 1 });

    res.json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/slots/:id
// @desc    Get single slot by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate(
      "bookedBy",
      "name email"
    );

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    res.json({
      success: true,
      data: slot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/slots/book/:id
// @desc    Book a slot
// @access  Private
router.post("/book/:id", protect, async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "Slot is already booked",
      });
    }

    // Create booking record
    const booking = new Booking({
      slot: slot._id,
      user: req.user._id,
      courtName: slot.courtName,
      date: slot.date,
      timeSlot: slot.timeSlot,
      price: slot.price,
      status: "active",
    });

    await booking.save();

    // Book the slot
    slot.isBooked = true;
    slot.bookedBy = req.user._id;
    slot.bookedAt = new Date();
    await slot.save();

    const populatedSlot = await Slot.findById(slot._id).populate(
      "bookedBy",
      "name email"
    );

    res.json({
      success: true,
      message: "Slot booked successfully",
      data: populatedSlot,
      booking: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/slots/cancel/:id
// @desc    Cancel a booking
// @access  Private
router.delete("/cancel/:id", protect, async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    if (!slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "Slot is not booked",
      });
    }

    // Check if user owns this booking
    if (slot.bookedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    // Update booking record to cancelled
    const booking = await Booking.findOne({
      slot: slot._id,
      user: req.user._id,
      status: "active",
    });
    if (booking) {
      booking.status = "cancelled";
      booking.cancelledAt = new Date();
      await booking.save();
    }

    // Cancel the booking
    slot.isBooked = false;
    slot.bookedBy = null;
    slot.bookedAt = null;
    await slot.save();

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: slot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/slots/my-bookings
// @desc    Get user's bookings
// @access  Private
router.get("/user/my-bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      status: "active",
    })
      .populate("slot")
      .populate("user", "name email")
      .sort({ date: 1, timeSlot: 1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
