// src/services/insight.service.ts

import { IInsight, Insight } from "../models/insight.model";

class InsightService {
  async getAll() {
    return Insight.find().sort({ createdAt: -1 });
  }

  async getBySlug(slug: string) {
    return Insight.findOne({ slug });
  }

  async getById(id: string) {
    return Insight.findById(id);
  }

  async create(data: Partial<IInsight>) {
    const insight = new Insight(data);
    return insight.save();
  }

  async update(slug: string, data: Partial<IInsight>) {
    return Insight.findOneAndUpdate(
      { slug },
      data,
      { new: true, runValidators: true }
    );
  }

  async remove(slug: string) {
    return Insight.findOneAndDelete({ slug });
  }

  async search(q: string) {
    return Insight.find({
      $or: [
        { title: new RegExp(q, "i") },
        { tags: new RegExp(q, "i") },
        { category: new RegExp(q, "i") }
      ],
    });
  }

  async getByCategory(category: string) {
    return Insight.find({ category }).sort({ publishedDate: -1 });
  }
}

export const insightService = new InsightService();
