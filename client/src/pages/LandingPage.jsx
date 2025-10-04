import React from 'react';
import { Users, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { handleSelectUserType } = useAuth();
  const { isDarkMode } = useTheme();

  const handleSelectUserTypeAndNavigate = (type) => {
    handleSelectUserType(type);
    navigate(`/login/${type}`);
  };

  // CSS Variables for consistent color scheme
  const colors = {
    primary: isDarkMode ? '#ffffff' : '#000000',
    secondary: isDarkMode ? '#000000' : '#ffffff',
    background: isDarkMode ? '#000000' : '#ffffff',
    surface: isDarkMode ? '#111111' : '#f8f9fa',
    border: isDarkMode ? '#333333' : '#e5e7eb',
    text: isDarkMode ? '#ffffff' : '#000000',
    textSecondary: isDarkMode ? '#cccccc' : '#666666',
    accent: isDarkMode ? '#666666' : '#999999'
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Brand Logo/Icon */}
          <div className="mb-12 animate-scaleIn">
            <div 
              className="w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center border-2 backdrop-blur-sm relative group cursor-pointer"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                boxShadow: isDarkMode 
                  ? '0 20px 40px rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-glow"
                style={{ 
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              />
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: colors.primary }}
              >
                <Star className="w-10 h-10 animate-bounce-gentle" style={{ color: colors.secondary }} />
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <h1 
            className="text-8xl md:text-9xl font-bold mb-8 tracking-tight animate-fadeInUp"
            style={{ 
              color: colors.primary,
              backgroundImage: isDarkMode 
                ? 'linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%)'
                : 'linear-gradient(135deg, #000000 0%, #667eea 50%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Contriverse
          </h1>

          {/* Tagline */}
          <p 
            className="text-2xl md:text-3xl font-light max-w-3xl mx-auto leading-relaxed animate-slideInFromLeft"
            style={{ color: colors.textSecondary }}
          >
            Transform your open-source contributions into measurable achievements
          </p>

          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed mt-6 animate-slideInFromRight"
            style={{ color: colors.textSecondary }}
          >
            Join thousands of developers building the future of open-source collaboration
          </p>
        </div>
      </section>

      {/* Login Options Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ 
                color: colors.primary,
                backgroundImage: isDarkMode 
                  ? 'linear-gradient(135deg, #ffffff 0%, #667eea 100%)'
                  : 'linear-gradient(135deg, #000000 0%, #667eea 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Choose Your Path
            </h2>
            <p 
              className="text-xl max-w-2xl mx-auto"
              style={{ color: colors.textSecondary }}
            >
              Select your role to get started with your contribution journey
            </p>
          </div>

          {/* Login Options Grid */}
          <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
            
            {/* Contributor Option */}
            <div 
              onClick={() => handleSelectUserTypeAndNavigate('contributor')}
              className="group cursor-pointer transition-all duration-500 hover:scale-105 animate-slideInFromLeft"
            >
              <div 
                className="p-12 rounded-3xl border transition-all duration-500 relative overflow-hidden backdrop-blur-sm"
                style={{ 
                  backgroundColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  borderColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(0, 0, 0, 0.1)',
                  boxShadow: isDarkMode 
                    ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                    : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                  }}
                />
                
                {/* Icon */}
                <div className="mb-8 relative z-10">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <Users className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 
                  className="text-3xl font-bold mb-6 text-center relative z-10"
                  style={{ color: colors.primary }}
                >
                  Individual Contributor
                </h3>

                {/* Description */}
                <p 
                  className="text-lg leading-relaxed mb-8 text-center relative z-10"
                  style={{ color: colors.textSecondary }}
                >
                  Track your personal contributions, build your developer profile, and earn recognition for your open-source work.
                </p>

                {/* Features */}
                <div className="space-y-4 mb-8 relative z-10">
                  <div 
                    className="flex items-center py-3 px-4 rounded-xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.6)',
                      borderColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    />
                    <span style={{ color: colors.text }}>Personal contribution tracking</span>
                  </div>
                  <div 
                    className="flex items-center py-3 px-4 rounded-xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.6)',
                      borderColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    />
                    <span style={{ color: colors.text }}>Achievement badges & levels</span>
                  </div>
                  <div 
                    className="flex items-center py-3 px-4 rounded-xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.6)',
                      borderColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    />
                    <span style={{ color: colors.text }}>Developer profile building</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 group-hover:shadow-2xl flex items-center justify-center relative z-10 overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12 group-hover:translate-x-full" />
                  <span>Start Contributing</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Maintainer Option */}
            <div 
              onClick={() => handleSelectUserTypeAndNavigate('maintainer')}
              className="group cursor-pointer transition-all duration-500 hover:scale-105 animate-slideInFromRight"
            >
              <div 
                className="p-12 rounded-3xl border transition-all duration-500 relative overflow-hidden backdrop-blur-sm"
                style={{ 
                  backgroundColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  borderColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(0, 0, 0, 0.1)',
                  boxShadow: isDarkMode 
                    ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                    : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)'
                  }}
                />
                
                {/* Icon */}
                <div className="mb-8 relative z-10">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300"
                    style={{ 
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)'
                    }}
                  >
                    <Star className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 
                  className="text-3xl font-bold mb-6 text-center relative z-10"
                  style={{ color: colors.primary }}
                >
                  Project Maintainer
                </h3>

                {/* Description */}
                <p 
                  className="text-lg leading-relaxed mb-8 text-center relative z-10"
                  style={{ color: colors.textSecondary }}
                >
                  Manage your projects, track team contributions, and celebrate milestones with your community.
                </p>

                {/* Features */}
                <div className="space-y-4 mb-8 relative z-10">
                  <div 
                    className="flex items-center py-3 px-4 rounded-xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.6)',
                      borderColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ 
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                      }}
                    />
                    <span style={{ color: colors.text }}>Project dashboard & analytics</span>
                  </div>
                  <div 
                    className="flex items-center py-3 px-4 rounded-xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.6)',
                      borderColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ 
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                      }}
                    />
                    <span style={{ color: colors.text }}>Team contribution tracking</span>
                  </div>
                  <div 
                    className="flex items-center py-3 px-4 rounded-xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(255, 255, 255, 0.6)',
                      borderColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ 
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                      }}
                    />
                    <span style={{ color: colors.text }}>Community milestone celebrations</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 group-hover:shadow-2xl flex items-center justify-center relative z-10 overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12 group-hover:translate-x-full" />
                  <span>Manage Projects</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;