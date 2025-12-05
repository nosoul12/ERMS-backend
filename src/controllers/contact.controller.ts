// src/controllers/contact.controller.ts

import { Request, Response } from "express";
import { contactService } from "../services/contact.service";

/**
 * @desc Create a new contact
 * @route POST /api/contacts
 */
export async function createContact(req: Request, res: Response) {
  try {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, and message are required",
      });
    }

    const contact = await contactService.createContact(req.body);

    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (error) {
    console.error("❌ createContact error:", error);
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
export async function getContacts(req: Request, res: Response) {
  try {
    const contacts = await contactService.getContacts();

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("❌ getContacts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
}

/**
 * @desc Get single contact by ID
 * @route GET /api/contacts/:id
 */
export async function getContactById(req: Request, res: Response) {
  try {
    const contact = await contactService.getContactById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("❌ getContactById error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * @desc Delete a contact by ID
 * @route DELETE /api/contacts/:id
 */
export async function deleteContact(req: Request, res: Response) {
  try {
    const contact = await contactService.deleteContact(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("❌ deleteContact error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
