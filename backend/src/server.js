import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import invitationRoutes from "./routes/invitations.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:8081",
  "https://royal-luxe-invites.onrender.com",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
    res.json({
        message: "Royal Luxe Invites API is running",
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend healthy",
    });
});

app.use("/api/invitations", invitationRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});