import mongoose from 'mongoose';
import Reading from '../models/Reading.js';

async function seedReading() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jlpt-master');
    console.log('Connected to MongoDB');

    // Sample reading data
    const readingData = [
      {
        level: 'N5',
        title: 'Simple Reading 1',
        text: '私は学生です。東京に住んでいます。毎日学校に行きます。',
        questions: [
          { question: 'What is the person?', options: ['Student', 'Teacher', 'Doctor'], answer: 'Student' },
          { question: 'Where does the person live?', options: ['Tokyo', 'Osaka', 'Kyoto'], answer: 'Tokyo' }
        ]
      },
      {
        level: 'N4',
        title: 'Intermediate Reading 1',
        text: '昨日、友達と映画を見に行きました。面白かったです。次はアクション映画を見たいです。',
        questions: [
          { question: 'What did they do yesterday?', options: ['Watched a movie', 'Ate dinner', 'Played games'], answer: 'Watched a movie' }
        ]
      }
    ];

    await Reading.insertMany(readingData, { ordered: false });
    console.log(`Seeded ${readingData.length} reading entries`);
  } catch (error) {
    console.error('Error seeding reading:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedReading();