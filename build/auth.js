import express from "express";
export var router = express.Router();
router.get("/login", function (req, res) {
    res.send("login form");
});
router.post("/login", function (req, res) {
    res.send("login post form data");
});
router.delete("/logout", function (req, res) {
    res.send("logout delete method");
});
router.get("/register", function (req, res) {
    res.send("register form");
});
router.post("/register", function (req, res) {
    res.send("register post form data");
});
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
// these routes will be used for testing and removed later on
router.get("/protected", function (req, res) {
    res.send("I'm a protected route");
});
router.get("/unprotected", function (req, res) {
    res.send("I'm an unprotected route");
});
