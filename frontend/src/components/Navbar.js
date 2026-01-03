import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Calendar, LogOut, User, BookOpen } from "lucide-react";

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
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-display font-bold text-gradient">
              CourtBook
            </h1>
            <p className="text-xs text-gray-400 hidden xs:block">by Cridaa</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/my-bookings"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">My Bookings</span>
              </Link>

              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg">
                <User className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-secondary px-3 sm:px-6 py-2 sm:py-3 text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary px-3 sm:px-6 py-2 sm:py-3 text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
