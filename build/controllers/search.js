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
import { countries } from "../constants/countries.js";
import { languages } from "../constants/languages.js";
import { proficiencyLevels } from "../constants/proficiency.js";
import { User } from "../models/User.js";
export var router = express.Router();
// get search page
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, language, country, proficiency, filter, users;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, language = _a.language, country = _a.country, proficiency = _a.proficiency;
                filter = [{}, {}];
                if (language) {
                    filter[0].nativeLanguage = String(language);
                    filter[1].targetLanguage = String(language);
                }
                if (proficiency) {
                    filter[1].targetLanguageProficiency = String(proficiency);
                }
                if (country) {
                    filter[0].country = String(country);
                    filter[1].country = String(country);
                }
                return [4 /*yield*/, User.find({ $or: filter })];
            case 1:
                users = _b.sent();
                // remove self from search results
                users = users.filter(function (u) { var _a; return !req.session.user || String(u._id) !== String((_a = req.session.user) === null || _a === void 0 ? void 0 : _a._id); });
                res.render("search.ejs", {
                    title: "Search",
                    users: users,
                    languages: languages,
                    language: language,
                    countries: countries,
                    country: country,
                    proficiencyLevels: proficiencyLevels,
                    proficiency: proficiency,
                });
                return [2 /*return*/];
        }
    });
}); });
// return to search page with current search data
router.post("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, language, country, proficiency, searchQuery, i, formattedQuery;
    return __generator(this, function (_b) {
        _a = req.body, language = _a.language, country = _a.country, proficiency = _a.proficiency;
        console.log("lang", language);
        console.log("country", country), console.log("prof", proficiency);
        searchQuery = [];
        if (language && language !== "BLANK") {
            searchQuery.push("language=" + language);
        }
        if (country && country !== "BLANK") {
            searchQuery.push("country=" + country);
        }
        if (proficiency && proficiency !== "BLANK") {
            searchQuery.push("proficiency=" + proficiency);
        }
        for (i = 0; i < searchQuery.length; i++) {
            if (i + 1 !== searchQuery.length) {
                searchQuery[i] = searchQuery[i] + "&";
            }
        }
        formattedQuery = searchQuery.reduce(function (x, y) { return x + y; }, "");
        if (formattedQuery.length) {
            formattedQuery = "?" + formattedQuery;
        }
        res.redirect("/search" + formattedQuery);
        return [2 /*return*/];
    });
}); });
