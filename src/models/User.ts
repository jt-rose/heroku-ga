import mongoose from "mongoose";
import { inviteSchema, InviteSchema } from "./Invite.js";
import { IMessage, messageSchema } from "./Conversation.js";
import { IMeetup, meetupSchema } from "./Meetup.js";
import { ObjectId } from "./ObjectId.js";

export interface IUser {
  _id: typeof ObjectId;
  username: string;
  password: string;
  email: string;
  img: string;
  country: string;
  cityOrState: string;
  aboutMeText: string;
  joinedOn: Date;
  active: boolean;
  nativeLanguage: string;
  targetLanguage: string;
  targetLanguageProficiency: "basic" | "conversational" | "fluent";
  // denormalized relational data
  connections: typeof ObjectId[];
  connectionInvites: InviteSchema[];
  currentMeetups: IMeetup[];
  unreadMessages: IMessage[];
  allConversations: typeof ObjectId[];
  allMeetups: typeof ObjectId[];
  blackListed: typeof ObjectId[];
}

export const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  img: { type: String, required: true },
  country: { type: String, required: true },
  cityOrState: { type: String, required: true },
  aboutMeText: { type: String, required: true },
  joinedOn: { type: Date, required: true },
  active: { type: Boolean, required: true },
  nativeLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  targetLanguageProficiency: { type: String, required: true },

  connections: [{ type: ObjectId, required: true }],
  connectionInvites: [
    {
      type: inviteSchema,
      required: true,
    },
  ],
  currentMeetups: [{ type: meetupSchema, required: true }],
  unreadMessages: [{ type: messageSchema, required: true }],
  allConversations: [{ type: ObjectId, required: true }],
  allMeetups: [{ type: ObjectId, required: true }],

  blackListed: [{ type: ObjectId, required: true }],
});

export const User = mongoose.model("User", userSchema);
