import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 backdrop-blur-sm border overflow-hidden"
      style={{
        backgroundColor: isDarkMode ? 'rgba(255, 252, 239, 0.1)' : 'rgba(92, 137, 157, 0.1)',
        borderColor: isDarkMode ? 'rgba(255, 252, 239, 0.3)' : 'rgba(92, 137, 157, 0.3)',
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(255, 252, 239, 0.2), inset 0 1px 0 rgba(255, 252, 239, 0.2)' 
          : '0 8px 32px rgba(92, 137, 157, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Animated background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(255, 252, 239, 0.2) 0%, rgba(255, 252, 239, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(92, 137, 157, 0.2) 0%, rgba(92, 137, 157, 0.1) 100%)'
        }}
      />
      
      {/* Icon with rotation animation */}
      <div className="relative z-10">
        {isDarkMode ? (
          <Sun 
            className="w-6 h-6 transition-all duration-300 group-hover:rotate-180" 
            style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }}
          />
        ) : (
          <Moon 
            className="w-6 h-6 transition-all duration-300 group-hover:rotate-12" 
            style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }}
          />
        )}
      </div>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div 
          className="absolute inset-0 opacity-0 group-active:opacity-30 transition-opacity duration-150"
          style={{
            background: isDarkMode 
              ? 'radial-gradient(circle, rgba(255, 252, 239, 0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(92, 137, 157, 0.4) 0%, transparent 70%)'
          }}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
