const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  courtName: {
    type: String,
    required: true,
    enum: ['Court A - Indoor', 'Court B - Outdoor', 'Court C - Premium']
  },
  date: {
    type: String,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound index to ensure unique slots per court, date, and time
slotSchema.index({ courtName: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);
