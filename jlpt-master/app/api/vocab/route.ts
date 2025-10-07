import { NextRequest, NextResponse } from 'next/server';
import Vocab from '@/models/Vocab';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const countOnly = searchParams.get('count') === 'true';

    if (!level) {
      return NextResponse.json({ message: 'Level parameter required' }, { status: 400 });
    }

    if (countOnly) {
      const total = await Vocab.countDocuments({ level });
      return NextResponse.json({ total });
    }

    const vocabs = await Vocab.find({ level }).limit(50); // Limit for pagination

    return NextResponse.json(vocabs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}