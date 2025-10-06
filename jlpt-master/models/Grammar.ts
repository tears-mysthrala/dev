import mongoose, { Document, Schema } from 'mongoose';

export interface IGrammar extends Document {
  level: string;
  rule: string;
  explanation: string;
  examples: string[];
}

const GrammarSchema: Schema = new Schema({
  level: { type: String, required: true, enum: ['N5', 'N4', 'N3', 'N2', 'N1'] },
  rule: { type: String, required: true },
  explanation: { type: String, required: true },
  examples: [{ type: String }],
}, {
  timestamps: true,
});

GrammarSchema.index({ level: 1 });
GrammarSchema.index({ rule: 'text' }); // for search

export default mongoose.models.Grammar || mongoose.model<IGrammar>('Grammar', GrammarSchema);