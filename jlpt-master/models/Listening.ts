import mongoose, { Document, Schema } from 'mongoose';

export interface IListening extends Document {
  level: string;
  audioUrl: string;
  transcript: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

const ListeningSchema: Schema = new Schema({
  level: { type: String, required: true, enum: ['N5', 'N4', 'N3', 'N2', 'N1'] },
  audioUrl: { type: String, required: true },
  transcript: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String },
  }],
}, {
  timestamps: true,
});

ListeningSchema.index({ level: 1 });

export default mongoose.models.Listening || mongoose.model<IListening>('Listening', ListeningSchema);