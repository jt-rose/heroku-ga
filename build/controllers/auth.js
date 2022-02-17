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
import argon2 from "argon2";
import { User } from "../models/User.js";
import multer from "multer";
import { uploadFile } from "../utils/s3.js";
import { languages } from "../constants/languages.js";
import { proficiencyLevels } from "../constants/proficiency.js";
export var router = express.Router();
var upload = multer({ dest: "uploads/" });
router.get("/login", function (req, res) {
    res.render("login.ejs", {
        title: "Login",
        user: req.session.user,
    });
});
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, usernameOrEmail, password, foundUser, matchingPassword;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, usernameOrEmail = _a.usernameOrEmail, password = _a.password;
                return [4 /*yield*/, User.findOne({
                        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
                    })];
            case 1:
                foundUser = _b.sent();
                if (!foundUser) {
                    res.redirect("/auth/login");
                    // res.render("/auth/login", {
                    //   title: "Login",
                    //   error: "No user with that username / password",
                    // });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, argon2.verify(foundUser.password, password)];
            case 2:
                matchingPassword = _b.sent();
                if (!matchingPassword) {
                    res.redirect("/auth/login");
                    // res.render("/auth/login", {
                    //   title: "Login",
                    //   error: "No user with that username / password",
                    // });
                    return [2 /*return*/];
                }
                // set cookie if username and password match
                req.session.user = foundUser;
                // redirect to home page
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
router.delete("/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // add error handling?
            return [4 /*yield*/, req.session.destroy(function () { })];
            case 1:
                // add error handling?
                _a.sent();
                res.redirect("/");
                return [2 /*return*/];
        }
    });
}); });
router.get("/register", function (req, res) {
    res.render("register.ejs", {
        title: "Sign Up",
        user: req.session.user,
        languages: languages,
        proficiencyLevels: proficiencyLevels,
    });
});
router.post("/register", upload.single("img"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var file, img, result, _a, username, email, password, aboutMeText, country, cityOrState, nativeLanguage, targetLanguage, targetLanguageProficiency, userAlreadyExists, hashedPassword, user, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                file = req.file;
                img = void 0;
                if (!file) return [3 /*break*/, 2];
                return [4 /*yield*/, uploadFile(file)];
            case 1:
                result = _b.sent();
                img = result.Location;
                _b.label = 2;
            case 2:
                _a = req.body, username = _a.username, email = _a.email, password = _a.password, aboutMeText = _a.aboutMeText, country = _a.country, cityOrState = _a.cityOrState, nativeLanguage = _a.nativeLanguage, targetLanguage = _a.targetLanguage, targetLanguageProficiency = _a.targetLanguageProficiency;
                return [4 /*yield*/, User.findOne({
                        $or: [{ username: username }, { email: email }],
                    })];
            case 3:
                userAlreadyExists = _b.sent();
                if (userAlreadyExists) {
                    res.render("/register", {
                        title: "Register",
                        user: req.session.user,
                        error: "Username / Email already in use",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, argon2.hash(password)];
            case 4:
                hashedPassword = _b.sent();
                return [4 /*yield*/, new User({
                        username: username,
                        email: email,
                        password: hashedPassword,
                        img: img,
                        country: country,
                        cityOrState: cityOrState,
                        aboutMeText: aboutMeText,
                        nativeLanguage: nativeLanguage,
                        targetLanguage: targetLanguage,
                        targetLanguageProficiency: targetLanguageProficiency,
                        active: true,
                        joinedOn: new Date(),
                        updatedConnects: [],
                        updatedConversations: [],
                        updatedMeetups: [],
                    }).save()];
            case 5:
                user = _b.sent();
                // if err
                // ! add later
                // set cookie
                req.session.user = user;
                // return to homepage
                res.redirect("/");
                return [3 /*break*/, 7];
            case 6:
                e_1 = _b.sent();
                console.log(e_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get("/forgot-password", function (req, res) {
    res.send("forgot password form");
});
router.post("/forgot-password", function (req, res) {
    res.send("submit forgot password form");
});
router.get("/reset-password", function (req, res) {
    res.send("form to reset password");
});
router.post("/reset-password", function (req, res) {
    res.send("submit form to reset password");
});
