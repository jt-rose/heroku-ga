var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
//___________________
//Dependencies
//___________________
// declare module "express-session" {
//   interface SessionData {
//     user: string;
//   }
// }
import express from "express";
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
import { defaultImg } from "./constants/defaultImg.js";
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, db, PORT, MONGODB_URI, RedisStore, redisURL, redis;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dotenv.config()];
            case 1:
                _a.sent();
                app = express();
                app.set("trust proxy", 1);
                db = mongoose.connection;
                PORT = process.env.PORT || 3003;
                MONGODB_URI = process.env.MONGODB_URI;
                // Connect to Mongo
                return [4 /*yield*/, mongoose.connect(MONGODB_URI)];
            case 2:
                // Connect to Mongo
                _a.sent();
                // Error / success
                db.on("error", function (err) { return console.log(err.message + " is Mongod not running?"); });
                db.on("connected", function () { return console.log("mongo connected: ", MONGODB_URI); });
                db.on("disconnected", function () { return console.log("mongo disconnected"); });
                RedisStore = connectRedis(session);
                redisURL = process.env.REDIS_TLS_URL;
                if (redisURL) {
                    redis = new Redis(redisURL, {
                        tls: {
                            rejectUnauthorized: false,
                        },
                    });
                }
                else {
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
                app.use(session({
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
                    secret: process.env.COOKIE_SECRET,
                    resave: false,
                    saveUninitialized: false,
                }));
                // test redis
                return [4 /*yield*/, redis
                        .ping()
                        .then(function (pong) { return console.log(pong + "! Redis has been connected"); })];
            case 3:
                // test redis
                _a.sent();
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
                app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, currentMeetups, unreadMessages, connectionInvites, meetupsWith, unreadMsgFrom, invitesFrom, usersToSearchFor, users, meetups, _loop_1, _i, currentMeetups_1, meetup, messages, _loop_2, _b, unreadMessages_1, message, invites, _loop_3, _c, connectionInvites_1, invite;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                console.log(req.session.user);
                                if (!req.session.user) {
                                    res.render("welcome.ejs", {
                                        title: "Welcome",
                                        user: undefined,
                                    });
                                    return [2 /*return*/];
                                }
                                _a = req.session.user, currentMeetups = _a.currentMeetups, unreadMessages = _a.unreadMessages, connectionInvites = _a.connectionInvites;
                                // filter out new invites that originated from self
                                connectionInvites = connectionInvites.filter(function (conn) { return String(conn.from) !== String(req.session.user._id); });
                                meetupsWith = currentMeetups
                                    .map(function (meet) { return [meet.creator, meet.invitee]; })
                                    .flat();
                                unreadMsgFrom = unreadMessages.map(function (msg) { return msg.from; });
                                invitesFrom = connectionInvites
                                    .map(function (invite) { return [invite.from, invite.to]; })
                                    .flat();
                                usersToSearchFor = __spreadArray(__spreadArray(__spreadArray([], meetupsWith, true), unreadMsgFrom, true), invitesFrom, true);
                                return [4 /*yield*/, User.find({
                                        active: true,
                                        _id: { $in: usersToSearchFor },
                                    })];
                            case 1:
                                users = _d.sent();
                                // filter self out from users
                                users = users.filter(function (u) { return String(u._id) !== String(req.session.user._id); });
                                meetups = [];
                                _loop_1 = function (meetup) {
                                    var partner = users.find(function (u) {
                                        return String(u._id) === String(meetup.invitee) ||
                                            String(u._id) === String(meetup.creator);
                                    });
                                    var meetupWithPartnerInfo = {
                                        partnerImg: partner ? partner.img : defaultImg,
                                        partnerUsername: partner ? partner.username : "Busy bee",
                                        meetup: meetup,
                                    };
                                    meetups.push(meetupWithPartnerInfo);
                                };
                                for (_i = 0, currentMeetups_1 = currentMeetups; _i < currentMeetups_1.length; _i++) {
                                    meetup = currentMeetups_1[_i];
                                    _loop_1(meetup);
                                }
                                console.log("users found: ", users);
                                messages = [];
                                _loop_2 = function (message) {
                                    var partner = users.find(function (u) { return String(u._id) === String(message.from); });
                                    var messageWithPartnerInfo = {
                                        partnerImg: partner ? partner.img : defaultImg,
                                        partnerUsername: partner ? partner.username : "Busy bee",
                                        message: message,
                                    };
                                    messages.push(messageWithPartnerInfo);
                                };
                                for (_b = 0, unreadMessages_1 = unreadMessages; _b < unreadMessages_1.length; _b++) {
                                    message = unreadMessages_1[_b];
                                    _loop_2(message);
                                }
                                invites = [];
                                _loop_3 = function (invite) {
                                    var partner = users.find(function (u) { return String(u._id) === String(invite.from); });
                                    var inviteWithPartnerInfo = {
                                        partnerImg: partner ? partner.img : defaultImg,
                                        partnerUsername: partner ? partner.username : "Busy bee",
                                        invite: invite,
                                    };
                                    invites.push(inviteWithPartnerInfo);
                                };
                                for (_c = 0, connectionInvites_1 = connectionInvites; _c < connectionInvites_1.length; _c++) {
                                    invite = connectionInvites_1[_c];
                                    _loop_3(invite);
                                }
                                res.render("index.ejs", {
                                    title: "Index",
                                    user: req.session.user,
                                    users: users,
                                    myAccount: req.session.user,
                                    meetups: meetups,
                                    messages: messages,
                                    invites: invites,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                //___________________
                //Listener
                //___________________
                app.listen(PORT, function () { return console.log("Listening on port:", PORT); });
                return [2 /*return*/];
        }
    });
}); };
main().catch(function (err) { return console.log(err); });
