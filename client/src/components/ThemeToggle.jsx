import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: isDarkMode ? '#5c899d' : '#fffcef',
        color: isDarkMode ? '#fffcef' : '#5c899d',
        border: `2px solid ${isDarkMode ? '#fffcef' : '#5c899d'}`,
        boxShadow: isDarkMode 
          ? '0 0 0 1px rgba(255, 252, 239, 0.1)' 
          : '0 0 0 1px rgba(92, 137, 157, 0.1)'
      }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 transition-transform duration-200" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-200" />
      )}
    </button>
  );
};

export default ThemeToggle;
