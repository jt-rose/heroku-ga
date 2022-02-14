import mongoose, { Types } from "mongoose";
import { ObjectId } from "./ObjectId.js";

export interface IMessage extends Types.Subdocument {
  message: string;
  from: typeof ObjectId; // mongo id
  to: typeof ObjectId; // mongo id
  date: Date;
}

export const messageSchema = new mongoose.Schema<IMessage>({
  message: { type: String, required: true },
  from: { type: ObjectId, required: true },
  to: { type: ObjectId, required: true },
  date: { type: Date, required: true },
});

export const Message = mongoose.model("Message", messageSchema);

export interface IConversation extends Types.Subdocument {
  speakers: typeof ObjectId[];
  messages: typeof Message[];
  dateOfLastMessage?: Date;
}

export const conversationSchema = new mongoose.Schema<IConversation>({
  speakers: [{ type: ObjectId, required: true }],
  messages: [{ type: messageSchema, required: true }],
  dateOfLastMessage: { type: Date }, // nullable for when creating a new empty conversation object
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
