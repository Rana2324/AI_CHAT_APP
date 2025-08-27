import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      index: true,
    },
    role: {
      type: String,
      enum: ["system", "user", "assistant"],
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

MessageSchema.index({ conversation: 1, createdAt: 1 });
export default mongoose.model("Message", MessageSchema);
