import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import RoleBasedContent from "./RoleBasedContent";

const Navigation = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return null;

  const displayName = user?.first_name || user?.username;

  // Updated color scheme to match homepage
  const linkClass = (base = "") =>
    `font-medium transition-colors duration-200 ${
      isScrolled 
        ? "text-gray-700 hover:text-yellow-600" 
        : "text-white hover:text-yellow-300"
    } ${base}`;

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-lg backdrop-blur-sm bg-white/95" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-10">
            <Link
              to="/"
              className={`text-2xl font-bold transition-colors duration-200 ${
                isScrolled ? "text-yellow-600" : "text-white"
              } hover:text-yellow-500`}
            >
              GlobeTrotter
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link to="/tour-packages" className={linkClass("py-2")}>
                Tour Packages
              </Link>
              <Link to="/destinations" className={linkClass("py-2")}>
                Destinations
              </Link>
              <Link to="/flights" className={linkClass("py-2")}>
                Flights
              </Link>
              <Link to="/hotels" className={linkClass("py-2")}>
                Hotels
              </Link>
              <Link to="/cars" className={linkClass("py-2")}>
                Cars
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Role-based links */}
            {isAuthenticated && (
              <RoleBasedContent forRole="customer">
                <Link to="/bookings" className={`hidden lg:block ${linkClass()}`}>
                  My Bookings
                </Link>
              </RoleBasedContent>
            )}

            <RoleBasedContent forRole="organizer">
              <Link to="/organizer" className={`hidden lg:block ${linkClass()}`}>
                Organizer Dashboard
              </Link>
            </RoleBasedContent>

            <RoleBasedContent forRole="admin">
              <Link to="/admin" className={`hidden lg:block ${linkClass()}`}>
                Admin Dashboard
              </Link>
            </RoleBasedContent>

            {/* User Info & Auth */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className={`hidden sm:block text-sm ${
                  isScrolled ? "text-gray-600" : "text-white"
                }`}>
                  Welcome, {displayName}
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full capitalize">
                    {user?.role?.toLowerCase() || "customer"}
                  </span>
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                    isScrolled
                      ? "bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg"
                      : "bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg hover:shadow-xl"
                  }`}
                >
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? "text-gray-700 hover:bg-gray-100" 
                  : "text-white hover:bg-white/20"
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={`md:hidden animate-fadeIn ${
          isScrolled 
            ? "bg-white shadow-lg" 
            : "bg-white/95 backdrop-blur-md"
        }`}>
          <div className="px-4 py-6 space-y-4">
            {/* Main Links */}
            <Link 
              to="/tour-packages" 
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-yellow-600 transition-colors"
            >
              Tour Packages
            </Link>
            <Link 
              to="/destinations" 
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-yellow-600 transition-colors"
            >
              Destinations
            </Link>
            <Link 
              to="/flights" 
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-yellow-600 transition-colors"
            >
              Flights
            </Link>
            <Link 
              to="/hotels" 
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-yellow-600 transition-colors"
            >
              Hotels
            </Link>
            <Link 
              to="/cars" 
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-yellow-600 transition-colors"
            >
              Cars
            </Link>
             <Link 
              to="/contact" 
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-yellow-600 transition-colors"
            >
              Contact Us
            </Link>

           {isAuthenticated && (
              <RoleBasedContent forRole="customer">
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-yellow-600 transition-colors"
                >
                  My Dashboard
                </Link>
              </RoleBasedContent>
            )}


            {/* Role-based Mobile Links */}
            {isAuthenticated && (
              <RoleBasedContent forRole="customer">
                <Link 
                  to="/bookings" 
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-yellow-600 transition-colors"
                >
                  My Bookings
                </Link>
              </RoleBasedContent>
            )}

            <RoleBasedContent forRole="organizer">
              <Link 
                to="/organizer" 
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-yellow-600 transition-colors"
              >
                Organizer Dashboard
              </Link>
            </RoleBasedContent>

            <RoleBasedContent forRole="admin">
              <Link 
                to="/admin" 
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-gray-700 font-medium border-b border-gray-100 hover:text-yellow-600 transition-colors"
              >
                Admin Dashboard
              </Link>
            </RoleBasedContent>

            {/* Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Welcome, {displayName}
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full capitalize">
                      {user?.role?.toLowerCase() || "customer"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full text-left bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setMobileOpen(false)}
                  className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;