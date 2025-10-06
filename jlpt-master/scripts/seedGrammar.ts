import mongoose from 'mongoose';
import Grammar from '@/models/Grammar.js';

async function seedGrammar() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jlpt-master');
    console.log('Connected to MongoDB');

    // Sample grammar data - in a real app, this would come from an API
    const grammarData = [
      {
        level: 'N5',
        pattern: '～は～です',
        meaning: 'is/am/are',
        examples: ['私は学生です。', 'これはペンです。']
      },
      {
        level: 'N5',
        pattern: '～か～',
        meaning: 'or',
        examples: ['コーヒーか紅茶かどちらがいいですか。']
      },
      {
        level: 'N4',
        pattern: '～たら',
        meaning: 'if/when',
        examples: ['時間がなかったら、行きません。']
      },
      {
        level: 'N3',
        pattern: '～ば～ほど',
        meaning: 'the more... the more',
        examples: ['勉強すればするほど、面白くなります。']
      },
      {
        level: 'N2',
        pattern: '～につけ',
        meaning: 'every time/without fail',
        examples: ['彼の顔を見るにつけ、昔のことを思い出します。']
      },
      {
        level: 'N1',
        pattern: '～んばかり',
        meaning: 'as if/about to',
        examples: ['泣き出さんばかりの顔をしていた。']
      }
    ];

    await Grammar.insertMany(grammarData, { ordered: false });
    console.log(`Seeded ${grammarData.length} grammar entries`);
  } catch (error) {
    console.error('Error seeding grammar:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedGrammar();