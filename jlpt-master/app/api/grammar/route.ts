import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Grammar from '@/models/Grammar';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    const query: Record<string, string> = {};
    if (level) {
      query.level = level;
    }

    const skip = (page - 1) * limit;

    const grammar = await Grammar.find(query)
      .sort({ level: -1, pattern: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Grammar.countDocuments(query);

    return NextResponse.json({
      grammar,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching grammar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}