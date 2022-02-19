import mongoose, { Types } from "mongoose";
import { ObjectId } from "./ObjectId.js";

export interface InviteSchema extends Types.Subdocument {
  from: typeof ObjectId;
  to: typeof ObjectId;

  date: Date; // refers to either date invite sent or date accepted, depending on status
  message: string;
  targetLanguage: string;
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
