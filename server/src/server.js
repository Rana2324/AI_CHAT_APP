// Load environment variables first
import '../setup.js';
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./DB/db.js";
import chatRouter from "./routes/chat.js";

const app = express();

// 🛡️ Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// 🛣️ Routes
app.use("/api/chat", chatRouter);

// Health check
app.get("/health", (_, res) => res.json({ ok: true }));

// 🗄️ Connect MongoDB
await connectDB(process.env.MONGO_URI);

// 🚀 Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}/api/chat`);
  console.log("✅ Environment loaded:");
  console.log("   PORT:", process.env.PORT);
  console.log("   CLIENT_ORIGIN:", process.env.CLIENT_ORIGIN);
  console.log("   MONGO_URI:", process.env.MONGO_URI ? "Set ✅" : "Missing ❌");
  console.log("   OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Set ✅" : "Missing ❌");
});
