import mongoose from "mongoose";
import { ObjectId } from "./ObjectId";

interface IMessage {
  text: string;
  from: typeof ObjectId; // mongo id
  to: typeof ObjectId; // mongo id
  date: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
  text: { type: String, required: true },
  from: { type: ObjectId, required: true },
  to: { type: ObjectId, required: true },
  date: { type: Date, required: true },
});

const Message = mongoose.model("Message", messageSchema);

interface IConversation {
  speakers: typeof ObjectId[];
  messages: typeof Message[];
  dateOfLastMessage: Date;
}

const conversationSchema = new mongoose.Schema<IConversation>({
  speakers: [{ type: ObjectId, required: true }],
  messages: [{ type: Message, required: true }],
  dateOfLastMessage: { type: Date, required: true },
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
