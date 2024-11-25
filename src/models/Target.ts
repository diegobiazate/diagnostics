import mongoose, { Schema, Document } from 'mongoose';

export interface ITarget extends Document {
  type: 'url' | 'ip';
  value: string;
  periodicity: number; // Intervalo em minutos
}

const TargetSchema: Schema = new Schema({
  type: { type: String, required: true, enum: ['url', 'ip'] },
  value: { type: String, required: true },
  periodicity: { type: Number, required: true },
});

export const Target = mongoose.model<ITarget>('Target', TargetSchema);
