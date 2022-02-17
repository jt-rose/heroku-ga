//___________________
//Dependencies
//___________________
// declare module "express-session" {
//   interface SessionData {
//     user: string;
//   }
// }
import express, { Request, Response } from "express";
import methodOverride from "method-override";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { router as authRouter } from "./controllers/auth.js";
import { router as userRouter } from "./controllers/user.js";
import { router as invitesRouter } from "./controllers/invites.js";
import { router as meetupsRouter } from "./controllers/meetups.js";
import { router as conversationsRouter } from "./controllers/conversations.js";
import { router as searchRouter } from "./controllers/search.js";
import { __PROD__ } from "./constants/PROD.js";
import { User } from "./models/User.js";
import { isAuth } from "./utils/isAuth.js";
import { IMeetup } from "./models/Meetup.js";
import { defaultImg } from "./constants/defaultImg.js";
import { IMessage } from "./models/Conversation.js";

const main = async () => {
  await dotenv.config();

  const app = express();
  app.set("trust proxy", 1);
  const db = mongoose.connection;
  //___________________
  //Port
  //___________________
  // Allow use of Heroku's port or your own local port, depending on the environment
  const PORT = process.env.PORT || 3003;

  //___________________
  //Database
  //___________________
  // How to connect to the database either via heroku or locally
  const MONGODB_URI = process.env.MONGODB_URI;

  // Connect to Mongo
  await mongoose.connect(MONGODB_URI as string);

  // Error / success
  db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
  db.on("connected", () => console.log("mongo connected: ", MONGODB_URI));
  db.on("disconnected", () => console.log("mongo disconnected"));

  /* -------------------------------------------------------------------------- */
  /*                              connect to Redis                              */
  /* -------------------------------------------------------------------------- */
  const RedisStore = connectRedis(session);
  const redisURL = process.env.REDIS_TLS_URL;
  let redis: Redis.Redis;
  if (redisURL) {
    redis = new Redis(redisURL, {
      tls: {
        rejectUnauthorized: false,
      },
    });
  } else {
    redis = new Redis(); // auto connect if running on localhost
  }

  //___________________
  //Middleware
  //___________________

  //use public folder for static assets
  app.use(express.static("public"));

  // populates req.body with parsed info from forms - if no data from forms will return an empty object {}
  app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
  app.use(express.json()); // returns middleware that only parses JSON - may or may not need it depending on your project

  //use method override
  app.use(methodOverride("_method")); // allow POST, PUT and DELETE from a form

  // set up sessions
  app.use(
    session({
      name: "cid",
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __PROD__, // disable for dev in localhost
        //domain: __PROD__ ? ".herokuapp.com" : undefined, // add domain when in prod
      },
      secret: process.env.COOKIE_SECRET as string,
      resave: false,
      saveUninitialized: false,
    })
  );

  // test redis
  await redis
    .ping()
    .then((pong) => console.log(pong + "! Redis has been connected"));

  // set up app to refresh user data on each page
  app.use(isAuth);
  //___________________
  // Routes
  //___________________
  //localhost:3000

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/invites", invitesRouter);
  app.use("/meetups", meetupsRouter);
  app.use("/conversations", conversationsRouter);
  app.use("/search", searchRouter);

  app.get("/", async (req: Request, res: Response) => {
    console.log(req.session.user);

    if (!req.session.user) {
      res.render("welcome.ejs", {
        title: "Welcome",
        user: undefined,
      });
      return;
    }

    let { currentMeetups, unreadMessages, connectionInvites } =
      req.session.user;

    // filter out new invites that originated from self
    connectionInvites = connectionInvites.filter(
      (conn) => String(conn.from) !== String(req.session.user!._id)
    );

    const meetupsWith = currentMeetups
      .map((meet) => [meet.creator, meet.invitee])
      .flat();

    const unreadMsgFrom = unreadMessages.map((msg) => msg.from);

    const invitesFrom = connectionInvites
      .map((invite) => [invite.from, invite.to])
      .flat();

    const usersToSearchFor = [...meetupsWith, ...unreadMsgFrom, ...invitesFrom];

    let users = await User.find({
      active: true,
      _id: { $in: usersToSearchFor },
    });

    // filter self out from users
    users = users.filter(
      (u) => String(u._id) !== String(req.session.user!._id)
    );

    // associate partner data with each meetup
    let meetups: {
      partnerImg: string;
      partnerUsername: string;
      meetup: IMeetup;
    }[] = [];
    for (const meetup of currentMeetups) {
      const partner = users.find(
        (u) =>
          String(u._id) === String(meetup.invitee) ||
          String(u._id) === String(meetup.creator)
      );
      const meetupWithPartnerInfo = {
        partnerImg: partner ? partner.img : defaultImg,
        partnerUsername: partner ? partner.username : "Busy bee",
        meetup,
      };
      meetups.push(meetupWithPartnerInfo);
    }
    console.log("users found: ", users);

    // associate partner data with each new message
    let messages: {
      partnerImg: string;
      partnerUsername: string;
      message: IMessage;
    }[] = [];

    for (const message of unreadMessages) {
      const partner = users.find((u) => String(u._id) === String(message.from));
      const messageWithPartnerInfo = {
        partnerImg: partner ? partner.img : defaultImg,
        partnerUsername: partner ? partner.username : "Busy bee",
        message,
      };
      messages.push(messageWithPartnerInfo);
    }
    // associate partner data with each invite
    let invites: {
      partnerImg: string;
      partnerUsername: string;
      invite: IMessage;
    }[] = [];

    for (const invite of connectionInvites) {
      const partner = users.find((u) => String(u._id) === String(invite.from));
      const inviteWithPartnerInfo = {
        partnerImg: partner ? partner.img : defaultImg,
        partnerUsername: partner ? partner.username : "Busy bee",
        invite,
      };
      invites.push(inviteWithPartnerInfo);
    }

    res.render("index.ejs", {
      title: "Index",
      user: req.session.user,
      users,
      myAccount: req.session.user,
      meetups,
      messages,
      invites,
    });
  });

  //___________________
  //Listener
  //___________________
  app.listen(PORT, () => console.log("Listening on port:", PORT));
};

main().catch((err) => console.log(err));
