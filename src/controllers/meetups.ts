import express from "express";
import { languages } from "../constants/languages.js";
import { User } from "../models/User.js";
import { Meetup } from "../models/Meetup.js";

export const router = express.Router();

// create meetup
router.get("/create", async (req, res) => {
  const connections = await User.find({
    _id: { $in: req.session.user?.connections },
  });
  res.render("create-meetup.ejs", {
    title: "Create Meetup",
    user: req.session.user,
    connections,
    languages,
  });
});

router.post("/create", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  const { description, invitee, date, start, duration, platform } = req.body;
  const startTime = new Date(date + " " + start);
  const endTime = new Date(startTime.getTime() + parseInt(duration) * 60000);

  const newMeetup = new Meetup({
    creator: req.session.user._id,
    description,
    invitee,
    startTime,
    endTime,
    platform,
    cancelled: false,
    response: "NO_RESPONSE",
  });
  console.log(newMeetup);
  await User.updateMany(
    { _id: { $in: [req.session.user._id, invitee] } },
    { $push: { currentMeetups: newMeetup } }
  );
  res.redirect("/");
});

// delete meetup
router.delete("/", async (req, res) => {});

// edit meetup
router.get("/edit/:meetupid", async (req, res) => {});

router.put("/edit", async (req, res) => {});

// respond to meetup
router.put("/respond", async (req, res) => {});

// read meetups
router.get("/", async (req, res) => {});
