import mongoose from 'mongoose';
import Listening from '../models/Listening.js';

async function seedListening() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jlpt-master');
    console.log('Connected to MongoDB');

    // Sample listening data
    const listeningData = [
      {
        level: 'N5',
        audioUrl: '/audio/sample1.mp3', // Placeholder
        transcript: 'こんにちは。今日はいい天気ですね。',
        questions: [
          { question: 'What does the speaker say?', options: ['Hello, nice weather', 'Goodbye', 'Thank you'], answer: 'Hello, nice weather' }
        ]
      },
      {
        level: 'N4',
        audioUrl: '/audio/sample2.mp3', // Placeholder
        transcript: 'すみません、このバスは駅に行きますか。',
        questions: [
          { question: 'Where does the bus go?', options: ['Station', 'School', 'Home'], answer: 'Station' }
        ]
      }
    ];

    await Listening.insertMany(listeningData, { ordered: false });
    console.log(`Seeded ${listeningData.length} listening entries`);
  } catch (error) {
    console.error('Error seeding listening:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedListening();