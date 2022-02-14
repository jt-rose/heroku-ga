import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";

// this function will update the stored user object on each page load
export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) {
    return next();
  } else {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      await req.session.destroy(() => {});
      return next();
    }
    req.session.user = user;
    return next();
  }
};
