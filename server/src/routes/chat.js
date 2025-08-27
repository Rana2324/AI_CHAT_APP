import express from "express";
import OpenAI from "openai";
import Conversation from "../model/Conversation.js";
import Message from "../model/Message.js";

const router = express.Router();

// Initialize OpenAI with environment variable
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

if (!openai) {
  console.error("❌ OPENAI_API_KEY is not set in environment variables");
}

/**
 * 1) নন-স্ট্রিম রেসপন্স (চাইলে সরাসরি ইউজ করতে পারো)
 */
router.get("/", async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { conversationId, userText } = req.body;

    let convo = conversationId
      ? await Conversation.findById(conversationId)
      : await Conversation.create({});

    // ইউজার মেসেজ সেভ
    const userMsg = await Message.create({
      conversation: convo._id,
      role: "user",
      content: userText,
    });

    // পুরনো হিস্টরি লোড
    const history = await Message.find({ conversation: convo._id }).sort({
      createdAt: 1,
    });

    // Chat Completions (স্ট্রিম ছাড়া; সহজ ভ্যারিয়েন্ট)
    // Chat Completions API এখনো সাপোর্টেড (Responses API-ও আছে) :contentReference[oaicite:2]{index=2}
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const aiText = completion.choices?.[0]?.message?.content ?? "";
    const aiMsg = await Message.create({
      conversation: convo._id,
      role: "assistant",
      content: aiText,
    });

    res.json({ conversationId: convo._id, answer: aiMsg.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * 2) স্ট্রিমিং এন্ডপয়েন্ট (SSE)
 *   - ব্রাউজার EventSource ব্যবহার করবে
 */
router.get("/stream", async (req, res) => {
  try {
    const { q, conversationId } = req.query;

    // SSE হেডার
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    // কনভারসেশন
    let convo = conversationId
      ? await Conversation.findById(conversationId)
      : await Conversation.create({});

    // ইউজার মেসেজ সেভ
    await Message.create({
      conversation: convo._id,
      role: "user",
      content: String(q || ""),
    });

    const history = await Message.find({ conversation: convo._id }).sort({
      createdAt: 1,
    });

    // Chat Completions স্ট্রিম অন (SDK async iterable) :contentReference[oaicite:3]{index=3}
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      stream: true,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    let fullText = "";

    for await (const chunk of stream) {
      const delta = chunk?.choices?.[0]?.delta?.content || "";
      if (delta) {
        fullText += delta;
        // ক্লায়েন্টে টোকেন পাঠাও
        res.write(`data: ${delta}\n\n`);
      }
    }

    // জেনারেশন শেষ, DB-তে অ্যাসিস্ট্যান্ট মেসেজ সেভ
    await Message.create({
      conversation: convo._id,
      role: "assistant",
      content: fullText,
    });

    // ডান ইভেন্ট
    res.write(
      `event: done\ndata: ${JSON.stringify({ conversationId: convo._id })}\n\n`
    );
    res.end();
  } catch (e) {
    console.error(e);
    // SSE এরর ইভেন্ট
    res.write(
      `event: error\ndata: ${JSON.stringify({ message: "Stream failed" })}\n\n`
    );
    res.end();
  }
});

export default router;
