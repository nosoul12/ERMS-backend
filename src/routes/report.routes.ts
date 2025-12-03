// src/routes/report.routes.ts




console.log("📌 Report Routes Loaded");


import { Router } from "express";
import {
  createReport,
  deleteReport,
  getReportBySlug,
  getReports,
  getReportsByIndustry,
  searchForReports,
  updateReport
} from "../controllers/report.controller";

const router = Router();

router.get("/", getReports);
router.get('/search', searchForReports);
router.get("/industry/:industry", getReportsByIndustry); // Add this route
//changing slug to id for better performance
router.get("/slug/:slug", getReportBySlug);
router.post("/", createReport);
router.put("/:slug", updateReport);
router.delete("/:slug", deleteReport);




export default router;

