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

  useEffect(() => {
    fetchStats();
  }, []);

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

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Study Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-gray-600">Words Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-gray-600">Words Learning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-gray-600">Quiz Scores</div>
            </div>
          </div>
          <p className="text-gray-500 text-center mt-4">
            User progress tracking will be implemented with authentication
          </p>
        </div>
      </div>
    </div>
  );
}