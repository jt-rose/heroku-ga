import mongoose from "mongoose";
import { ObjectId } from "./ObjectId";
var messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    from: { type: ObjectId, required: true },
    to: { type: ObjectId, required: true },
    date: { type: Date, required: true },
});
var Message = mongoose.model("Message", messageSchema);
var conversationSchema = new mongoose.Schema({
    speakers: [{ type: ObjectId, required: true }],
    messages: [{ type: Message, required: true }],
    dateOfLastMessage: { type: Date, required: true },
});
export var Conversation = mongoose.model("Conversation", conversationSchema);
