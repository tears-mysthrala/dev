import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vocab from '@/models/Vocab.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jlpt-master';

async function seedVocab() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fetch from API with pagination
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
    const limit = 100;
    for (const level of levels) {
      console.log(`Fetching ${level} vocab...`);
      let offset = 0;
      let totalFetched = 0;
      while (true) {
        const response = await fetch(`https://jlpt-vocab-api.vercel.app/api/words?level=${level}&offset=${offset}&limit=${limit}`);
        if (!response.ok) {
          console.error(`Failed to fetch ${level} at offset ${offset}: ${response.status}`);
          break;
        }
        const data = await response.json();
        if (data.words.length === 0) break;

        const vocabData = data.words.map((item: any) => ({
          level: `N${item.level}`,
          word: item.word,
          romaji: item.romaji,
          meaning: item.meaning,
          examples: []
        }));

        // Insert, skip duplicates
        for (const vocab of vocabData) {
          const existing = await Vocab.findOne({ word: vocab.word, level });
          if (!existing) {
            await Vocab.create(vocab);
            totalFetched++;
          }
        }

        offset += limit;
        if (data.words.length < limit) break; // Last page
      }
      console.log(`Seeded ${totalFetched} ${level} words`);
    }

    console.log('Vocab seeding completed');
  } catch (error) {
    console.error('Error seeding vocab:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedVocab();