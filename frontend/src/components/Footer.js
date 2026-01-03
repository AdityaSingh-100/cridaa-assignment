import React from "react";
import { Heart, Mail, Github, Linkedin, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-black via-gray-950 to-black border-t border-white/20 mt-12 sm:mt-20 overflow-hidden">
      {/* White gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-gradient mb-3 sm:mb-4">
              CourtBook
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              Your premier platform for booking sports courts. Easy, fast, and
              reliable court reservations at your fingertips.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Serving courts nationwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Book a Court
                </a>
              </li>
              <li>
                <a
                  href="/my-bookings"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  My Bookings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <a
                  href="mailto:info@courtbook.com"
                  className="hover:text-primary-400 transition-colors break-all"
                >
                  info@courtbook.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              &copy; {currentYear} CourtBook. All rights reserved.
            </p>

            {/* Made with Love */}
            <div className="flex items-center gap-2 text-xs sm:text-sm order-last sm:order-none">
              <span className="text-gray-400">Made with</span>
              <Heart
                className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-red-500 animate-pulse"
                aria-label="love"
              />
              <span className="text-gray-400">by</span>
              <span className="text-primary-400 font-semibold">
                Aditya Singh
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
