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
import express from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { languages } from "../constants/languages.js";
import { proficiencyLevels } from "../constants/proficiency.js";
import multer from "multer";
import { uploadFile } from "../utils/s3.js";
import { countries } from "../constants/countries.js";
import { defaultImg } from "../constants/defaultImg.js";
import { formatErrorMsg } from "../utils/formatErrorMsg.js";
var upload = multer({ dest: "uploads/" });
export var router = express.Router();
router.get("/connects", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connectionInvites, connectionIds, inviteIds, otherUserIds, users, invites, _loop_1, _i, connectionInvites_1, invite, connections;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                connectionInvites = req.session.user.connectionInvites;
                // filter out new invites that originated from self
                connectionInvites = connectionInvites.filter(function (conn) { return String(conn.from) !== String(req.session.user._id); });
                connectionIds = req.session.user.connections;
                inviteIds = connectionInvites
                    .map(function (invite) { return [invite.from, invite.to]; })
                    .flat();
                otherUserIds = __spreadArray(__spreadArray([], connectionIds, true), inviteIds, true);
                return [4 /*yield*/, User.find({
                        _id: { $in: otherUserIds },
                    })];
            case 1:
                users = _a.sent();
                // filter self out from users
                users = users.filter(function (u) { return String(u._id) !== String(req.session.user._id); });
                invites = [];
                _loop_1 = function (invite) {
                    var partner = users.find(function (u) { return String(u._id) === String(invite.from); });
                    var inviteWithPartnerInfo = {
                        partnerImg: partner ? partner.img : defaultImg,
                        partnerUsername: partner ? partner.username : "Busy bee",
                        invite: invite,
                    };
                    invites.push(inviteWithPartnerInfo);
                };
                for (_i = 0, connectionInvites_1 = connectionInvites; _i < connectionInvites_1.length; _i++) {
                    invite = connectionInvites_1[_i];
                    _loop_1(invite);
                }
                connections = users.filter(function (u) {
                    return connectionIds.map(function (x) { return String(x); }).includes(String(u._id));
                });
                res.render("connects.ejs", {
                    title: "Connections",
                    user: req.session.user,
                    connections: connections,
                    invites: invites,
                });
                return [2 /*return*/];
        }
    });
}); });
router.get("/profile/:userid", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var targetUser, myConnection, connectionRequestFromMe, connectionRequestToMe, invite, inviteToMe, inviteFromMe;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.session.user && "".concat(req.session.user._id) === req.params.userid) {
                    res.render("user.ejs", {
                        title: "Profile",
                        user: req.session.user,
                        targetUser: req.session.user,
                        myAccount: true,
                        myConnection: false,
                        connectionRequestToMe: false,
                        connectionRequestFromMe: false,
                        invite: null,
                    });
                    return [2 /*return*/];
                }
                targetUser = null;
                if (!mongoose.isValidObjectId(req.params.userid)) return [3 /*break*/, 2];
                return [4 /*yield*/, User.findById(req.params.userid)];
            case 1:
                targetUser = _a.sent();
                _a.label = 2;
            case 2:
                if (!targetUser) {
                    // ! flash message
                    res.redirect("/");
                    return [2 /*return*/];
                }
                myConnection = req.session.user &&
                    req.session.user.connections.some(function (conn) { return String(conn) === String(targetUser._id); });
                connectionRequestFromMe = false;
                connectionRequestToMe = false;
                invite = null;
                if (!myConnection && req.session.user) {
                    inviteToMe = req.session.user.connectionInvites.find(function (invite) { return String(invite.from) === String(targetUser._id); });
                    if (inviteToMe) {
                        connectionRequestToMe = true;
                        invite = inviteToMe;
                    }
                    else {
                        inviteFromMe = req.session.user.connectionInvites.find(function (invite) { return String(invite.to) === String(targetUser._id); });
                        if (inviteFromMe) {
                            connectionRequestFromMe = true;
                            invite = inviteFromMe;
                        }
                    }
                }
                res.render("user.ejs", {
                    title: "Profile",
                    user: req.session.user,
                    targetUser: targetUser,
                    myAccount: false,
                    myConnection: myConnection,
                    connectionRequestFromMe: connectionRequestFromMe,
                    connectionRequestToMe: connectionRequestToMe,
                    invite: invite,
                });
                return [2 /*return*/];
        }
    });
}); });
router.get("/edit-profile", function (req, res) {
    var user = req.session.user;
    if (!user) {
        // flash message
        res.redirect("/auth/login");
        return;
    }
    var errorMessage = req.query.errorMessage;
    errorMessage = formatErrorMsg(errorMessage);
    res.render("edit-profile.ejs", {
        title: "Edit Profile",
        user: user,
        countries: countries,
        languages: languages,
        proficiencyLevels: proficiencyLevels,
        errorMessage: errorMessage,
    });
});
router.put("/edit-profile", upload.single("img"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, file, img, allowedImgTypes, result, _a, username, email, country, cityOrState, aboutMeText, nativeLanguage, targetLanguage, targetLanguageProficiency, sameUsers, otherUsers, sameUsername, sameEmail, errorMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.session.user;
                if (!user) {
                    // flash message
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                file = req.file;
                if (!file) return [3 /*break*/, 2];
                allowedImgTypes = ["image/jpeg", "image/png"];
                if (!allowedImgTypes.includes(file.mimetype)) return [3 /*break*/, 2];
                console.log("image file type allowed");
                return [4 /*yield*/, uploadFile(file)];
            case 1:
                result = _b.sent();
                img = result.Location;
                _b.label = 2;
            case 2:
                _a = req.body, username = _a.username, email = _a.email, country = _a.country, cityOrState = _a.cityOrState, aboutMeText = _a.aboutMeText, nativeLanguage = _a.nativeLanguage, targetLanguage = _a.targetLanguage, targetLanguageProficiency = _a.targetLanguageProficiency;
                return [4 /*yield*/, User.find({ $or: [{ username: username }, { email: email }] })];
            case 3:
                sameUsers = _b.sent();
                if (sameUsers.length) {
                    otherUsers = sameUsers.filter(function (u) { return String(u._id) !== String(user._id); });
                    if (otherUsers.length) {
                        sameUsername = otherUsers.find(function (u) { return u.username === username; });
                        sameEmail = otherUsers.find(function (u) { return u.email === email; });
                        errorMessage = "internal";
                        if (sameUsername && sameEmail) {
                            errorMessage = "usernameAndEmailTaken";
                        }
                        else if (sameUsername) {
                            errorMessage = "usernameTaken";
                        }
                        else if (sameEmail) {
                            errorMessage = "emailTaken";
                        }
                        console.log("REGISTRATION FAILED FOR SAME USERNAME / EMAIL ALREADY REGISTERED");
                        res.redirect("/user/edit-profile?errorMessage=" + errorMessage);
                        return [2 /*return*/];
                    }
                }
                return [4 /*yield*/, User.findByIdAndUpdate(user._id, {
                        $set: {
                            username: username,
                            img: img,
                            email: email,
                            country: country,
                            cityOrState: cityOrState,
                            aboutMeText: aboutMeText,
                            nativeLanguage: nativeLanguage,
                            targetLanguage: targetLanguage,
                            targetLanguageProficiency: targetLanguageProficiency,
                        },
                    })];
            case 4:
                _b.sent();
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
router.put("/toggle-active", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // user account will be deactivated, rather than outright deleted,
                // to maintain relational data integrity and allow for reactivation later
                // ! when getting data on users, a filter for active will need to be applied
                if (!req.session.user) {
                    res.redirect("/");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User.findByIdAndUpdate(req.session.user._id, {
                        active: !req.session.user.active,
                    }, { new: true })];
            case 1:
                user = _a.sent();
                if (!user) {
                    console.log("Error - search for user " +
                        req.session.user._id +
                        " but could not locate in database");
                    res.redirect("/");
                    return [2 /*return*/];
                }
                req.session.user = user;
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
router.delete("/permadelete", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User.findByIdAndRemove(req.session.user._id)];
            case 1:
                user = _a.sent();
                // ! TODO: run a cascade delete
                if (!user) {
                    console.log("Error - search for user " +
                        req.session.user._id +
                        " but could not locate in database");
                    res.redirect("/");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, req.session.destroy(function () { })];
            case 2:
                _a.sent();
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
router.get("/me", function (req, res) {
    if (req.session.user) {
        res.redirect("/user/profile/" + req.session.user._id);
    }
    else {
        res.redirect("/search");
    }
});
