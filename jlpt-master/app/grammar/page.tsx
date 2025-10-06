'use client';

import { useState, useEffect, useCallback } from 'react';
import { GrammarCardSkeleton } from '@/components/skeletons';

interface GrammarItem {
  _id: string;
  level: string;
  pattern: string;
  meaning: string;
  examples: string[];
}

export const dynamic = 'force-dynamic';

export default function GrammarPage() {
  const [grammar, setGrammar] = useState<GrammarItem[]>([]);
  const [level, setLevel] = useState('N5');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrammar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/grammar?level=${level}&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch grammar');
      }
      const data = await response.json();
      setGrammar(data.grammar);
    } catch (error) {
      console.error('Error fetching grammar:', error);
      setError('Failed to load grammar. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    fetchGrammar();
  }, [fetchGrammar]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grammar</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Understand Japanese grammar patterns</p>
        </header>

        <div className="mb-6 flex justify-center">
          <label htmlFor="grammar-level-select" className="mr-2 self-center text-gray-700 dark:text-gray-300 font-medium">
            JLPT Level:
          </label>
          <select
            id="grammar-level-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Select JLPT level to filter grammar patterns"
          >
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">N2</option>
            <option value="N1">N1</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading grammar patterns">
            {Array.from({ length: 6 }).map((_, index) => (
              <GrammarCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12" role="alert" aria-live="assertive">
            <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
            <button
              onClick={fetchGrammar}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              aria-label="Retry loading grammar patterns"
            >
              Try Again
            </button>
          </div>
        ) : (
          <main aria-label="Grammar patterns list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grammar.map((item) => (
                <article
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500"
                  aria-labelledby={`grammar-pattern-${item._id}`}
                >
                  <div className="mb-3">
                    <h2
                      id={`grammar-pattern-${item._id}`}
                      className="text-xl font-bold text-green-600 dark:text-green-400"
                      lang="ja"
                    >
                      {item.pattern}
                    </h2>
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
                        {item.examples.map((example, index) => (
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