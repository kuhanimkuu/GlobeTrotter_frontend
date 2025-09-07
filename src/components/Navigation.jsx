import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import RoleBasedContent from "./RoleBasedContent";

const Navigation = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  const displayName = user?.first_name || user?.username;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              GlobeTrotter
            </Link>

            <div className="flex space-x-6">
              <Link to="/tour-packages" className="text-gray-700 hover:text-blue-600">
                Tour Packages
              </Link>
              <Link to="/destinations" className="text-gray-700 hover:text-blue-600">
                Destinations
              </Link>
              <Link to="/flights" className="text-gray-700 hover:text-blue-600">
                Flights
              </Link>
              <Link to="/hotels" className="text-gray-700 hover:text-blue-600">
                Hotels
              </Link>
              <Link to="/cars" className="text-gray-700 hover:text-blue-600">
                Cars
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            {isAuthenticated && (
              <RoleBasedContent forRole="customer">
                <Link to="/bookings" className="text-gray-700 hover:text-blue-600">
                  My Bookings
                </Link>
              </RoleBasedContent>
            )}

            <RoleBasedContent forRole="organizer">
              <Link to="/organizer" className="text-gray-700 hover:text-blue-600">
                Organizer Dashboard
              </Link>
            </RoleBasedContent>
            <RoleBasedContent forRole="admin">
              <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                Admin Dashboard
              </Link>
            </RoleBasedContent>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {displayName}
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                    {user?.role?.toLowerCase() || "customer"}
                  </span>
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
