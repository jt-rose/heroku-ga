import mongoose from "mongoose";
import { Invite, inviteSchema } from "./Invite.js";
import { Conversation, conversationSchema } from "./Conversation.js";
import { Meetup, meetupSchema } from "./Meetup.js";
import { ObjectId } from "./ObjectId.js";

export interface IUser {
  _id: typeof ObjectId;
  username: string;
  password: string;
  email: string;
  img?: string;
  country: string;
  cityOrState: string;
  aboutMeText: string;
  joinedOn: Date;
  active: boolean;
  nativeLanguage: string;
  targetLanguage: string;
  targetLanguageProficiency: "basic" | "conversational" | "fluent";
  hobbies: string[]; // refactor to constant later
  // denormalized relational data
  connections: typeof ObjectId[];
  connectionInvites: typeof Invite[];
  currentMeetups: typeof Meetup[];
  unreadConversations: typeof Conversation[];
  allConversations: typeof ObjectId[];
  allMeetups: typeof ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  img: String, // images will be saved to the public folder and the url will be stored
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

export const User = mongoose.model("User", userSchema);
