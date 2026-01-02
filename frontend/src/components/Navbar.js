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
    <nav className="glass-card mx-4 mt-4 p-4 sticky top-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-gradient">
              CourtBook
            </h1>
            <p className="text-xs text-gray-400">by Cridaa</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/my-bookings"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">My Bookings</span>
              </Link>

              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg">
                <User className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium hidden sm:inline">
                  {user?.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
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
