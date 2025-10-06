import mongoose, { Document, Schema } from 'mongoose';

export interface IKanji extends Document {
  char: string;
  readings: {
    onyomi: string[];
    kunyomi: string[];
  };
  strokes: string[]; // array of SVG paths or stroke data
  meaning: string;
  level: string;
  compounds: string[];
}

const KanjiSchema: Schema = new Schema({
  char: { type: String, required: true, unique: true },
  readings: {
    onyomi: [{ type: String }],
    kunyomi: [{ type: String }],
  },
  strokes: [{ type: String }],
  meaning: { type: String, required: true },
  level: { type: String, required: true, enum: ['N5', 'N4', 'N3', 'N2', 'N1'] },
  compounds: [{ type: String }],
}, {
  timestamps: true,
});

KanjiSchema.index({ char: 1 });

export default mongoose.models.Kanji || mongoose.model<IKanji>('Kanji', KanjiSchema);