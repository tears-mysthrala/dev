import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Listening from '../../../models/Listening';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    let query: any = {};
    if (level) {
      query.level = level;
    }

    const skip = (page - 1) * limit;

    const listening = await Listening.find(query)
      .sort({ level: -1, audioUrl: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Listening.countDocuments(query);

    return NextResponse.json({
      listening,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching listening:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}