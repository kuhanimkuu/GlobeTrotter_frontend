import { useAuth } from "../contexts/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin, isOrganizer, isCustomer, loading } = useAuth();

  // Show a loading placeholder while auth state is being resolved
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // If not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based checks
  if (requiredRole) {
    let hasRole = false;

    switch (requiredRole) {
      case "admin":
        hasRole = isAdmin;
        break;
      case "organizer":
        hasRole = isOrganizer;
        break;
      case "customer":
        hasRole = isCustomer;
        break;
      default:
        hasRole = false;
    }

    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and (if required) has correct role → render children
  return children;
};

export default ProtectedRoute;
