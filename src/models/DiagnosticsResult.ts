import mongoose, { Schema, Document } from 'mongoose';

export interface DiagnosticResult extends Document {
  type: 'ping' | 'traceroute' | 'nslookup' | 'http-check';
  target: string; // Altere para string
  result: any;
  createdAt: Date;
}

const DiagnosticResultSchema = new Schema<DiagnosticResult>(
  {
    type: { type: String, required: true },
    target: { type: String, required: true }, // Corrija para String
    result: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<DiagnosticResult>('DiagnosticResult', DiagnosticResultSchema);
