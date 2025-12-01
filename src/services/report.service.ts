// src/services/report.service.ts
import { Report } from "../models/report.model";

export const fetchReports = async () => {
  return await Report.find().sort({ createdAt: -1 });
};

export const fetchReportBySlug = async (slug: string) => {
  return await Report.findOne({ slug });
};

export const createNewReport = async (data: any) => {
  const report = new Report(data);
  return await report.save();
};

export const updateReportBySlug = async (slug: string, data: any) => {
  return await Report.findOneAndUpdate({ slug }, data, { new: true });
};

export const deleteReportBySlug = async (slug: string) => {
  return await Report.findOneAndDelete({ slug });
};

export const fetchReportsByIndustry = async (industry: string) => {
  return await Report.find({ industry }).sort({ createdAt: -1 });
};

// New search service

// src/services/report.service.ts

export const searchReports = async (query: any) => {
  // 1. Check for the common query parameter 'q'
  const commonQuery = query.q; 
  
  if (!commonQuery || typeof commonQuery !== 'string' || commonQuery.trim().length === 0) {
    // If 'q' is missing or empty, return no results.
    return []; 
  }

  // 2. Define the $regex pattern for substring search
  // We use the commonQuery value, and 'i' for case-insensitive.
  const regex = { $regex: commonQuery, $options: "i" };

  // 3. Construct the MongoDB $or filter
  // The query will match documents where the commonQuery is found in 
  // EITHER title OR industry OR publisher.
  const filter = {
    $or: [
      { title: regex },
      { industry: regex },
      { publisher: regex },
    ],
  };

  // 4. Execute the query and sort by creation date
  return await Report.find(filter).sort({ createdAt: -1 });
};