import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import invitationRoutes from "./routes/invitations.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:8080",
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