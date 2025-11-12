import express from "express";
import {
  createReport,
  deleteReport,
  getReportBySlug,
  getReports,
  updateReport,
} from "../controllers/report.controller";

const router = express.Router();

router.get("/", getReports);
router.get("/:slug", getReportBySlug);
router.post("/", createReport);
router.put("/:slug", updateReport);
router.delete("/:slug", deleteReport);

export default router;
