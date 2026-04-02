import express from "express";
import Contact from "../models/Contact.js"; 
import { getDbStatus } from "../lib/db.js";
const router = express.Router();
const fallbackMessages = [];

// Use async function
router.post("/", async (req, res) => {
  // res.json({ msg: "Connect route working" });
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }

    if (!getDbStatus()) {
      fallbackMessages.push({
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      });
      return res.status(202).json({
        message: "Message captured in fallback mode. Database reconnect hote hi persistence add kar sakte ho.",
      });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save(); // wait for DB save

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

export default router;
