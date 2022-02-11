import mongoose from "mongoose";
import { ObjectId } from "./ObjectId";
var meetupSchema = new mongoose.Schema({
    creator: { type: ObjectId, required: true },
    description: String,
    invitees: [{ id: ObjectId, accepted: String }],
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    platform: { type: String, required: true },
    cancelled: { type: Boolean, required: true },
});
export var Meetup = mongoose.model("Meetup", meetupSchema);
