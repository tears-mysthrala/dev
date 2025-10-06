'use client';

import { useState, useEffect, useCallback } from 'react';
import { VocabCardSkeleton } from '@/components/skeletons';
import { LoadingSpinner } from '@/components/loading';

interface VocabItem {
  _id: string;
  level: string;
  word: string;
  romaji: string;
  meaning: string;
  examples: string[];
}

export const dynamic = 'force-dynamic';

export default function VocabPage() {
  const [vocab, setVocab] = useState<VocabItem[]>([]);
  const [level, setLevel] = useState('N5');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVocab = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vocab?level=${level}&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary');
      }
      const data = await response.json();
      setVocab(data.vocab);
    } catch (error) {
      console.error('Error fetching vocab:', error);
      setError('Failed to load vocabulary. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    fetchVocab();
  }, [fetchVocab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vocabulary</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Learn essential JLPT vocabulary words</p>
        </header>

        <div className="mb-6 flex justify-center">
          <label htmlFor="vocab-level-select" className="mr-2 self-center text-gray-700 dark:text-gray-300 font-medium">
            JLPT Level:
          </label>
          <select
            id="vocab-level-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Select JLPT level to filter vocabulary"
          >
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">N2</option>
            <option value="N1">N1</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading vocabulary">
            {Array.from({ length: 6 }).map((_, index) => (
              <VocabCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12" role="alert" aria-live="assertive">
            <div className="text-red-600 dark:text-red-400 mb-4" aria-hidden="true">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Vocabulary</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={fetchVocab}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium"
              aria-label="Retry loading vocabulary"
            >
              <LoadingSpinner size="sm" className="mr-2" />
              Try Again
            </button>
          </div>
        ) : vocab.length === 0 ? (
          <div className="text-center py-12" role="status" aria-live="polite">
            <div className="text-gray-400 dark:text-gray-500 mb-4" aria-hidden="true">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Vocabulary Found</h3>
            <p className="text-gray-600 dark:text-gray-300">No vocabulary items found for this level.</p>
          </div>
        ) : (
          <main aria-label="Vocabulary list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vocab.map((item) => (
                <article
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border dark:border-gray-700 hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500"
                  aria-labelledby={`vocab-word-${item._id}`}
                >
                  <div className="mb-4">
                    <h2
                      id={`vocab-word-${item._id}`}
                      className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1"
                      lang="ja"
                    >
                      {item.word}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm italic" aria-label={`Romanization: ${item.romaji}`}>
                      {item.romaji}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-800 dark:text-gray-200 font-medium" aria-label={`Meaning: ${item.meaning}`}>
                      {item.meaning}
                    </p>
                  </div>
                  {item.examples.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Examples:</h3>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1" role="list">
                        {item.examples.slice(0, 2).map((example, index) => (
                          <li key={index} className="leading-relaxed" lang="ja">
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}