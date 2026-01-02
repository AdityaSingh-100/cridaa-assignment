const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Slot = require('./models/Slot');

dotenv.config();

const courts = ['Court A - Indoor', 'Court B - Outdoor', 'Court C - Premium'];
const timeSlots = [
  '06:00 - 07:00',
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00'
];

const prices = {
  'Court A - Indoor': 800,
  'Court B - Outdoor': 600,
  'Court C - Premium': 1200
};

// Generate dates for next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const seedSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing slots
    await Slot.deleteMany({});
    console.log('Cleared existing slots');

    const dates = generateDates();
    const slots = [];

    // Generate slots for each court, date, and time
    for (const court of courts) {
      for (const date of dates) {
        for (const timeSlot of timeSlots) {
          slots.push({
            courtName: court,
            date,
            timeSlot,
            price: prices[court],
            isBooked: false
          });
        }
      }
    }

    await Slot.insertMany(slots);
    console.log(`✅ Seeded ${slots.length} slots successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedSlots();
