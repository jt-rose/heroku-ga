import mongoose from "mongoose";
import { ObjectId } from "./ObjectId.js";

interface InviteSchema {
  from: typeof ObjectId; // mongo id - string?
  to: typeof ObjectId;

  date: Date; // refers to either date invite sent or date accepted, depending on status
  message: string;
  targetLanguage: string; // constant
  inviteAccepted: boolean;
}

export const inviteSchema = new mongoose.Schema<InviteSchema>({
  from: { type: ObjectId, required: true },
  to: { type: ObjectId, required: true },
  date: { type: Date, required: true },
  message: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  inviteAccepted: { type: Boolean, required: true },
});

export const Invite = mongoose.model("Invite", inviteSchema);
