import mongoose from "mongoose";
import { ObjectId } from "./ObjectId.js";
export var inviteSchema = new mongoose.Schema({
    from: { type: ObjectId, required: true },
    to: { type: ObjectId, required: true },
    date: { type: Date, required: true },
    message: { type: String, required: true },
    targetLanguage: { type: String, required: true },
    inviteAccepted: { type: Boolean, required: true },
});
export var Invite = mongoose.model("Invite", inviteSchema);
