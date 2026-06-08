import express from "express";
import Contact from "../models/Contact.js";
import { getDbStatus } from "../lib/db.js";

const router = express.Router();

const fallbackMessages = [];

async function sendTelegram(name, email, message) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TG_CHAT_ID,
          text: `
🔥 New Portfolio Text

👤 Name: ${name}

📧 Email: ${email}

💬 Message:
${message}
`,
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error("Telegram API Error:", data);
    }
  } catch (error) {
    console.error("Telegram Send Error:", error);
  }
}

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        msg: "Please fill all the fields",
      });
    }

    // Database unavailable
    if (!getDbStatus()) {
      fallbackMessages.push({
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      });

      await sendTelegram(name, email, message);

      return res.status(202).json({
        message:
          "Message received (fallback mode active)",
      });
    }

    // Save to MongoDB
    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    // Send Telegram notification
    await sendTelegram(name, email, message);

    return res.status(200).json({
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error saving contact:", error);

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
});

export default router;
