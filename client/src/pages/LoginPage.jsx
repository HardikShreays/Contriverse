import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Github, Trophy, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for OAuth errors
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'no_code':
          setError('GitHub authorization was cancelled. Please try again.');
          break;
        case 'invalid_token':
          setError('Invalid GitHub token. Please try again.');
          break;
        case 'oauth_failed':
          setError('GitHub authentication failed. Please try again.');
          break;
        default:
          setError('An error occurred during authentication. Please try again.');
      }
    }
  }, [searchParams]);

  const handleGitHubLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Redirect to GitHub OAuth
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/github`;
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Trophy className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome to PRAISE
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in with your GitHub account to start your gamified journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                onClick={handleGitHubLogin}
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Github className="h-5 w-5 mr-2" />
                )}
                {loading ? 'Signing in...' : 'Continue with GitHub'}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Secure GitHub OAuth</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">What you'll get access to:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Real-time GitHub contribution tracking</li>
                <li>• Gamified achievement system with badges</li>
                <li>• Personal analytics and insights</li>
                <li>• Leaderboards and community features</li>
                <li>• Automated milestone celebrations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
