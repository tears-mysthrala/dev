// Badge definitions and gamification logic
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: GamificationStats) => boolean;
}

export interface GamificationStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  badges: string[];
  vocabProgress: number;
  kanjiProgress: number;
  quizScore: number;
  flashcardsReviewed: number;
}

export const BADGES: Badge[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first learning session',
    icon: '🎯',
    condition: (stats) => stats.totalSessions >= 1,
  },
  {
    id: 'streak_3',
    name: 'Consistency',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day learning streak',
    icon: '👑',
    condition: (stats) => stats.currentStreak >= 30,
  },
  {
    id: 'vocab_master',
    name: 'Vocabulary Master',
    description: 'Achieve 80% vocabulary mastery',
    icon: '📚',
    condition: (stats) => stats.vocabProgress >= 80,
  },
  {
    id: 'kanji_expert',
    name: 'Kanji Expert',
    description: 'Achieve 80% kanji mastery',
    icon: '✍️',
    condition: (stats) => stats.kanjiProgress >= 80,
  },
  {
    id: 'quiz_champion',
    name: 'Quiz Champion',
    description: 'Score 90% or higher on a quiz',
    icon: '🏆',
    condition: (stats) => stats.quizScore >= 90,
  },
  {
    id: 'flashcard_ninja',
    name: 'Flashcard Ninja',
    description: 'Review 100 flashcards',
    icon: '🥷',
    condition: (stats) => stats.flashcardsReviewed >= 100,
  },
  {
    id: 'dedicated_learner',
    name: 'Dedicated Learner',
    description: 'Complete 50 learning sessions',
    icon: '🎓',
    condition: (stats) => stats.totalSessions >= 50,
  },
];

export function calculateStreak(lastActivityDate: Date, currentDate: Date = new Date()): number {
  const diffTime = currentDate.getTime() - lastActivityDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // If last activity was today or yesterday, streak continues
  if (diffDays <= 1) {
    return diffDays + 1; // +1 because diffDays doesn't include today
  }

  // If more than 1 day gap, streak resets
  return 0;
}

export function checkNewBadges(currentBadges: string[], stats: GamificationStats): string[] {
  const newBadges: string[] = [];

  for (const badge of BADGES) {
    if (!currentBadges.includes(badge.id) && badge.condition(stats)) {
      newBadges.push(badge.id);
    }
  }

  return newBadges;
}

export function getBadgeById(badgeId: string): Badge | undefined {
  return BADGES.find(badge => badge.id === badgeId);
}