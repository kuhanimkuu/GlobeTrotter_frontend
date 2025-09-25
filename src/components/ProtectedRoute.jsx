import { useAuth } from "../contexts/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin, isOrganizer, isCustomer, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

 
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

  return children;
};

export default ProtectedRoute;
