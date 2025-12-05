// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Option A) Basic auth (quick). Use ADMIN_USER and ADMIN_PASS from .env
 * Usage: add as middleware to admin route.
 */
export function basicAdminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Basic ")) return res.status(401).setHeader("WWW-Authenticate", "Basic").json({ success: false, message: "Unauthorized" });

  try {
    const base64 = auth.split(" ")[1];
    const decoded = Buffer.from(base64, "base64").toString("utf8"); // "user:pass"
    const [user, pass] = decoded.split(":");
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;
    if (!adminUser || !adminPass) {
      console.warn("ADMIN_USER/ADMIN_PASS not set in env");
      return res.status(500).json({ success: false, message: "Server not configured for admin auth" });
    }
    if (user === adminUser && pass === adminPass) return next();
    return res.status(403).json({ success: false, message: "Forbidden" });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid authorization header" });
  }
}

/**
 * Option B) JWT admin auth (recommended if app uses JWT)
 * The JWT payload must include role === "admin" or isAdmin === true
 * Usage: add requireAdminJwt as middleware on admin routes.
 */
export function requireAdminJwt(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ success: false, message: "Missing token" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || ""); // will throw if invalid
    // You can be flexible here: accept payload.role === 'admin' or payload.isAdmin === true
    const payloadAny = payload as any;
    if (payloadAny?.role === "admin" || payloadAny?.isAdmin) {
      (req as any).user = payloadAny;
      return next();
    }
    return res.status(403).json({ success: false, message: "Forbidden" });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
