import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Reading from '../../../models/Reading';

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

    const reading = await Reading.find(query)
      .sort({ level: -1, title: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Reading.countDocuments(query);

    return NextResponse.json({
      reading,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}