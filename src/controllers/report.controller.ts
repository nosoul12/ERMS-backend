import { Request, Response } from "express";
import { Report } from "../models/report.model";

export const getReports = async (req: Request, res: Response) => {
  try {
    console.log("Fetching reports from MongoDB...");
    const reports = await Report.find().sort({ createdAt: -1 });
    console.log(`Fetched ${reports.length} reports`);
    res.json({ success: true, message: "Reports fetched successfully", data: reports });
  } catch (error) {
    console.error("Error fetching reports from MongoDB:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getReportBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    console.log(`Fetching report with slug: ${slug}`);
    const report = await Report.findOne({ slug });
    if (!report) {
      console.warn(`Report not found for slug: ${slug}`);
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    res.json({ success: true, message: "Report fetched successfully", data: report });
  } catch (error) {
    console.error("Error fetching report by slug:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    console.log("Creating new report with data:", req.body);
    const report = new Report(req.body);
    await report.save();
    console.log("Report created successfully:", report);
    res.status(201).json({ success: true, message: "Report created successfully", data: report });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(400).json({ success: false, message: "Failed to create report", error });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    console.log(`Updating report with slug: ${slug}, data:`, req.body);
    const updated = await Report.findOneAndUpdate({ slug }, req.body, { new: true });
    if (!updated) {
      console.warn(`Report not found for update, slug: ${slug}`);
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    console.log("Report updated successfully:", updated);
    res.json({ success: true, message: "Report updated successfully", data: updated });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(400).json({ success: false, message: "Failed to update report", error });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    console.log(`Deleting report with slug: ${slug}`);
    const deleted = await Report.findOneAndDelete({ slug });
    if (!deleted) {
      console.warn(`Report not found for deletion, slug: ${slug}`);
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    console.log("Report deleted successfully:", deleted);
    res.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(400).json({ success: false, message: "Failed to delete report", error });
  }
};
