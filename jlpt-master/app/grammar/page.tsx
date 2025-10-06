'use client';

import { useState, useEffect } from 'react';

interface GrammarItem {
  _id: string;
  level: string;
  pattern: string;
  meaning: string;
  examples: string[];
}

export default function GrammarPage() {
  const [grammar, setGrammar] = useState<GrammarItem[]>([]);
  const [level, setLevel] = useState('N5');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrammar();
  }, [level]);

  const fetchGrammar = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/grammar?level=${level}&limit=20`);
      const data = await response.json();
      setGrammar(data.grammar);
    } catch (error) {
      console.error('Error fetching grammar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Grammar</h1>

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
            {grammar.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-xl font-bold text-green-600 mb-2">{item.pattern}</div>
                <div className="text-gray-800 mb-4">{item.meaning}</div>
                {item.examples.length > 0 && (
                  <div>
                    <div className="font-semibold mb-1">Examples:</div>
                    <ul className="text-sm text-gray-600">
                      {item.examples.map((example, index) => (
                        <li key={index} className="mb-1">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}