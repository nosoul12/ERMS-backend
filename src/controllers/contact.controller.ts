import { Request, Response } from "express";
import Contact from "../models/contact.model";

/**
 * @desc Create a new contact
 * @route POST /api/contacts
 */
export async function createContact(req: Request, res: Response) {
  try {
    const {
      fullName,
      email,
      countryCode,
      phone,
      company,
      industry,
      subject,
      message
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, and message are required",
      });
    }

    const contact = await Contact.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      countryCode,
      phone,
      company,
      industry,
      subject,
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    console.error("❌ Contact creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * @desc Get all contacts
 * @route GET /api/contacts
 */
export async function getContacts(_req: Request, res: Response) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("❌ Fetch contacts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
}
