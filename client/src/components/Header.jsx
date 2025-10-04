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
      className="w-full backdrop-blur-md border-b transition-all duration-300 sticky top-0 z-50"
      style={{
        backgroundColor: isDarkMode ? 'rgba(92, 137, 157, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isDarkMode ? 'rgba(255, 252, 239, 0.1)' : 'rgba(92, 137, 157, 0.1)',
        boxShadow: isDarkMode 
          ? '0 1px 3px rgba(255, 252, 239, 0.1), 0 1px 2px rgba(255, 252, 239, 0.06)' 
          : '0 1px 3px rgba(92, 137, 157, 0.1), 0 1px 2px rgba(92, 137, 157, 0.06)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center group cursor-pointer">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm border shadow-lg group-hover:scale-110 transition-all duration-300"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(255, 252, 239, 0.15)' : 'rgba(92, 137, 157, 0.15)',
                borderColor: isDarkMode ? 'rgba(255, 252, 239, 0.3)' : 'rgba(92, 137, 157, 0.3)',
                boxShadow: isDarkMode 
                  ? '0 4px 16px rgba(255, 252, 239, 0.2)' 
                  : '0 4px 16px rgba(92, 137, 157, 0.2)'
              }}
            >
              <Trophy 
                className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" 
                style={{ color: isDarkMode ? '#fffcef' : '#5c899d' }}
              />
            </div>
            <h1 
              className="text-2xl font-bold group-hover:scale-105 transition-transform duration-300"
              style={{ 
                color: isDarkMode ? '#fffcef' : '#5c899d',
                backgroundImage: isDarkMode 
                  ? 'linear-gradient(135deg, #fffcef 0%, rgba(255, 252, 239, 0.8) 100%)'
                  : 'linear-gradient(135deg, #5c899d 0%, rgba(92, 137, 157, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Contriverse
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl border-2 shadow-lg transition-all duration-300 hover:scale-110"
                    style={{
                      borderColor: isDarkMode ? 'rgba(255, 252, 239, 0.3)' : 'rgba(92, 137, 157, 0.3)',
                      boxShadow: isDarkMode 
                        ? '0 4px 16px rgba(255, 252, 239, 0.2)' 
                        : '0 4px 16px rgba(92, 137, 157, 0.2)'
                    }}
                  />
                  <div 
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2"
                    style={{
                      backgroundColor: '#10b981',
                      borderColor: isDarkMode ? '#5c899d' : 'white'
                    }}
                  />
                </div>
                <span 
                  className="text-base font-semibold"
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
