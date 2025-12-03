import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  fullName: string;
  email: string;
  countryCode?: string;
  phone?: string;
  company?: string;
  industry?: string;
  subject?: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    countryCode: { type: String },
    phone: { type: String },

    // NEW FIELDS
    company: { type: String, trim: true },
    industry: { type: String, trim: true },
    subject: { type: String, trim: true },

    message: { type: String, required: true, trim: true },

    createdAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

const Contact =
  (mongoose.models?.Contact as mongoose.Model<IContact>) ||
  mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
