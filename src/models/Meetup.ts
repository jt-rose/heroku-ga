import mongoose from "mongoose";
import { ObjectId } from "./ObjectId";

interface IMeetup {
  creator: typeof ObjectId;
  description: string;
  invitees: { id: typeof ObjectId; accepted: string }[]; // ids - mongo? accepted - constant
  from: Date;
  to: Date;
  platform: string; // constant
  cancelled: boolean;
}

const meetupSchema = new mongoose.Schema<IMeetup>({
  creator: { type: ObjectId, required: true },
  description: String,
  invitees: [{ id: ObjectId, accepted: String }],
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  platform: { type: String, required: true },
  cancelled: { type: Boolean, required: true },
});

export const Meetup = mongoose.model("Meetup", meetupSchema);
