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
import { Conversation, Message, } from "../models/Conversation.js";
import { User } from "../models/User.js";
export var router = express.Router();
// show conversations
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conversations, unread, unreadAuthors, read, _i, conversations_1, convo, alreadyRead, _loop_1, _a, unreadAuthors_1, unreadAuthor;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Conversation.find({
                        speakers: req.session.user._id,
                    })];
            case 1:
                conversations = _b.sent();
                unread = req.session.user.unreadMessages;
                unreadAuthors = unread.map(function (message) { return String(message.from); });
                read = [];
                for (_i = 0, conversations_1 = conversations; _i < conversations_1.length; _i++) {
                    convo = conversations_1[_i];
                    alreadyRead = true;
                    _loop_1 = function (unreadAuthor) {
                        if (convo.speakers.map(function (speaker) { return String(speaker).includes(unreadAuthor); })) {
                            alreadyRead = false;
                        }
                    };
                    for (_a = 0, unreadAuthors_1 = unreadAuthors; _a < unreadAuthors_1.length; _a++) {
                        unreadAuthor = unreadAuthors_1[_a];
                        _loop_1(unreadAuthor);
                    }
                    if (alreadyRead) {
                        read.push(convo);
                    }
                }
                console.log(unread);
                console.log(read);
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
// create a new message
router.post("/post", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, from, to, message, convoId, messageDate, newMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                _a = req.body, from = _a.from, to = _a.to, message = _a.message, convoId = _a.convoId;
                messageDate = new Date();
                newMessage = new Message({
                    message: message,
                    from: from,
                    to: to,
                    date: messageDate,
                });
                return [4 /*yield*/, Conversation.findByIdAndUpdate(convoId, {
                        $push: { messages: newMessage },
                        dateOfLastMessage: newMessage.date,
                    })];
            case 1:
                _b.sent();
                console.log("to", to);
                console.log(newMessage);
                return [4 /*yield*/, User.findByIdAndUpdate(to, {
                        $push: {
                            unreadMessages: newMessage,
                        },
                    })];
            case 2:
                _b.sent();
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
// ! add pagination
router.get("/post/:userid", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var recipient, previousConversation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.session.user) {
                    res.redirect("/auth/login");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User.findById(req.params.userid)];
            case 1:
                recipient = _a.sent();
                return [4 /*yield*/, Conversation.findOne({
                        speakers: { $all: [req.session.user._id, req.params.userid] },
                    })];
            case 2:
                previousConversation = _a.sent();
                // clear out unread messages from this conversation
                return [4 /*yield*/, User.findByIdAndUpdate(req.session.user._id, {
                        $pull: {
                            unreadMessages: {
                                from: req.params.userid,
                            },
                        },
                    })];
            case 3:
                // clear out unread messages from this conversation
                _a.sent();
                console.log(previousConversation);
                res.render("create-conversation.ejs", {
                    title: "Send a New Message",
                    me: req.session.user,
                    recipient: recipient,
                    previousConversation: previousConversation,
                });
                return [2 /*return*/];
        }
    });
}); });
// addToConversation
