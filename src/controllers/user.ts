import express from "express";
import mongoose from "mongoose";
import { User, IUser } from "../models/User.js";
import { Invite } from "../models/Invite.js";
import { languages } from "../constants/languages.js";
import { proficiencyLevels } from "../constants/proficiency.js";
import multer from "multer";
import { uploadFile } from "../utils/s3.js";
import { countries } from "../constants/countries.js";
const upload = multer({ dest: "uploads/" });
export const router = express.Router();

router.get("/connects", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }

  const connections = await User.find({
    _id: { $in: req.session.user.connections },
  });

  const invites = req.session.user.connectionInvites;

  res.render("connects.ejs", {
    title: "Connections",
    user: req.session.user,
    connections,
    invites,
  });
});

router.get("/profile/:userid", async (req, res) => {
  if (req.session.user && `${req.session.user._id}` === req.params.userid) {
    res.render("user.ejs", {
      title: "Profile",
      user: req.session.user,
      targetUser: req.session.user,
      myAccount: true,
      myConnection: false,
      connectionRequestToMe: false,
      connectionRequestFromMe: false,
      invite: null,
    });
    return;
  }
  let targetUser: IUser | null = null;
  if (mongoose.isValidObjectId(req.params.userid)) {
    targetUser = await User.findById(req.params.userid);
  }

  if (!targetUser) {
    // flash message
    res.redirect("/");
    return;
  }

  const myConnection =
    req.session.user &&
    req.session.user.connections.some(
      (conn) => String(conn) === String(targetUser!._id)
    );

  let connectionRequestFromMe = false;
  let connectionRequestToMe = false;
  let invite = null;

  if (!myConnection && req.session.user) {
    const inviteToMe = req.session.user.connectionInvites.find(
      (invite) => String(invite.from) === String(targetUser!._id)
    );
    if (inviteToMe) {
      connectionRequestToMe = true;
      invite = inviteToMe;
    } else {
      const inviteFromMe = req.session.user.connectionInvites.find(
        (invite) => String(invite.to) === String(targetUser!._id)
      );
      if (inviteFromMe) {
        connectionRequestFromMe = true;
        invite = inviteFromMe;
      }
    }
  }

  res.render("user.ejs", {
    title: "Profile",
    user: req.session.user,
    targetUser,
    myAccount: false,
    myConnection,
    connectionRequestFromMe,
    connectionRequestToMe,
    invite,
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
    countries,
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

router.get("/me", (req, res) => {
  if (req.session.user) {
    res.redirect("/user/profile/" + req.session.user._id);
  } else {
    res.redirect("/search");
  }
});
