import mongoose from "mongoose";
import { ObjectId } from "./ObjectId.js";
export var meetupSchema = new mongoose.Schema({
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
    timeframe: String,
    partnerUsername: String,
    partnerImg: String,
});
export var Meetup = mongoose.model("Meetup", meetupSchema);
