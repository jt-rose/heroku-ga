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
import express from "express";
import { User } from "../models/User.js";
import { Meetup } from "../models/Meetup.js";
import { formatTime } from "../utils/formatTime.js";
export var router = express.Router();
// create meetup
router.get("/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connections;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, User.find({
                    _id: { $in: (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.connections },
                })];
            case 1:
                connections = _b.sent();
                res.render("create-meetup.ejs", {
                    title: "Create Meetup",
                    user: req.session.user,
                    connections: connections,
                });
                return [2 /*return*/];
        }
    });
}); });
router.post("/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, invitee, date, start, duration, platform, startTime, endTime, newMeetup;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                _a = req.body, name = _a.name, description = _a.description, invitee = _a.invitee, date = _a.date, start = _a.start, duration = _a.duration, platform = _a.platform;
                startTime = new Date(date + " " + start);
                endTime = new Date(startTime.getTime() + parseInt(duration) * 60000);
                newMeetup = new Meetup({
                    creator: req.session.user._id,
                    name: name,
                    description: description,
                    invitee: invitee,
                    startTime: startTime,
                    endTime: endTime,
                    platform: platform,
                    cancelled: false,
                    response: "NO_RESPONSE",
                });
                return [4 /*yield*/, User.updateMany({ _id: { $in: [req.session.user._id, invitee] } }, { $push: { currentMeetups: newMeetup } })];
            case 1:
                _b.sent();
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
// delete meetup
router.delete("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, meetupid, invitee;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, meetupid = _a.meetupid, invitee = _a.invitee;
                return [4 /*yield*/, User.findByIdAndUpdate((_b = req.session.user) === null || _b === void 0 ? void 0 : _b._id, {
                        $pull: { currentMeetups: { _id: meetupid } },
                    })];
            case 1:
                _c.sent();
                return [4 /*yield*/, User.updateOne({ _id: invitee, "currentMeetups._id": meetupid }, {
                        $set: {
                            "currentMeetups.$.cancelled": true,
                        },
                    })];
            case 2:
                _c.sent();
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
router.delete("/clear-cancelled-meetup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var meetupid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                meetupid = req.body.meetupid;
                return [4 /*yield*/, User.findByIdAndUpdate(req.session.user._id, {
                        $pull: {
                            currentMeetups: {
                                _id: meetupid,
                            },
                        },
                    })];
            case 1:
                _a.sent();
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
router.delete("/clear-finished", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, meetupid, invitee;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                _a = req.body, meetupid = _a.meetupid, invitee = _a.invitee;
                return [4 /*yield*/, User.updateMany({ _id: { $in: [req.session.user._id, invitee] } }, {
                        $pull: {
                            currentMeetups: {
                                _id: meetupid,
                            },
                        },
                    })];
            case 1:
                _b.sent();
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
// edit meetup
router.get("/edit/:meetupid", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var meetupid, meetup, duration, fmtDuration, connections;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                meetupid = req.params.meetupid;
                console.log("mmetup id ", meetupid);
                meetup = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.currentMeetups.find(function (meet) { return String(meet._id) === String(meetupid); });
                console.log("meetup", meetup);
                if (!meetup) {
                    res.redirect("/");
                    return [2 /*return*/];
                }
                duration = meetup.endTime.getTime() - meetup.startTime.getTime();
                fmtDuration = duration / 60000;
                if (!meetup) {
                    res.redirect("/");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User.find({
                        _id: { $in: (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.connections },
                    })];
            case 1:
                connections = _c.sent();
                res.render("edit-meetup.ejs", {
                    title: "Edit Meetup",
                    user: req.session.user,
                    meetup: meetup,
                    connections: connections,
                    duration: fmtDuration,
                    date: meetup.startTime,
                });
                return [2 /*return*/];
        }
    });
}); });
router.put("/edit", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, invitee, date, start, duration, platform, meetupid, startTime, endTime, newMeetup;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                _a = req.body, name = _a.name, description = _a.description, invitee = _a.invitee, date = _a.date, start = _a.start, duration = _a.duration, platform = _a.platform, meetupid = _a.meetupid;
                startTime = new Date(date + " " + start);
                endTime = new Date(startTime.getTime() + parseInt(duration) * 60000);
                newMeetup = new Meetup({
                    creator: req.session.user._id,
                    name: name,
                    description: description,
                    invitee: invitee,
                    startTime: startTime,
                    endTime: endTime,
                    platform: platform,
                    cancelled: false,
                    response: "MEETUP_CHANGED",
                });
                console.log("edited meetup", newMeetup);
                return [4 /*yield*/, User.updateMany({ _id: { $in: [req.session.user._id, invitee] } }, {
                        $pull: {
                            currentMeetups: { _id: meetupid },
                        },
                    })];
            case 1:
                _b.sent();
                return [4 /*yield*/, User.updateMany({ _id: { $in: [req.session.user._id, invitee] } }, {
                        $push: { currentMeetups: newMeetup },
                    })];
            case 2:
                _b.sent();
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
// respond to meetup
router.put("/response", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, rsvp, meetupid, creator;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                _a = req.body, rsvp = _a.rsvp, meetupid = _a.meetupid, creator = _a.creator;
                if (!(rsvp === "true")) return [3 /*break*/, 2];
                return [4 /*yield*/, User.updateMany({
                        //_id: { $in: [req.session.user._id, creator] },
                        "currentMeetups._id": meetupid,
                    }, {
                        $set: {
                            "currentMeetups.$.response": "accepted",
                        },
                    })];
            case 1:
                _b.sent();
                return [3 /*break*/, 5];
            case 2: 
            // template:
            // await User.updateOne(
            //     { _id: invitee, "currentMeetups._id": meetupid },
            //     {
            //       $set: {
            //         "currentMeetups.$.cancelled": true,
            //       },
            //     }
            //   );
            return [4 /*yield*/, User.updateMany({
                    //_id: { $in: [req.session.user._id, creator] },
                    "currentMeetups._id": meetupid,
                }, {
                    $set: {
                        "currentMeetups.$.response": "declined",
                    },
                })];
            case 3:
                // template:
                // await User.updateOne(
                //     { _id: invitee, "currentMeetups._id": meetupid },
                //     {
                //       $set: {
                //         "currentMeetups.$.cancelled": true,
                //       },
                //     }
                //   );
                _b.sent();
                return [4 /*yield*/, User.findByIdAndUpdate(req.session.user._id, {
                        $pull: {
                            currentMeetups: {
                                _id: meetupid,
                            },
                        },
                    })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
// read individual meetup
router.get("/:meetupid", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var meetupid, currentMeetups, meetup, alreadyDone;
    var _a, _b;
    return __generator(this, function (_c) {
        meetupid = req.params.meetupid;
        currentMeetups = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.currentMeetups;
        meetup = currentMeetups === null || currentMeetups === void 0 ? void 0 : currentMeetups.find(function (meet) { return String(meet._id) === String(meetupid); });
        if (!meetup) {
            res.redirect("/");
            return [2 /*return*/];
        }
        alreadyDone = new Date() > meetup.endTime;
        res.render("meetup.ejs", {
            title: "Meetup",
            user: req.session.user,
            meetup: meetup,
            myMeetup: String((_b = req.session.user) === null || _b === void 0 ? void 0 : _b._id) === String(meetup === null || meetup === void 0 ? void 0 : meetup.creator),
            alreadyDone: alreadyDone,
        });
        return [2 /*return*/];
    });
}); });
// read meetups
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var meetups, meetupPartnerIds, meetupPartners, activeMeetups, cancelledMeetups, hasMeetups;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                meetups = req.session.user.currentMeetups || [];
                // map out who created each meetup
                meetups.forEach(function (meet) {
                    var _a;
                    return String(meet.creator) === String((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id)
                        ? (meet.createdByMe = true)
                        : (meet.createdByMe = false);
                });
                // map out the dates to display in ejs
                meetups.forEach(function (meet) {
                    meet.month = meet.startTime.getMonth() + 1;
                    meet.day = meet.startTime.getDate();
                    meet.timeframe =
                        formatTime(meet.startTime) + " - " + formatTime(meet.endTime);
                });
                meetupPartnerIds = [];
                meetups.forEach(function (meet) {
                    var partnerId = meet.createdByMe ? meet.invitee : meet.creator;
                    meetupPartnerIds.push(partnerId);
                });
                return [4 /*yield*/, User.find({ _id: { $in: meetupPartnerIds } })];
            case 1:
                meetupPartners = _a.sent();
                meetups.forEach(function (meet) {
                    if (meet.createdByMe) {
                        var partner = meetupPartners.find(function (p) { return String(p._id) === String(meet.invitee); });
                        if (!partner) {
                            meet.partnerImg = "/avatars/bee.svg";
                            meet.partnerUsername = "Not Found";
                        }
                        else {
                            meet.partnerImg = partner.img;
                            meet.partnerUsername = partner.username;
                        }
                    }
                    else {
                        var partner = meetupPartners.find(function (p) { return String(p._id) === String(meet.creator); });
                        if (!partner) {
                            meet.partnerImg = "/avatars/bee.svg";
                            meet.partnerUsername = "Not Found";
                        }
                        else {
                            meet.partnerImg = partner.img;
                            meet.partnerUsername = partner.username;
                        }
                    }
                });
                activeMeetups = meetups.filter(function (meet) { return !meet.cancelled; });
                cancelledMeetups = meetups.filter(function (meet) { return meet.cancelled; });
                hasMeetups = meetups.length > 0;
                res.render("meetups.ejs", {
                    title: "Meetups",
                    user: req.session.user,
                    activeMeetups: activeMeetups,
                    cancelledMeetups: cancelledMeetups,
                    hasMeetups: hasMeetups,
                });
                return [2 /*return*/];
        }
    });
}); });
