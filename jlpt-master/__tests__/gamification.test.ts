import { calculateStreak, checkNewBadges, getBadgeById, BADGES } from '@/lib/gamification';
import type { GamificationStats } from '@/lib/gamification';

describe('Gamification', () => {
  describe('calculateStreak', () => {
    it('should return 1 for today activity', () => {
      const today = new Date();
      const result = calculateStreak(today, today);
      expect(result).toBe(1);
    });

    it('should return 2 for yesterday activity', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const result = calculateStreak(yesterday, today);
      expect(result).toBe(2);
    });

    it('should return 0 for activity more than 1 day ago', () => {
      const today = new Date();
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(today.getDate() - 2);
      const result = calculateStreak(twoDaysAgo, today);
      expect(result).toBe(0);
    });
  });

  describe('checkNewBadges', () => {
    it('should return new badges that conditions are met', () => {
      const stats: GamificationStats = {
        currentStreak: 0,
        longestStreak: 0,
        totalSessions: 1,
        badges: [],
        vocabProgress: 0,
        kanjiProgress: 0,
        quizScore: 0,
        flashcardsReviewed: 0,
      };

      const newBadges = checkNewBadges(stats.badges, stats);
      expect(newBadges).toContain('first_steps');
    });

    it('should not return badges that are already earned', () => {
      const stats: GamificationStats = {
        currentStreak: 0,
        longestStreak: 0,
        totalSessions: 1,
        badges: ['first_steps'],
        vocabProgress: 0,
        kanjiProgress: 0,
        quizScore: 0,
        flashcardsReviewed: 0,
      };

      const newBadges = checkNewBadges(stats.badges, stats);
      expect(newBadges).not.toContain('first_steps');
    });
  });

  describe('getBadgeById', () => {
    it('should return the correct badge', () => {
      const badge = getBadgeById('first_steps');
      expect(badge).toBeDefined();
      expect(badge?.name).toBe('First Steps');
    });

    it('should return undefined for non-existent badge', () => {
      const badge = getBadgeById('non_existent');
      expect(badge).toBeUndefined();
    });
  });

  describe('BADGES', () => {
    it('should have all required badge properties', () => {
      BADGES.forEach(badge => {
        expect(badge).toHaveProperty('id');
        expect(badge).toHaveProperty('name');
        expect(badge).toHaveProperty('description');
        expect(badge).toHaveProperty('icon');
        expect(badge).toHaveProperty('condition');
        expect(typeof badge.condition).toBe('function');
      });
    });
  });
});