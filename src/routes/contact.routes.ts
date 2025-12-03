import express from "express";
import { createContact, getContacts } from "../controllers/contact.controller";

const router = express.Router();

router.get("/", getContacts);
router.post("/", createContact);

export default router;
