import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useRatingSystem = (username) => {
  const [ratingSummary, setRatingSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-generate ratings from GitHub PRs
  const generateRatings = async () => {
    if (!username) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      // Get GitHub token from user profile (stored during OAuth)
      const profileResponse = await axios.get(
        `${API_BASE_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const githubToken = profileResponse.data?.data?.user?.githubToken;
      
      if (!githubToken) {
        throw new Error('GitHub token not found. Please re-authenticate with GitHub.');
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/api/ratings/auto-generate/${username}`,
        { githubToken },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setRatingSummary(response.data.data.ratingSummary);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to generate ratings');
      }
    } catch (err) {
      console.error('Error generating ratings:', err);
      
      // Handle specific error cases
      if (err.response?.status === 403) {
        setError('GitHub API rate limit exceeded. Please try again in a few minutes.');
      } else if (err.response?.status === 401) {
        setError('GitHub authentication expired. Please log out and log back in.');
      } else {
        setError(err.response?.data?.message || 'Failed to generate ratings');
      }
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // Fetch existing rating summary
  const fetchRatingSummary = async () => {
    if (!username) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/ratings/summary/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setRatingSummary(response.data.data.ratingSummary);
      }
    } catch (err) {
      console.error('Error fetching rating summary:', err);
      // Don't set error for 404 - just means no ratings exist yet
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Failed to fetch rating summary');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch rating summary on mount
  useEffect(() => {
    if (username) {
      fetchRatingSummary();
    }
  }, [username]);

  return {
    ratingSummary,
    loading,
    error,
    isGenerating,
    generateRatings,
    fetchRatingSummary,
    hasRatings: !!ratingSummary && ratingSummary.totalPRs > 0
  };
};

export const useRatingBadges = (ratingSummary) => {
  if (!ratingSummary) return [];

  const badges = [];

  // Rating level badges
  if (ratingSummary.ratingLevel === 'excellent') {
    badges.push({
      id: 'rating-excellent',
      name: 'Excellent Contributor',
      description: 'Consistently excellent PR ratings',
      earned: true,
      color: 'bg-yellow-100 text-yellow-800'
    });
  }

  if (ratingSummary.ratingLevel === 'very-good') {
    badges.push({
      id: 'rating-very-good',
      name: 'High Quality Contributor',
      description: 'Very good PR ratings',
      earned: true,
      color: 'bg-green-100 text-green-800'
    });
  }

  // PR count badges
  if (ratingSummary.totalPRs >= 10) {
    badges.push({
      id: 'rating-prolific',
      name: 'Prolific Contributor',
      description: '10+ rated PRs',
      earned: true,
      color: 'bg-blue-100 text-blue-800'
    });
  }

  if (ratingSummary.totalPRs >= 25) {
    badges.push({
      id: 'rating-expert',
      name: 'Rating Expert',
      description: '25+ rated PRs',
      earned: true,
      color: 'bg-purple-100 text-purple-800'
    });
  }

  // Average score badges
  if (ratingSummary.averageScore >= 90) {
    badges.push({
      id: 'rating-master',
      name: 'Rating Master',
      description: '90+ average rating score',
      earned: true,
      color: 'bg-amber-100 text-amber-800'
    });
  }

  if (ratingSummary.averageScore >= 80) {
    badges.push({
      id: 'rating-high-performer',
      name: 'High Performer',
      description: '80+ average rating score',
      earned: true,
      color: 'bg-emerald-100 text-emerald-800'
    });
  }

  // Trend badges
  if (ratingSummary.recentTrend === 'improving') {
    badges.push({
      id: 'rating-improving',
      name: 'Getting Better',
      description: 'Improving rating trend',
      earned: true,
      color: 'bg-teal-100 text-teal-800'
    });
  }

  return badges;
};
