'use client';

import { useState, useEffect, useCallback } from 'react';
import { CardSkeleton } from '@/components/skeletons';

interface VocabItem {
  _id: string;
  word: string;
  romaji: string;
  meaning: string;
  examples: string[];
}

export const dynamic = 'force-dynamic';

export default function FlashcardsPage() {
  const [vocab, setVocab] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [level, setLevel] = useState('N5');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVocab = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vocab?level=${level}&limit=50`);
      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary');
      }
      const data = await response.json();
      setVocab(data.vocab || []);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error fetching vocab:', error);
      setError('Failed to load flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    fetchVocab();
  }, [fetchVocab]);

  const nextCard = () => {
    if (currentIndex < vocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center" role="status" aria-label="Loading flashcards">
          <CardSkeleton />
          <div className="mt-4 text-gray-600 dark:text-gray-400">Loading flashcards...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center" role="alert" aria-live="assertive">
          <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
          <button
            onClick={fetchVocab}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            aria-label="Retry loading flashcards"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (vocab.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
          No vocabulary found for this level.
        </div>
      </div>
    );
  }

  const currentCard = vocab[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Flashcards</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Review with interactive flashcards</p>
        </header>

        <div className="mb-6 flex justify-center">
          <label htmlFor="flashcard-level-select" className="mr-2 self-center text-gray-700 dark:text-gray-300 font-medium">
            JLPT Level:
          </label>
          <select
            id="flashcard-level-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Select JLPT level to filter flashcards"
          >
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">N2</option>
            <option value="N1">N1</option>
          </select>
        </div>

        <div className="flex justify-center mb-8">
          <div className="text-gray-600 dark:text-gray-400" aria-live="polite" aria-atomic="true">
            Card {currentIndex + 1} of {vocab.length}
          </div>
        </div>

        <main className="flex justify-center mb-8" aria-label="Flashcard interface">
          <div
            className="w-full max-w-md h-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer flex items-center justify-center text-center p-6 transform transition-transform hover:scale-105 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500"
            onClick={flipCard}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                flipCard();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`${isFlipped ? 'Show question' : 'Show answer'}. Press Enter or Space to flip card.`}
            aria-describedby="card-content"
          >
            {!isFlipped ? (
              <div id="card-content">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4" lang="ja">
                  {currentCard.word}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Click or press Enter/Space to reveal meaning</div>
              </div>
            ) : (
              <div id="card-content">
                <div className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {currentCard.meaning}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  ({currentCard.romaji})
                </div>
                {(currentCard.examples && Array.isArray(currentCard.examples) && currentCard.examples.length > 0) && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="font-medium mb-1">Example:</div>
                    <div lang="ja">{currentCard.examples[0]}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <nav className="flex justify-center space-x-4" aria-label="Flashcard navigation">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Go to previous card. ${currentIndex === 0 ? 'Disabled: This is the first card' : `Card ${currentIndex} of ${vocab.length}`}`}
          >
            Previous
          </button>
          <button
            onClick={flipCard}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label={`${isFlipped ? 'Show question side of card' : 'Show answer side of card'}`}
          >
            {isFlipped ? 'Hide' : 'Show'} Answer
          </button>
          <button
            onClick={nextCard}
            disabled={currentIndex === vocab.length - 1}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Go to next card. ${currentIndex === vocab.length - 1 ? 'Disabled: This is the last card' : `Card ${currentIndex + 2} of ${vocab.length}`}`}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}