import React from 'react';
import { Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  return (
    <header 
      className="w-full shadow-sm border-b transition-colors duration-200"
      style={{
        backgroundColor: isDarkMode ? '#5c899d' : 'white',
        borderColor: isDarkMode ? 'rgba(255, 252, 239, 0.2)' : '#e5e7eb'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Trophy 
              className="h-8 w-8" 
              style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }}
            />
            <h1 
              className="ml-2 text-xl font-bold"
              style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }}
            >
              Contriverse
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }}
                >
                  {user.name || user.username}
                </span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
