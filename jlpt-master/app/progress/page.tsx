'use client';

import { useState, useEffect } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStats();
    checkLogin();
  }, []);

  const checkLogin = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      loadUserProgress();
    }
  };

  const loadUserProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

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
        body: JSON.stringify({ progress: userProgress })
      });
      if (response.ok) {
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
    try {
      // Fetch counts for each level
      const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
      const vocabCounts = { N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 };
      const kanjiCounts = { N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 };

      for (const level of levels) {
        const vocabResponse = await fetch(`/api/vocab?level=${level}&limit=1`);
        const vocabData = await vocabResponse.json();
        vocabCounts[level as keyof typeof vocabCounts] = vocabData.pagination.total;

        const kanjiResponse = await fetch(`/api/kanji?level=${level}&limit=1`);
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Learning Progress</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Vocabulary Progress</h2>
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalVocab}</div>
            <div className="text-gray-600">Total words available</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Kanji Progress</h2>
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.totalKanji}</div>
            <div className="text-gray-600">Total kanji available</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Bar data={vocabChartData} options={chartOptions} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Bar data={kanjiChartData} options={chartOptions} />
          </div>
        </div>

        {isLoggedIn && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userProgress.vocab}%</div>
                <div className="text-gray-600">Vocabulary</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{userProgress.kanji}%</div>
                <div className="text-gray-600">Kanji</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userProgress.grammar}%</div>
                <div className="text-gray-600">Grammar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userProgress.quizzes}%</div>
                <div className="text-gray-600">Quizzes</div>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={saveUserProgress}
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Progress'}
              </button>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Progress</h2>
            <p className="text-gray-600 text-center">
              <a href="/login" className="text-indigo-600 hover:text-indigo-500">Login</a> to track your personal learning progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}