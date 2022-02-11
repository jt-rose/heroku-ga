import express from "express";
export const router = express.Router();

router.get("/connects", (req, res) => {
  res.send("connects landing page");
});
router.get("/messages", (req, res) => {
  res.send("messages landing page");
});
router.get("/meetups", (req, res) => {
  res.send("meetups landing page");
});
router.get("/:userid", (req, res) => {
  res.send("invidivual user page");
});

// may need to create invidivual routes for the connect, message, and meetup forms

router.post("/create-user", (req, res) => {
  res.send("post create-user form data");
});
router.post("/create-message/:recipient", (req, res) => {
  res.send("post form data for sending a new message to another user");
});
router.post("/create-meetup/", (req, res) => {
  res.send(" post form data for creating a new meetup");
});
router.post("/create-connection-invite/:recipient", (req, res) => {
  res.send("post form data for sending a new connection to another user");
});

router.put("/update-profile/:userid", (req, res) => {
  res.send("put form data for updating user profile");
});
router.put("/update-meetup/:meetupid", (req, res) => {
  res.send("put form data to update meetup");
});
router.put("/respond-to-message/:messageid", (req, res) => {
  res.send("put form data to update conversation messages");
});
// at this time messages cannot be updated or deleted

router.delete("/delete-account/:accountid", (req, res) => {
  res.send("delete user account - be careful!");
}); // use sparingly and make sure to cascade delete!
// users should be encouraged to deactivate, rather than delete, their account
// to preserve data integrity for other users

router.delete("/delete-connect-invite/:connectid", (req, res) => {
  res.send("remove connection invite");
});
router.delete("/delete-meetup/:meetupid", (req, res) => {
  res.send("delete meetup - alert invitees");
});
// alert invitees who have responded upon deleting a meetup
