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
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Invite } from "../models/Invite.js";
import { languages } from "../constants/languages.js";
import { proficiencyLevels } from "../constants/proficiency.js";
export var router = express.Router();
router.get("/connects", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var connects;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Invite.find({
                        $or: [{ from: req.session.user._id }, { to: req.session.user._id }],
                    })];
            case 1:
                connects = _a.sent();
                res.render("connects.ejs", {
                    connects: connects,
                });
                return [2 /*return*/];
        }
    });
}); });
router.get("/messages", function (req, res) {
    res.send("messages landing page");
});
router.get("/meetups", function (req, res) {
    res.send("meetups landing page");
});
router.get("/profile/:userid", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.session.user && "".concat(req.session.user._id) === req.params.userid) {
                    res.render("user.ejs", {
                        title: "Profile",
                        user: req.session.user,
                        myAccount: true,
                    });
                    return [2 /*return*/];
                }
                user = null;
                if (!mongoose.isValidObjectId(req.params.userid)) return [3 /*break*/, 2];
                return [4 /*yield*/, User.findById(req.params.userid)];
            case 1:
                user = _a.sent();
                _a.label = 2;
            case 2:
                if (!user) {
                    // flash message
                    res.redirect("/");
                    return [2 /*return*/];
                }
                res.render("user.ejs", {
                    title: "Profile",
                    user: user,
                    myAccount: false,
                });
                return [2 /*return*/];
        }
    });
}); });
// may need to create invidivual routes for the connect, message, and meetup forms
router.post("/create-user", function (req, res) {
    res.send("post create-user form data");
});
router.post("/create-message/:recipient", function (req, res) {
    res.send("post form data for sending a new message to another user");
});
router.post("/create-meetup/", function (req, res) {
    res.send(" post form data for creating a new meetup");
});
router.get("/edit-profile", function (req, res) {
    var user = req.session.user;
    if (!user) {
        // flash message
        res.redirect("/auth/login");
        return;
    }
    res.render("edit-profile.ejs", {
        title: "Edit Profile",
        user: user,
        languages: languages,
        proficiencyLevels: proficiencyLevels,
    });
});
router.post("/create-connection-invite/:recipient", function (req, res) {
    res.send("post form data for sending a new connection to another user");
});
router.put("/update-profile/:userid", function (req, res) {
    res.send("put form data for updating user profile");
});
router.put("/update-meetup/:meetupid", function (req, res) {
    res.send("put form data to update meetup");
});
router.put("/respond-to-message/:messageid", function (req, res) {
    res.send("put form data to update conversation messages");
});
// at this time messages cannot be updated or deleted
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
router.delete("/delete-connect-invite/:connectid", function (req, res) {
    res.send("remove connection invite");
});
router.delete("/delete-meetup/:meetupid", function (req, res) {
    res.send("delete meetup - alert invitees");
});
// alert invitees who have responded upon deleting a meetup
