import mongoose, { Document, Schema } from 'mongoose';

export interface IVocab extends Document {
  level: string;
  word: string;
  romaji: string;
  meaning: string;
  examples: string[];
}

const VocabSchema: Schema = new Schema({
  level: { type: String, required: true, enum: ['N5', 'N4', 'N3', 'N2', 'N1'] },
  word: { type: String, required: true },
  romaji: { type: String, required: true },
  meaning: { type: String, required: true },
  examples: [{ type: String }],
}, {
  timestamps: true,
});

VocabSchema.index({ level: 1, word: 1 });

export default mongoose.models.Vocab || mongoose.model<IVocab>('Vocab', VocabSchema);