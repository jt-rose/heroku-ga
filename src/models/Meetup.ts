import mongoose, { Types } from "mongoose";
import { ObjectId } from "./ObjectId.js";

export interface IMeetup extends Types.Subdocument {
  creator: typeof ObjectId;
  name: string;
  description: string;
  invitee: typeof ObjectId; // ids - mongo? accepted - constant
  startTime: Date;
  endTime: Date;
  platform: string; // constant
  cancelled: boolean;
  response: "accepted" | "declined" | "no response";
}

export const meetupSchema = new mongoose.Schema<IMeetup>({
  creator: { type: ObjectId, required: true },
  name: { type: String, required: true },
  description: String,
  invitee: { type: ObjectId, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  platform: { type: String, required: true },
  cancelled: { type: Boolean, required: true },
  response: { type: String, required: true },
});

export const Meetup = mongoose.model("Meetup", meetupSchema);
