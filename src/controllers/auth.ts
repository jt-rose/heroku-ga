import express from "express";
import argon2 from "argon2";
import { User, IUser } from "../models/User.js";
import path from "path";
import multer from "multer";
import { uploadFile, getFileStream } from "../utils/s3.js";
import { languages } from "../constants/languages.js";
import { proficiencyLevels } from "../constants/proficiency.js";
export const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/login", (req, res) => {
  res.render("login.ejs", {
    title: "Login",
    user: req.session.user,
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
  // set cookie if username and password match
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
    user: req.session.user,
    languages,
    proficiencyLevels,
  });
});
router.post("/register", upload.single("img"), async (req, res) => {
  try {
    // upload user avatar to s3 and capture img path
    const file = req.file;
    let img;
    if (file) {
      // ! add validation around img type and size
      const result = await uploadFile(file);
      img = result.Location;
    }

    // get form parameters from req.body
    const {
      username,
      email,
      password,
      aboutMeText,
      country,
      cityOrState,
      nativeLanguage,
      targetLanguage,
      targetLanguageProficiency,
    } = req.body;

    // confirm no such username / email already present
    const userAlreadyExists = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (userAlreadyExists) {
      res.render("/register", {
        title: "Register",
        user: req.session.user,
        error: "Username / Email already in use",
      });
      return;
    }
    // validate data
    // ! add later

    // encrypt password
    const hashedPassword = await argon2.hash(password);

    // add user to db
    const user = await new User({
      username,
      email,
      password: hashedPassword,
      img,
      country,
      cityOrState,
      aboutMeText,
      nativeLanguage,
      targetLanguage,
      targetLanguageProficiency,
      active: true,
      joinedOn: new Date(),
      updatedConnects: [],
      updatedConversations: [],
      updatedMeetups: [],
    }).save();

    // if err
    // ! add later

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
