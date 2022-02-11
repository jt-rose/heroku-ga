import mongoose from "mongoose";
import { Connect, connectSchema } from "./Connect.js";
import { Conversation, conversationSchema } from "./Conversation.js";
import { Meetup, meetupSchema } from "./Meetup.js";

export interface IUser {
  // _id - mongo
  username: string;
  password: string;
  email: string;
  //img?: string;
  country: string;
  cityOrState: string;
  aboutMeText: string;
  joinedOn: Date;
  active: boolean;
  languages: { language: string; proficiency: string }[]; // refactor to constant later
  hobbies: string[]; // refactor to constant later
  updatedConnects: typeof Connect[];
  updatedConversations: typeof Conversation[];
  updatedMeetups: typeof Meetup[];
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  // img
  country: { type: String, required: true },
  cityOrState: { type: String, required: true },
  aboutMeText: { type: String, required: true },
  joinedOn: { type: Date, required: true },
  active: { type: Boolean, required: true },
  languages: [{ type: String, required: true }],
  hobbies: [{ type: String, required: true }],
  // to limit mongo's excessive data duplication, we will only
  // store recently updated fields, manage these as changes are made
  // and limit pulling data on the full data set unless needed
  updatedConnects: [connectSchema],
  updatedConversations: [conversationSchema],
  updatedMeetups: [meetupSchema],
});

export const User = mongoose.model("User", userSchema);
