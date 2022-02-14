import express from "express";
import { User } from "../models/User.js";
import { Invite } from "../models/Invite.js";
import { isAuth } from "../utils/isAuth.js";
import { languages } from "../constants/languages.js";
import { ObjectID } from "mongodb";

export const router = express.Router();

router.get("/create/:userid", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  const { userid } = req.params;
  const invitee = await User.findById(userid);
  res.render("create-invite.ejs", {
    title: "Create Invite",
    invitee,
    languages,
    user: req.session.user,
  });
});

router.post("/create", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }

  const { invitee, message, targetLanguage } = req.body;
  // create new invite
  const newInvite = new Invite({
    from: req.session.user?._id,
    to: invitee,
    date: new Date(),
    message,
    targetLanguage,
    inviteAccepted: false,
  });

  // add new invite to from and to users
  const fromAndTo = await User.updateMany(
    { $or: [{ _id: req.session.user._id }, { _id: invitee }] },
    { $push: { connectionInvites: newInvite } },
    { new: true }
  );
  const me = await User.findById(req.session.user._id);
  if (!me) {
    res.redirect("/auth/login");
    return;
  }

  res.redirect("/");
});

// respond with accept or reject
router.put("/response", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  const { inviteId, inviteAccepted, newConnectionId } = req.body;
  if (inviteAccepted === "true") {
    // add user ids to each other's connections array
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user?._id,
      {
        $push: { connections: newConnectionId },
        $pull: { connectionInvites: { _id: inviteId } },
      },
      { new: true }
    );
    if (!updatedUser) {
      res.redirect("/");
      return;
    }

    // update other user
    await User.findByIdAndUpdate(newConnectionId, {
      $push: { connections: req.session.user._id },
      $pull: { connectionInvites: { _id: inviteId } },
    });
    res.redirect("/");
  } else {
    // remove connecion invite from both users
    // hide users from one another by adding to each others blacklists
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user._id,
      {
        $pull: { connectionInvites: { _id: inviteId } },
        $push: { blackListed: newConnectionId },
      },
      { new: true }
    );
    if (!updatedUser) {
      res.redirect("/");
      return;
    }

    await User.findByIdAndUpdate(newConnectionId, {
      $pull: { connectionInvites: { _id: inviteId } },
      $push: { blackListed: newConnectionId },
    });
    res.redirect("/");
  }
});

// rescind invite that has been sent
router.delete("/", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  const { invitedUserId, inviteId } = req.body;
  // remove the invite from both users
  const updatedUsers = await User.updateMany(
    { _id: { $in: [req.session.user?._id, invitedUserId] } },
    { $pull: { connectionInvites: { _id: inviteId } } }
  );

  res.redirect("/");
});

// show all current invites
router.get("/", async (req, res) => {
  // get invites both sent and received, stored in cookie
  // switch to db call if cookie size limits are an issue
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }

  // invites are stored in the user sessions
  // but we will query the db anyway to check for updates
  // that the cache may not have captured
  const user = await User.findById(req.session.user._id);
  if (!user) {
    res.redirect("/auth/login");
    return;
  }

  const invitesFromMe = user.connectionInvites.filter(
    (invite) => String(invite.from) === String(req.session.user?._id)
  );
  const invitesToMe = user.connectionInvites.filter(
    (invite) => String(invite.to) === String(req.session.user?._id)
  );

  // display with ejs
  res.render("invites.ejs", {
    title: "Invites",
    invitesFromMe,
    invitesToMe,
  });
});
