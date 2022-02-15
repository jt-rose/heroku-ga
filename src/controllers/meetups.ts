import express from "express";
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
  });
});

router.post("/create", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  const { name, description, invitee, date, start, duration, platform } =
    req.body;
  const startTime = new Date(date + " " + start);
  const endTime = new Date(startTime.getTime() + parseInt(duration) * 60000);

  const newMeetup = new Meetup({
    creator: req.session.user._id,
    name,
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
router.delete("/", async (req, res) => {
  const { meetupid, invitee } = req.body;
  await User.findByIdAndUpdate(req.session.user?._id, {
    $pull: { currentMeetups: { _id: meetupid } },
  });
  const inviteeData = await User.findByIdAndUpdate(invitee);
  if (!inviteeData) {
    res.redirect("/");
    return;
  }
  for (let i = 0; i < inviteeData.currentMeetups.length; i++) {
    if (String(inviteeData.currentMeetups[i]._id) === String(meetupid)) {
      inviteeData.currentMeetups[i].cancelled = true;
    }
  }
  console.log("updated", inviteeData);
  await inviteeData.save();
  res.redirect("/");
});

router.delete("/clear-cancelled-meetup", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  const { meetupid } = req.body;
  await User.findByIdAndUpdate(req.session.user._id, {
    $pull: {
      currentMeetups: {
        _id: meetupid,
      },
    },
  });
  res.redirect("/");
});

router.delete("/clear-finished", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  const { meetupid, invitee } = req.body;
  await User.updateMany(
    { _id: { $in: [req.session.user._id, invitee] } },
    {
      $pull: {
        currentMeetups: {
          _id: meetupid,
        },
      },
    }
  );
  res.redirect("/");
});

// edit meetup
router.get("/edit/:meetupid", async (req, res) => {
  const { meetupid } = req.params;
  console.log("mmetup id ", meetupid);
  const meetup = req.session.user?.currentMeetups.find(
    (meet) => String(meet._id) === String(meetupid)
  );
  console.log("meetup", meetup);
  if (!meetup) {
    res.redirect("/");
    return;
  }

  const duration = meetup.endTime.getTime() - meetup.startTime.getTime();
  const fmtDuration = duration / 60000;

  if (!meetup) {
    res.redirect("/");
    return;
  }

  const connections = await User.find({
    _id: { $in: req.session.user?.connections },
  });
  res.render("edit-meetup.ejs", {
    title: "Edit Meetup",
    meetup,
    connections,
    duration: fmtDuration,
    date: meetup.startTime,
  });
});

router.put("/edit", async (req, res) => {});

// respond to meetup
router.put("/respond", async (req, res) => {});

// read individual meetup
router.get("/:meetupid", async (req, res) => {
  const { meetupid } = req.params;
  const currentMeetups = req.session.user?.currentMeetups;
  const meetup = currentMeetups?.find(
    (meet) => String(meet._id) === String(meetupid)
  );
  if (!meetup) {
    res.redirect("/");
    return;
  }
  const alreadyDone = new Date() > meetup.endTime;
  res.render("meetup.ejs", {
    title: "Meetup",
    meetup,
    myMeetup: String(req.session.user?._id) === String(meetup?.creator),
    alreadyDone,
  });
});

// read meetups
router.get("/", async (req, res) => {
  const meetups = req.session.user?.currentMeetups;
  res.render("meetups.ejs", {
    title: "Meetups",
    meetups,
  });
});
