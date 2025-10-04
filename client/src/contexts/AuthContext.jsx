import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    const accessToken = localStorage.getItem('accessToken');

    if (savedUser && accessToken && savedUserType) {
      try {
        setUser(JSON.parse(savedUser));
        setUserType(savedUserType);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const handleSelectUserType = (type) => {
    setUserType(type);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData.user);
    localStorage.setItem('userType', userType);
  };

  const handleLoginError = (error) => {
    console.error('Login error:', error);
  };

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('userType');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    userType,
    loading,
    handleSelectUserType,
    handleLoginSuccess,
    handleLoginError,
    handleLogout,
    isAuthenticated: !!user && !!userType
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
