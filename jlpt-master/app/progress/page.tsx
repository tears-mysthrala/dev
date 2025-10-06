'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getBadgeById } from '@/lib/gamification';
import APIErrorBoundary from '@/components/api-error-boundary';
import { ChartSkeleton } from '@/components/skeletons';
import { LoadingSpinner } from '@/components/loading';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const dynamic = 'force-dynamic';

export default function ProgressPage() {
  const [stats, setStats] = useState({
    vocabByLevel: { N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 },
    kanjiByLevel: { N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 },
    totalVocab: 0,
    totalKanji: 0
  });
  const [userProgress, setUserProgress] = useState({
    vocab: 0,
    kanji: 0,
    grammar: 0,
    reading: 0,
    listening: 0,
    flashcards: 0,
    quizzes: 0
  });
  const [gamification, setGamification] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
    badges: [] as string[],
    lastActivityDate: new Date(),
  });
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUserProgress, setLoadingUserProgress] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [userProgressError, setUserProgressError] = useState<string | null>(null);

  const loadUserProgress = useCallback(async () => {
    setLoadingUserProgress(true);
    setUserProgressError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to load user progress');
      }
      const data = await response.json();
      setUserProgress(data.progress);
      setGamification(data.gamification);
    } catch (error) {
      console.error('Error loading user progress:', error);
      setUserProgressError('Failed to load user progress. Please try refreshing the page.');
    } finally {
      setLoadingUserProgress(false);
    }
  }, []);

  const checkLogin = useCallback(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      loadUserProgress();
    }
  }, [loadUserProgress]);

  useEffect(() => {
    fetchStats();
    checkLogin();
  }, [checkLogin]);

  const saveUserProgress = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ progress: userProgress, activityType: 'manual' })
      });
      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress);
        setGamification(data.gamification);
        if (data.newBadges && data.newBadges.length > 0) {
          setNewBadges(data.newBadges);
          // Show badge notification
          setTimeout(() => setNewBadges([]), 5000); // Hide after 5 seconds
        }
        alert('Progress saved successfully!');
      } else {
        alert('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving user progress:', error);
      alert('Error saving progress');
    } finally {
      setSaving(false);
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    setStatsError(null);
    try {
      // Fetch counts for each level
      const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
      const vocabCounts = { N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 };
      const kanjiCounts = { N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 };

      for (const level of levels) {
        const vocabResponse = await fetch(`/api/vocab?level=${level}&limit=1`);
        if (!vocabResponse.ok) {
          throw new Error('Failed to fetch vocabulary stats');
        }
        const vocabData = await vocabResponse.json();
        vocabCounts[level as keyof typeof vocabCounts] = vocabData.pagination.total;

        const kanjiResponse = await fetch(`/api/kanji?level=${level}&limit=1`);
        if (!kanjiResponse.ok) {
          throw new Error('Failed to fetch kanji stats');
        }
        const kanjiData = await kanjiResponse.json();
        kanjiCounts[level as keyof typeof kanjiCounts] = kanjiData.pagination.total;
      }

      const totalVocab = Object.values(vocabCounts).reduce((sum, count) => sum + count, 0);
      const totalKanji = Object.values(kanjiCounts).reduce((sum, count) => sum + count, 0);

      setStats({
        vocabByLevel: vocabCounts,
        kanjiByLevel: kanjiCounts,
        totalVocab,
        totalKanji
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStatsError('Failed to load statistics. Please try again.');
    } finally {
      setLoadingStats(false);
    }
  };

  const vocabChartData = {
    labels: ['N5', 'N4', 'N3', 'N2', 'N1'],
    datasets: [
      {
        label: 'Vocabulary Words',
        data: Object.values(stats.vocabByLevel),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const kanjiChartData = {
    labels: ['N5', 'N4', 'N3', 'N2', 'N1'],
    datasets: [
      {
        label: 'Kanji Characters',
        data: Object.values(stats.kanjiByLevel),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'JLPT Content by Level',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <APIErrorBoundary>
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Learning Progress</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {loadingStats ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : statsError ? (
              <div className="md:col-span-2 text-center py-12">
                <div className="text-red-600 dark:text-red-400 mb-4">{statsError}</div>
                <button
                  onClick={fetchStats}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Vocabulary Progress</h2>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalVocab}</div>
                  <div className="text-gray-600 dark:text-gray-300">Total words available</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Kanji Progress</h2>
                  <div className="text-3xl font-bold text-red-600 mb-2">{stats.totalKanji}</div>
                  <div className="text-gray-600 dark:text-gray-300">Total kanji available</div>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loadingStats ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : statsError ? null : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
                  <Bar data={vocabChartData} options={chartOptions} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
                  <Bar data={kanjiChartData} options={chartOptions} />
                </div>
              </>
            )}
          </div>

          {isLoggedIn && (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Progress</h2>
              {loadingUserProgress ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading progress...</span>
                </div>
              ) : userProgressError ? (
                <div className="text-center py-8">
                  <div className="text-red-600 dark:text-red-400 mb-4">{userProgressError}</div>
                  <button
                    onClick={loadUserProgress}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{userProgress.vocab}%</div>
                      <div className="text-gray-600 dark:text-gray-300">Vocabulary</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">{userProgress.kanji}%</div>
                      <div className="text-gray-600 dark:text-gray-300">Kanji</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{userProgress.grammar}%</div>
                      <div className="text-gray-600 dark:text-gray-300">Grammar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{userProgress.quizzes}%</div>
                      <div className="text-gray-600 dark:text-gray-300">Quizzes</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={saveUserProgress}
                      disabled={saving}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                      {saving ? 'Saving...' : 'Save Progress'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {isLoggedIn && (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Achievements & Streaks</h2>
              
              {loadingUserProgress ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading achievements...</span>
                </div>
              ) : userProgressError ? null : (
                <>
                  {/* Streak Display */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-lg p-4">
                      <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{gamification.currentStreak}</div>
                      <div className="text-sm text-orange-800 dark:text-orange-300">Current Streak</div>
                      <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">days</div>
                    </div>
                    <div className="text-center bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{gamification.longestStreak}</div>
                      <div className="text-sm text-blue-800 dark:text-blue-300">Longest Streak</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">days</div>
                    </div>
                    <div className="text-center bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{gamification.totalSessions}</div>
                      <div className="text-sm text-green-800 dark:text-green-300">Total Sessions</div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">completed</div>
                    </div>
                  </div>

                  {/* Badge Notifications */}
                  {newBadges.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">🏆</span>
                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">New Badges Earned!</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newBadges.map((badgeId) => {
                          const badge = getBadgeById(badgeId);
                          return badge ? (
                            <div key={badgeId} className="flex items-center bg-yellow-100 dark:bg-yellow-800 px-3 py-1 rounded-full">
                              <span className="text-lg mr-1">{badge.icon}</span>
                              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{badge.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Badges Collection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Your Badges</h3>
                    {gamification.badges.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {gamification.badges.map((badgeId) => {
                          const badge = getBadgeById(badgeId);
                          return badge ? (
                            <div key={badgeId} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                              <span className="text-2xl mr-3">{badge.icon}</span>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{badge.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">{badge.description}</div>
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <span className="text-4xl mb-2 block">🎯</span>
                        <p>Complete activities to earn your first badge!</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {!isLoggedIn && (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Personal Progress</h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                <a href="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">Login</a> to track your personal learning progress.
              </p>
            </div>
          )}
        </APIErrorBoundary>
      </div>
    </div>
  );
}