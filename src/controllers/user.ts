import express from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";
export const router = express.Router();

router.get("/connects", (req, res) => {
  res.send("connects landing page");
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

router.delete("/delete-account/:accountid", (req, res) => {
  res.send("delete user account - be careful!");
}); // use sparingly and make sure to cascade delete!
// users should be encouraged to deactivate, rather than delete, their account
// to preserve data integrity for other users

router.delete("/delete-connect-invite/:connectid", (req, res) => {
  res.send("remove connection invite");
});
router.delete("/delete-meetup/:meetupid", (req, res) => {
  res.send("delete meetup - alert invitees");
});
// alert invitees who have responded upon deleting a meetup
