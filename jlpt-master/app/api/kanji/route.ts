import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Kanji from '../../../models/Kanji';

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

    const kanji = await Kanji.find(query)
      .sort({ char: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Kanji.countDocuments(query);

    return NextResponse.json({
      kanji,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching kanji:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}