// src/models/insight.model.ts

import mongoose, { Document, Schema } from "mongoose";

export interface IInsight extends Document {
  insightId: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[]; // paragraphs
  category: string;
  author: string;
  publishedDate: string; // or Date
  readTime: string;
  tags: string[];
  imageUrl?: string;
  relatedInsights: string[];
}

const InsightSchema = new Schema<IInsight>(
  {
    insightId: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },

    title: { type: String, required: true },
    excerpt: { type: String, required: true },

    content: [{ type: String, required: true }],

    category: { type: String, required: true },
    author: { type: String, required: true },

    publishedDate: { type: String, required: true },
    readTime: { type: String, required: true },

    tags: [{ type: String, required: true }],
    imageUrl: { type: String },

    relatedInsights: [{ type: String }],
  },
  { timestamps: true }
);

export const Insight = mongoose.model<IInsight>("Insight", InsightSchema);
export default Insight;
