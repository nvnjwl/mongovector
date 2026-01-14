import { Schema, model } from 'mongoose';

const TurnSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

TurnSchema.index({ userId: 1, sessionId: 1, createdAt: -1 });

export const TurnModel = model('Turn', TurnSchema);
