import mongoose from 'mongoose';
import Kanji from '../models/Kanji.js';

async function seedKanji() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jlpt-master');
    console.log('Connected to MongoDB');

    const response = await fetch('https://raw.githubusercontent.com/AnchorI/jlpt-kanji-dictionary/main/jlpt-kanji.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch kanji data: ${response.statusText}`);
    }
    const kanjiData = await response.json();

    const kanjiDocs = kanjiData.map((item: any) => ({
      char: item.kanji,
      readings: {
        onyomi: [],
        kunyomi: []
      },
      strokes: [], // Will be populated later if stroke data is available
      meaning: item.description.split(' is a Japanese kanji that means ')[1]?.split('.')[0] || item.description,
      level: item.jlpt,
      compounds: []
    }));

    // Insert in batches to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < kanjiDocs.length; i += batchSize) {
      const batch = kanjiDocs.slice(i, i + batchSize);
      await Kanji.insertMany(batch, { ordered: false });
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(kanjiDocs.length / batchSize)}`);
    }

    console.log(`Seeded ${kanjiDocs.length} kanji entries`);
  } catch (error) {
    console.error('Error seeding kanji:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedKanji();