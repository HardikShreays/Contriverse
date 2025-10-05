import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const refreshToken = urlParams.get('refreshToken');
    const userParam = urlParams.get('user');

    if (token && refreshToken && userParam) {
      // Handle OAuth callback
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error parsing OAuth callback:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Check for existing token
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        // Verify token and get user data
        console.log('Verifying token:', existingToken);
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/me`, {
          headers: { Authorization: `Bearer ${existingToken}` }
        })
        .then(response => {
          console.log('Token verification successful:', response.data);
          setUser(response.data.data.user);
        })
        .catch((error) => {
          console.error('Token verification failed:', error.response?.data || error.message);
          // Only clear tokens if it's a 403 (invalid token), not network errors
          if (error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        })
        .finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, []);

  const login = async (githubCode) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/github`, { code: githubCode });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const setAuthUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    login,
    logout,
    setAuthUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
