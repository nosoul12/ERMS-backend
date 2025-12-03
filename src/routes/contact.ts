import express from "express";
import mongoose from "mongoose";
import Contact from "../models/Contact";

const router = express.Router();

// GET contacts (admin)
router.get("/", async (_req, res) => {
  try {
    const docs = await Contact.find().sort({ createdAt: -1 }).limit(50).lean();
    return res.json({ count: docs.length, data: docs });
  } catch (err) {
    console.error("Failed to fetch contacts:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST: create contact message
router.post("/", async (req, res) => {
  const {
    fullName,
    email,
    countryCode,
    phone,
    company,
    industry,
    subject,
    message,
  } = req.body;

  // ----------- Basic validation -----------

  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return res.status(400).json({ error: "Invalid fullName" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!subject || subject.trim().length < 3) {
    return res.status(400).json({ error: "Subject required" });
  }

  if (!message || message.trim().length < 5) {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    const doc = new Contact({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      countryCode,
      phone,
      company,
      industry,
      subject,
      message,
    });

    const saved = await doc.save();

    // Debug info
    console.info("Saved contact:", (saved._id as mongoose.Types.ObjectId).toString());
    console.info("DB:", mongoose.connection.db?.databaseName ?? "unknown");
    console.info("Collection:", Contact.collection.name);

    return res.status(201).json({
      message: "Message submitted successfully",
      id: (saved._id as mongoose.Types.ObjectId).toString(),
    });
  } catch (err) {
    console.error("Failed to save contact:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
