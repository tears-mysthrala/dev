'use client';

import { useState, useEffect } from 'react';

interface VocabItem {
  _id: string;
  word: string;
  romaji: string;
  meaning: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  word: string;
}

export default function QuizzesPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [level, setLevel] = useState('N5');
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quizStarted) {
      generateQuiz();
    }
  }, [level, quizStarted]);

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vocab?level=${level}&limit=20`);
      const data = await response.json();
      const vocab: VocabItem[] = data.vocab;

      // Generate multiple choice questions
      const quizQuestions: Question[] = vocab.slice(0, 10).map((item) => {
        // For each question, show the word, ask for meaning
        // Create 3 wrong options from other vocab
        const otherVocab = vocab.filter(v => v._id !== item._id);
        const wrongOptions = otherVocab
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(v => v.meaning);

        const options = [item.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);

        return {
          question: `What does "${item.word}" (${item.romaji}) mean?`,
          options,
          correctAnswer: item.meaning,
          word: item.word
        };
      });

      setQuestions(quizQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setScore(0);
      setShowResult(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const submitAnswer = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setShowResult(false);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6">Vocabulary Quiz</h1>
          <div className="mb-6">
            <label htmlFor="level-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select JLPT Level:
            </label>
            <select
              id="level-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
              <option value="N2">N2</option>
              <option value="N1">N1</option>
            </select>
          </div>
          <button
            onClick={startQuiz}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 font-medium"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Generating quiz...</div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-6">Quiz Complete!</h1>
          <div className="text-6xl font-bold text-blue-600 mb-4">{percentage}%</div>
          <div className="text-xl mb-6">
            You got {score} out of {questions.length} questions correct
          </div>
          <button
            onClick={restartQuiz}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 font-medium"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-lg font-semibold">
                Score: {score}/{currentQuestionIndex}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left p-4 rounded-md border-2 transition-colors ${
                      selectedAnswer === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={submitAnswer}
                disabled={!selectedAnswer}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}