import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer 
      className="w-full border-t mt-12 transition-colors duration-200"
      style={{
        backgroundColor: isDarkMode ? '#5c899d' : 'white',
        borderColor: isDarkMode ? 'rgba(255, 252, 239, 0.2)' : '#e5e7eb'
      }}
    >
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div 
          className="text-center"
          style={{ 
            color: isDarkMode ? 'rgba(255, 252, 239, 0.8)' : '#6b7280' 
          }}
        >
          <p>Made with ❤️ for the open-source community</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
