// src/routes/insight.routes.ts

import { Router } from "express";
import { insightController } from "../controllers/insight.controller";

const router = Router();

router.get("/", insightController.getAll);
router.get("/slug/:slug", insightController.getBySlug);
router.get("/category/:category", insightController.getByCategory);
router.get("/search", insightController.search);

router.post("/", insightController.create);
router.put("/:slug", insightController.update);
router.delete("/:slug", insightController.remove);

export default router;
