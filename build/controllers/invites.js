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
import { Invite } from "../models/Invite.js";
import { languages } from "../constants/languages.js";
import { Conversation, Message } from "../models/Conversation.js";
export var router = express.Router();
router.get("/create/:userid", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userid, invitee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                userid = req.params.userid;
                return [4 /*yield*/, User.findById(userid)];
            case 1:
                invitee = _a.sent();
                res.render("create-invite.ejs", {
                    title: "Create Invite",
                    invitee: invitee,
                    languages: languages,
                    user: req.session.user,
                });
                return [2 /*return*/];
        }
    });
}); });
router.post("/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, invitee, message, targetLanguage, newInvite, fromAndTo, me;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                _a = req.body, invitee = _a.invitee, message = _a.message, targetLanguage = _a.targetLanguage;
                newInvite = new Invite({
                    from: (_b = req.session.user) === null || _b === void 0 ? void 0 : _b._id,
                    to: invitee,
                    date: new Date(),
                    message: message,
                    targetLanguage: targetLanguage,
                    inviteAccepted: false,
                });
                return [4 /*yield*/, User.updateMany({ $or: [{ _id: req.session.user._id }, { _id: invitee }] }, { $push: { connectionInvites: newInvite } }, { new: true })];
            case 1:
                fromAndTo = _c.sent();
                return [4 /*yield*/, User.findById(req.session.user._id)];
            case 2:
                me = _c.sent();
                if (!me) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
// respond with accept or reject
router.put("/response", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, inviteId, message, date, inviteAccepted, newConnectionId, firstMessage, confirmationMessage, newConversation, updatedUser, updatedUser;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                _a = req.body, inviteId = _a.inviteId, message = _a.message, date = _a.date, inviteAccepted = _a.inviteAccepted, newConnectionId = _a.newConnectionId;
                console.log("date", date);
                console.log(new Date(date));
                if (!(inviteAccepted === "true")) return [3 /*break*/, 4];
                firstMessage = new Message({
                    from: newConnectionId,
                    to: req.session.user._id,
                    message: message,
                    date: new Date(date),
                });
                confirmationMessage = new Message({
                    from: req.session.user._id,
                    to: newConnectionId,
                    message: "".concat(req.session.user.username, " has accepted the invite!"),
                    date: new Date(),
                });
                newConversation = new Conversation({
                    speakers: [req.session.user._id, newConnectionId],
                    messages: [firstMessage, confirmationMessage],
                });
                // store conversation in separate collection
                return [4 /*yield*/, newConversation.save()];
            case 1:
                // store conversation in separate collection
                _c.sent();
                return [4 /*yield*/, User.findByIdAndUpdate((_b = req.session.user) === null || _b === void 0 ? void 0 : _b._id, {
                        $push: {
                            connections: newConnectionId,
                            allConversations: newConversation._id,
                        },
                        $pull: { connectionInvites: { _id: inviteId } },
                    }, { new: true })];
            case 2:
                updatedUser = _c.sent();
                if (!updatedUser) {
                    res.redirect("/");
                    return [2 /*return*/];
                }
                // update other user
                return [4 /*yield*/, User.findByIdAndUpdate(newConnectionId, {
                        $push: {
                            connections: req.session.user._id,
                            allConversations: newConversation._id,
                            unreadMessages: confirmationMessage,
                        },
                        $pull: { connectionInvites: { _id: inviteId } },
                    })];
            case 3:
                // update other user
                _c.sent();
                res.redirect("/");
                return [3 /*break*/, 7];
            case 4: return [4 /*yield*/, User.findByIdAndUpdate(req.session.user._id, {
                    $pull: { connectionInvites: { _id: inviteId } },
                    $push: { blackListed: newConnectionId },
                }, { new: true })];
            case 5:
                updatedUser = _c.sent();
                if (!updatedUser) {
                    res.redirect("/");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User.findByIdAndUpdate(newConnectionId, {
                        $pull: { connectionInvites: { _id: inviteId } },
                        $push: { blackListed: newConnectionId },
                    })];
            case 6:
                _c.sent();
                res.redirect("/");
                _c.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
// rescind invite that has been sent
router.delete("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, invitedUserId, inviteId, updatedUsers;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                _a = req.body, invitedUserId = _a.invitedUserId, inviteId = _a.inviteId;
                return [4 /*yield*/, User.updateMany({ _id: { $in: [(_b = req.session.user) === null || _b === void 0 ? void 0 : _b._id, invitedUserId] } }, { $pull: { connectionInvites: { _id: inviteId } } })];
            case 1:
                updatedUsers = _c.sent();
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
// show all current invites
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, invitesFromMe, invitesToMe;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // get invites both sent and received, stored in cookie
                // switch to db call if cookie size limits are an issue
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User.findById(req.session.user._id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                invitesFromMe = user.connectionInvites.filter(function (invite) { var _a; return String(invite.from) === String((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id); });
                invitesToMe = user.connectionInvites.filter(function (invite) { var _a; return String(invite.to) === String((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id); });
                console.log("invites", invitesToMe);
                // display with ejs
                res.render("invites.ejs", {
                    title: "Invites",
                    invitesFromMe: invitesFromMe,
                    invitesToMe: invitesToMe,
                });
                return [2 /*return*/];
        }
    });
}); });
