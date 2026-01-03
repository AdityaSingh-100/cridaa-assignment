# 🏸 CourtBook - Court Booking Application

A simple court booking app where users can book sports courts online. Built with React, Node.js, and MongoDB.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🔐 User login and registration
- 📅 Book court slots by date and time
- 🏟️ 3 court types (Indoor, Outdoor, Premium)
- 💰 Different pricing for each court
- 📱 Mobile responsive design
- 👤 View and cancel bookings

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS, Axios  
**Backend:** Node.js, Express, MongoDB, JWT

## ⚡ Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd court-booking-app

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
node seed.js
npm start

# Frontend setup (new terminal)
cd frontend
npm install
npm start
```

**Backend:** http://localhost:5000  
**Frontend:** http://localhost:3000

### Environment Variables

**Backend (.env):**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/court-booking
JWT_SECRET=your-secret-key
```

**Frontend (.env):**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Usage

1. **Browse**: View available slots without login
2. **Register**: Create account with name, email, password
3. **Book**: Select date, court, and time slot
4. **Manage**: View and cancel bookings in "My Bookings"

## 🆕 Recent Updates (January 3, 2026)

### Enhanced User Experience
- **📱 Fully Responsive Design**: Optimized for all screen sizes (mobile, tablet, desktop) with custom breakpoints
  - Added `xs` breakpoint (480px) for extra small devices
  - Responsive typography and spacing throughout the app
  - Touch-friendly UI elements for mobile users

- **📅 Calendar Date Picker**: Replaced button-based date selection with native HTML5 calendar input
  - Users can now select any date up to 60 days in advance
  - Visual calendar interface for easier date selection
  - Displays selected date in user-friendly format

- **⏰ Smart Slot Display**: Improved booking flow with conditional rendering
  - Time slots only appear after selecting a specific time
  - No more scrolling through irrelevant slots
  - Clear prompt to guide users: "Select a time slot to view available courts"
  - Removed "All Times" option to enforce better UX

- **📆 Extended Availability**: Backend now generates slots for 60 days (2 months) instead of 7 days
  - Covers current and next month completely
  - Total of 2,880 slots generated (60 days × 3 courts × 16 time slots)
  - Better planning flexibility for users

### Component Improvements
- **Navbar**: Compact mobile design with icon-only buttons
- **Forms**: Smaller padding and text on mobile devices
- **Footer**: Responsive grid layout adapting to screen size
- **Cards**: Improved spacing and readability across devices

## 📝 Challenges & Solutions

**Double Bookings:** MongoDB indexes prevent race conditions when multiple users book simultaneously. Database transactions ensure atomic slot reservation.

**Date Consistency:** ISO 8601 format (YYYY-MM-DD) maintains consistency across timezones. All dates normalized before database storage.

**Authentication Flow:** JWT tokens stored in localStorage with 7-day expiration. Axios interceptors automatically inject tokens in API requests.

**Booking History:** Separate Booking collection preserves transaction history independent of slot availability, enabling cancellation tracking and analytics.

**Mobile Responsiveness:** Tailwind's mobile-first approach with glass morphism effects creates consistent experience across devices from 320px to 4K displays.

## 🔒 Security

- Encrypted passwords
- JWT authentication
- Protected booking routes
