import mongoose, { Document } from "mongoose";
import { ObjectId } from "./ObjectId.js";

interface IMessage extends Document {
  text: string;
  from: typeof ObjectId; // mongo id
  to: typeof ObjectId; // mongo id
  date: Date;
}

export const messageSchema = new mongoose.Schema<IMessage>({
  text: { type: String, required: true },
  from: { type: ObjectId, required: true },
  to: { type: ObjectId, required: true },
  date: { type: Date, required: true },
});

const Message = mongoose.model("Message", messageSchema);

interface IConversation extends Document {
  speakers: typeof ObjectId[];
  messages: typeof Message[];
  dateOfLastMessage: Date;
}

export const conversationSchema = new mongoose.Schema<IConversation>({
  speakers: [{ type: ObjectId, required: true }],
  messages: [{ type: messageSchema, required: true }],
  dateOfLastMessage: { type: Date, required: true },
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
