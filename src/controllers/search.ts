import express from "express";
import { countries } from "../constants/countries.js";
import { languages } from "../constants/languages.js";
import { proficiencyLevels } from "../constants/proficiency.js";
import { User } from "../models/User.js";

export const router = express.Router();

type Filter = [
  {
    nativeLanguage?: string;

    country?: string;
  },
  {
    targetLanguage?: string;
    targetLanguageProficiency?: string;
    country?: string;
  }
];

// get search page
router.get("/", async (req, res) => {
  let { language, country, proficiency } = req.query;

  let filter: Filter = [{}, {}];
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

  let users = await User.find({ $or: filter });
  // remove self from search results
  users = users.filter(
    (u) => !req.session.user || String(u._id) !== String(req.session.user?._id)
  );
  res.render("search.ejs", {
    title: "Search",
    users,
    languages,
    language,
    countries,
    country,
    proficiencyLevels,
    proficiency,
  });
});

// return to search page with current search data
router.post("/", async (req, res) => {
  const { language, country, proficiency } = req.body;
  console.log("lang", language);
  console.log("country", country), console.log("prof", proficiency);
  let searchQuery: string[] = [];

  if (language && language !== "BLANK") {
    searchQuery.push("language=" + language);
  }
  if (country && country !== "BLANK") {
    searchQuery.push("country=" + country);
  }
  if (proficiency && proficiency !== "BLANK") {
    searchQuery.push("proficiency=" + proficiency);
  }

  for (let i = 0; i < searchQuery.length; i++) {
    if (i + 1 !== searchQuery.length) {
      searchQuery[i] = searchQuery[i] + "&";
    }
  }

  let formattedQuery = searchQuery.reduce((x, y) => x + y, "");
  if (formattedQuery.length) {
    formattedQuery = "?" + formattedQuery;
  }
  res.redirect("/search" + formattedQuery);
});
