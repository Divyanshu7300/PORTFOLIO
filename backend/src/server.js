import express from "express";
import dotenv from "dotenv";
import conn from "./lib/db.js"; 
import cors from "cors";
import connect from "./routes/Contacts.js"; 
import projcts from "./routes/projects.js"; 
dotenv.config();

conn();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const allowedOrigins = [process.env.FRONTEND_URI, "http://localhost:3000", "http://127.0.0.1:3000"].filter(Boolean);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Test route
app.use("/connect", connect);
app.use("/projects", projcts);

app.get("/", (req, res) => res.send("Server is running"));
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, mode: process.env.NODE_ENV || "development" });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
