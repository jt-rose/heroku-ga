import { IUser } from "../models/User.js";

declare module "express-session" {
  interface SessionData {
    user: IUser;
  }
}
