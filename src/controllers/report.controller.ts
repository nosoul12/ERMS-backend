// src/controllers/report.controller.ts
import { Request, Response } from "express";
import {
  createNewReport,
  deleteReportBySlug,
  fetchReportBySlug,
  fetchReports,
  fetchReportsByIndustry,
  updateReportBySlug
} from "../services/report.service";

export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await fetchReports();
    res.json({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getReportsByIndustry = async (req: Request, res: Response) => {
  try {
    const { industry } = req.params;

    const reports = await fetchReportsByIndustry(industry);

    if (reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No reports found for industry: ${industry}`,
      });
    }

    res.json({
      success: true,
      message: "Reports fetched successfully",
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

export const getReportBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const report = await fetchReportBySlug(slug);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.json({
      success: true,
      message: "Report fetched successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const report = await createNewReport(req.body);

    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: report,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create report", error });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const updated = await updateReportBySlug(slug, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.json({
      success: true,
      message: "Report updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update report", error });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const deleted = await deleteReportBySlug(slug);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to delete report", error });
  }
};

// src/controllers/report.controller.ts

import { NextFunction } from 'express';
import Joi from 'joi';
import { searchReports } from "../services/report.service";

// --- Joi Schema for Single Query Validation ---
const searchSchema = Joi.object({
    // Only accept 'q' (the common query) and enforce it's a non-empty string.
    q: Joi.string().trim().min(1).required(),
}); 

export const searchForReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Validation: Only checking for the required 'q' parameter
        const { error, value: validatedQuery } = searchSchema.validate(req.query);

        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: 'A non-empty query parameter "q" is required.', 
                details: error.details.map(d => d.message) 
            });
        }
        
        // 2. Service Call (with the validated { q: string } object)
        const results = await searchReports(validatedQuery);

        // 3. Response
        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No reports found matching the criteria.",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Search completed successfully",
            data: results,
            count: results.length
        });
    } catch (error) {
        next(error); 
    }
};