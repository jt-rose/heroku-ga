import express from "express";
export const router = express.Router();

router.get("/login", (req, res) => {
  res.send("login form");
});
router.post("/login", (req, res) => {
  res.send("login post form data");
});
router.delete("/logout", (req, res) => {
  res.send("logout delete method");
});
router.get("/register", (req, res) => {
  res.send("register form");
});
router.post("/register", (req, res) => {
  res.send("register post form data");
});
router.get("/forgot-password", (req, res) => {
  res.send("forgot password form");
});
router.post("/forgot-password", (req, res) => {
  res.send("submit forgot password form");
});
router.get("/reset-password", (req, res) => {
  res.send("form to reset password");
});
router.post("/reset-password", (req, res) => {
  res.send("submit form to reset password");
});

// these routes will be used for testing and removed later on
router.get("/protected", (req, res) => {
  res.send("I'm a protected route");
});
router.get("/unprotected", (req, res) => {
  res.send("I'm an unprotected route");
});
