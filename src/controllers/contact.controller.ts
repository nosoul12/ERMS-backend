import { Request, Response } from "express";
import Contact from "../models/contact.model";
import { sendContactNotification } from "../utils/email"; // add this import
// make sure this import exists at top of file
// import { sendContactNotification } from "../utils/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createContact(req: Request, res: Response) {
  try {
    const raw = req.body ?? {};

    const fullName = (raw.fullName || "").toString().trim();
    const email = (raw.email || "").toString().trim().toLowerCase();
    const countryCode = raw.countryCode ? raw.countryCode.toString().trim() : undefined;
    const phone = raw.phone ? raw.phone.toString().trim() : undefined;
    const company = raw.company ? raw.company.toString().trim() : undefined;
    const industry = raw.industry ? raw.industry.toString().trim() : undefined;
    const subject = raw.subject ? raw.subject.toString().trim() : undefined;
    const message = (raw.message || "").toString().trim();

    // basic required validation
    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, and message are required",
      });
    }

    // simple email format check
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const contact = await Contact.create({
      fullName,
      email,
      countryCode,
      phone,
      company,
      industry,
      subject,
      message,
    });

    // Fire-and-forget sending, but log results; use Promise.allSettled so one failure won't hide the other.
    (async () => {
      try {
        const results = await sendContactNotification(contact as any);
        // If your sendContactNotification already logs, this is optional; still helpful.
        if (Array.isArray(results)) {
          results.forEach((r, i) => {
            if ((r as any)?.status === "fulfilled" || (r as any)?.messageId) {
              console.log(`📧 contact email[${i}] likely sent`, (r as any).messageId ?? r);
            } else if ((r as any)?.status === "rejected") {
              console.error(`❌ contact email[${i}] failed:`, (r as any).reason ?? r);
            }
          });
        }
      } catch (err) {
        console.error("❌ sendContactNotification encountered an error:", err);
      }
    })();

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
 * @desc Get all contacts (with optional filters: from, to, page, limit, sort)
 * @route GET /api/contacts
 * Query params:
 *   - from: ISO date or yyyy-mm-dd
 *   - to: ISO date or yyyy-mm-dd
 *   - page (default 1)
 *   - limit (default 50)
 *   - sort (default -createdAt)
 */
export async function getContacts(req: Request, res: Response) {
  try {
    const { from, to, page = "1", limit = "50", sort = "-createdAt" } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};

    if (from || to) {
      filter.createdAt = {};
      if (from) {
        const fromDate = new Date(from);
        if (!isNaN(fromDate.getTime())) filter.createdAt.$gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        if (!isNaN(toDate.getTime())) filter.createdAt.$lte = toDate;
      }
      if (Object.keys(filter.createdAt).length === 0) delete filter.createdAt;
    }

    const [total, contacts] = await Promise.all([
      Contact.countDocuments(filter),
      Contact.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
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
