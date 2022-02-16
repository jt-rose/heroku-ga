import mongoose, { Types } from "mongoose";
import { ObjectId } from "./ObjectId.js";

export interface IMeetup extends Types.Subdocument {
  creator: typeof ObjectId;
  name: string;
  description: string;
  invitee: typeof ObjectId;
  startTime: Date;
  endTime: Date;
  platform: string; // constant
  cancelled: boolean;
  response: "accepted" | "declined" | "no response";
  // fields to override mongoose's object limits when formatting ejs page
  createdByMe?: boolean;
  month?: number;
  day?: number;
  timeframe?: string; // string type to include :30  and AM PM data
  partnerUsername?: string;
  partnerImg?: string;
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
  // fields to override mongoose's object limits when formatting ejs page
  createdByMe: Boolean,
  month: Number,
  day: Number,
  timeframe: String, // string type to include :30  and AM PM data
  partnerUsername: String,
  partnerImg: String,
});

export const Meetup = mongoose.model("Meetup", meetupSchema);
