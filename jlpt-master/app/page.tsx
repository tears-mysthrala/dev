import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            JLPT Master
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master Japanese Language Proficiency Test with comprehensive learning modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link href="/vocab" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Vocabulary</h2>
            <p className="text-gray-600">Learn essential JLPT vocabulary words</p>
          </Link>

          <Link href="/kanji" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Kanji</h2>
            <p className="text-gray-600">Master Japanese characters and their meanings</p>
          </Link>

          <Link href="/grammar" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Grammar</h2>
            <p className="text-gray-600">Understand Japanese grammar patterns</p>
          </Link>

          <Link href="/reading" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reading</h2>
            <p className="text-gray-600">Practice reading comprehension</p>
          </Link>

          <Link href="/listening" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Listening</h2>
            <p className="text-gray-600">Improve listening skills with audio exercises</p>
          </Link>

          <Link href="/flashcards" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Flashcards</h2>
            <p className="text-gray-600">Review with interactive flashcards</p>
          </Link>

          <Link href="/quizzes" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Quizzes</h2>
            <p className="text-gray-600">Test your knowledge with quizzes</p>
          </Link>

          <Link href="/progress" className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Progress</h2>
            <p className="text-gray-600">Track your learning progress</p>
          </Link>
        </div>
      </div>
    </div>
  );
}