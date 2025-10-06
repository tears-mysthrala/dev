import mongoose from 'mongoose';
import Listening from '@/models/Listening.js';

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
          {
            question: 'What does the speaker say?',
            options: ['Hello, nice weather', 'Goodbye', 'Thank you'],
            correctAnswer: 0,
            explanation: 'The speaker greets and comments on the weather.'
          }
        ]
      },
      {
        level: 'N4',
        audioUrl: '/audio/sample2.mp3', // Placeholder
        transcript: 'すみません、このバスは駅に行きますか。',
        questions: [
          {
            question: 'Where does the bus go?',
            options: ['Station', 'School', 'Home'],
            correctAnswer: 0,
            explanation: 'The speaker asks if the bus goes to the station.'
          }
        ]
      },
      {
        level: 'N3',
        audioUrl: '/audio/sample3.mp3', // Placeholder
        transcript: '明日の会議は午前10時から始まります。',
        questions: [
          {
            question: 'When does the meeting start?',
            options: ['9 AM', '10 AM', '11 AM'],
            correctAnswer: 1,
            explanation: 'The speaker says the meeting starts at 10 AM tomorrow.'
          }
        ]
      },
      {
        level: 'N2',
        audioUrl: '/audio/sample4.mp3', // Placeholder
        transcript: 'このプロジェクトの締め切りは来週の金曜日です。',
        questions: [
          {
            question: 'When is the deadline?',
            options: ['This Friday', 'Next Friday', 'Next Monday'],
            correctAnswer: 1,
            explanation: 'The speaker mentions the deadline is next Friday.'
          }
        ]
      },
      {
        level: 'N1',
        audioUrl: '/audio/sample5.mp3', // Placeholder
        transcript: '経済状況の悪化により、会社は人員削減を検討している。',
        questions: [
          {
            question: 'What is the company considering?',
            options: ['Expansion', 'Staff reduction', 'New hires'],
            correctAnswer: 1,
            explanation: 'The speaker discusses staff reduction due to economic conditions.'
          }
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