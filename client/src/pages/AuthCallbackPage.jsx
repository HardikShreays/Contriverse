import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage = () => {
  const [status, setStatus] = useState('Processing authentication...');
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    if (hasProcessed) return; // Prevent double execution in React StrictMode
    
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        console.log('AuthCallbackPage - URL params:', {
          code: code ? 'Present' : 'Missing',
          error: error || 'None'
        });

        if (error) {
          setStatus(`Authentication failed: ${error}`);
          setTimeout(() => {
            navigate('/login?error=oauth_failed');
          }, 2000);
          return;
        }

        if (!code) {
          console.log('AuthCallbackPage - No authorization code received');
          setStatus('No authorization code received');
          setTimeout(() => {
            navigate('/login?error=no_code');
          }, 2000);
          return;
        }

        setHasProcessed(true); // Mark as processed to prevent double execution
        setStatus('Exchanging code for access token...');

        // Send the code to your backend
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/github`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Authentication failed');
        }

        if (data.success) {
          setStatus('Authentication successful! Redirecting...');
          
          // Store tokens and user data
          localStorage.setItem('token', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          
          // Set user in context
          setAuthUser(data.data.user);
          
          // Redirect to dashboard
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          throw new Error(data.message || 'Authentication failed');
        }

      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus(`Authentication failed: ${error.message}`);
        setTimeout(() => {
          navigate('/login?error=oauth_failed');
        }, 2000);
      }
    };

    handleCallback();
  }, [navigate, setAuthUser, hasProcessed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authenticating with GitHub
            </h2>
            <p className="text-sm text-gray-600">
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
