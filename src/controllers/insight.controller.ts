// src/controllers/insight.controller.ts

import { Request, Response } from "express";
import { insightService } from "../services/insight.service";

class InsightController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await insightService.getAll();
      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const data = await insightService.getBySlug(req.params.slug);

      if (!data)
        return res.status(404).json({ success: false, message: "Not found" });

      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const q = req.query.q as string;

      if (!q)
        return res.status(400).json({ success: false, message: "query required" });

      const data = await insightService.search(q);
      res.json({ success: true, count: data.length, data });

    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await insightService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await insightService.update(req.params.slug, req.body);

      if (!data)
        return res.status(404).json({ success: false, message: "Not found" });

      res.json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const data = await insightService.remove(req.params.slug);

      if (!data)
        return res.status(404).json({ success: false, message: "Not found" });

      res.json({ success: true, message: "Deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getByCategory(req: Request, res: Response) {
    try {
      const category = req.params.category;
      const data = await insightService.getByCategory(category);

      res.json({ success: true, count: data.length, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export const insightController = new InsightController();
