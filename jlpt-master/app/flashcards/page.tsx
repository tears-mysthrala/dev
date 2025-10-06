'use client';

import { useState, useEffect } from 'react';

interface VocabItem {
  _id: string;
  word: string;
  romaji: string;
  meaning: string;
  examples: string[];
}

export default function FlashcardsPage() {
  const [vocab, setVocab] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [level, setLevel] = useState('N5');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVocab();
  }, [level]);

  const fetchVocab = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vocab?level=${level}&limit=50`);
      const data = await response.json();
      setVocab(data.vocab);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error fetching vocab:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading flashcards...</div>
      </div>
    );
  }

  if (vocab.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">No vocabulary found for this level.</div>
      </div>
    );
  }

  const currentCard = vocab[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Flashcards</h1>

        <div className="mb-6 flex justify-center">
          <label htmlFor="level-select" className="mr-2 self-center">JLPT Level:</label>
          <select
            id="level-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="N5">N5</option>
            <option value="N4">N4</option>
            <option value="N3">N3</option>
            <option value="N2">N2</option>
            <option value="N1">N1</option>
          </select>
        </div>

        <div className="flex justify-center mb-8">
          <div className="text-gray-600">
            Card {currentIndex + 1} of {vocab.length}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div
            className="w-full max-w-md h-64 bg-white rounded-lg shadow-lg cursor-pointer flex items-center justify-center text-center p-6 transform transition-transform hover:scale-105"
            onClick={flipCard}
          >
            {!isFlipped ? (
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-4">{currentCard.word}</div>
                <div className="text-gray-600">Click to reveal meaning</div>
              </div>
            ) : (
              <div>
                <div className="text-xl font-semibold text-gray-800 mb-2">{currentCard.meaning}</div>
                <div className="text-sm text-gray-600 mb-2">({currentCard.romaji})</div>
                {currentCard.examples.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <div className="font-medium mb-1">Example:</div>
                    <div>{currentCard.examples[0]}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={flipCard}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isFlipped ? 'Hide' : 'Show'} Answer
          </button>
          <button
            onClick={nextCard}
            disabled={currentIndex === vocab.length - 1}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}