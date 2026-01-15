import { Schema, model } from 'mongoose';
import { memoryTypes } from '../modules/memory/memory.types';

const MemorySchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, required: true, enum: memoryTypes },
    text: { type: String, required: true },
    summary: { type: String, required: true },
    tags: { type: [String], default: [] },
    importance: { type: Number, default: 0.5 },

    embedding: { type: [Number], required: true },

    accessCount: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

MemorySchema.index({ userId: 1, createdAt: -1 });

export const MemoryModel = model('Memory', MemorySchema);
