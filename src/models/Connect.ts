import mongoose from "mongoose";
import { ObjectId } from "./ObjectId.js";

interface IConnect {
  from: typeof ObjectId; // mongo id - string?
  to: typeof ObjectId;
  date: Date; // refers to either date invite sent or date accepted, depending on status
  message: string;
  targetLanguage: string; // constant
  inviteAccepted: boolean;
}

export const connectSchema = new mongoose.Schema<IConnect>({
  from: { type: ObjectId, required: true },
  to: { type: ObjectId, required: true },
  date: { type: Date, required: true },
  message: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  inviteAccepted: { type: Boolean, required: true },
});

export const Connect = mongoose.model("Connect", connectSchema);
