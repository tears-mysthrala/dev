import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { SearchBar } from '@/components/search-bar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 shadow-sm" role="banner">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">JLPT Master</h1>
          <nav aria-label="Main navigation" className="flex items-center space-x-4">
            <SearchBar />
            <ThemeToggle />
            <Link
              href="/login"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Go to login page"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Go to registration page"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-16" role="main">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            JLPT Master
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master Japanese Language Proficiency Test with comprehensive learning modules
          </p>
        </div>

        <nav aria-label="Learning modules" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link
            href="/vocab"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Vocabulary learning module - Learn essential JLPT vocabulary words"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Vocabulary</h2>
            <p className="text-gray-600 dark:text-gray-300">Learn essential JLPT vocabulary words</p>
          </Link>

          <Link
            href="/kanji"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Kanji learning module - Master Japanese characters and their meanings"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Kanji</h2>
            <p className="text-gray-600 dark:text-gray-300">Master Japanese characters and their meanings</p>
          </Link>

          <Link
            href="/grammar"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Grammar learning module - Understand Japanese grammar patterns"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Grammar</h2>
            <p className="text-gray-600 dark:text-gray-300">Understand Japanese grammar patterns</p>
          </Link>

          <Link
            href="/reading"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Reading learning module - Practice reading comprehension"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Reading</h2>
            <p className="text-gray-600 dark:text-gray-300">Practice reading comprehension</p>
          </Link>

          <Link
            href="/listening"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Listening learning module - Improve listening skills with audio exercises"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Listening</h2>
            <p className="text-gray-600 dark:text-gray-300">Improve listening skills with audio exercises</p>
          </Link>

          <Link
            href="/flashcards"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Flashcards learning module - Review with interactive flashcards"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Flashcards</h2>
            <p className="text-gray-600 dark:text-gray-300">Review with interactive flashcards</p>
          </Link>

          <Link
            href="/quizzes"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Quizzes learning module - Test your knowledge with quizzes"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Quizzes</h2>
            <p className="text-gray-600 dark:text-gray-300">Test your knowledge with quizzes</p>
          </Link>

          <Link
            href="/progress"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Progress tracking module - Track your learning progress"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Progress</h2>
            <p className="text-gray-600 dark:text-gray-300">Track your learning progress</p>
          </Link>
        </nav>
      </main>
    </div>
  );
}