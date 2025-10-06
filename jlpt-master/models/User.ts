import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  level: string;
  progress: {
    vocab: number;
    kanji: number;
    grammar: number;
    reading: number;
    listening: number;
    flashcards: number;
    quizzes: number;
  };
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: String, default: 'N5' },
  progress: {
    vocab: { type: Number, default: 0 },
    kanji: { type: Number, default: 0 },
    grammar: { type: Number, default: 0 },
    reading: { type: Number, default: 0 },
    listening: { type: Number, default: 0 },
    flashcards: { type: Number, default: 0 },
    quizzes: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);