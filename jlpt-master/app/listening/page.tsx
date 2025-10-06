'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

interface ListeningItem {
  _id: string;
  level: string;
  audioUrl: string;
  transcript: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export const dynamic = 'force-dynamic';

export default function ListeningPage() {
  const [listening, setListening] = useState<ListeningItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [level, setLevel] = useState('N5');
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  const fetchListening = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/listening?level=${level}&limit=20`);
      const data = await response.json();
      setListening(data.listening);
      setCurrentIndex(0);
      setShowTranscript(false);
      stopAudio(); // Stop any playing audio when changing level
    } catch (error) {
      console.error('Error fetching listening:', error);
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    fetchListening();
  }, [fetchListening]);

  useEffect(() => {
    stopAudio(); // Stop audio when changing exercises
  }, [currentIndex]);

  const playAudio = () => {
    if (soundRef.current) {
      soundRef.current.stop();
    }

    // For demo purposes, we'll use a placeholder. In real app, use actual audio URLs
    // Since we don't have real audio files, we'll simulate playback
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000); // Simulate 3 second audio
  };

  const stopAudio = () => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const sound = soundRef.current;
      if (sound) {
        sound.unload();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading listening exercises...</div>
      </div>
    );
  }

  if (listening.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">No listening exercises found for this level.</div>
      </div>
    );
  }

  const currentItem = listening[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Listening Practice</h1>

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

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-semibold">
                Exercise {currentIndex + 1} of {listening.length}
              </div>
              <div className="text-sm text-gray-600">
                Level: {currentItem.level}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">Listen to the audio:</h2>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-gray-600 mb-2">
                  {isPlaying ? 'Playing...' : 'Audio Player'}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Audio file: {currentItem.audioUrl}
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={playAudio}
                    disabled={isPlaying}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlaying ? 'Playing...' : 'Play Audio'}
                  </button>
                  {isPlaying && (
                    <button
                      onClick={stopAudio}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                {showTranscript ? 'Hide' : 'Show'} Transcript
              </button>
              {showTranscript && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-800">{currentItem.transcript}</p>
                </div>
              )}
            </div>

            {currentItem.questions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Questions:</h3>
                <div className="space-y-4">
                  {currentItem.questions.map((q, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4">
                      <div className="font-medium mb-2">{q.question}</div>
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center">
                            <input
                              type="radio"
                              id={`q${index}-opt${optIndex}`}
                              name={`question-${index}`}
                              className="mr-2"
                            />
                            <label htmlFor={`q${index}-opt${optIndex}`} className="text-gray-700">
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-green-600">
                        Correct answer: {q.options[q.correctAnswer]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentIndex(Math.min(listening.length - 1, currentIndex + 1))}
              disabled={currentIndex === listening.length - 1}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}