// src/services/contact.service.ts

import Contact, { IContact } from "../models/contact.model";

class ContactService {
  async createContact(data: Partial<IContact>) {
    return Contact.create({
      fullName: data.fullName?.trim(),
      email: data.email?.trim().toLowerCase(),
      countryCode: data.countryCode,
      phone: data.phone,
      company: data.company,
      industry: data.industry,
      subject: data.subject,
      message: data.message?.trim(),
    });
  }

  async getContacts() {
    return Contact.find().sort({ createdAt: -1 }).lean();
  }

  async getContactById(id: string) {
    return Contact.findById(id);
  }

  async deleteContact(id: string) {
    return Contact.findByIdAndDelete(id);
  }
}

export const contactService = new ContactService();
