import mongoose from "mongoose";
import { inviteSchema } from "./Invite.js";
import { conversationSchema } from "./Conversation.js";
import { meetupSchema } from "./Meetup.js";
import { ObjectId } from "./ObjectId.js";
var userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    img: String,
    country: { type: String, required: true },
    cityOrState: { type: String, required: true },
    aboutMeText: { type: String, required: true },
    joinedOn: { type: Date, required: true },
    active: { type: Boolean, required: true },
    nativeLanguage: { type: String, required: true },
    targetLanguage: { type: String, required: true },
    targetLanguageProficiency: { type: String, required: true },
    hobbies: [{ type: String, required: true }],
    // to limit mongo's excessive data duplication, we will only
    // store recently updated fields, manage these as changes are made
    // and limit pulling data on the full data set unless needed
    connections: [{ type: ObjectId, required: true }],
    connectionInvites: [{ type: inviteSchema, required: true }],
    currentMeetups: [{ type: meetupSchema, required: true }],
    unreadConversations: [{ type: conversationSchema, required: true }],
    allConversations: [{ type: ObjectId, required: true }],
    allMeetups: [{ type: ObjectId, required: true }],
});
export var User = mongoose.model("User", userSchema);
