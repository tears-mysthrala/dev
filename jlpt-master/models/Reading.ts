import mongoose, { Document, Schema } from 'mongoose';

export interface IReading extends Document {
  level: string;
  passage: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

const ReadingSchema: Schema = new Schema({
  level: { type: String, required: true, enum: ['N5', 'N4', 'N3', 'N2', 'N1'] },
  passage: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String },
  }],
}, {
  timestamps: true,
});

ReadingSchema.index({ level: 1 });

export default mongoose.models.Reading || mongoose.model<IReading>('Reading', ReadingSchema);