import React, { useState } from 'react';
import { Github, Loader2 } from 'lucide-react';

const SimpleLogin = ({ onLoginSuccess, onLoginError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      await new Promise(resolve => setTimeout(resolve, 1000));

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
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Logging in...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Github className="w-5 h-5 mr-2" />
        {isLoading ? 'Logging in...' : 'Login with GitHub (Demo)'}
      </button>
    </div>
  );
};

export default SimpleLogin;

