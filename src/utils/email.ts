// src/utils/email.ts
import nodemailer from "nodemailer";
import { IContact } from "../models/contact.model";

let transporter: nodemailer.Transporter | null = null;

function createTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration missing in environment variables.");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  // optional verification at startup
  transporter.verify()
    .then(() => console.log("✅ SMTP transporter verified"))
    .catch((err) => console.warn("⚠️ SMTP verify failed:", err.message || err));

  return transporter;
}

/**
 * Send two emails:
 *  - boss notification (detailed)
 *  - acknowledgement to user (polite thank-you)
 */
export async function sendContactNotification(contact: IContact) {
  const bossEmail = process.env.BOSS_EMAIL;
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;

  if (!bossEmail) {
    console.warn("BOSS_EMAIL not set — skipping sendContactNotification");
    return;
  }

  // Basic safety: ensure we have the user's email
  if (!contact.email) {
    console.warn("Contact has no email field — skipping user acknowledgement");
  }

  const transporter = createTransporter();

  // --- Boss email content ---
  const bossSubject = `New contact: ${contact.fullName} — ${contact.subject || "No subject"}`;
  const bossText = [
    `You received a new contact submission:`,
    ``,
    `Full name: ${contact.fullName}`,
    `Email: ${contact.email}`,
    `Phone: ${contact.countryCode || ""} ${contact.phone || ""}`,
    `Company: ${contact.company || "N/A"}`,
    `Industry: ${contact.industry || "N/A"}`,
    `Subject: ${contact.subject || "N/A"}`,
    ``,
    `Message:`,
    `${contact.message}`,
    ``,
    `Submitted at: ${contact.createdAt?.toISOString() || new Date().toISOString()}`,
  ].join("\n");

  const bossHtml = `
    <h2>New contact submission</h2>
    <p><strong>Full name:</strong> ${escapeHtml(contact.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(contact.email || "N/A")}</p>
    <p><strong>Phone:</strong> ${escapeHtml((contact.countryCode || "") + " " + (contact.phone || ""))}</p>
    <p><strong>Company:</strong> ${escapeHtml(contact.company || "N/A")}</p>
    <p><strong>Industry:</strong> ${escapeHtml(contact.industry || "N/A")}</p>
    <p><strong>Subject:</strong> ${escapeHtml(contact.subject || "N/A")}</p>
    <hr/>
    <p><strong>Message:</strong></p>
    <p>${nl2br(escapeHtml(contact.message || ""))}</p>
    <hr/>
    <p>Submitted at: ${escapeHtml(contact.createdAt?.toISOString() || new Date().toISOString())}</p>
  `;

  // --- Acknowledgement to user content ---
  const userSubject = `Thanks for contacting us, ${contact.fullName.split(" ")[0] || ""}!`;
  const userText = [
    `Hi ${contact.fullName},`,
    ``,
    `Thanks for reaching out — we received your message and someone from our team will get back to you soon.`,
    ``,
    `Summary of your submission:`,
    `Subject: ${contact.subject || "N/A"}`,
    `Message:`,
    `${contact.message}`,
    ``,
    `If you need urgent assistance, reply to this email or call us.`,
    ``,
    `Best regards,`,
    `The Team`
  ].join("\n");

  const userHtml = `
    <p>Hi ${escapeHtml(contact.fullName.split(" ")[0] || contact.fullName)},</p>
    <p>Thanks for reaching out — we received your message and someone from our team will get back to you soon.</p>
    <h4>Your message summary</h4>
    <p><strong>Subject:</strong> ${escapeHtml(contact.subject || "N/A")}</p>
    <p><strong>Message:</strong></p>
    <p>${nl2br(escapeHtml(contact.message || ""))}</p>
    <br/>
    <p>If you need urgent assistance, reply to this email.</p>
    <p>Best regards,<br/>The Team</p>
  `;

  // Build send operations
  const sends: Promise<any>[] = [];

  // 1) boss
  sends.push(
    transporter.sendMail({
      from: fromEmail,
      to: bossEmail,
      subject: bossSubject,
      text: bossText,
      html: bossHtml,
    })
  );

  // 2) user ack (only if email present)
  if (contact.email) {
    sends.push(
      transporter.sendMail({
        from: fromEmail,
        to: contact.email,
        subject: userSubject,
        text: userText,
        html: userHtml,
      })
    );
  }

  // Run both and log results — do not throw on single failure
  const results = await Promise.allSettled(sends);

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      // info object is transport result
      console.log(`📧 email[${i}] sent:`, (r.value && r.value.messageId) || r.value);
    } else {
      console.error(`❌ email[${i}] failed:`, r.reason);
    }
  });

  return results;
}

// small helpers
function escapeHtml(str: string) {
  return (str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function nl2br(str: string) {
  return (str || "").replace(/\r\n|\r|\n/g, "<br/>");
}
