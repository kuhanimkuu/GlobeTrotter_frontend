import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { api } from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
 
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        try {
   
          const userData = await api.auth.getProfile();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('accessToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await api.auth.login(credentials);
      
      if (data.access) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setToken(data.access);
        
       
        const userData = await api.auth.getProfile();
        setUser(userData);
        
        return { success: true };
      }
      
      throw new Error('Invalid login response');
      
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

    const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
            }

        const data = await api.auth.refresh(refreshToken);
    
        if (data.access) {
            localStorage.setItem('accessToken', data.access);
            setToken(data.access);
        return true;
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    return false;
  }
};


  const value = {
  user,
  token,
  loading,
  login,
  logout,
  refreshToken,
  isAuthenticated: !!token,
  isAdmin: user?.is_staff || user?.role?.toLowerCase() === 'admin',
  isOrganizer: user?.role?.toLowerCase() === 'agent', 
  isCustomer: !user?.is_staff && (!user?.role || user?.role?.toLowerCase() === 'customer'),
};
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};