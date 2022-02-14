import mongoose from "mongoose";
import { ObjectId } from "./ObjectId.js";
export var meetupSchema = new mongoose.Schema({
    creator: { type: ObjectId, required: true },
    description: String,
    invitee: { type: ObjectId, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    platform: { type: String, required: true },
    cancelled: { type: Boolean, required: true },
    response: { type: String, required: true },
});
export var Meetup = mongoose.model("Meetup", meetupSchema);
