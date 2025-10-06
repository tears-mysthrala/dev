import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  mastery: { [key: string]: number }; // e.g., { 'vocabulary': 75, 'kanji': 60 }
  streaks: number;
  badges: string[];
  lastUpdated: Date;
}

const ProgressSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mastery: { type: Map, of: Number, default: {} },
  streaks: { type: Number, default: 0 },
  badges: [{ type: String }],
}, {
  timestamps: true,
});

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);