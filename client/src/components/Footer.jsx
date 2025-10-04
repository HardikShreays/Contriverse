import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer 
      className="w-full border-t mt-20 transition-all duration-300 relative overflow-hidden"
      style={{
        backgroundColor: isDarkMode ? 'rgba(92, 137, 157, 0.05)' : 'rgba(92, 137, 157, 0.02)',
        borderColor: isDarkMode ? 'rgba(255, 252, 239, 0.1)' : 'rgba(92, 137, 157, 0.1)'
      }}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: isDarkMode 
            ? 'radial-gradient(circle at 50% 0%, rgba(255, 252, 239, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 50% 0%, rgba(92, 137, 157, 0.05) 0%, transparent 50%)'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div 
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: isDarkMode ? 'rgba(255, 252, 239, 0.08)' : 'rgba(92, 137, 157, 0.08)',
              borderColor: isDarkMode ? 'rgba(255, 252, 239, 0.2)' : 'rgba(92, 137, 157, 0.2)',
              boxShadow: isDarkMode 
                ? '0 4px 20px rgba(255, 252, 239, 0.1)' 
                : '0 4px 20px rgba(92, 137, 157, 0.1)'
            }}
          >
            <span 
              className="text-lg font-medium"
              style={{ 
                color: isDarkMode ? 'rgba(255, 252, 239, 0.9)' : 'rgba(92, 137, 157, 0.9)' 
              }}
            >
              Made with
            </span>
            <span className="text-xl animate-pulse">❤️</span>
            <span 
              className="text-lg font-medium"
              style={{ 
                color: isDarkMode ? 'rgba(255, 252, 239, 0.9)' : 'rgba(92, 137, 157, 0.9)' 
              }}
            >
              for the open-source community
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
