import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Vocab from '@/models/Vocab';
import Kanji from '@/models/Kanji';
import Grammar from '@/models/Grammar';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');

    if (!term || term.length < 2) {
      return NextResponse.json({
        results: [],
        message: 'Search term must be at least 2 characters'
      });
    }

    const searchRegex = new RegExp(term, 'i'); // Case-insensitive regex

    // Search across all collections in parallel
    const [vocabResults, kanjiResults, grammarResults] = await Promise.all([
      // Search vocabulary
      Vocab.find({
        $or: [
          { word: searchRegex },
          { romaji: searchRegex },
          { meaning: searchRegex }
        ]
      })
      .limit(10)
      .select('word romaji meaning level')
      .lean(),

      // Search kanji
      Kanji.find({
        $or: [
          { kanji: searchRegex },
          { meaning: searchRegex },
          { kunyomi: { $in: [searchRegex] } },
          { onyomi: { $in: [searchRegex] } }
        ]
      })
      .limit(10)
      .select('kanji meaning level kunyomi onyomi')
      .lean(),

      // Search grammar
      Grammar.find({
        $or: [
          { pattern: searchRegex },
          { meaning: searchRegex },
          { explanation: searchRegex }
        ]
      })
      .limit(10)
      .select('pattern meaning level explanation')
      .lean()
    ]);

    // Format results with type indicators
    const results = [
      ...vocabResults.map(item => ({
        ...item,
        type: 'vocabulary',
        displayText: `${item.word} (${item.romaji}) - ${item.meaning}`,
        url: `/vocab?level=${item.level}&search=${encodeURIComponent(item.word)}`
      })),
      ...kanjiResults.map(item => ({
        ...item,
        type: 'kanji',
        displayText: `${item.kanji} - ${item.meaning}`,
        url: `/kanji?level=${item.level}&search=${encodeURIComponent(item.kanji)}`
      })),
      ...grammarResults.map(item => ({
        ...item,
        type: 'grammar',
        displayText: `${item.pattern} - ${item.meaning}`,
        url: `/grammar?level=${item.level}&search=${encodeURIComponent(item.pattern)}`
      }))
    ];

    return NextResponse.json({
      results,
      total: results.length,
      term
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}