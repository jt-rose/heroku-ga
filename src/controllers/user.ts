import express from "express";
import mongoose from "mongoose";
import { User, IUser } from "../models/User.js";
import { Invite } from "../models/Invite.js";
import { languages } from "../constants/languages.js";
import { proficiencyLevels } from "../constants/proficiency.js";
import multer from "multer";
import { uploadFile } from "../utils/s3.js";
const upload = multer({ dest: "uploads/" });
export const router = express.Router();

router.get("/connects", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }

  const connects = await Invite.find({
    $or: [{ from: req.session.user._id }, { to: req.session.user._id }],
  });
  res.render("connects.ejs", {
    connects,
  });
});

router.get("/profile/:userid", async (req, res) => {
  if (req.session.user && `${req.session.user._id}` === req.params.userid) {
    res.render("user.ejs", {
      title: "Profile",
      user: req.session.user,
      myAccount: true,
      myConnection: false,
    });
    return;
  }
  let user: IUser | null = null;
  if (mongoose.isValidObjectId(req.params.userid)) {
    user = await User.findById(req.params.userid);
  }

  if (!user) {
    // flash message
    res.redirect("/");
    return;
  }

  const myConnection =
    req.session.user &&
    req.session.user.connections.some(
      (conn) => String(conn) === String(user!._id)
    );

  res.render("user.ejs", {
    title: "Profile",
    user,
    myAccount: false,
    myConnection,
  });
});

router.get("/edit-profile", (req, res) => {
  const user = req.session.user;
  if (!user) {
    // flash message
    res.redirect("/auth/login");
    return;
  }
  res.render("edit-profile.ejs", {
    title: "Edit Profile",
    user,
    languages,
    proficiencyLevels,
  });
});

router.put("/edit-profile", upload.single("img"), async (req, res) => {
  const user = req.session.user;
  if (!user) {
    // flash message
    res.redirect("/auth/login");
    return;
  }

  // upload user avatar to s3 and capture img path
  const file = req.file;
  let img;
  if (file) {
    // ! add validation around img type and size
    const result = await uploadFile(file);
    img = result.Location;
  }
  const {
    username,
    email,
    country,
    cityOrState,
    aboutMeText,
    nativeLanguage,
    targetLanguage,
    targetLanguageProficiency,
  } = req.body;
  //confirm that email and username are available

  const sameUsers = await User.find({ $or: [{ username }, { email }] });
  console.log(sameUsers);
  if (
    sameUsers.length &&
    sameUsers.some((u) => String(u._id) !== String(user._id))
  ) {
    console.log("email or username already taken");
    // ! add flash message warning and reroute
    res.redirect("/user/edit-profile");
    return;
  }

  await User.findByIdAndUpdate(user._id, {
    $set: {
      username,
      img,
      email,
      country,
      cityOrState,
      aboutMeText,
      nativeLanguage,
      targetLanguage,
      targetLanguageProficiency,
    },
  });

  res.redirect("/");
});

router.put("/toggle-active", async (req, res) => {
  // user account will be deactivated, rather than outright deleted,
  // to maintain relational data integrity and allow for reactivation later
  // ! when getting data on users, a filter for active will need to be applied
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const user = await User.findByIdAndUpdate(
    req.session.user._id,
    {
      active: !req.session.user.active,
    },
    { new: true }
  );
  if (!user) {
    console.log(
      "Error - search for user " +
        req.session.user._id +
        " but could not locate in database"
    );
    res.redirect("/");
    return;
  }
  req.session.user = user;
  res.redirect("/");
});

router.delete("/permadelete", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  const user = await User.findByIdAndRemove(req.session.user._id);
  // ! TODO: run a cascade delete
  if (!user) {
    console.log(
      "Error - search for user " +
        req.session.user._id +
        " but could not locate in database"
    );
    res.redirect("/");
    return;
  }
  await req.session.destroy(() => {});
  res.redirect("/");
});
