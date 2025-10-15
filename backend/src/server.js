import express from "express";
import dotenv from "dotenv";
import conn from "./lib/db.js"; // <-- add .js
import cors from "cors";
import connect from "./routes/Contacts.js"; // <-- add .js
import projcts from "./routes/projects.js"; // <-- add .js
dotenv.config();

conn();

const app = express();
const PORT = process.env.PORT ;

const FRONTEND_URI = process.env.FRONT_URI



// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({ origin: FRONTEND_URI }));

// Test route
app.use("/connect", connect);
// app.use("/contact", (req, res) => {
//   res.send("Contact API");
// });
app.use("/projects", projcts);

app.get("/", (req, res) => res.send("Server is running"));

// app.all("/*", (req, res) => {
//   res.redirect("/");
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
