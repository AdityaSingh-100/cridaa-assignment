import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, BookOpen } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="glass-card mx-2 sm:mx-4 mt-2 sm:mt-4 p-3 sm:p-4 sticky top-2 sm:top-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <img
            src={logo}
            alt="CourtBook Logo"
            className="h-12 sm:h-12 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <div className="hidden" style={{ display: "none" }}>
            <h1 className="text-base sm:text-xl font-display font-bold text-gradient">
              CourtBook
            </h1>
            <p className="text-xs text-gray-400 hidden xs:block">by Cridaa</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" className="animated-button">
                <svg
                  viewBox="0 0 24 24"
                  className="arr-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
                <span className="text">My Bookings</span>
                <span className="circle" />
                <svg
                  viewBox="0 0 24 24"
                  className="arr-1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
              </Link>

              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/20">
                <User className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>

              <button onClick={handleLogout} className="animated-button">
                <svg
                  viewBox="0 0 24 24"
                  className="arr-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
                <span className="text">Logout</span>
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
          ) : (
            <>
              <Link to="/login" className="animated-button">
                <svg
                  viewBox="0 0 24 24"
                  className="arr-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
                <span className="text">Login</span>
                <span className="circle" />
                <svg
                  viewBox="0 0 24 24"
                  className="arr-1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
              </Link>
              <Link to="/register" className="animated-button">
                <svg
                  viewBox="0 0 24 24"
                  className="arr-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
                <span className="text">Register</span>
                <span className="circle" />
                <svg
                  viewBox="0 0 24 24"
                  className="arr-1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
