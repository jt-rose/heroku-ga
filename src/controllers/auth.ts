declare module "express-session" {
  interface SessionData {
    user: IUser;
  }
}
import express from "express";
import argon2 from "argon2";
import { User, IUser } from "../models/User.js";
export const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login.ejs", {
    title: "Login",
  });
});
router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // check for user in system
  const foundUser = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!foundUser) {
    res.redirect("/auth/login");
    // res.render("/auth/login", {
    //   title: "Login",
    //   error: "No user with that username / password",
    // });
    return;
  }
  // compare password
  const matchingPassword = await argon2.verify(foundUser.password, password);
  if (!matchingPassword) {
    res.redirect("/auth/login");
    // res.render("/auth/login", {
    //   title: "Login",
    //   error: "No user with that username / password",
    // });
    return;
  }
  // set cookie is username and password match
  req.session.user = foundUser;

  // redirect to home page
  res.redirect("/");
});
router.delete("/logout", async (req, res) => {
  // add error handling?
  await req.session.destroy(() => {});
  res.redirect("/");
});
router.get("/register", (req, res) => {
  res.render("register.ejs", {
    title: "Sign Up",
  });
});
router.post("/register", async (req, res) => {
  // get form parameters from req.body
  try {
    const {
      username,
      email,
      password,
      aboutMeText,
      country,
      cityOrState,
      languages,
      hobbies,
    } = req.body;

    // confirm no such username / email already present
    const userAlreadyExists = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (userAlreadyExists) {
      res.render("/register", {
        title: "Register",
        error: "Username / Email already in use",
      });
      return;
    }
    // validate data

    // encrypt password
    const hashedPassword = await argon2.hash(password);

    // add user to db
    const user = await new User({
      username,
      email,
      password: hashedPassword,
      country,
      cityOrState,
      aboutMeText,
      languages: [languages],
      hobbies: [hobbies],
      active: true,
      joinedOn: new Date(),
    }).save();

    // if err

    // set cookie
    req.session.user = user;

    // return to homepage
    res.redirect("/");
  } catch (e) {
    console.log(e);
    // res.redirect('/register', {
    //   title: 'Register',
    //   error: 'internal server error'
    // })
  }
});
router.get("/forgot-password", (req, res) => {
  res.send("forgot password form");
});
router.post("/forgot-password", (req, res) => {
  res.send("submit forgot password form");
});
router.get("/reset-password", (req, res) => {
  res.send("form to reset password");
});
router.post("/reset-password", (req, res) => {
  res.send("submit form to reset password");
});
