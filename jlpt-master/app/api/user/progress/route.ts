import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { calculateStreak, checkNewBadges, GamificationStats } from '@/lib/gamification';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      progress: user.progress,
      gamification: user.gamification
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { progress, activityType } = await request.json();

    // Get current user data
    const currentUser = await User.findById(decoded._id);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate new gamification stats
    const now = new Date();
    const currentStreak = calculateStreak(currentUser.gamification.lastActivityDate, now);
    const newStreak = currentStreak > 0 ? Math.max(currentStreak, currentUser.gamification.currentStreak) : 0;
    const longestStreak = Math.max(newStreak, currentUser.gamification.longestStreak);
    const totalSessions = currentUser.gamification.totalSessions + 1;

    // Create stats for badge checking
    const stats: GamificationStats = {
      currentStreak: newStreak,
      longestStreak,
      totalSessions,
      badges: currentUser.gamification.badges,
      vocabProgress: progress.vocab || currentUser.progress.vocab,
      kanjiProgress: progress.kanji || currentUser.progress.kanji,
      quizScore: progress.quizScore || 0,
      flashcardsReviewed: currentUser.gamification.flashcardsReviewed || 0,
    };

    // Check for new badges
    const newBadges = checkNewBadges(currentUser.gamification.badges, stats);
    const allBadges = [...currentUser.gamification.badges, ...newBadges];

    // Update user with progress and gamification
    const updateData = {
      progress: { ...currentUser.progress, ...progress },
      gamification: {
        currentStreak: newStreak,
        longestStreak,
        totalSessions,
        badges: allBadges,
        lastActivityDate: now,
        flashcardsReviewed: activityType === 'flashcard' ?
          (currentUser.gamification.flashcardsReviewed || 0) + 1 :
          currentUser.gamification.flashcardsReviewed || 0,
      },
    };

    const user = await User.findByIdAndUpdate(
      decoded._id,
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      progress: user.progress,
      gamification: user.gamification,
      newBadges
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}