import express from "express";
import {
  IConversation,
  Conversation,
  Message,
} from "../models/Conversation.js";
import { User } from "../models/User.js";

export const router = express.Router();

// show conversations
router.get("/", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }
  const conversations = await Conversation.find({
    speakers: req.session.user._id,
  });
  const unread = req.session.user.unreadMessages;
  const unreadAuthors = unread.map((message) => String(message.from));

  const read: typeof conversations = [];

  for (const convo of conversations) {
    let alreadyRead = true;
    for (const unreadAuthor of unreadAuthors) {
      if (
        convo.speakers.map((speaker) => String(speaker).includes(unreadAuthor))
      ) {
        alreadyRead = false;
      }
    }
    if (alreadyRead) {
      read.push(convo);
    }
  }
  console.log(unread);
  console.log(read);

  res.redirect("/");
});

// create a new message
router.post("/post", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }

  const { from, to, message, convoId } = req.body;
  const messageDate = new Date();
  const newMessage = new Message({
    message,
    from,
    to,
    date: messageDate,
  });

  await Conversation.findByIdAndUpdate(convoId, {
    $push: { messages: newMessage },
    dateOfLastMessage: newMessage.date,
  });
  console.log("to", to);
  console.log(newMessage);
  await User.findByIdAndUpdate(to, {
    $push: {
      unreadMessages: newMessage,
    },
  });
  res.redirect("/");
});

// ! add pagination

router.get("/post/:userid", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/auth/login");
    return;
  }

  const recipient = await User.findById(req.params.userid);
  const previousConversation = await Conversation.findOne({
    speakers: { $all: [req.session.user._id, req.params.userid] },
  });
  // clear out unread messages from this conversation
  await User.findByIdAndUpdate(req.session.user._id, {
    $pull: {
      unreadMessages: {
        from: req.params.userid,
      },
    },
  });
  console.log(previousConversation);

  res.render("create-conversation.ejs", {
    title: "Send a New Message",
    me: req.session.user,
    recipient,
    previousConversation,
  });
});

// addToConversation
