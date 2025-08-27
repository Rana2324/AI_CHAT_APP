import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    title: { type: String, default: "New Chat" },
    participants: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
