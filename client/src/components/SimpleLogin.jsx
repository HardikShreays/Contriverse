import React, { useState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const SimpleLogin = ({ onLoginSuccess, onLoginError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate login with mock data
      const mockUser = {
        id: Date.now().toString(),
        username: 'demo-user',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: 'https://github.com/github.png',
        githubUrl: 'https://github.com/demo-user'
      };

      const mockToken = 'demo-jwt-token-' + Date.now();

      // Store in localStorage
      localStorage.setItem('accessToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      onLoginSuccess && onLoginSuccess({ user: mockUser, accessToken: mockToken });

    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message);
      onLoginError && onLoginError(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div 
            className="w-16 h-16 rounded-full border-4 border-transparent animate-spin"
            style={{ 
              borderTopColor: isDarkMode ? '#667eea' : '#667eea',
              borderRightColor: isDarkMode ? '#764ba2' : '#764ba2'
            }}
          />
          <div 
            className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent animate-spin"
            style={{ 
              borderBottomColor: isDarkMode ? '#f093fb' : '#f093fb',
              borderLeftColor: isDarkMode ? '#f5576c' : '#f5576c',
              animationDirection: 'reverse',
              animationDuration: '1.5s'
            }}
          />
        </div>
        <p 
          className="mt-4 text-sm font-medium animate-pulse-soft"
          style={{ color: isDarkMode ? '#cccccc' : '#666666' }}
        >
          Logging in...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div 
          className="mb-6 p-4 rounded-2xl border backdrop-blur-sm animate-slideInFromLeft"
          style={{ 
            backgroundColor: isDarkMode 
              ? 'rgba(239, 68, 68, 0.1)' 
              : 'rgba(254, 226, 226, 0.8)',
            borderColor: isDarkMode 
              ? 'rgba(239, 68, 68, 0.3)' 
              : 'rgba(239, 68, 68, 0.2)',
            color: isDarkMode ? '#fca5a5' : '#dc2626'
          }}
        >
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
      
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="group w-full flex items-center justify-center px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12 group-hover:translate-x-full" />
        
        <div className="relative z-10 flex items-center">
          <Github className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
          <span>Login with GitHub (Demo)</span>
        </div>
      </button>

      {/* Additional info */}
      <p 
        className="mt-4 text-xs text-center leading-relaxed"
        style={{ color: isDarkMode ? '#999999' : '#666666' }}
      >
        This is a demo login. In production, this would authenticate with GitHub OAuth.
      </p>
    </div>
  );
};

export default SimpleLogin;

