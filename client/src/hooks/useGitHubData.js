import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useGitHubProfile = (username) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentContributions, setRecentContributions] = useState([]);
  const [topRepositories, setTopRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/api/github/profile/${username}`);
        
        if (response.data.success) {
          setProfile(response.data.data.profile);
          setStats(response.data.data.stats);
          setRecentContributions(response.data.data.recentContributions);
          setTopRepositories(response.data.data.topRepositories);
        } else {
          setError('Failed to fetch profile data');
        }
      } catch (err) {
        console.error('Error fetching GitHub profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return {
    profile,
    stats,
    recentContributions,
    topRepositories,
    loading,
    error
  };
};

export const useGitHubActivity = (username) => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/api/github/activity/${username}`);
        
        if (response.data.success) {
          setActivity(response.data.data);
        } else {
          setError('Failed to fetch activity data');
        }
      } catch (err) {
        console.error('Error fetching GitHub activity:', err);
        setError(err.response?.data?.message || 'Failed to fetch activity data');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [username]);

  return {
    activity,
    loading,
    error
  };
};

export const useGitHubRepositories = (username) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/api/github/repos/${username}`);
        
        if (response.data.success) {
          setRepositories(response.data.data);
        } else {
          setError('Failed to fetch repositories');
        }
      } catch (err) {
        console.error('Error fetching repositories:', err);
        setError(err.response?.data?.message || 'Failed to fetch repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [username]);

  return {
    repositories,
    loading,
    error
  };
};
