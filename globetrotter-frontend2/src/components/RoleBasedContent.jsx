import { useAuth } from '../contexts/useAuth';

const RoleBasedContent = ({ forRole, children }) => {
  const { isAdmin, isOrganizer, isCustomer, isAuthenticated } = useAuth();

  const hasAccess = () => {
    switch (forRole) {
      case 'admin':
        return isAdmin;
      case 'organizer':
        return isOrganizer;
      case 'customer':
        return isCustomer;
      case 'authenticated':
        return isAuthenticated;
      default:
        return false;
    }
  };

  return hasAccess() ? <>{children}</> : null;
};

export default RoleBasedContent;
