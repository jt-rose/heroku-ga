import express from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Invite } from "../models/Invite.js";
import { languages } from "../constants/languages.js";
import { proficiencyLevels } from "../constants/proficiency.js";
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
router.get("/messages", (req, res) => {
  res.send("messages landing page");
});
router.get("/meetups", (req, res) => {
  res.send("meetups landing page");
});
router.get("/profile/:userid", async (req, res) => {
  if (req.session.user && `${req.session.user._id}` === req.params.userid) {
    res.render("user.ejs", {
      title: "Profile",
      user: req.session.user,
      myAccount: true,
    });
    return;
  }
  let user = null;
  if (mongoose.isValidObjectId(req.params.userid)) {
    user = await User.findById(req.params.userid);
  }

  if (!user) {
    // flash message
    res.redirect("/");
    return;
  }
  res.render("user.ejs", {
    title: "Profile",
    user,
    myAccount: false,
  });
});

// may need to create invidivual routes for the connect, message, and meetup forms

router.post("/create-user", (req, res) => {
  res.send("post create-user form data");
});
router.post("/create-message/:recipient", (req, res) => {
  res.send("post form data for sending a new message to another user");
});
router.post("/create-meetup/", (req, res) => {
  res.send(" post form data for creating a new meetup");
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
router.post("/create-connection-invite/:recipient", (req, res) => {
  res.send("post form data for sending a new connection to another user");
});

router.put("/update-profile/:userid", (req, res) => {
  res.send("put form data for updating user profile");
});
router.put("/update-meetup/:meetupid", (req, res) => {
  res.send("put form data to update meetup");
});
router.put("/respond-to-message/:messageid", (req, res) => {
  res.send("put form data to update conversation messages");
});
// at this time messages cannot be updated or deleted

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

router.delete("/delete-connect-invite/:connectid", (req, res) => {
  res.send("remove connection invite");
});
router.delete("/delete-meetup/:meetupid", (req, res) => {
  res.send("delete meetup - alert invitees");
});
// alert invitees who have responded upon deleting a meetup
