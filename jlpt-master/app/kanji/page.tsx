'use client';

import { useState, useEffect, useCallback } from 'react';
import { KanjiCardSkeleton } from '@/components/skeletons';

interface KanjiItem {
  _id: string;
  char: string;
  readings: {
    onyomi: string[];
    kunyomi: string[];
  };
  strokes: string[];
  meaning: string;
  level: string;
  compounds: string[];
}

export const dynamic = 'force-dynamic';

export default function KanjiPage() {
  const [kanji, setKanji] = useState<KanjiItem[]>([]);
  const [level, setLevel] = useState('N5');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKanji = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/kanji?level=${level}&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch kanji');
      }
      const data = await response.json();
      setKanji(data.kanji || []);
    } catch (error) {
      console.error('Error fetching kanji:', error);
      setError('Failed to load kanji. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    fetchKanji();
  }, [fetchKanji]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kanji</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Master Japanese characters and their meanings</p>
        </header>

        <div className="mb-6 flex justify-center">
          <label htmlFor="kanji-level-select" className="mr-2 self-center text-gray-700 dark:text-gray-300 font-medium">
            JLPT Level:
          </label>
          <select
            id="kanji-level-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Select JLPT level to filter kanji"
          >
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">N2</option>
            <option value="N1">N1</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading kanji">
            {Array.from({ length: 6 }).map((_, index) => (
              <KanjiCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12" role="alert" aria-live="assertive">
            <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
            <button
              onClick={fetchKanji}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              aria-label="Retry loading kanji"
            >
              Try Again
            </button>
          </div>
        ) : (
          <main aria-label="Kanji list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kanji.map((item) => (
                <article
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500"
                  aria-labelledby={`kanji-char-${item._id}`}
                >
                  <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2 text-center" id={`kanji-char-${item._id}`} lang="ja" role="img" aria-label={`Kanji character: ${item.char}`}>
                    {item.char}
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 mb-2 text-center font-medium" aria-label={`Meaning: ${item.meaning}`}>
                    {item.meaning}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="mb-1">
                      <span className="font-medium">Onyomi:</span>{' '}
                      <span lang="ja" aria-label={`Onyomi readings: ${item.readings.onyomi.join(', ') || 'None available'}`}>
                        {item.readings.onyomi.join(', ') || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Kunyomi:</span>{' '}
                      <span lang="ja" aria-label={`Kunyomi readings: ${item.readings.kunyomi.join(', ') || 'None available'}`}>
                        {item.readings.kunyomi.join(', ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}