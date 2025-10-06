'use client';

import { useState, useEffect } from 'react';

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

export default function KanjiPage() {
  const [kanji, setKanji] = useState<KanjiItem[]>([]);
  const [level, setLevel] = useState('N5');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKanji();
  }, [level]);

  const fetchKanji = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/kanji?level=${level}&limit=20`);
      const data = await response.json();
      setKanji(data.kanji);
    } catch (error) {
      console.error('Error fetching kanji:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Kanji</h1>

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

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kanji.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-4xl font-bold text-red-600 mb-2 text-center">{item.char}</div>
                <div className="text-gray-800 mb-2 text-center">{item.meaning}</div>
                <div className="text-sm text-gray-600">
                  <div>Onyomi: {item.readings.onyomi.join(', ') || 'N/A'}</div>
                  <div>Kunyomi: {item.readings.kunyomi.join(', ') || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}